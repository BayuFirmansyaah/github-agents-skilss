import type { EditorSnapshot } from './types.js';
/**
 * Reads a single markdown file relative to the given base directory.
 * Returns a fallback string if the file does not exist.
 */
export declare function loadFile(basePath: string, relativePath: string): Promise<string>;
/**
 * Reads and concatenates multiple markdown files, separated by blank lines.
 * Missing files produce a warning marker instead of throwing.
 */
export declare function loadFiles(basePath: string, relativePaths: readonly string[]): Promise<string>;
/**
 * Captures the current active editor text and metadata.
 * Returns `undefined` when no editor is open.
 */
export declare function getActiveEditorSnapshot(): EditorSnapshot | undefined;
//# sourceMappingURL=promptLoader.d.ts.map