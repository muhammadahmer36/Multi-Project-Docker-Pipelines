import { TFunction } from 'i18next';

export interface IforgotCredentials {
    userName: string;
  }

export interface IHeaderProps {
    t: TFunction;
    forgetCredentials: string;
  }
