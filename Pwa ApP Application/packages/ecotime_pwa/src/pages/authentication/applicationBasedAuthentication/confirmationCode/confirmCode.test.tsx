import ConfirmationCode from './confirmCode';
import { setupStore } from 'redux/store/mockStore';
import { fireEvent } from '@testing-library/react';
import renderWithReduxAndRouter from 'utilities/cutomRender.test';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: jest.fn(),
}))

describe('confirmCode', () => {
    it('renders correctly', () => {
        renderWithReduxAndRouter(<ConfirmationCode />,);
    });

    it('should dispatch on submit button', async () => {
        const initialState1 = {
            authRes: {
                successfullUser: {
                    employeeName: 'Haris',
                    employeeNumber: '10358',
                    employeeEmail: 'haris@ecotimebyhbs.com'
                }
            },
        };
        const { getByText } = renderWithReduxAndRouter(<ConfirmationCode />, { initialState: initialState1 });
        const ConfirmButton = getByText('Confirm');
        await fireEvent.click(ConfirmButton)
        const initialState = {}
        const store = setupStore(initialState)
        expect(store.dispatch({
            type: 'CONFIRM_ABA_USER', payload:
            {
                data: {
                    employeeNumber: '10358',
                    confirmationCode: 'HHAqaa_',
                }
            }
        })).
            toEqual({
                type: 'CONFIRM_ABA_USER', payload: {
                    data: {
                        employeeNumber: '10358',
                        confirmationCode: 'HHAqaa_',
                    }
                }
            });
    })


});

