/* eslint-disable react/require-default-props -- optional props use default parameters */
import { KeyboardEvent, ReactNode } from 'react';

interface SettingsOptionProps {
  label: string;
  description?: string;
  /** Renders a checkbox and makes the whole row toggle it */
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  disabled?: boolean;
  /** Control (input, select, ...) shown on the right when the row isn't a toggle */
  children?: ReactNode;
}

function SettingsOption({
  label,
  description = undefined,
  checked = false,
  onToggle = undefined,
  disabled = false,
  children = null,
}: SettingsOptionProps) {
  const isToggle = onToggle !== undefined;

  const toggle = () => {
    if (isToggle && !disabled) onToggle(!checked);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  const text = (
    <div className="label">
      <p>{label}</p>
      {description && <span className="description">{description}</span>}
    </div>
  );

  if (!isToggle) {
    return (
      <div className={`settings-option ${disabled ? 'disabled' : ''}`}>
        {text}
        <div className="control">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`settings-option toggle ${disabled ? 'disabled' : ''}`}
      role="switch"
      aria-checked={!!checked}
      aria-disabled={disabled}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      {text}
      <input
        type="checkbox"
        checked={!!checked}
        readOnly
        tabIndex={-1}
        disabled={disabled}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}

export default SettingsOption;
