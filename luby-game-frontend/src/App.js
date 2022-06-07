import './App.css';
import { useTransactionContext } from './context/TransactionContext';

function App() {
  const {
    connectWallet,
    currentAccount,
    balance,
    getInitialCoin,
    startGame,
    isStarted,
    correcAnswer,
    incorrecAnswer,
    claimBalance,
  } = useTransactionContext();

  console.log('Current Account', { currentAccount, balance });

  return (
    <div>
      <h1>Luby Game</h1>

      <div>
        {!currentAccount && (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}

        <div>
          <p>Account: {currentAccount}</p>
          <p>Balance: {balance}</p>
          <button onClick={claimBalance}>Claim balance</button>
        </div>

        {!isStarted && balance === 0 && (
          <div>
            <p>Get 1 LBC to initialize game</p>
            <button onClick={getInitialCoin}>Get 1 LBC</button>
          </div>
        )}

        {!isStarted ? (
          <div>
            <p>Start Game</p>
            <button onClick={startGame}>Start </button>
          </div>
        ) : (
          <div>
            <h2>Question</h2>

            <>
              <p>Quem é o CTO da Luby?</p>
              <button onClick={incorrecAnswer}>Rodrigo Salatiel</button>
              <button onClick={correcAnswer}>Rodrigo Gardin</button>
              <button onClick={incorrecAnswer}>Rodrigo Júnior</button>
            </>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
