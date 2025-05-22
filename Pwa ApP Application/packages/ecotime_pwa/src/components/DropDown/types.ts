/* eslint-disable no-unused-vars */
export interface ListItem {
    fldId?: number;
    code: string;
    description: string;
}

export interface IComboBoxProps {
    helperText?: string | undefined;
    list: ListItem[] | [];
    value?: ListItem | ListItem[]
    label: string;
    error?: boolean;
    onBlur?: () => void;
    onChange?: (val: string | undefined) => void;
    readOnly?: boolean;
    disabled?: boolean;
    disableCloseOnSelect?: boolean;
    multipeSelectonChange?: (value: ListItem[] | undefined) => void,
    multiple?: boolean;
    loading?: boolean;
    onChangeTextInput?: (val: React.ChangeEvent<HTMLInputElement>) => void;
    readOnlyInput?: boolean
}
