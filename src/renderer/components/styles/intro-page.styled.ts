import styled from 'styled-components';

const StyledIntroPage = styled.div`
  height: calc(100vh - 46px - 2px);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  .intro-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min(420px, 90%);
  }

  .intro-logo {
    margin: 0 0 2.5rem;
    font-size: clamp(6rem, 22vw, 11rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
    color: ${(props) => props.theme.text.primary};
    opacity: 0.06;
    pointer-events: none;
  }

  .intro-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .intro-row-wrapper {
    position: relative;
  }

  .intro-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: ${(props) => props.theme.text.secondary};
    font-size: 14px;
    text-align: left;
    cursor: pointer;
    transition:
      background 0.1s ease,
      color 0.1s ease;

    &:hover:not([aria-disabled='true']),
    &:focus-visible:not([aria-disabled='true']) {
      outline: none;
      background: ${(props) => props.theme.background.secondary};
      color: ${(props) => props.theme.text.primary};
    }

    &:focus-visible {
      outline: none;
    }

    &[aria-disabled='true'] {
      opacity: 0.45;
      cursor: default;
    }
  }

  .intro-keys {
    display: flex;
    gap: 4px;
  }

  .intro-key {
    min-width: 22px;
    padding: 1px 6px;
    border: 1px solid ${(props) => props.theme.border.secondary};
    border-radius: 4px;
    background: ${(props) => props.theme.background.secondary};
    color: ${(props) => props.theme.text.secondary};
    font-size: 12px;
    text-align: center;
  }

  .intro-hint {
    margin-top: 1.5rem;
    font-size: 12px;
    color: ${(props) => props.theme.text.secondary};
    opacity: 0.7;
  }
`;

export default StyledIntroPage;
