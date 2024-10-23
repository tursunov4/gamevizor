import React from 'react';
import styles from "../styles/baseCenterContainer.module.css"

interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}


const BaseCenterContainer: React.FC<ContainerProps> = ({ children, style }) => {
  return (
    <div className={styles.container} style={style}>
      {children}
    </div>
  );
};

export default BaseCenterContainer;