import styled from 'styled-components';

const StyledWorkspaceTabHeader = styled.div`
  width: 100%;
  height: 38px;
  border-bottom: 2px solid ${(props) => props.theme.borderColor};
  user-select: none;

  -webkit-app-region: drag;

  button,
  li {
    -webkit-app-region: no-drag;
  }

  .workspace-tabs {
    height: 100%;
    display: flex;
    align-items: center;
    list-style-type: none;
  }

  .workspace-tab {
    height: 100%;
    padding-inline: 0.8rem;
    border-right: 2px solid ${(props) => props.theme.borderColor};
    cursor: pointer;

    display: flex;
    align-items: center;

    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

export default StyledWorkspaceTabHeader;
