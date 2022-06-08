import React from 'react';
import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const Wellcome = () => {
  const { data } = useTransactionContext();
  const { alreadyMintedLBC } = data;
  return (
    <>
      {!alreadyMintedLBC ? (
        <div className='welcome'>
          <h2>Bem vindo</h2>
          <p>Pegue grátis 10 LBC para começar a jogar</p>
        </div>
      ) : null}
    </>
  );
};
