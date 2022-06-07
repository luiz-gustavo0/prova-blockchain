import React, { useState } from 'react';
import { useTransactionContext } from '../../context/TransactionContext';
import { Wellcome, StartGame, Questions } from '../index';

import './styles.css';

export const Layout = () => {
  const [questionNumber, setQuestionNumber] = useState(0);
  const { startGame, balance, currentAccount } = useTransactionContext();

  const handleStartGame = async () => {
    await startGame();

    const number = Math.floor(Math.random() * 2);
    setQuestionNumber(number);
  };

  if (!currentAccount) {
    return (
      <div className='container'>
        <h2>Conecte na metamask para iniciar</h2>
      </div>
    );
  }

  return (
    <main>
      <div className='container'>
        <div className='balance'>
          <span>Saldo {balance} LBC</span>
        </div>
        <Wellcome />
        <StartGame handleStartGame={handleStartGame} />
        <Questions questionNumber={questionNumber} />
      </div>
    </main>
  );
};
