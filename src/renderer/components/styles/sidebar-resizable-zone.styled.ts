import styled from 'styled-components';

const StyledSidebarResizableZone = styled.div`
  width: 5px;
  height: 100vh;
  cursor: col-resize;
  transition: width 0.2s ease-in;
  transition: background-color 0.4s linear;
  position: absolute;
  z-index: 99;

  &:hover {
    background: ${(props) => props.theme.secondary};
  }
`;

export default StyledSidebarResizableZone;
