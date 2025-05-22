import { Severity } from 'components/SnackBar/types';
import { Nullable } from 'types/common';

export interface Configuration {
    message: Nullable<string>;
    severity: Severity;
  }

export interface PopupState {
    visible: boolean;
    configuration: Configuration
  }
