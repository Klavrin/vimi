import styled from 'styled-components';

const StyledSidebarTabHeader = styled.div`
  width: 100%;
  height: 44px;

  display: flex;
  justify-content: end;
  align-items: center;

  -webkit-app-region: drag;

  button {
    padding: 4px;
    border-radius: 4px;
    -webkit-app-region: no-drag;
    opacity: 0.8;
  }

  button:hover {
    background: ${(props) => props.theme.secondary};
  }
`;

export default StyledSidebarTabHeader;
