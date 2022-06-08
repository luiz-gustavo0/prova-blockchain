import React from 'react';
import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const Header = () => {
  const { currentAccount, connectWallet, claimBalance, getInitialCoin, data } =
    useTransactionContext();

  const { alreadyMintedLBC } = data;

  return (
    <header className='header'>
      <div className='header-content'>
        <div className='logo'>
          <span>Luby Game</span>
        </div>

        <nav className='navigation'>
          <ul>
            {!alreadyMintedLBC ? (
              <li>
                <button onClick={getInitialCoin}>Grátis 1 LBC</button>
              </li>
            ) : (
              <li>
                <button onClick={claimBalance}>Sacar tudo</button>
              </li>
            )}
            {!currentAccount && (
              <li>
                <button className='btn-conect' onClick={connectWallet}>
                  Conect 🦊
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
