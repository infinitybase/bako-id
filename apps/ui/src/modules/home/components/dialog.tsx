import { QRCode } from '@farcaster/auth-kit';
import { MdPhoneAndroid } from 'react-icons/md';
import { Dialog, type DialogModalProps } from '../../../components';

interface QRCodeDialogProps extends DialogModalProps {
  onClose: () => void;
  isOpen: boolean;
  uri: string;
}

export const QRCodeDialog = (props: QRCodeDialogProps) => {
  const { uri, ...rest } = props;

  return (
    <Dialog.Modal {...rest}>
      <Dialog.Body w="auto">
        <QRCode size={300} logoSize={20} uri={uri} />
      </Dialog.Body>
      <Dialog.Actions>
        <Dialog.PrimaryAction
          onClick={() => {
            window.location.href = uri;
          }}
          rightIcon={<MdPhoneAndroid width={5} height={5} />}
        >
          I'm using my phone
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
