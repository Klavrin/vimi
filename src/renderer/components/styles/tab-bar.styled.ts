import styled from 'styled-components';

const StyledTabBar = styled.div`
  width: 100%;
  height: 35px;
  background: ${(props) => props.theme.backgroundColor};
  border-bottom: 2px solid ${(props) => props.theme.borderColor};

  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;

  .tab-list {
    height: 35px;
    display: flex;
    align-items: center;
    list-style-type: none;
  }

  .tab {
    height: 100%;
    border-left: 2px solid ${(props) => props.theme.borderColor};
    padding-inline: 8px;
    line-height: 35px;
    cursor: pointer;

    -webkit-app-region: no-drag;

    &:last-child {
      border-right: 2px solid ${(props) => props.theme.borderColor};
    }
  }
`;

export default StyledTabBar;
