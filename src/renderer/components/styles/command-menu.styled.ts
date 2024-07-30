import styled from 'styled-components';

const StyledCommandMenu = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30vh;

  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.2);

  position: fixed;
  top: 0;

  .container {
    width: 60%;
    color: ${(props) => props.theme.text.primary};
    border: 1px solid ${(props) => props.theme.text.secondary};
    border-radius: 10px;

    @media only screen and (max-width: 1248px) {
      width: 80%;
    }
  }

  .input-field {
    background: ${(props) => props.theme.background.secondary};
    padding-inline: 1rem;
    padding-block: 0.7rem;
    border-radius: 10px 10px 0 0;
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.text.secondary};

    display: flex;
    align-items: center;
    gap: 8px;

    & .magnifying-glass {
      color: ${(props) => props.theme.text.primary};
    }
  }

  [cmdk-input] {
    background: none;
    outline: none;
    border: none;
    color: ${(props) => props.theme.text.primary};
    width: 100%;
  }

  .command-item {
    display: flex;
    align-items: center;

    background: ${(props) => props.theme.background.secondary};
    padding-inline: 1rem;
    padding-block: 0.6rem;

    .sidebar-item-directory-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 10px;
    }

    .command-item-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-inline: 0.3rem;
      background-color: ${(props) => props.theme.white[100]};
      font-size: 0.8rem;
      border-radius: 4px;
    }

    .command-item-title {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    @media screen and (max-width: 500px) {
      .command-item-tag {
        font-size: 0.6rem;
      }

      .command-item-title {
        font-size: 0.8rem;
        line-height: 1rem;
      }
    }

    & .separator {
      height: 1px;
      background-color: ${(props) => props.theme.text.secondary};
      margin-block: 0.5rem;
    }

    &[data-selected='true'] {
      outline-width: 1px;
      outline-color: ${(props) => props.theme.text.primary};
      outline-style: solid;
    }

    &:last-child {
      border-radius: 0 0 10px 10px;
    }
  }

  hr {
    height: 0.35rem;
    border: none;
    background-color: ${(props) => props.theme.white[100]};
  }
`;

export default StyledCommandMenu;
