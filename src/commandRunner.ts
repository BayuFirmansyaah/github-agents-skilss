import * as vscode from 'vscode';
import { loadFile, loadFiles, getActiveEditorSnapshot } from './promptLoader.js';
import { COMMAND_MAP } from './commandMap.js';
import type {
    ChatRequest,
    ChatContext,
    ChatResponseStream,
    CancellationToken,
    ComposedPrompt,
    SlashCommandConfig,
} from './types.js';

// ---------------------------------------------------------------------------
// Prompt Composition
// ---------------------------------------------------------------------------

/**
 * Loads all markdown sections and merges them into a single structured prompt.
 */
async function composePrompt(
    workspacePath: string,
    config: SlashCommandConfig,
    userQuery: string
): Promise<ComposedPrompt> {
    const [agent, skills, rules, task] = await Promise.all([
        loadFile(workspacePath, config.agentFile),
        loadFiles(workspacePath, config.skills),
        loadFiles(workspacePath, config.rules),
        loadFile(workspacePath, config.promptFile),
    ]);

    // Capture the active editor code
    const snapshot = getActiveEditorSnapshot();
    const code = snapshot
        ? `File: ${snapshot.fileName}\nLanguage: ${snapshot.languageId}\n\n\`\`\`${snapshot.languageId}\n${snapshot.content}\n\`\`\``
        : '[No file is currently open in the editor]';

    return { agent, skills, rules, task, code };
}

/**
 * Serialises a ComposedPrompt into the final string sent to the model.
 */
function formatPrompt(prompt: ComposedPrompt, userQuery: string): string {
    const sections = [
        `=== AGENT ===\n${prompt.agent}`,
        `=== SKILLS ===\n${prompt.skills}`,
        `=== RULES ===\n${prompt.rules}`,
        `=== TASK ===\n${prompt.task}`,
    ];

    if (userQuery.trim().length > 0) {
        sections.push(`=== USER REQUEST ===\n${userQuery}`);
    }

    sections.push(`=== CODE ===\n${prompt.code}`);

    return sections.join('\n\n');
}

// ---------------------------------------------------------------------------
// Command Execution
// ---------------------------------------------------------------------------

/**
 * Resolves the workspace root path. Falls back to the extension path if no
 * workspace is open.
 */
function resolveWorkspacePath(extensionPath: string): string {
    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length > 0) {
        return folders[0].uri.fsPath;
    }
    return extensionPath;
}

/**
 * Handles a single slash command invocation from the chat participant.
 */
export async function runCommand(
    commandName: string,
    request: ChatRequest,
    _context: ChatContext,
    stream: ChatResponseStream,
    token: CancellationToken,
    extensionPath: string
): Promise<void> {
    // 1. Look up the command config
    const config = COMMAND_MAP[commandName];
    if (!config) {
        stream.markdown(
            `❌ Unknown command: \`/${commandName}\`.\n\nAvailable commands:\n` +
            Object.keys(COMMAND_MAP).map((c) => `- \`/${c}\``).join('\n')
        );
        return;
    }

    // 2. Resolve workspace path (markdown files live here)
    const workspacePath = resolveWorkspacePath(extensionPath);

    // 3. Show progress
    stream.progress(`Loading agent and knowledge for /${commandName}...`);

    // 4. Compose the prompt
    const composed = await composePrompt(workspacePath, config, request.prompt);
    const finalPrompt = formatPrompt(composed, request.prompt);

    // 5. Log for debugging (visible in Extension Development Host → Debug Console)
    console.log(`[copilot-dev-assistant] /${commandName} prompt length: ${finalPrompt.length} chars`);

    // 6. Send to Copilot model and stream the response
    const messages = [
        vscode.LanguageModelChatMessage.User(finalPrompt),
    ];

    try {
        const chatResponse = await request.model.sendRequest(messages, {}, token);

        for await (const fragment of chatResponse.text) {
            if (token.isCancellationRequested) {
                stream.markdown('\n\n⚠️ *Request was cancelled.*');
                return;
            }
            stream.markdown(fragment);
        }
    } catch (err) {
        if (err instanceof vscode.LanguageModelError) {
            stream.markdown(`\n\n❌ **Model error** (${err.code ?? 'unknown'}): ${err.message}`);
        } else {
            throw err;
        }
    }
}
