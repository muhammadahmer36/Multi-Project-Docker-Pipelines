import React from 'react';
import registrationSuccess from 'assets/img/registrationSuccess.svg';

type imageStyle = {
  styleClass: string
}

function RegistrationSuccessImage({ styleClass }: imageStyle) {
  return (
    <img
      src={registrationSuccess}
      alt="Success"
      className={styleClass}
    />
  );
}

export default RegistrationSuccessImage;
