import {createContext} from 'react';

// Создаем контекст React
const InfoQuestionPanelContext = createContext<((index: number) => void) | undefined>(
  undefined
);

export default InfoQuestionPanelContext;