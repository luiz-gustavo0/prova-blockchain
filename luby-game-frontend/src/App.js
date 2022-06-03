import { useEffect, useState } from 'react';
import './App.css';
import { useContractFn } from './hooks/useContractFn';
import { useWeb3 } from './hooks/useWeb3';

function App() {
  const { selectedAccount, main } = useWeb3();
  const { getBalance, mintLbc, startGame } = useContractFn();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    main();
    getBalanceIndividual();
  }, []);

  console.log('selectedAccount', selectedAccount);

  const init = () => {
    startGame()
      .then((res) => {
        console.log(res);
        getBalance();
      })
      .catch((err) => {
        console.log('start', err);
      });
  };

  const getBalanceIndividual = () => {
    getBalance()
      .then((response) => {
        setBalance(response);
      })
      .catch((err) => {
        console.log('balance individual', err);
      });
  };

  return (
    <div className='App'>
      <h1>Dapp: LubyGame</h1>
      <h3>
        Your Balance: <span>{balance}</span>
      </h3>
      <button onClick={mintLbc}>Minerar 10 LBC</button>

      <div>
        <h2>Start Game</h2>
        <button onClick={init}>Start</button>
      </div>
    </div>
  );
}

export default App;
