import styled from 'styled-components';

const StyledWorkspace = styled.div`
  width: 100%;
  min-height: calc(100vh - 44px); /* 44px is the height of the sidebar */
  background: ${(props) => props.theme.backgroundPrimary};
  border-top-left-radius: 10px;

  .cm-editor {
    width: 100%;
    min-height: calc(100vh - 44px);
    background: ${(props) => props.theme.backgroundPrimary};
    color: ${(props) => props.theme.primary};
  }

  .cm-editor * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans',
      Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  }

  .cm-focused .cm-selectionBackground,
  ::selection {
    /* background: rgba(0, 0, 0, 0.4) !important; */
    background: ${(props) => props.theme.borderColor} !important;
  }

  .cm-selectionMatch {
    background: ${(props) => props.theme.borderColor} !important;
  }

  .cm-gutters {
    border: none;
  }

  .cm-gutter {
    background: ${(props) => props.theme.backgroundPrimary};
    color: ${(props) => props.theme.primary};
  }

  .cm-gutterElement {
    opacity: 0.3;
  }

  .cm-activeLineGutter {
    opacity: 1;
  }

  .cm-focused .cm-cursor {
    border-left-color: ${(props) => props.theme.primary};
  }

  .cm-activeLine,
  .cm-activeLineGutter {
    background: rgba(0, 0, 0, 0.1);
  }

  .md-editor-preview {
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.backgroundPrimary};
    color: ${(props) => props.theme.primary};
  }

  .md-editor-preview * {
    background: ${(props) => props.theme.backgroundPrimary};
    color: ${(props) => props.theme.primary};
  }

  .tab-list {
    width: 100%;
    background-color: ${(props) => props.theme.backgroundPrimary};
    border-bottom: 2px solid ${(props) => props.theme.borderColor};
    position: fixed;
    top: 0;
    left: 0;
    padding-left: 5rem;
    z-index: 99;
    -webkit-app-region: no-drag;
  }
`;

export default StyledWorkspace;
