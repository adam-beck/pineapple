import React from 'react';
import styles from './Header.css';
import { Link } from 'react-router';

import AuthControls from '../AuthControls/AuthControls';
      // <Link to={`/login`} activeStyle={{ display: 'none' }}>Login/Register</Link>

const Header = ({auth}) => (
  <header className={styles.header}>
    <div className={styles.left}>
      <img className={styles.logo} src="images/pineapple.svg" />
      <h3 className={styles.name}>Pineapple</h3>
    </div>
    <div className={styles.right}>
      <AuthControls isAuthenticated={auth.isAuthenticated} />
    </div>
  </header>
);

export default Header;
