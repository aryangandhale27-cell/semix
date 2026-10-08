import { useEffect, useRef, useState } from 'react';

export function useNearViewport<T extends Element>(): {
  ref: React.RefObject<T | null>;
  isNearViewport: boolean;
} {
  const ref = useRef<T>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setIsNearViewport(true);
        observer.disconnect();
      }
    });
    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return { ref, isNearViewport };
}
