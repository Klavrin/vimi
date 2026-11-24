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
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media only screen and (max-width: 1248px) {
      width: 90%;
    }
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.5rem 0.5rem 1.5rem;

    h2 {
      font-size: 1.1rem;
      font-weight: 600;
    }

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
    flex: 1;
    overflow-y: auto;
    padding-inline: 1rem;
    padding-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    section {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    h3 {
      padding-inline: 1rem;
      padding-bottom: 0.3rem;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      opacity: 0.6;
    }

    h4 {
      padding-inline: 1rem;
      padding-top: 0.8rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .empty {
      padding-inline: 1rem;
      opacity: 0.6;
    }
  }

  .settings-option {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    border-radius: 4px;

    &:hover {
      background: ${(props) => props.theme.border.secondary};
    }

    &.toggle {
      cursor: pointer;
    }

    &.disabled {
      opacity: 0.5;
    }

    .label {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .description {
      font-size: 0.8rem;
      opacity: 0.6;
    }
  }

  .settings-input {
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.border.primary};
    background: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.text.primary};
    font: inherit;

    &:focus {
      outline: 1px solid ${(props) => props.theme.text.primary};
    }

    &.number {
      width: 6rem;
    }

    &.key {
      width: 11rem;
      font-family: 'Roboto Mono', monospace;
    }
  }

  .theme-swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    padding-inline: 1rem;
  }

  .theme-swatch {
    width: 8rem;
    padding: 0.6rem;
    border-radius: 6px;
    border: 1px solid;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;

    &.active {
      outline: 2px solid ${(props) => props.theme.text.primary};
      outline-offset: 2px;
    }

    .swatch-bar {
      height: 0.8rem;
      border-radius: 3px;
    }
  }

  .mapping-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 1rem;

    .arrow {
      opacity: 0.6;
    }
  }

  .icon-button,
  .add-mapping {
    padding: 4px 8px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: ${(props) => props.theme.text.primary};

    &:hover:not(:disabled) {
      background: ${(props) => props.theme.border.secondary};
    }

    &:disabled {
      opacity: 0.5;
    }
  }

  .add-mapping {
    align-self: flex-start;
    margin-left: 1rem;
    margin-top: 0.3rem;
  }
`;

export default StyledSettings;
