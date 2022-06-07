import React from 'react';
import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const StartGame = ({ handleStartGame }) => {
  const { isStarted } = useTransactionContext();
  const { hasMinded } = JSON.parse(localStorage.getItem('@lubyCoin'));

  return (
    <>
      {!isStarted && hasMinded ? (
        <div className='start-game'>
          <h2>Start Game</h2>
          <button onClick={handleStartGame}>Start </button>
        </div>
      ) : null}
    </>
  );
};
