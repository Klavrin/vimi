import { useState, useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  indentOnInput,
  bracketMatching,
  // defaultHighlightStyle,
  HighlightStyle,
  syntaxHighlighting,
} from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
// import { javascript } from '@codemirror/lang-javascript';

import { vim } from '@replit/codemirror-vim';

const customSyntaxHighlighting = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: '1.8em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading2,
    fontSize: '1.6em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading3,
    fontSize: '1.4em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading4,
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading5,
    fontSize: '1em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading6,
    fontSize: '0.8em',
    fontWeight: 'bold',
  },
  {
    tag: tags.emphasis,
    fontStyle: 'italic',
    color: '#318CE7',
  },
  {
    tag: tags.strong,
    fontWeight: 'bold',
    color: '#F5761A',
  },
]);

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
        // javascript(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
        syntaxHighlighting(customSyntaxHighlighting),
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
