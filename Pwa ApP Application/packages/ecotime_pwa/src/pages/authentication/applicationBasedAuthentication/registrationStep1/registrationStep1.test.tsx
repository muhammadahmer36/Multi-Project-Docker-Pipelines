import AbaRegister from './registrationStep1';
import { useNavigate } from 'react-router-dom';
import renderWithReduxAndRouter from '../../../../utilities/cutomRender.test';
import { setupStore } from '../../../../redux/store/mockStore';
import { fireEvent } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: jest.fn(),
}))

describe('addAdaReg', () => {
    it('renders correctly', () => {
        renderWithReduxAndRouter(<AbaRegister />);
    });

    it('should navigate a user back to login', async () => {
        const navigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigate);
        const { getByTestId } = renderWithReduxAndRouter(<AbaRegister />);
        const etIcon = getByTestId('et-icon');
        await fireEvent.click(etIcon)
        expect(navigate).toHaveBeenCalledWith('/login');
    })
});

