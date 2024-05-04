import styled from 'styled-components';

const StyledSidebar = styled.div`
  /* min-width: 240px; */
  height: 100vh;
  /* border-right-width: 2px; */
  /* border-right-style: solid;
  border-right-color: ${(props) => props.theme.borderColor}; */
  overflow-y: scroll;
  background: ${(props) => props.theme.backgroundSecondary};

  .container {
    padding: 0 10px 10px 10px;
    flex-direction: column;
    gap: 10px;
  }

  .note {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 5px;
    padding-inline: 10px;
    padding-block: 5px;
    cursor: pointer;
    text-align: start;

    & .title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
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
