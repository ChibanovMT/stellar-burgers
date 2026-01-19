import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onConstructorClick,
  onFeedClick,
  onProfileClick
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <button
          type='button'
          className={styles.button}
          onClick={onConstructorClick}
        >
          <BurgerIcon type={'primary'} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </button>
        <button type='button' className={styles.button} onClick={onFeedClick}>
          <ListIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </button>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <button
        type='button'
        className={styles.button}
        onClick={onProfileClick}
      >
        <div className={styles.link_position_last}>
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </button>
    </nav>
  </header>
);
