import React, { FC, ReactNode } from 'react';
import styles from './center.module.css';

interface CenterProps {
  title: string;
  children: ReactNode;
}

export const Center: FC<CenterProps> = ({ title, children }) => (
  <main className={styles.center}>
    <h1 className={`text text_type_main-large mb-6 ${styles.title}`}>
      {title}
    </h1>
    {children}
  </main>
);
