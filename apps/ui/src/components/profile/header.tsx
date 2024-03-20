import { Box, Button, Text } from '@chakra-ui/react';

interface ProfileHeaderProps {
  current: string,
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const Header = ({ current, onClick }: ProfileHeaderProps) => {
  const options = ["Profile", "Records", "Ownership", "Subnames", "Permissions", "More"]

  const option = (option: string) => {
    const selectedColor = current === option.toLowerCase() ? "yellow-light" : "button.200"
    return <Button onClick={onClick} id={option} variant="ghost" pl={0} _hover={{}} _focus={{}} _active={{}}>
      <Text color={selectedColor} fontSize="sm" fontWeight={500}>
        {option}
      </Text>
    </Button>
  }

  // Good to note that, everytime the current tab change, the map runs. I would love to spend some time, making some validations, so we can reduce the renders

  return (
    <Box as="header" display="flex" gap={3} py={2} alignSelf="flex-start">
      {options.map(opt => option(opt))}
    </Box>
  )
}
