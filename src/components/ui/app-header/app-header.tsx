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
  onProfileClick,
  isConstructorActive = false,
  isFeedActive = false,
  isProfileActive = false
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <button
          type='button'
          className={`${styles.button} ${isConstructorActive ? styles.link_active : ''}`}
          onClick={onConstructorClick}
        >
          <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </button>
        <button
          type='button'
          className={`${styles.button} ${isFeedActive ? styles.link_active : ''}`}
          onClick={onFeedClick}
        >
          <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </button>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <button
        type='button'
        className={`${styles.button} ${isProfileActive ? styles.link_active : ''}`}
        onClick={onProfileClick}
      >
        <div className={styles.link_position_last}>
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </button>
    </nav>
  </header>
);
