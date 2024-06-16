import { useState, useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, drawSelection } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  indentOnInput,
  bracketMatching,
  HighlightStyle,
  syntaxHighlighting,
} from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';

import { vim } from '@replit/codemirror-vim';

const customSyntaxHighlighting = HighlightStyle.define([
  {
    tag: tags.heading1,
    class: 'cm-heading1',
  },
  {
    tag: tags.heading2,
    class: 'cm-heading2',
  },
  {
    tag: tags.heading3,
    class: 'cm-heading3',
  },
  {
    tag: tags.heading4,
    class: 'cm-heading4',
  },
  {
    tag: tags.heading5,
    class: 'cm-heading5',
  },
  {
    tag: tags.heading6,
    class: 'cm-heading6',
  },
  {
    tag: tags.emphasis,
    class: 'cm-emphasis',
  },
  {
    tag: tags.strong,
    class: 'cm-strong',
  },
  {
    tag: [tags.attributeName, tags.variableName],
    class: 'cm-def',
  },
  {
    tag: tags.keyword,
    class: 'cm-keyword',
  },
  {
    tag: tags.comment,
    class: 'cm-comment',
  },
  {
    tag: tags.variableName,
    class: 'cm-variable',
  },
  {
    tag: tags.operator,
    class: 'cm-operator',
  },
  {
    tag: tags.propertyName,
    class: 'cm-property',
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
        indentOnInput(),
        bracketMatching(),
        syntaxHighlighting(customSyntaxHighlighting),
        drawSelection(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
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
