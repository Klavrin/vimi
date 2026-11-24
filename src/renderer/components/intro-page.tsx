import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import Tooltip from './tooltip';

import StyledIntroPage from './styles/intro-page.styled';
import type { State } from '../types/state';

type IntroAction = {
  label: string;
  keys?: string[];
  channel?: 'openFolderDialog' | 'openFileDialog';
};

const actions: IntroAction[] = [
  { label: 'Open Folder', keys: ['⌘', 'O'], channel: 'openFolderDialog' },
  { label: 'Open File', channel: 'openFileDialog' },
  { label: 'Open Whiteboard' },
  { label: 'Open Sheets' },
  { label: 'Open Slides' },
  { label: 'Open Docs' },
  { label: 'Open Data' },
];

function IntroPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const isEditing = useSelector((state: State) => state.workspace.isEditing);
  const settingsVisible = useSelector(
    (state: State) => state.workspace.settingsVisible,
  );

  const activate = (action: IntroAction) => {
    if (!action.channel) return;
    window.electron.ipcRenderer.sendMessage(action.channel);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing || settingsVisible) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const rows: HTMLButtonElement[] = Array.from(
        containerRef.current?.querySelectorAll('.intro-row') ?? [],
      );
      if (rows.length === 0) return;

      const down = e.key === 'j' || e.key === 'ArrowDown';
      const up = e.key === 'k' || e.key === 'ArrowUp';
      if (!down && !up) return;

      e.preventDefault();
      const current = rows.indexOf(document.activeElement as HTMLButtonElement);
      let next: number;
      if (current === -1) next = down ? 0 : rows.length - 1;
      else if (down) next = current === rows.length - 1 ? 0 : current + 1;
      else next = current === 0 ? rows.length - 1 : current - 1;
      rows[next].focus();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, settingsVisible]);

  return (
    <StyledIntroPage>
      <motion.div
        className="intro-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        ref={containerRef}
      >
        <h1 className="intro-logo" aria-hidden="true">
          vimi
        </h1>
        <div className="intro-list">
          {actions.map((action) => {
            const disabled = !action.channel;
            return (
              <div className="intro-row-wrapper" key={action.label}>
                <button
                  type="button"
                  className="intro-row"
                  aria-disabled={disabled}
                  onClick={() => activate(action)}
                  onMouseEnter={() => setHoveredLabel(action.label)}
                  onMouseLeave={() => setHoveredLabel(null)}
                  onFocus={() => setHoveredLabel(action.label)}
                  onBlur={() => setHoveredLabel(null)}
                >
                  <span>{action.label}</span>
                  {action.keys && (
                    <span className="intro-keys">
                      {action.keys.map((key) => (
                        <kbd className="intro-key" key={key}>
                          {key}
                        </kbd>
                      ))}
                    </span>
                  )}
                </button>
                {disabled && (
                  <Tooltip
                    innerText="Coming soon"
                    visible={hoveredLabel === action.label}
                    style={{ right: 10, top: 'calc(100% - 4px)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <p className="intro-hint">or drag a folder here</p>
      </motion.div>
    </StyledIntroPage>
  );
}

export default IntroPage;
