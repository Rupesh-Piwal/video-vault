// TODO-1: Goal: Delay search API calls while user types.

import { useEffect, useState } from "react";

interface DebounceProps {
  input: string;
  delay: number;
}

export const useDebounce = ({ input, delay }: DebounceProps) => {
  // store debounced value
  const [debounceValue, setDebounceValue] = useState(input);

  useEffect(() => {
    // start timer
    const timer = setTimeout(() => {
      // update debounced value after delay
      setDebounceValue(input);
    }, delay);

    // cleanup previous timer when input changes
    return () => {
      clearTimeout(timer);
    };
  }, [input, delay]);

  // return debounced value
  return debounceValue;
};
