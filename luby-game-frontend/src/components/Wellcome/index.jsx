import React from 'react';
import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const Wellcome = () => {
  const { data } = useTransactionContext();
  const { balance } = data;

  return (
    <>
      {balance === 0 ? (
        <div className='welcome'>
          <h2>Bem vindo</h2>
          <p>Pegue grátis 1 LBC para começar a jogar</p>
        </div>
      ) : null}
    </>
  );
};
