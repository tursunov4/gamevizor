import React, { CSSProperties, useEffect, useRef } from 'react';
import styles from "../styles/input.module.css"

interface Props {
    value?: string | number;
  suffix?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  suffixProps?: React.HTMLAttributes<HTMLSpanElement>;
  onChange: (value: string) => void;
  sub_styles?: CSSProperties
}

let canvas: HTMLCanvasElement; // Объявляем canvas глобально

const InputWithSuffix: React.FC<Props> = ({
    value,
  suffix = 'ms.',
  inputProps,
  suffixProps,
  onChange,
  sub_styles
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const suffixRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (inputRef.current && suffixRef.current) {
      updateSuffix();
      inputRef.current.addEventListener('input', updateSuffix);
      return () => {
        if (inputRef.current) { // Добавлен этот if
          inputRef.current.removeEventListener('input', updateSuffix);
        }
      };
    }
  }, [value]);

  const updateSuffix = () => {
    if (inputRef.current && suffixRef.current) {
      // const width = getTextWidth(inputRef.current.value, "Unbounded_Light_Base") + 1;
      const width = inputRef.current.value.length * 8
      console.log(width, inputRef.current.value)
      suffixRef.current.style.left = `${width}px`;
    }
  };

  const getTextWidth = (text: string, font: string) => {
    canvas = canvas || (canvas = document.createElement('canvas')); 
    if (text.length == 0) {
        text = "0"
    }
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      const metrics = context.measureText(text);
      return metrics.width;
    }
    return 0; 
  };

  return (
    <div style={sub_styles} className={styles.input_container}>
      <input className={styles.input}
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="number"
        {...inputProps}
      />
      <span
        {...suffixProps}
        ref={suffixRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 9,
          color: 'white',
          marginLeft: 30,
          ...suffixProps?.style
        }}
      >
        {suffix}
      </span>
    </div>
  );
};

export default InputWithSuffix;