import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StyledTooltip from './styles/tooltip.styled';

type TooltipProps = {
  innerText: string;
  style?: React.CSSProperties;
  visible?: boolean;
};

function Tooltip({ innerText, style, visible = false }: TooltipProps) {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    let timeout: any;

    if (visible) {
      timeout = setTimeout(() => {
        setIsTooltipDisplayed(true);
        setTooltipVisible(true);
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
      setTooltipVisible(false);
    };
  }, [visible]);

  return (
    <StyledTooltip
      style={{ ...style, display: isTooltipDisplayed ? 'block' : 'none' }}
    >
      <motion.div
        animate={{ opacity: tooltipVisible ? 1 : 0 }}
        style={{ opacity: tooltipVisible ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        onEnded={() => !tooltipVisible && setIsTooltipDisplayed(false)}
      >
        {innerText}
      </motion.div>
    </StyledTooltip>
  );
}

Tooltip.defaultProps = {
  style: {},
  visible: false,
};

export default Tooltip;
