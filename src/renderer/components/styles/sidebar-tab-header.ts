import styled from 'styled-components';

const StyledSidebarTabHeader = styled.div`
  width: 100%;
  height: 44px;

  display: flex;
  justify-content: end;
  align-items: center;

  -webkit-app-region: drag;

  button {
    -webkit-app-region: no-drag;
  }
`;

export default StyledSidebarTabHeader;
