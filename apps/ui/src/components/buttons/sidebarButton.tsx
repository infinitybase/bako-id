import { Button, type ButtonProps } from '@chakra-ui/react';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  useEffect,
  type JSXElementConstructor,
  type ReactElement,
} from 'react';

interface SidebarButtonProps extends ButtonProps {
  title: string;
  icon:
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | undefined;
  isActive?: boolean;
  setActive: (title: string) => void;
  active: string;
}

export const SidebarButton = ({
  icon,
  title,
  isActive,
  setActive,
  active,
  ...rest
}: SidebarButtonProps) => {
  const { domain } = useParams({ strict: false });
  const navigate = useNavigate();

  const href = window.location.pathname;
  const samePath = href.includes(title.toLowerCase());

  const handleChangeRoute = (route: string) => {
    setActive(route);

    if (route.toLowerCase() === 'profile') {
      navigate({ to: `/${route.toLowerCase()}/${domain}` });
      return;
    }

    navigate({
      to: `/profile/${domain}/${route.toLowerCase()}`,
    });
  };

  useEffect(() => {
    if (samePath) {
      setActive(title);
    }
  }, [title, setActive, samePath]);

  return (
    <Button
      w="full"
      variant="ghost"
      color="grey.100"
      p={6}
      leftIcon={icon}
      justifyContent="flex-start"
      onClick={() => handleChangeRoute(title)}
      isActive={isActive || title === active}
      _active={{
        color: 'white',
        bgColor: 'grey.600',
      }}
      _hover={{
        bgColor: 'grey.300',
        color: 'white',
      }}
      {...rest}
    >
      {title}
    </Button>
  );
};
