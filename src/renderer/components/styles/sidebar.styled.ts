import styled from 'styled-components';

const StyledSidebar = styled.div`
  width: 240px;
  height: 100vh;
  border-right-width: 2px;
  border-right-style: solid;
  border-right-color: ${(props) =>
    props.theme.borderColor
      ? props.theme.borderColor
      : 'rgba(255, 255, 255, 0.1)'};
  overflow-y: scroll;

  position: fixed;
  top: 0;
  left: 0;

  .container {
    padding-top: 35px;
    padding-inline: 10px;
    padding-bottom: 10px;
    flex-direction: column;
    gap: 10px;
  }

  .note {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding-inline: 10px;
    padding-block: 5px;
  }
`;

export default StyledSidebar;
