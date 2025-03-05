import styled from 'styled-components';

const StyledSidebar = styled.div`
  height: 100vh;
  max-width: 60rem;
  /* border-right: 1px solid red; */

  .container {
    height: calc(100% - 44px);
    overflow-y: scroll;
    /* border-right: 1px solid ${(props) => props.theme.borderColor}; */
  }

  .sidebar-content {
    height: 95%;
    padding: 2px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .note,
  .sidebar-item {
    width: 100%;
    border: none;
    border-radius: 5px;
    padding-inline: 10px;
    padding-block: 2px;
    cursor: pointer;
    text-align: start;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    outline-color: ${(props) => props.theme.text.secondary};
    outline-width: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;

    &:focus {
      & .title {
        opacity: 1;
      }
    }

    & .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.6;
    }
  }

  .directory-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 10px;
  }

  .file-input-renaming {
    width: 100%;
    margin: 0;
    padding: 0;
    background: none;
    border: none;
  }

  .sidebar-footer {
    display: flex;
    align-items: center;
    justify-content: end;
    padding-inline: 10px;

    .settings-icon {
      padding: 4px;
      border-radius: 4px;
      opacity: 0.8;

      &:hover {
        background: ${(props) => props.theme.text.secondary};
      }
    }
  }

  .icon {
    color: ${(props) => props.theme.text.primary};
  }
`;

export default StyledSidebar;
