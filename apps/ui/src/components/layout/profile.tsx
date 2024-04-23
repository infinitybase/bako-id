import { Flex } from '@chakra-ui/react';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useScreenSize } from '../../hooks/useScreenSize';
import { Header } from '../header';
import { ProfileSidebar } from '../sidebar/profile';
import { Container } from './container';
import { Content } from './content';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const ProfileLayout = (props: DashboardLayoutProps) => {
  const { isMobile } = useScreenSize();

  return (
    <>
      <Container h="full" overflowY="auto">
        <Header />
        <Flex h="auto" w="100%">
          {!isMobile && <ProfileSidebar />}
          <Content>{props.children}</Content>
        </Flex>
        {import.meta.env.NODE_ENV === 'development' && (
          <TanStackRouterDevtools />
        )}
      </Container>
    </>
  );
};

export { ProfileLayout };
