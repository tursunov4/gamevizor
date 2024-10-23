import { useEffect, useLayoutEffect, useState } from 'react';
import { useMobileContext } from '../../stores/mobileProvider';

function useWindowSize() {
  const { is_mobile } = useMobileContext(); 
  const [size, setSize] = useState([is_mobile ? 0.0 : 1600, 0.0]);

  
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export default useWindowSize