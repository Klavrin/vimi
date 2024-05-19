import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FaEye } from 'react-icons/fa6';
import { togglePreviewMode, setPreviewMode } from '../store/reducers/tab-bar';

import MarkdownEditor from './markdown-editor';
import MarkdownPreview from './markdown-preview';

type TextEditorProps = {
  contents: string;
  index: number;
  markdownEditorRefs: any;
  previewMode: boolean;
};

function TextEditor({
  contents,
  index,
  markdownEditorRefs,
  previewMode,
}: TextEditorProps) {
  const [editorContent, setEditorContent] = useState(contents);
  const [spacePressed, setSpacePressed] = useState(false);
  const dispatch = useDispatch();

  // Use vim mappings in preview mode
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (!previewMode) return;

      // Toggle preview
      if (e.code === 'Space') setSpacePressed(true);
      if (e.key === 'p' && spacePressed) {
        setSpacePressed(false);
        dispatch(setPreviewMode(false));
        setTimeout(() => {
          markdownEditorRefs.current[index].focus();
        });
        document.removeEventListener('keydown', handleKeyDown);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [previewMode, spacePressed]);

  const handlePreviewButton = () => {
    dispatch(togglePreviewMode());
    if (previewMode) {
      setTimeout(() => {
        markdownEditorRefs.current[index].focus();
      });
    }
  };

  return (
    <>
      <MarkdownEditor
        value={editorContent}
        setEditorContent={setEditorContent}
        previewMode={previewMode}
        markdownEditorRefs={markdownEditorRefs}
        index={index}
      />
      <MarkdownPreview previewMode={previewMode} innerText={editorContent} />

      <button
        type="button"
        onClick={handlePreviewButton}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
        }}
      >
        <FaEye size={30} opacity={0.4} />
      </button>
    </>
  );
}

export default TextEditor;
