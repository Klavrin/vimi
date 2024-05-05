import styled from 'styled-components';

const StyledCommandMenu = styled.div`
  position: absolute;
  top: 0;
  right: 50%;
  z-index: 99;

  .framer {
    [cmdk-root] {
      max-width: 640px;
      width: 100%;
      padding: 8px;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid ${(props) => props.theme.borderColor};
      outline: none;

      .dark & {
        background: ${(props) => props.theme.backgroundSecondary};
      }
    }

    [cmdk-framer-header] {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 48px;
      padding: 0 8px;
      border-bottom: 1px solid ${(props) => props.theme.borderColor};
      margin-bottom: 12px;
      padding-bottom: 8px;

      svg {
        width: 20px;
        height: 20px;
        transform: translateY(1px);
      }
    }

    [cmdk-input] {
      border: none;
      width: 100%;
      font-size: 16px;
      outline: none;
      background: gray;
      color: ${(props) => props.theme.secondary};

      &::placeholder {
        color: ${(props) => props.theme.secondary};
      }
    }

    [cmdk-item] {
      content-visibility: auto;

      cursor: pointer;
      border-radius: 12px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: ${(props) => props.theme.primary};
      padding: 8px 8px;
      margin-right: 8px;
      font-weight: 500;
      transition: all 150ms ease;
      transition-property: none;

      &[data-selected='true'] {
        background: lightblue;
        color: #ffffff;

        [cmdk-framer-item-subtitle] {
          color: #ffffff;
        }
      }

      &[data-disabled='true'] {
        color: ${(props) => props.theme.primary};
        cursor: not-allowed;
      }

      & + [cmdk-item] {
        margin-top: 4px;
      }

      svg {
        width: 16px;
        height: 16px;
        color: #ffffff;
      }
    }

    [cmdk-framer-icon-wrapper] {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      background: orange;
      border-radius: 8px;
    }

    [cmdk-framer-item-meta] {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    [cmdk-framer-item-subtitle] {
      font-size: 12px;
      font-weight: 400;
      color: ${(props) => props.theme.primary};
    }

    [cmdk-framer-items] {
      min-height: 308px;
      display: flex;
    }

    [cmdk-framer-left] {
      width: 40%;
    }

    [cmdk-framer-separator] {
      width: 1px;
      border: 0;
      margin-right: 8px;
      background: ${(props) => props.theme.backgroundPrimary};
    }

    [cmdk-framer-right] {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      margin-left: 8px;
      width: 60%;

      button {
        width: 120px;
        height: 40px;
        background: ${(props) => props.theme.backgroundPrimary};
        border-radius: 6px;
        font-weight: 500;
        color: white;
        font-size: 14px;
      }

      input[type='text'] {
        height: 40px;
        width: 160px;
        border: 1px solid ${(props) => props.theme.borderColor};
        background: #ffffff;
        border-radius: 6px;
        padding: 0 8px;
        font-size: 14px;
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.08);

        &::placeholder {
          color: ${(props) => props.theme.primary};
        }

        @media (prefers-color-scheme: dark) {
          background: var(--gray3);
        }
      }

      [cmdk-framer-radio] {
        display: flex;
        align-items: center;
        gap: 4px;
        color: ${(props) => props.theme.primary};
        font-weight: 500;
        font-size: 14px;
        accent-color: lightblue;

        input {
          width: 20px;
          height: 20px;
        }
      }

      img {
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        border: 1px solid blue;
      }

      [cmdk-framer-container] {
        width: 100px;
        height: 100px;
        background: blue;
        border-radius: 16px;
      }

      [cmdk-framer-badge] {
        background: blue;
        padding: 0 8px;
        height: 28px;
        font-size: 14px;
        line-height: 28px;
        color: blue;
        border-radius: 9999px;
        font-weight: 500;
      }

      [cmdk-framer-slider] {
        height: 20px;
        width: 200px;
        background: linear-gradient(90deg, blue 40%, gray 0%);
        border-radius: 9999px;

        div {
          width: 20px;
          height: 20px;
          background: #ffffff;
          border-radius: 9999px;
          box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.32);
          transform: translateX(70px);
        }
      }
    }

    [cmdk-list] {
      overflow: auto;
    }

    [cmdk-separator] {
      height: 1px;
      width: 100%;
      background: gray;
      margin: 4px 0;
    }

    [cmdk-group-heading] {
      user-select: none;
      font-size: 12px;
      color: gray;
      padding: 0 8px;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    [cmdk-empty] {
      font-size: 14px;
      padding: 32px;
      white-space: pre-wrap;
      color: gray;
    }
  }

  @media (max-width: 640px) {
    .framer {
      [cmdk-framer-icon-wrapper] {
      }

      [cmdk-framer-item-subtitle] {
        display: none;
      }
    }
  }
`;

export default StyledCommandMenu;
