import React, { useState } from 'react';

import { useTransactionContext } from '../../context/TransactionContext';
import { questions } from '../../utils/questions';

import './styles.css';

export const Questions = ({ questionNumber }) => {
  const [answer, setAnswer] = useState([]);

  const { isStarted } = useTransactionContext();

  const handleChange = (event) => {
    const { target } = event;
    if (target.checked) {
      setAnswer([target.value]);
    } else {
      setAnswer((prevState) =>
        prevState.filter((item) => item !== target.value)
      );
    }
  };

  return (
    <>
      {isStarted && (
        <div className='questions'>
          <h2>Question</h2>

          <p>{questions[questionNumber].question}</p>
          <form>
            {questions[questionNumber].answers.map((answer) => (
              <label className='form-control' key={answer.id}>
                <input
                  type='checkbox'
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
