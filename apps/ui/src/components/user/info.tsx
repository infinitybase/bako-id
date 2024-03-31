import { ChevronDownIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useFuel } from '@fuels/react';
import { AbstractAddress } from 'fuels';
import { useMemo, useState } from 'react';
import { formatAddress } from '../../utils/formatter.ts';
import { RoundedUserIcon } from '../helpers/roundedUserIcon.tsx';

export const Info = ({
  name,
  account,
}: {
  name: string;
  account: string | AbstractAddress;
}) => {
  const {
    fuel: { disconnect },
  } = useFuel();
  const [hover, setHover] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(account.toString());
  };

  const icon = useMemo(() => {
    return <RoundedUserIcon width="2em" heigth="2em" />;
  }, []);

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Button}
            variant="ghost"
            rounded="md"
            position="relative"
            _focus={{}}
            _hover={{}}
            _focusVisible={{}}
            _active={{}}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            p={0}
          >
            <Box
              display="flex"
              gap={2}
              alignItems="center"
              w="7rem"
              color="white"
            >
              {icon}
              {name}

              {hover || isOpen ? (
                <ChevronDownIcon
                  className={`rotate-base ${isOpen ? undefined : 'rotate-div'}`}
                />
              ) : null}
            </Box>
          </MenuButton>
          <MenuList background="background.600" minW="fit-content">
            <Box
              as="button"
              w="full"
              flex={0.5}
              p={2}
              fontSize="sm"
              display="flex"
              alignItems="center"
              gap={2}
              cursor="pointer"
              onClick={copy}
              color="white"
            >
              {formatAddress(account.toString())}
              <CopyIcon />
            </Box>
            <Divider w="90%" h="0px" bgColor="#FFF" m="auto" />
            <MenuItem
              onClick={() => disconnect()}
              p={2}
              background="transparent"
              color="grey.300"
              fontSize="sm"
            >
              Disconnect
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};
