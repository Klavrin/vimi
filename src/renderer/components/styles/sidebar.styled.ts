import styled from 'styled-components';

const StyledSidebar = styled.div`
  /* height: 100vh;
  overflow-y: scroll;
  background: ${(props) => props.theme.backgroundSecondary}; */

  .sidebar-container {
    height: 100vh;
    overflow-y: scroll;
    background: ${(props) => props.theme.backgroundSecondary};
  }

  .container {
    padding: 0 10px 10px 10px;
    flex-direction: column;
    gap: 10px;
  }

  .note {
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
    outline-color: ${(props) => props.theme.secondary};
    outline-width: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

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
`;

export default StyledSidebar;
