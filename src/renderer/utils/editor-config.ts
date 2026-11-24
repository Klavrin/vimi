import { EditorState, Extension } from '@codemirror/state';
import {
  EditorView,
  ViewPlugin,
  ViewUpdate,
  lineNumbers,
} from '@codemirror/view';
import type { LineNumbersMode } from '../store/reducers/settings';

/**
 * Line number formatter for relative numbering: every line shows its distance
 * to the cursor line and the cursor line shows its absolute number (like
 * `set number relativenumber` in vim).
 */
export const formatRelativeLineNumber = (
  lineNo: number,
  state: EditorState,
) => {
  const cursorLine = state.doc.lineAt(state.selection.main.head).number;
  return String(lineNo === cursorLine ? lineNo : Math.abs(lineNo - cursorLine));
};

/**
 * The gutter only redraws when its config changes, so when the cursor moves to
 * another line we hand it a fresh formatter by asking `reconfigure` to swap in
 * a newly built extension.
 */
const relativeLineNumbers = (
  reconfigure: (extension: Extension) => void,
): Extension => {
  const cursorLine = (state: EditorState) =>
    state.doc.lineAt(state.selection.main.head).number;

  // Assigned below, once the tracker plugin exists
  let build: () => Extension = () => [];

  const tracker = ViewPlugin.fromClass(
    class {
      line: number;

      constructor(view: EditorView) {
        this.line = cursorLine(view.state);
      }

      update(update: ViewUpdate) {
        const line = cursorLine(update.state);
        if (line !== this.line) {
          this.line = line;
          // Dispatching inside an update is not allowed
          setTimeout(() => reconfigure(build()));
        }
      }
    },
  );

  build = () => [
    lineNumbers({
      formatNumber: (n, state) => formatRelativeLineNumber(n, state),
    }),
    tracker,
  ];

  return build();
};

/** Builds the line number extension for a mode; `reconfigure` swaps it in place. */
export const lineNumbersExtension = (
  mode: LineNumbersMode,
  reconfigure: (extension: Extension) => void,
): Extension => {
  if (mode === 'absolute') return lineNumbers();
  if (mode === 'relative') return relativeLineNumbers(reconfigure);
  return [];
};

export const fontSizeExtension = (fontSize: number): Extension =>
  EditorView.theme({ '&': { fontSize: `${fontSize}px` } });

export const lineWrappingExtension = (enabled: boolean): Extension =>
  enabled ? EditorView.lineWrapping : [];
