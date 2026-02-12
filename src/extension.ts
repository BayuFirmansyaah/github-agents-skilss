import * as vscode from 'vscode';
import { runCommand } from './commandRunner.js';
import { COMMAND_MAP } from './commandMap.js';

// ---------------------------------------------------------------------------
// Extension Lifecycle
// ---------------------------------------------------------------------------

const PARTICIPANT_ID = 'copilot-dev-assistant.agent';

export function activate(context: vscode.ExtensionContext): void {
    const extensionPath = context.extensionPath;

    // Register the Copilot Chat participant
    const participant = vscode.chat.createChatParticipant(
        PARTICIPANT_ID,
        async (request, context, stream, token) => {
            const command = request.command;

            // No command → show welcome / help
            if (!command) {
                stream.markdown(buildHelpMessage());
                return;
            }

            // Delegate to the command runner
            await runCommand(command, request, context, stream, token, extensionPath);
        }
    );

    participant.iconPath = vscode.Uri.joinPath(
        context.extensionUri,
        'icon.png'
    );

    context.subscriptions.push(participant);

    console.log('[copilot-dev-assistant] Extension activated');
}

export function deactivate(): void {
    console.log('[copilot-dev-assistant] Extension deactivated');
}

// ---------------------------------------------------------------------------
// Help Message
// ---------------------------------------------------------------------------

function buildHelpMessage(): string {
    const lines = [
        '## 🤖 Dev Assistant\n',
        'I\'m your AI Dev Assistant powered by specialized sub-agents. Use one of the slash commands below to get started:\n',
    ];

    for (const [name, config] of Object.entries(COMMAND_MAP)) {
        lines.push(`- **\`/${name}\`** — ${config.description}`);
    }

    lines.push(
        '\n---',
        '\n> **Tip:** Open a file in the editor before running a command. The file contents will be included as context automatically.',
        '\n> **Customise:** Edit the markdown files in `agents/`, `skills/`, `rules/`, and `prompts/` to change my behaviour — no code changes needed.',
    );

    return lines.join('\n');
}
