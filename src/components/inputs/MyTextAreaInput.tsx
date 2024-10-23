import { CSSProperties } from 'react';
import styles from "../../styles/inputs/MyTextAreaInput.module.css"

interface InputProps {
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: any;
  style?: CSSProperties;
  isDisabled?: boolean;
  onEnter?: (value: string) => void;
}

const MyTextAreaInput: React.FC<InputProps> = ({
  label,
  placeholder,
  onChange,
  value,
  style,
  isDisabled,
  onEnter
}) => {

  const handleChange = (event: any) => {

    if (onChange) {
      onChange(event.target.value);
    }
  };
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey && onEnter) {
      event.preventDefault();
      onEnter(event.target.value);
    }
  }



  return (
    <div className={styles.input_container}>
      {label && <div className={styles.label}>{label}</div>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={styles.input}
        style={style}
        disabled={isDisabled}
      />
    </div>
  );
};

export default MyTextAreaInput;