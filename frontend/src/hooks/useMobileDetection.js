// hooks/useMobileDetection.js

import { useState, useEffect } from 'react';

const useMobileDetection = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Проверяем при загрузке
    checkDevice();

    // Слушаем изменения размера окна
    window.addEventListener('resize', checkDevice);

    // Очищаем обработчик при размонтировании
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useMobileDetection;