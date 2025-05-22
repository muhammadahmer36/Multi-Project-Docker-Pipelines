export interface EmpInterface {
    empRes: {
        empName: '',
        empData: [],
        mgrData: [],
        error: null
    };
    empTableObj: {
        id: number,
        name: string,
        username: string,
        email: string,
        address: {
            street: string
        }
    }
}
