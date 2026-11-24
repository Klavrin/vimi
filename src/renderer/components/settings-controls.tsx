/* eslint-disable react/require-default-props -- optional props use default parameters */
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';

type NumberInputProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  ariaLabel: string;
  onChange: (value: number) => void;
};

/** Number input that only reports values inside [min, max]. */
export function NumberInput({
  value,
  min,
  max,
  step = 1,
  disabled = false,
  ariaLabel,
  onChange,
}: NumberInputProps) {
  const [text, setText] = useState(String(value));

  useEffect(() => setText(String(value)), [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    const parsed = Number(e.target.value);
    if (
      e.target.value !== '' &&
      Number.isInteger(parsed) &&
      parsed >= min &&
      parsed <= max
    )
      onChange(parsed);
  };

  return (
    <input
      type="number"
      className="settings-input number"
      aria-label={ariaLabel}
      min={min}
      max={max}
      step={step}
      value={text}
      disabled={disabled}
      onChange={handleChange}
      onBlur={() => setText(String(value))}
    />
  );
}

type KeyInputProps = {
  value: string;
  placeholder?: string;
  ariaLabel: string;
  onCommit: (value: string) => void;
};

/**
 * Text input for vim key notation (`<Space>e`, `jk`, ...). Typing `<` and `>`
 * one character at a time would produce half-written mappings, so the value is
 * only committed on Enter or blur; Escape reverts.
 */
export function KeyInput({
  value,
  placeholder = undefined,
  ariaLabel,
  onCommit,
}: KeyInputProps) {
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);

  const commit = () => {
    if (text !== value) onCommit(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      commit();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setText(value);
      e.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      className="settings-input key"
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={text}
      spellCheck={false}
      autoComplete="off"
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={commit}
    />
  );
}

type SelectProps<T extends string> = {
  value: T;
  options: { value: T; label: string }[];
  ariaLabel: string;
  onChange: (value: T) => void;
};

export function Select<T extends string>({
  value,
  options,
  ariaLabel,
  onChange,
}: SelectProps<T>) {
  return (
    <select
      className="settings-input select"
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
