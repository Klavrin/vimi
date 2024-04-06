import styled from 'styled-components';

const StyledEditor = styled.div`
  margin: 0 auto;
  max-width: 55rem;

  .cm-editor {
    width: 100%;
    min-height: 100%;
    background: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.color};
  }

  .cm-editor * {
    font-family: sans-serif;
  }

  .cm-focused .cm-selectionBackground,
  ::selection {
    /* background: rgba(0, 0, 0, 0.4) !important; */
    background: ${(props) => props.theme.borderColor} !important;
  }

  .cm-selectionMatch {
    background: rgba(0, 0, 0, 0.4);
  }

  .cm-gutters {
    border: none;
  }

  .cm-gutter {
    background: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.color};
  }

  .cm-focused .cm-cursor {
    border-left-color: ${(props) => props.theme.color};
  }

  .cm-activeLine,
  .cm-activeLineGutter {
    background: rgba(0, 0, 0, 0.1);
  }

  .md-editor-preview {
    width: 50%;
    height: 100%;
    background: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.color};
  }

  .md-editor-preview * {
    background: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.color};
  }
`;

export default StyledEditor;
