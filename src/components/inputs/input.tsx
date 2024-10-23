import { CSSProperties } from 'react';
import styles from "../../styles/input.module.css"

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onEventEnterPressed?: () => void;
  value?: any;
  min?: number;
  max?: number;
  suffix?: string;
  style?: CSSProperties;
  maxlenght?: number;
  isDisabled?: boolean;
  styles_suffix?: CSSProperties;
  label_style?: CSSProperties

  onFocus?: (e: any) => string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  onChange,
  value,
  min,
  max,
  suffix,
  style,
  maxlenght,
  onEventEnterPressed,
  isDisabled,
  styles_suffix,
  label_style
}) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    if (onChange) {
      onChange(event.target.value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (onEventEnterPressed) onEventEnterPressed();
    }
  };

  return (
    <div style={{position: "relative"}}>
      {label && <div className={styles.label} style={label_style}>{label}</div>}
      <div className={styles.input_container}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={styles.input}
          min={min}
          max={max}
          style={{...style, ...{cursor: isDisabled ? "not-allowed" : "initial"}}}
          maxLength={maxlenght}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
        <img className={styles.suffix} style={styles_suffix} src={suffix}/>
        {type === "date" && <img src='/icons/bases/date_icon.svg' width={10} height={12} style={{width: "15px", height: "25px", transform: "translateX(-95%) translateY(-50%)", position: "absolute", left: "95%", top: "50%", pointerEvents: "none", zIndex: 1}}/>}
      </div>
    </div>
  );
};

export default Input;