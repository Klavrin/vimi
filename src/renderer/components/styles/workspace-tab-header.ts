import styled from 'styled-components';

const StyledWorkspaceTabHeader = styled.div`
  height: 44px;
  /* border-bottom: 1px solid ${(props) => props.theme.borderColor}; */
  user-select: none;
  background: ${(props) => props.theme.backgroundSecondary};
  padding-inline: 1rem;
  overflow: scroll;

  -webkit-app-region: drag;

  button {
    -webkit-app-region: no-drag;
  }

  & .collapse-icon {
    padding: 4px;
    border-radius: 4px;
    opacity: 0.8;

    &:hover {
      background: ${(props) => props.theme.secondary};
    }
  }

  .workspace-tabs {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .workspace-tab {
    min-width: 6rem;
    max-width: 12rem;
    width: 12rem;
    max-width: 100%;
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
      min-width: 20px;
    }
  }
`;

export default StyledWorkspaceTabHeader;
