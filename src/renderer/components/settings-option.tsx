import { useRef } from 'react';

interface SettingsOptionProps {
  innerText: string;
}

const SettingsOption = ({ innerText }: SettingsOptionProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleOnClick = () => {
    if (ref.current) {
      ref.current.checked = !ref.current.checked;
    }
  };

  return (
    <div className="settings-option" onClick={handleOnClick}>
      <p>{innerText}</p>
      <input ref={ref} type="checkbox" />
    </div>
  );
};

export default SettingsOption;
