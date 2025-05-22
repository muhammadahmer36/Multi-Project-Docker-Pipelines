import { ListItem } from 'components/SearchInput/types';
import { NavigateFunction } from 'react-router-dom';
import { Nullable } from 'types/common';

export interface SearchStatus {
    id: number;
    title: string;
    description: string;
    displayOrder: number;
    shortDescr: string;
  }

export interface SearchStatusesResponse {
    searchStatuses: SearchStatus[];
  }

export interface InitialState {
    payPeriodList: ListItem[];
    payPeriod: Nullable<ListItem>;
    timehseetGroupList: ListItem[];
    timehseetGroup: Nullable<ListItem>;
    employeeList: ListItem[];
    SearchStatus: SearchStatus[];
    selectedSearchStatus: number[];
    selectedEmployeeList: ListItem[];
    selectedEmployeeGroup: Nullable<ListItem>;
    payPeriodDefault: Nullable<ListItem>;
  }

export interface TimesheetSearchResultParams {
    ResourceId: number;
    PeriodIdentity: number;
    ListOfEmployeeNumbers: string;
    ListOfStatusCodes: string;
    StatusCodesCondition: string;
    Separator: string;
  }

export interface TimesheetSearchResultPayload {
    navigate?: NavigateFunction;
}
