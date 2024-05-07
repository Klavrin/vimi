import styled from 'styled-components';

const StyledAlert = styled.div`
  width: 60rem;
  max-width: calc(100% - 4rem);
  padding: 1rem;
  margin-right: 2rem;
  background: ${(props) => props.theme.backgroundSecondary};
  border: 1px solid ${(props) => props.theme.secondary};
  border-radius: 10px;

  position: absolute;
  left: 50%;
  transform: translate(-50%);

  h3 {
  }

  p {
  }
`;

export default StyledAlert;
