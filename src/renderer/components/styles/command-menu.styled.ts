import styled from 'styled-components';

const StyledCommandMenu = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30vh;

  backdrop-filter: blur(3px);

  position: fixed;
  top: 0;

  .container {
    width: 60%;
    color: ${(props) => props.theme.primary};
    border: 1px solid ${(props) => props.theme.secondary};
    border-radius: 10px;
  }

  .input-field {
    background: ${(props) => props.theme.backgroundSecondary};
    padding-inline: 1rem;
    padding-block: 0.6rem;
    border-radius: 10px 10px 0 0;
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.secondary};

    display: flex;
    align-items: center;
    gap: 8px;

    & .magnifying-glass {
      color: ${(props) => props.theme.primary};
    }
  }

  [cmdk-input] {
    background: none;
    outline: none;
    border: none;
  }

  .command-item {
    display: flex;
    align-items: center;
    gap: 8px;

    text-align: start;
    background: ${(props) => props.theme.backgroundSecondary};
    padding-inline: 1rem;
    padding-block: 0.6rem;

    & .separator {
      height: 1px;
      background-color: ${(props) => props.theme.secondary};
      margin-block: 0.5rem;
    }

    &[data-selected='true'] {
      outline-width: 1px;
      outline-color: ${(props) => props.theme.primary};
      outline-style: solid;
    }

    &:last-child {
      border-radius: 0 0 10px 10px;
    }
  }
`;

export default StyledCommandMenu;
