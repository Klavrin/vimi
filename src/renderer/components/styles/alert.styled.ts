import styled from 'styled-components';

const StyledAlert = styled.div`
  width: 60rem;
  max-width: calc(100% - 4rem);
  padding: 1rem;
  margin-right: 2rem;
  background: ${(props) => props.theme.backgroundSecondary};
  border: 1px solid ${(props) => props.theme.secondary};
  border-radius: 10px;
  z-index: 99;

  display: flex;
  gap: 1rem;

  position: absolute;
  left: 50%;
  transform: translate(-50%);

  .icon-container {
    min-width: 20px;
    min-height: 100%;
    margin-block: auto;
  }

  .content-container {
    width: 100%;
  }

  p {
    opacity: 0.7;
  }
`;

export default StyledAlert;
