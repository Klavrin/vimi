import { useState, useEffect, useRef } from 'react';
import { Compartment, EditorState, Extension } from '@codemirror/state';
import { useSelector } from 'react-redux';
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
import type { State } from '../types/state';
import {
  fontSizeExtension,
  lineNumbersExtension,
  lineWrappingExtension,
} from './editor-config';

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
  {
    tag: tags.string,
    class: 'cm-string',
  },
]);

type onChangeProps = (value: EditorState) => void;

function useCodemiror(doc: string, onChange?: onChangeProps) {
  const refContainer = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView>();
  const editorSettings = useSelector((state: State) => state.settings.editor);
  const vimEnabled = useSelector((state: State) => state.settings.vim.enabled);

  // One set of compartments per editor, so settings can be swapped in live
  const compartments = useRef({
    vim: new Compartment(),
    lineWrapping: new Compartment(),
    lineNumbers: new Compartment(),
    fontSize: new Compartment(),
  });
  const settingsRef = useRef({ editorSettings, vimEnabled });
  settingsRef.current = { editorSettings, vimEnabled };
  // The settings the editor was last configured with
  const appliedSettings = useRef(settingsRef.current);

  // Relative line numbers need to rebuild themselves when the cursor moves
  const reconfigureRelativeNumbers = (
    extension: Extension,
    view: EditorView,
  ) => {
    if (settingsRef.current.editorSettings.lineNumbers !== 'relative') return;
    view.dispatch({
      effects: compartments.current.lineNumbers.reconfigure(extension),
    });
  };

  useEffect(() => {
    if (!refContainer.current) return;

    // eslint-disable-next-line prefer-const
    let view: EditorView;
    const { vim: vimCompartment } = compartments.current;
    const initial = settingsRef.current;

    const startState = EditorState.create({
      doc,
      extensions: [
        vimCompartment.of(initial.vimEnabled ? vim() : []),
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
        compartments.current.lineWrapping.of(
          lineWrappingExtension(initial.editorSettings.lineWrapping),
        ),
        compartments.current.lineNumbers.of(
          lineNumbersExtension(
            initial.editorSettings.lineNumbers,
            (extension) => reconfigureRelativeNumbers(extension, view),
          ),
        ),
        compartments.current.fontSize.of(
          fontSizeExtension(initial.editorSettings.fontSize),
        ),
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            if (onChange) {
              onChange(update.state);
            }
          }
        }),
      ],
    });

    view = new EditorView({
      state: startState,
      parent: refContainer.current,
    });

    setEditorView(view);
  }, []);

  // Apply settings changes to the existing editor, touching only what changed
  useEffect(() => {
    if (!editorView) return;

    const previous = appliedSettings.current;
    const {
      vim: vimCompartment,
      lineWrapping,
      lineNumbers,
      fontSize,
    } = compartments.current;
    const effects = [];

    if (previous.vimEnabled !== vimEnabled)
      effects.push(vimCompartment.reconfigure(vimEnabled ? vim() : []));
    if (previous.editorSettings.lineWrapping !== editorSettings.lineWrapping)
      effects.push(
        lineWrapping.reconfigure(
          lineWrappingExtension(editorSettings.lineWrapping),
        ),
      );
    if (previous.editorSettings.lineNumbers !== editorSettings.lineNumbers)
      effects.push(
        lineNumbers.reconfigure(
          lineNumbersExtension(editorSettings.lineNumbers, (extension) =>
            reconfigureRelativeNumbers(extension, editorView),
          ),
        ),
      );
    if (previous.editorSettings.fontSize !== editorSettings.fontSize)
      effects.push(
        fontSize.reconfigure(fontSizeExtension(editorSettings.fontSize)),
      );

    appliedSettings.current = { editorSettings, vimEnabled };
    if (effects.length) editorView.dispatch({ effects });
  }, [editorView, editorSettings, vimEnabled]);

  return [refContainer, editorView] as const;
}

export default useCodemiror;
