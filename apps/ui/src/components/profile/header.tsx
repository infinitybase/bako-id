import { Box, Button, Text } from '@chakra-ui/react';

interface ProfileHeaderProps {
  current: string,
  onClick: (e: any) => void
}

export const Header = ({ current, onClick }: ProfileHeaderProps) => {
  const options = ["Profile", "Records", "Ownership", "Subnames", "Permissions", "More"]

  const option = (option: string) => {
    const selectedColor = current === option ? "yellow-light" : "button.200"
    return <Button onClick={onClick} variant="ghost" _hover={{}} _focus={{}} _active={{}}>
      <Text color={selectedColor} fontSize="sm" fontWeight={500}>
        {option}
      </Text>
    </Button>
  }

  return (
    <Box as="header" display="flex" gap={1} py={2} >
      {options.map(opt => option(opt))}
    </Box>
  )
}
