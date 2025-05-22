import { IPunchDetail, IFormControl, IPunchTasksList } from 'pages/AdditionalData/types';

export interface IAutoCompleteProps extends IFormControl {
    list: IPunchTasksList[];
    punchDetail: IPunchDetail
}

export interface IEachList {
    fldId: number;
    code: string;
    description: string;
}
