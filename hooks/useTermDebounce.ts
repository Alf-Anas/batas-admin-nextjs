import { useEffect, useState } from 'react';

function useTermDebounce<T>(
  defaultValue: T | undefined = undefined,
  delay: number = 500,
): [T | undefined, (value: T | undefined) => void] {
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const [debouncedValue, setDebouncedValue] = useState<T | undefined>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return [debouncedValue, setValue];
}

export default useTermDebounce;
