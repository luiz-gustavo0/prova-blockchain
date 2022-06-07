import React from 'react';
import { FaCoins } from 'react-icons/fa';

import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const StartGame = ({ handleStartGame }) => {
  const { isStarted, data } = useTransactionContext();
  const { balance } = data;

  return (
    <>
      {!isStarted && balance > 0 ? (
        <div className='start-game'>
          <h2>Iniciar Jogo</h2>
          <button onClick={handleStartGame}>Start</button>
        </div>
      ) : null}
    </>
  );
};
