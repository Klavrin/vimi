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
`;

export default StyledSidebar;
