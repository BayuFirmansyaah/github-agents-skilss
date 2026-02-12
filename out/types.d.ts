import * as vscode from 'vscode';
/** Defines which markdown files a slash command should load. */
export interface SlashCommandConfig {
    /** Display-friendly description shown in the chat UI. */
    readonly description: string;
    /** Path to the agent persona markdown (relative to workspace root). */
    readonly agentFile: string;
    /** Paths to skill markdown files to include. */
    readonly skills: readonly string[];
    /** Paths to rule markdown files to include. */
    readonly rules: readonly string[];
    /** Path to the prompt template markdown. */
    readonly promptFile: string;
}
/** Map of slash command names → their configuration. */
export type CommandMap = Readonly<Record<string, SlashCommandConfig>>;
/** The fully-assembled prompt that will be sent to the model. */
export interface ComposedPrompt {
    readonly agent: string;
    readonly skills: string;
    readonly rules: string;
    readonly task: string;
    readonly code: string;
}
/** Snapshot of the user's active editor. */
export interface EditorSnapshot {
    readonly languageId: string;
    readonly fileName: string;
    readonly content: string;
}
export type ChatRequest = vscode.ChatRequest;
export type ChatContext = vscode.ChatContext;
export type ChatResponseStream = vscode.ChatResponseStream;
export type CancellationToken = vscode.CancellationToken;
//# sourceMappingURL=types.d.ts.map