import { Box, useMediaQuery } from '@chakra-ui/react';
import { MyHandlesCard } from './components/myHandlesCard';
import { MyHandlesCardMobile } from './components/myHandlesCardMobile';
import { useMyHandles } from './hooks';

export const MyHandles = () => {
  const [isMobile] = useMediaQuery('(max-width: 30em)');
  const { data: handles } = useMyHandles();

  console.log(handles);

  // const items = [
  //   {
  //     username: '@bakoglobal',
  //     expiry: 'Expires in 3 months',
  //     isPrimary: true,
  //   },
  //   { username: '@user2', expiry: 'Expires in 1 month' },
  //   { username: '@user3', expiry: 'Expires in 2 months' },
  //   { username: '@user4', expiry: 'Expires in 3 months' },
  //   { username: '@user5', expiry: 'Expires in 1 month' },
  //   { username: '@user6', expiry: 'Expires in 2 months' },
  //   { username: '@user7', expiry: 'Expires in 3 months' },
  //   { username: '@user8', expiry: 'Expires in 1 month' },
  //   { username: '@user9', expiry: 'Expires in 2 months' },
  //   { username: '@user10', expiry: 'Expires in 3 months' },
  //   { username: '@user11', expiry: 'Expires in 1 month' },
  //   { username: '@user12', expiry: 'Expires in 2 months' },
  //   { username: '@user13', expiry: 'Expires in 3 months' },
  //   { username: '@user14', expiry: 'Expires in 1 month' },
  //   { username: '@user15', expiry: 'Expires in 2 months' },
  //   { username: '@user16', expiry: 'Expires in 3 months' },
  //   { username: '@user17', expiry: 'Expires in 1 month' },
  //   { username: '@user18', expiry: 'Expires in 2 months' },
  //   { username: '@user19', expiry: 'Expires in 3 months' },
  //   { username: '@user20', expiry: 'Expires in 1 month' },
  // ];

  return (
    <Box>
      {isMobile ? (
        <MyHandlesCardMobile handles={handles} />
      ) : (
        <MyHandlesCard handles={handles} />
      )}
    </Box>
  );
};
