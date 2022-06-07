import React from 'react';
import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const StartGame = ({ handleStartGame }) => {
  const { isStarted, hasAlreadyMined } = useTransactionContext();

  return (
    <>
      {!isStarted && hasAlreadyMined ? (
        <div className='start-game'>
          <h2>Start Game</h2>
          <button onClick={handleStartGame}>Start </button>
        </div>
      ) : null}
    </>
  );
};
