import styled from 'styled-components';

const StyledSidebar = styled.div`
  width: 240px;
  height: 100vh;
  border-right: 2px solid rgba(255, 255, 255, 0.1);

  position: fixed;
  top: 0;
  left: 0;

  .sidebar-container {
    padding-top: 35px;
    padding-inline: 10px;
    flex-direction: column;
    gap: 10px;
  }

  .sidebar-note {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding-inline: 10px;
    padding-block: 5px;
  }
`;

export default StyledSidebar;
