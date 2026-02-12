"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = runCommand;
const vscode = __importStar(require("vscode"));
const promptLoader_js_1 = require("./promptLoader.js");
const commandMap_js_1 = require("./commandMap.js");
// ---------------------------------------------------------------------------
// Prompt Composition
// ---------------------------------------------------------------------------
/**
 * Loads all markdown sections and merges them into a single structured prompt.
 */
async function composePrompt(workspacePath, config, userQuery) {
    const [agent, skills, rules, task] = await Promise.all([
        (0, promptLoader_js_1.loadFile)(workspacePath, config.agentFile),
        (0, promptLoader_js_1.loadFiles)(workspacePath, config.skills),
        (0, promptLoader_js_1.loadFiles)(workspacePath, config.rules),
        (0, promptLoader_js_1.loadFile)(workspacePath, config.promptFile),
    ]);
    // Capture the active editor code
    const snapshot = (0, promptLoader_js_1.getActiveEditorSnapshot)();
    const code = snapshot
        ? `File: ${snapshot.fileName}\nLanguage: ${snapshot.languageId}\n\n\`\`\`${snapshot.languageId}\n${snapshot.content}\n\`\`\``
        : '[No file is currently open in the editor]';
    return { agent, skills, rules, task, code };
}
/**
 * Serialises a ComposedPrompt into the final string sent to the model.
 */
function formatPrompt(prompt, userQuery) {
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
function resolveWorkspacePath(extensionPath) {
    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length > 0) {
        return folders[0].uri.fsPath;
    }
    return extensionPath;
}
/**
 * Handles a single slash command invocation from the chat participant.
 */
async function runCommand(commandName, request, _context, stream, token, extensionPath) {
    // 1. Look up the command config
    const config = commandMap_js_1.COMMAND_MAP[commandName];
    if (!config) {
        stream.markdown(`❌ Unknown command: \`/${commandName}\`.\n\nAvailable commands:\n` +
            Object.keys(commandMap_js_1.COMMAND_MAP).map((c) => `- \`/${c}\``).join('\n'));
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
    }
    catch (err) {
        if (err instanceof vscode.LanguageModelError) {
            stream.markdown(`\n\n❌ **Model error** (${err.code ?? 'unknown'}): ${err.message}`);
        }
        else {
            throw err;
        }
    }
}
//# sourceMappingURL=commandRunner.js.map