/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ListItem {
    fldId?: number;
    code: string;
    description: string;
}

export interface ISearchInputProps {
    helperText: string | undefined;
    list: ListItem[];
    label: string;
    value: string;
    error: boolean;
    searchAfterNumberOfCharacters: number;
    onBlur?: () => void;
    onChange?: (val: any) => void;
}
