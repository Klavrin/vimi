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
    lineHeight: '30px',
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
  {
    tag: [
      // tags.name,
      // tags.deleted,
      // tags.character,
      tags.propertyName,
      tags.attributeName,
      // tags.macroName,
    ],
    color: '#4078f2',
  },
  {
    tag: [tags.comment, tags.string],
    color: '#50a14f',
  },
  {
    tag: tags.keyword,
    color: '#007acc',
  },
  {
    tag: tags.typeName,
    color: '#f08d49',
  },

  // { tag: tags.keyword, color: 'violet' },
  // {
  //   tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
  //   color: 'red', // this is for the thing
  // },
  // { tag: [tags.function(tags.variableName), tags.labelName], color: 'red' },
  // { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: 'whyskey' },
  // { tag: [tags.definition(tags.name), tags.separator], color: 'blue' },
  // {
  //   tag: [
  //     tags.typeName,
  //     tags.className,
  //     tags.number,
  //     tags.changed,
  //     tags.annotation,
  //     tags.modifier,
  //     tags.self,
  //     tags.namespace,
  //   ],
  //   color: 'tomato',
  // },
  // {
  //   tag: [
  //     tags.operator,
  //     tags.operatorKeyword,
  //     tags.url,
  //     tags.escape,
  //     tags.regexp,
  //     tags.link,
  //     tags.special(tags.string),
  //   ],
  //   color: 'cyan',
  // },
  // { tag: [tags.meta, tags.comment], color: 'brown' },
  // { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: 'lightblue' },
  // { tag: [tags.processingInstruction, tags.string, tags.inserted], color: 'green' },
  // { tag: tags.invalid, color: 'invalid' },
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
        // lineNumbers(),
        indentOnInput(),
        bracketMatching(),
        // javascript(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
        syntaxHighlighting(customSyntaxHighlighting),
        // customTheme,
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
