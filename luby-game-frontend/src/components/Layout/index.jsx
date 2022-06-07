import React, { useState } from 'react';
import { useTransactionContext } from '../../context/TransactionContext';
import { Wellcome, StartGame, Questions } from '../index';

import './styles.css';

export const Layout = () => {
  const [questionNumber, setQuestionNumber] = useState(0);
  const { startGame } = useTransactionContext();

  const handleStartGame = async () => {
    await startGame();

    const number = Math.floor(Math.random() * 2);
    setQuestionNumber(number);
  };
  return (
    <main>
      <div className='container'>
        <Wellcome />
        <StartGame handleStartGame={handleStartGame} />
        <Questions questionNumber={questionNumber} />
      </div>
    </main>
  );
};
