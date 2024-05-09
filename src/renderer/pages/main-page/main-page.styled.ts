import styled from 'styled-components';

const StyledMainPage = styled.div`
  width: 100%;
  max-height: calc(100vh - 44px);
  overflow-y: scroll;

  border-top-left-radius: 8px;
  border-top: 1px solid ${(props) => props.theme.border.secondary};
  border-left: 1px solid ${(props) => props.theme.border.secondary};
  z-index: 9999;
`;

export default StyledMainPage;
