import { IPunchDetail, IPunchTasksList, IFormControl } from 'pages/AdditionalData/types';

export interface IComboBoxProps extends IFormControl {
    punchDetail: IPunchDetail;
    list: IPunchTasksList[];
}

export interface IEachList {
    fldId: number;
    code: string;
    description: string;
}
