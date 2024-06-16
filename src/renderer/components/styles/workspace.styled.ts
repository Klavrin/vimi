import styled from 'styled-components';

const StyledWorkspace = styled.div`
  width: 100%;
  min-height: calc(100vh - 44px); /* 44px is the height of the sidebar */
  background: ${(props) => props.theme.background.primary};
  border-top-left-radius: 10px;

  .cm-editor {
    width: 100%;
    min-height: calc(100vh - 44px);
    background: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.text.primary};
  }

  .cm-editor * {
    /* font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans',
      Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; */
    font-family: 'Roboto Mono', monospace;
  }

  .cm-focused .cm-selectionBackground,
  ::selection {
    /* background: rgba(0, 0, 0, 0.4) !important; */
    background: ${(props) => props.theme.border.primary} !important;
  }

  .cm-selectionMatch {
    background: ${(props) => props.theme.border.primary} !important;
  }

  .cm-gutters {
    border: none;
  }

  .cm-gutter {
    background: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.text.primary};
  }

  .cm-gutterElement {
    opacity: 0.3;
  }

  .cm-activeLineGutter {
    opacity: 1;
  }

  .cm-focused .cm-cursor {
    /* border-left-color: ${(props) => props.theme.text.primary}; */
    border-right-color: red !important;
  }

  .cm-activeLine,
  .cm-activeLineGutter {
    /* background: ${(props) => props.theme.border.secondary}; */
    background: rgba(0, 0, 0, 0);
  }

  .cm-content {
    caret-color: ${(props) => props.theme.text.primary};
  }

  .cm-fat-cursor {
    position: absolute;
    background: ${(props) => props.theme.background.primary};
    filter: invert();
  }

  .cm-editor:not(.cm-focused) .cm-fat-cursor {
    background: none;
    outline: solid 1px ${(props) => props.theme.background.primary};
    color: transparent !important;
  }

  .md-editor-preview {
    background: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.text.primary};
  }

  .md-editor-preview * {
    background: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.text.primary};
  }

  .tab-list {
    width: 100%;
    background-color: ${(props) => props.theme.background.primary};
    border-bottom: 2px solid ${(props) => props.theme.border.primary};
    position: fixed;
    top: 0;
    left: 0;
    padding-left: 5rem;
    z-index: 99;
    -webkit-app-region: no-drag;
  }
`;

export default StyledWorkspace;
