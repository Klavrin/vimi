import styled from 'styled-components';

const StyledWorkspaceTabHeader = styled.div`
  width: 100%;
  height: 44px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  user-select: none;
  background: ${(props) => props.theme.backgroundSecondary};
  padding-inline: 1rem;

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
    gap: 5px;
  }

  .workspace-tab {
    width: 12rem;
    height: 75%;
    padding-inline: 0.8rem;
    border-radius: 7px;
    cursor: pointer;

    -webkit-app-region: no-drag;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;

    position: relative;
    top: 1px;

    & .title {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & .icon {
      outline: none;
      /* padding: 4px 6px;
      border-radius: 5px; */

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
`;

export default StyledWorkspaceTabHeader;
