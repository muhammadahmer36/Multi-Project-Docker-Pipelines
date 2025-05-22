import React from 'react';
import styles from './Unauthrorized.module.scss';

export default function Unauthrorized() {
  return (
    <div className={styles.container}>
      <h2>Unauthorized</h2>
      <p>You are not authorized to access this page.</p>
      <p>Please relogin from your WPF ADMIN.</p>
    </div>
  );
}
