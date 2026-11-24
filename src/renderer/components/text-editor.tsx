import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye } from 'react-icons/fa6';
import {
  togglePreviewMode,
  setPreviewMode,
  updateTabContents,
} from '../store/reducers/tab-bar';

import type { State } from '../types/state';
import { expandLeader, keyMatchesToken, tokenizeKeys } from '../utils/vim-keys';
import MarkdownEditor from './markdown-editor';
import MarkdownPreview from './markdown-preview';

type TextEditorProps = {
  tabId: string;
  contents: string;
  markdownEditorRefs: any;
  previewMode: boolean;
};

function TextEditor({
  tabId,
  contents,
  markdownEditorRefs,
  previewMode,
}: TextEditorProps) {
  const [editorContent, setEditorContent] = useState(contents);
  const dispatch = useDispatch();
  const vimEnabled = useSelector((state: State) => state.settings.vim.enabled);
  const leader = useSelector((state: State) => state.settings.vim.leader);
  const togglePreviewKeys = useSelector(
    (state: State) => state.settings.vim.actions.togglePreview,
  );

  // Use the configured toggle-preview mapping in preview mode, where the editor is hidden
  useEffect(() => {
    if (!previewMode || !vimEnabled) return undefined;

    const sequence = tokenizeKeys(expandLeader(togglePreviewKeys, leader));
    if (sequence.length === 0) return undefined;
    let position = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;

      if (keyMatchesToken(sequence[position], e)) {
        position += 1;
      } else {
        position = keyMatchesToken(sequence[0], e) ? 1 : 0;
      }

      if (position === sequence.length) {
        position = 0;
        e.preventDefault();
        dispatch(setPreviewMode(false));
        setTimeout(() => {
          markdownEditorRefs.current[tabId]?.focus();
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [previewMode, vimEnabled, leader, togglePreviewKeys, tabId]);

  const handleContentChange = (newContents: string) => {
    setEditorContent(newContents);
    dispatch(updateTabContents({ _id: tabId, contents: newContents }));
  };

  const handlePreviewButton = () => {
    dispatch(togglePreviewMode());
    if (previewMode) {
      setTimeout(() => {
        markdownEditorRefs.current[tabId].focus();
      });
    }
  };

  return (
    <>
      <MarkdownEditor
        value={editorContent}
        setEditorContent={handleContentChange}
        previewMode={previewMode}
        markdownEditorRefs={markdownEditorRefs}
        tabId={tabId}
      />
      <MarkdownPreview previewMode={previewMode} innerText={editorContent} />

      <div
        className="editor-actions"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
        }}
      >
        <button type="button" onClick={handlePreviewButton}>
          <FaEye size={18} opacity={0.4} className="icon" />
        </button>
      </div>
    </>
  );
}

export default TextEditor;
