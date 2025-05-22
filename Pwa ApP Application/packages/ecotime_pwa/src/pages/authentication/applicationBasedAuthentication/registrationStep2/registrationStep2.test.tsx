import AbaRegister from './registrationStep2';
import renderWithReduxAndRouter from '../../../../utilities/cutomRender.test';

describe('addAdaReg', () => {
    it('renders correctly', () => {
        renderWithReduxAndRouter(<AbaRegister />);
    });
});
