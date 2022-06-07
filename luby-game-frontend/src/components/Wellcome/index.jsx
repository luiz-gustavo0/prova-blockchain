import React from 'react';
import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const Wellcome = () => {
  const { isStarted, balance, getInitialCoin } = useTransactionContext();

  return (
    <>
      {!isStarted && balance === 0 ? (
        <div className='welcome'>
          <h2>Bem vindo</h2>
          <p>Pegue 1 LBC para começar a jogar</p>
          <button onClick={getInitialCoin}>Começar</button>
        </div>
      ) : null}
    </>
  );
};
