import styled from 'styled-components';

const StyledTooltip = styled.div`
  position: absolute;
  z-index: 99;

  div {
    background: ${(props) => props.theme.text.primary};
    color: ${(props) => props.theme.background.primary};
    padding-inline: 6px;
    padding-block: 2px;
    font-size: 12px;
    border-radius: 4px;
  }
`;

export default StyledTooltip;
