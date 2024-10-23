/// <reference types="vite-plugin-svgr/client" />

import { useState } from 'react';
import ArrowDown from "/public/icons/bases/arrows/arrow_down.svg?react"; 
import ArrowUp from "/public/icons/bases/arrows/arrow_up.svg?react";

interface FlagButtonProps {
  initialState?: boolean;
  text?: string;
  styles?: React.CSSProperties;
  className?: string;


  onChangeActive: (value: boolean) => void;
  onChangeDirectionSorting: (value: boolean) => void;
}

const FlagButton: React.FC<FlagButtonProps> = ({
  initialState = false,
  text = 'Включено',
  styles = {},
  className,
  onChangeActive,
  onChangeDirectionSorting
}) => {
  const [DirectionSorting, setDirectionSorting] = useState(false);

  const handleClick = () => {
    onChangeActive(!initialState);
  };

  const handleIconClick = () => {
    onChangeDirectionSorting(!DirectionSorting);
    setDirectionSorting(!DirectionSorting);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      <button
        style={{
          ...styles,
          fontFamily: "Unbounded_Light_Base", fontSize: "12px",
          color: initialState ? "#FF007A" : "#D4D4D4", cursor: "pointer"
        }}
        onClick={handleClick}
        className={className}
      >
        {text}
      </button>
      <button style={{ backgroundColor: 'transparent', border: "none", cursor: "pointer"}} onClick={handleIconClick}>
        {DirectionSorting ? (
          <ArrowDown style={{ stroke: initialState ? '#FF007A' : '#D4D4D4' }} />
        ) : (
          <ArrowUp style={{ stroke: initialState ? '#FF007A' : '#D4D4D4', transform: 'rotate(180deg)' }} />
        )}
      </button>
    </div>
  );
};

export default FlagButton;