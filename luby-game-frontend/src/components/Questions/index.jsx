import React, { useId, useState } from 'react';

import { useTransactionContext } from '../../context/TransactionContext';
import { questions } from '../../utils/questions';

import './styles.css';

export const Questions = ({ questionNumber }) => {
  const [answer, setAnswer] = useState('');
  const id = useId();

  const { isStarted, correcAnswer, incorrecAnswer } = useTransactionContext();

  const handleChange = (event) => {
    const { target } = event;
    setAnswer(target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (answer === 'true') {
        await correcAnswer();
        return alert(`Você acertou e ganhou 0.5 LBC`);
      }

      if (answer === 'false') {
        await incorrecAnswer();
        return alert(`Você errou e perdeu 0.5 LBC`);
      }
    } catch (error) {
      console.log('Submit Cancelado', error);
    }
  };

  return (
    <>
      {isStarted && (
        <div className='questions'>
          <h2>Question</h2>

          <p>{questions[questionNumber].question}</p>
          <form onSubmit={handleSubmit}>
            {questions[questionNumber].answers.map((answer, index) => (
              <label className='form-control' key={`${index}-${id}`}>
                <input
                  type='radio'
                  name='answer'
                  value={answer.isCorrect}
                  onChange={handleChange}
                />
                <span>{answer.alternative}</span>
              </label>
            ))}
            <button disabled={answer.length === 0}>Confirm</button>
          </form>
        </div>
      )}
    </>
  );
};
