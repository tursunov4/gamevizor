import { createContext, useContext } from "react";

interface MobileContextType {
    is_mobile: boolean;
  }
  
  const MobileContext = createContext<MobileContextType>({ is_mobile: false });
  
  interface MobileProviderProps {
    children: React.ReactNode;
    is_mobile: boolean;
  }
  
  const MobileProvider: React.FC<MobileProviderProps> = ({ children, is_mobile }) => {
    return (
      <MobileContext.Provider value={{ is_mobile }}>
        {children}
      </MobileContext.Provider>
    );
  };
  
  export const useMobileContext = () => {
    return useContext(MobileContext);
  };
  
  export { MobileProvider };