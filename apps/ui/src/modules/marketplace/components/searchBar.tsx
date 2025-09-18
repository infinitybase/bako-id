import { SearchIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
  debounceMs?: number;
}

const SearchBar = ({
  onChange,
  placeholder = 'Search for asset id, seller address or handle',
  value,
  debounceMs = 300,
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const debouncedOnChange = useCallback(
    (newValue: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue); // Immediate visual feedback to the input
      debouncedOnChange(newValue); // Debounced callback to the url
    },
    [debouncedOnChange]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <FormControl pr={{ base: 3, sm: 0 }}>
      <InputGroup position="relative">
        <Input
          onChange={handleInputChange}
          placeholder=" "
          type="text"
          size="lg"
          variant="outlined"
          bg="input.600"
          value={inputValue}
          border="grey.600"
        />

        <FormLabel
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          style={{ textWrap: 'nowrap' }}
          fontSize={{
            base: 'xs',
            sm: 'sm',
            md: 'md',
          }}
          pt={{ base: 1, sm: 0 }}
        >
          {placeholder}
        </FormLabel>

        <InputRightElement
          position="absolute"
          right={1}
          top="50%"
          transform="translateY(-50%)"
        >
          <SearchIcon />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default memo(SearchBar);
