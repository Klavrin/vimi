import styled from 'styled-components';

const StyledLoading = styled.div`
  background: ${(props) => props.theme.background.primary};
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    color: ${(props) => props.theme.text.primary};
    font-size: 10em;
  }
`;

export default StyledLoading;
