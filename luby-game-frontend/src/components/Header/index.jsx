import React from 'react';
import { useTransactionContext } from '../../context/TransactionContext';

import './styles.css';

export const Header = () => {
  const { currentAccount, balance, connectWallet } = useTransactionContext();

  return (
    <header className='header'>
      <div className='header-content'>
        <div className='logo'>
          <span>Luby Game</span>
        </div>

        <nav className='navigation'>
          <ul>
            <li>
              <p>Saldo {balance} LBC</p>
            </li>
            <li>
              <button>Claim Balance</button>
            </li>
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
