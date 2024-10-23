import {CSSProperties, FC, useState } from "react";
import styles from "../../styles/checkbox.module.css"

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;

  style?: CSSProperties;
}

const Checkbox: FC<CheckboxProps> = ({ label, checked, onChange, style, disabled }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={styles.checkbox_container}>
      <input
        type="checkbox"
        checked={checked ?? isChecked}
        onChange={handleChange}
        className={styles.checkbox_input}
        style={style}
        disabled={disabled}
      />
      <label className={styles.checkbox_label} style={{fontFamily: "Unbounded_Light_Base"}}>{label}</label>
    </div>
  );
};

export default Checkbox;