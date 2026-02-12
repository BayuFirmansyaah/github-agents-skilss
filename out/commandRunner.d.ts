import type { ChatRequest, ChatContext, ChatResponseStream, CancellationToken } from './types.js';
/**
 * Handles a single slash command invocation from the chat participant.
 */
export declare function runCommand(commandName: string, request: ChatRequest, _context: ChatContext, stream: ChatResponseStream, token: CancellationToken, extensionPath: string): Promise<void>;
//# sourceMappingURL=commandRunner.d.ts.map