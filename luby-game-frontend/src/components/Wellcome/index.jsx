import React from 'react';
import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const Wellcome = () => {
  const { balance } = useTransactionContext();
  const { hasMinded } = JSON.parse(localStorage.getItem('@lubyCoin'));

  return (
    <>
      {balance === 0 && !hasMinded ? (
        <div className='welcome'>
          <h2>Bem vindo</h2>
          <p>Pegue grátis 1 LBC para começar a jogar</p>
        </div>
      ) : null}
    </>
  );
};
