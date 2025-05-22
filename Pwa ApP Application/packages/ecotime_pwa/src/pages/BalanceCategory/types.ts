/* eslint-disable no-unused-vars */

import { Nullable } from 'types/common';

export interface BalanceCategory {
  source: string,
  balanceGroupId: number,
  type: string,
  hours: string,
}

export interface BalanceGroupDetails {
  empNo: string;
  balanceGroupId: number;
  date: string;
  type: string;
  hours: string;
  totals: string;
  source: string;
}

export interface CalenderProps {
  onDateSelect: (date: string | undefined) => void;
}

export interface HeaderInfo {
  calculatedAsOfDate: string,
  tableTitle: string
}

export interface InitialState {
  balanceCategory: BalanceCategory[];
  balanceGroupDetails: BalanceGroupDetails[];
  headerInfo: Nullable<HeaderInfo>;
}
export interface ListBalanceCategory {
  listBalanceCategory: BalanceCategory[];
}
export interface IItemProps {
  value: string,
  isHeading?: boolean,
}
export interface CategoryProps {
  date: string | undefined,
  balanceGroupId?: number | null,
  category?: string | undefined,
  employeeNumber: string,
  sectionName: string
}
