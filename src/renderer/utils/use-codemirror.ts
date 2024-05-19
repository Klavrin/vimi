import { useState, useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { indentOnInput, bracketMatching } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';

import { vim } from '@replit/codemirror-vim';

type onChangeProps = (value: EditorState) => void;

function useCodemiror(doc: string, onChange?: onChangeProps) {
  const refContainer = useRef<Element>(null);
  const [editorView, setEditorView] = useState<EditorView>();

  useEffect(() => {
    if (!refContainer.current) return;

    const startState = EditorState.create({
      doc,
      extensions: [
        vim(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        history(),
        lineNumbers(),
        indentOnInput(),
        bracketMatching(),
        javascript(),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            if (onChange) {
              onChange(update.state);
            }
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: refContainer.current,
    });

    setEditorView(view);
  }, []);

  return [refContainer, editorView];
}

export default useCodemiror;
