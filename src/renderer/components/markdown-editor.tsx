import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setIsEditing } from '../store/reducers/workspace';
import useCodemiror from '../utils/use-codemirror';

type MarkdownEditorProps = {
  value: string;
  // TODO: type
  markdownEditorRefs: any;
  index: number;
  previewMode: boolean;
};

function MarkdownEditor({
  value,
  markdownEditorRefs,
  index,
  previewMode,
}: MarkdownEditorProps) {
  const [refContainer, editorView] = useCodemiror(value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editorView) markdownEditorRefs.current[index] = editorView;
  }, [editorView, index, markdownEditorRefs]);

  return (
    <div
      ref={refContainer}
      onFocus={() => dispatch(setIsEditing(true))}
      onBlur={() => dispatch(setIsEditing(false))}
      style={{ display: !previewMode ? 'block' : 'none' }}
    />
  );
}

export default MarkdownEditor;
