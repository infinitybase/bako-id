import {
  DialogActions,
  DialogPrimaryAction,
  DialogSecondaryAction,
  DialogTertiaryAction,
} from './actions';
import { DialogBody } from './body';

import { DialogModal, DialogModalProps } from './modal';
import { DialogSection } from './section';

const Dialog = {
  Modal: DialogModal,
  Body: DialogBody,
  Actions: DialogActions,
  PrimaryAction: DialogPrimaryAction,
  SecondaryAction: DialogSecondaryAction,
  TertiaryAction: DialogTertiaryAction,
  Section: DialogSection,
};

export { Dialog };
export type { DialogModalProps };
