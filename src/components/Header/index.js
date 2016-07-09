import React from 'react';
import styles from './styles.css';

const Header = () => (
  <header className={styles.header}>
    <img className={styles.logo} src="images/pineapple.svg" />
    <h3 className={styles.name}>Pineapple</h3>
  </header>
);

export default Header;
