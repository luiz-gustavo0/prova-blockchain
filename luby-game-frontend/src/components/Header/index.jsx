import React from 'react';
import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const Header = () => {
  const { currentAccount, connectWallet, claimBalance, getInitialCoin } =
    useTransactionContext();
  const { hasMinded } = JSON.parse(localStorage.getItem('@lubyCoin'));

  return (
    <header className='header'>
      <div className='header-content'>
        <div className='logo'>
          <span>Luby Game</span>
        </div>

        <nav className='navigation'>
          <ul>
            {!hasMinded ? (
              <li>
                <button onClick={getInitialCoin}>Grátis 1LBC</button>
              </li>
            ) : (
              <li>
                <button onClick={claimBalance}>Claim Balance</button>
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
