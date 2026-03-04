import React, { FC } from 'react';
import { OrderStatusUIProps } from './type';

export const OrderStatusUI: FC<OrderStatusUIProps> = ({ textStyle, text }) => (
  <span className='text text_type_main-default' style={{ color: textStyle }}>
    {text}
  </span>
);
