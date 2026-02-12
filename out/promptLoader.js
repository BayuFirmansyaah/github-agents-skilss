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
exports.loadFile = loadFile;
exports.loadFiles = loadFiles;
exports.getActiveEditorSnapshot = getActiveEditorSnapshot;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// ---------------------------------------------------------------------------
// File Loading
// ---------------------------------------------------------------------------
/**
 * Reads a single markdown file relative to the given base directory.
 * Returns a fallback string if the file does not exist.
 */
async function loadFile(basePath, relativePath) {
    const absolute = path.join(basePath, relativePath);
    try {
        return await fs.readFile(absolute, 'utf-8');
    }
    catch {
        return `[⚠ File not found: ${relativePath}]`;
    }
}
/**
 * Reads and concatenates multiple markdown files, separated by blank lines.
 * Missing files produce a warning marker instead of throwing.
 */
async function loadFiles(basePath, relativePaths) {
    if (relativePaths.length === 0) {
        return '[No files configured]';
    }
    const results = await Promise.all(relativePaths.map((p) => loadFile(basePath, p)));
    return results.join('\n\n---\n\n');
}
// ---------------------------------------------------------------------------
// Active Editor Snapshot
// ---------------------------------------------------------------------------
/**
 * Captures the current active editor text and metadata.
 * Returns `undefined` when no editor is open.
 */
function getActiveEditorSnapshot() {
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
//# sourceMappingURL=promptLoader.js.map