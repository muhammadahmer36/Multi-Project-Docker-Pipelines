import { Control, FieldValues } from 'react-hook-form';
import { Nullable } from 'types/common';

export interface IPunchDetail {
    dataElementId: number;
    fldId: number;
    fieldCaption: string;
    fieldInputTypeCode: string;
    fieldInputTypeName: string;
    displayOrder: number;
    fieldRequired: boolean;
    dataTypeCode: string;
    dataTypeName: string;
    numCharsForAutoComplete: number;
    useSelectList: boolean;
}

export interface IPunchTasksList {
    fldId: number;
    code: string;
    description: string;
}

export interface IAdditionalInformationItem {
    punchDetails: IPunchDetail
    punchTasksList: IPunchTasksList
}

export interface DataSets {
    punchDetails: IPunchDetail[];
    punchTasksList: IPunchTasksList[];
}

export interface IAdditionInformationItems {
    1: DataSets;
    2: DataSets;
    3: DataSets;
}

export interface IFormControl {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    control: Control<any>
}

export interface IFormBuilderProps extends IFormControl {
    punchDetail: IPunchDetail;
    punchTasksList: IPunchTasksList[];
}

export interface InitialState {
    additionalInformationIn: Nullable<DataSets>;
    additionalInformationOut: Nullable<DataSets>;
    additionalInformationTransfer: Nullable<DataSets>;
    openAdditionalInformationForm: boolean;
    navigateToDashboard: boolean;
    disableHeader: boolean;
    punchHeaderInformation: string;
    showLoader: boolean;
    navigator: any;
    timePunchId: Nullable<number>;
}

export interface IPunchHeader {
    timePunchId: number;
    optionHeader: string;
}

export interface IPunchAdditionalInfo {
    punchDetails: IPunchDetail[]
    punchHeader: IPunchHeader
    punchTasksList: IPunchTasksList[];
}

export interface IFormAdditionalData extends FieldValues {
    FormData?: Record<string, string | number | boolean>;
    punchDetails?: IPunchDetail[];
}

export interface postAdditionalDataFormPayload {
    currentPunchDetail: IPunchDetail[];
    data: FieldValues | IFormAdditionalData;
    uniqueIndentifier: string;
    timePunchId: number;
}

export interface IFormAdditionalDataPayload {
    payload: postAdditionalDataFormPayload
    type: string;
}

export interface IFormPayload {
    data: FieldValues | IFormAdditionalData
}

export interface Validation {
    statusCode: number
    statusMessage: string
}

export interface ClockWidgetItem {
    profileId: number
    functionId: number
    dataElementId: number
    getAdditionalData: boolean
    functionName: string
    entryCode: string
    imageName: string
    description: string
    functionNextExpected: boolean
    functionButton_Color: string
    functionButton_Align: string
    displayOrder: number
    controllerName: string
    dbServerGMT: string
}

export interface ValidationResponse {
    statusCode: number
    statusMessage: string
}

export interface ApplicationInfo {
    userEmpNo: string
    userEmployeeName: string
    appHeader: string
    appFooter: string
    messageCount: number
    numCharsForAutoComplete: number
    dateTimeFormat: string
    dateFormat: string
    timeFormat: string
    dateTimeFormatClockWidget: string
}

export interface PunchHeader {
    optionHeader: string
    optionFooter: string
    dataElementsGroupTitle: string
    timePunchId: number
}

export interface PunchDetail {
    dataElementId: number
    fldId: number
    fieldCaption: string
    fieldInputTypeCode: string
    fieldInputTypeName: string
    displayOrder: number
    fieldRequired: boolean
    dataTypeCode: string
    dataTypeName: string
    numCharsForAutoComplete: number
    useSelectList: boolean
}

export interface PunchTasksList {
    fldId: number
    code: string
    description: string
}

export interface PunchAdditionalInfo {
    validationResponse: ValidationResponse
    applicationInfo: ApplicationInfo
    punchHeader: PunchHeader
    punchDetails: PunchDetail[]
    punchTasksList: PunchTasksList[]
}

export interface Data {
    clockWidgetItems: ClockWidgetItem[]
    lastPunch: string
    utcDateTime: string
    punchAdditionalInfo: PunchAdditionalInfo
}

export interface AdditionalDataNavigationParams {
    getAdditionalData: boolean;
    additionalInformation: {
        punchDetails?: PunchDetail[]
    } | undefined;
}
