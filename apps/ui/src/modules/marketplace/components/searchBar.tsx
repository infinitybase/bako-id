import { SearchIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { memo } from 'react';

interface SearchBarProps {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}

const SearchBar = ({
  onChange,
  placeholder = 'Search for asset id, seller address or handle',
  value,
}: SearchBarProps) => {
  return (
    <FormControl>
      <InputGroup position="relative">
        <Input
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          type="text"
          size="lg"
          variant="outlined"
          value={value}
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
