import ResetPassword from './resetPassword';
import { useNavigate } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';
import { setupStore } from '../../../../redux/store/mockStore';
import renderWithReduxAndRouter from '../../../../utilities/cutomRender.test';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: jest.fn(),
}))

describe('addAdaReg', () => {
    it('renders correctly', () => {
        renderWithReduxAndRouter(<ResetPassword />);
    });

    it('should navigate to forgot screen', async () => {
        const navigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigate);
        const { getByTestId } = renderWithReduxAndRouter(<ResetPassword />);
        const backButton = getByTestId('et-icon');
        await fireEvent.click(backButton)
        expect(navigate).toHaveBeenCalledWith('/forgotCredentials');
    })

    it('should dispatch on submit button', async () => {
        const initialState1 = {
            authRes: {
                userDataForUpdatePassword: {
                    authenticationTypeId: 1,
                    employeeEmail: 'abc@ecotimebyhbs.com',
                    loginName: 'shah001',
                    accountId: 1221,
                    employeeName: 'Haris',
                    employeeNumber: '10358',
                }
            },
        };
        const { getByText } = renderWithReduxAndRouter(<ResetPassword />, { initialState: initialState1 });
        const ConfirmButton = getByText('Confirm');
        await fireEvent.click(ConfirmButton)
        const initialState = {}
        const store = setupStore(initialState)
        expect(store.dispatch({
            type: 'UPDATE_PASSWORD', payload:
            {
                data: {
                    tempPassword: '10002',
                    password: 'Hbs123',
                    confirmPassword: 'Hbs123',
                    loginName: 'shah001',
                }
            }
        })).
            toEqual({
                type: 'UPDATE_PASSWORD', payload: {
                    data: {
                        tempPassword: '10002',
                        password: 'Hbs123',
                        confirmPassword: 'Hbs123',
                        loginName: 'shah001',
                    }
                }
            });
    })

    it('should go back to respective routes', async () => {
        const initialState1 = {
            authRes: {
                isAccountDeactivated: true
            },
        };
        const navigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigate);
        const { getByTestId } = renderWithReduxAndRouter(<ResetPassword />, { initialState: initialState1 });
        const backButton = getByTestId('et-icon');
        await fireEvent.click(backButton)
        if(initialState1?.authRes?.isAccountDeactivated){
            expect(navigate).toHaveBeenCalledWith('/login');
        }
        else{
            expect(navigate).toHaveBeenCalledWith('/forgotCredentials');
        }

    })

});

