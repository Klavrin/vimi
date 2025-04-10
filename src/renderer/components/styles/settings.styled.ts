import styled from 'styled-components';

const StyledSettings = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 1000;

  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.2);

  position: fixed;
  top: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    width: 80vw;
    height: 85vh;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 10px;
    border: 1px solid ${(props) => props.theme.text.secondary};
    /* padding: 1rem; */

    @media only screen and (max-width: 1248px) {
      width: 90%;
    }
  }

  .top-bar {
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem;

    button {
      padding: 4px;
      border-radius: 4px;
      opacity: 0.8;

      &:hover {
        background: ${(props) => props.theme.text.secondary};
      }
    }

    .icon {
      color: ${(props) => props.theme.text.primary};
    }
  }

  .settings-box {
    padding-inline: 1rem;
  }

  .settings-option {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

export default StyledSettings;
