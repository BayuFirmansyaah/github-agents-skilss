import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { EditorSnapshot } from './types.js';

// ---------------------------------------------------------------------------
// File Loading
// ---------------------------------------------------------------------------

/**
 * Reads a single markdown file relative to the given base directory.
 * Returns a fallback string if the file does not exist.
 */
export async function loadFile(
    basePath: string,
    relativePath: string
): Promise<string> {
    const absolute = path.join(basePath, relativePath);
    try {
        return await fs.readFile(absolute, 'utf-8');
    } catch {
        return `[⚠ File not found: ${relativePath}]`;
    }
}

/**
 * Reads and concatenates multiple markdown files, separated by blank lines.
 * Missing files produce a warning marker instead of throwing.
 */
export async function loadFiles(
    basePath: string,
    relativePaths: readonly string[]
): Promise<string> {
    if (relativePaths.length === 0) {
        return '[No files configured]';
    }

    const results = await Promise.all(
        relativePaths.map((p) => loadFile(basePath, p))
    );
    return results.join('\n\n---\n\n');
}

// ---------------------------------------------------------------------------
// Active Editor Snapshot
// ---------------------------------------------------------------------------

/**
 * Captures the current active editor text and metadata.
 * Returns `undefined` when no editor is open.
 */
export function getActiveEditorSnapshot(): EditorSnapshot | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return undefined;
    }

    return {
        languageId: editor.document.languageId,
        fileName: editor.document.fileName,
        content: editor.document.getText(),
    };
}
