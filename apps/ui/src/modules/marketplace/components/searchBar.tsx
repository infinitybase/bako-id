import { SearchIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

interface SeachBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  onSearch,
  placeholder = 'Search for ID',
}: SeachBarProps) => {
  return (
    <FormControl>
      <InputGroup position="relative">
        <Input
          onChange={(e) => onSearch(e.target.value)}
          placeholder=" "
          type="text"
          size="lg"
          variant="outlined"
        />

        <FormLabel>{placeholder}</FormLabel>

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
