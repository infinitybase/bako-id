import { Button, type ButtonProps } from '@chakra-ui/react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';

interface NavLinkItemProps
  extends Omit<ButtonProps, 'onClick' | 'children' | 'rightIcon'> {
  label: string;
  icon: React.ReactElement;
  href: string;
}

export const NavLinkItem = ({
  href,
  icon,
  label,
  ...props
}: NavLinkItemProps) => {
  const navigate = useNavigate();
  const router = useRouter();
  const isActive = useMemo(
    () => router.state.location.pathname === href,
    [href, router.state.location.pathname]
  );

  return (
    <Button
      w="full"
      isActive={isActive}
      variant="customLink"
      rightIcon={icon}
      onClick={() => navigate({ to: href })}
      {...props}
    >
      {label}
    </Button>
  );
};
