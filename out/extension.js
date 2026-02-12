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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const commandRunner_js_1 = require("./commandRunner.js");
const commandMap_js_1 = require("./commandMap.js");
// ---------------------------------------------------------------------------
// Extension Lifecycle
// ---------------------------------------------------------------------------
const PARTICIPANT_ID = 'copilot-dev-assistant.agent';
function activate(context) {
    const extensionPath = context.extensionPath;
    // Register the Copilot Chat participant
    const participant = vscode.chat.createChatParticipant(PARTICIPANT_ID, async (request, context, stream, token) => {
        const command = request.command;
        // No command → show welcome / help
        if (!command) {
            stream.markdown(buildHelpMessage());
            return;
        }
        // Delegate to the command runner
        await (0, commandRunner_js_1.runCommand)(command, request, context, stream, token, extensionPath);
    });
    participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'icon.png');
    context.subscriptions.push(participant);
    console.log('[copilot-dev-assistant] Extension activated');
}
function deactivate() {
    console.log('[copilot-dev-assistant] Extension deactivated');
}
// ---------------------------------------------------------------------------
// Help Message
// ---------------------------------------------------------------------------
function buildHelpMessage() {
    const lines = [
        '## 🤖 Dev Assistant\n',
        'I\'m your AI Dev Assistant powered by specialized sub-agents. Use one of the slash commands below to get started:\n',
    ];
    for (const [name, config] of Object.entries(commandMap_js_1.COMMAND_MAP)) {
        lines.push(`- **\`/${name}\`** — ${config.description}`);
    }
    lines.push('\n---', '\n> **Tip:** Open a file in the editor before running a command. The file contents will be included as context automatically.', '\n> **Customise:** Edit the markdown files in `agents/`, `skills/`, `rules/`, and `prompts/` to change my behaviour — no code changes needed.');
    return lines.join('\n');
}
//# sourceMappingURL=extension.js.map