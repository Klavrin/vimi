interface SettingsOptionProps {
  innerText: string;
}

const SettingsOption = ({ innerText }: SettingsOptionProps) => {
  return (
    <div className="settings-option">
      <p>{innerText}</p>
      <input type="checkbox" />
    </div>
  );
};

export default SettingsOption;
