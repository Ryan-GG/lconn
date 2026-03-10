import { useRef, useState, useCallback } from 'react';

export function useInView() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const callbackRef = useCallback((node: HTMLDivElement | null) => {
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (!node || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  return { ref: callbackRef, inView };
}
