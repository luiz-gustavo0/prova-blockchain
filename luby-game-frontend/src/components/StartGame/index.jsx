import React from 'react';

import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const StartGame = ({ handleStartGame }) => {
  const { isStarted, data } = useTransactionContext();
  const { alreadyMintedLBC } = data;

  return (
    <>
      {!isStarted && alreadyMintedLBC ? (
        <div className='start-game'>
          <h2>Iniciar Jogo</h2>
          <button onClick={handleStartGame}>Start</button>
        </div>
      ) : null}
    </>
  );
};
