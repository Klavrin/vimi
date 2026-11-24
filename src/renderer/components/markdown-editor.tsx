import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setIsEditing, setEditorRefs } from '../store/reducers/workspace';
import useCodemiror from '../utils/use-codemirror';

type MarkdownEditorProps = {
  value: string;
  // TODO: type
  markdownEditorRefs: any;
  tabId: string;
  previewMode: boolean;
  setEditorContent: (value: string) => void;
};

function MarkdownEditor({
  value,
  markdownEditorRefs,
  tabId,
  previewMode,
  setEditorContent,
}: MarkdownEditorProps) {
  const [refContainer, editorView] = useCodemiror(value, (state: any) => {
    setEditorContent(state.doc.toString());
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (editorView) {
      markdownEditorRefs.current[tabId] = editorView;
      // Store the markdownEditorRef in the redux store so that it can be used in the sidebar component (you store the refs in redux and also have a useRef, this is not optimal, might potentially be improved later)
      dispatch(setEditorRefs({ ...markdownEditorRefs.current })); // might be causing the double rendering bug
    }
  }, [editorView, tabId, markdownEditorRefs]);

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
