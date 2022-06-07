import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Web3 from 'web3';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const web3 = new Web3(ethereum);
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  return contract;
};

// const addTokenToWallet = async () => {
//   try {
//     // wasAdded is a boolean. Like any RPC method, an error may be thrown.
//     const wasAdded = await ethereum.request({
//       method: 'wallet_watchAsset',
//       params: {
//         type: 'ERC20', // Initially only supports ERC20, but eventually more!
//         options: {
//           address: contractAddress, // The address that the token is at.
//           symbol: 'LBC', // A ticker symbol or shorthand, up to 5 chars.
//           decimals: 18, // The number of decimals in the token
//           image:
//             'https://cdn2.vectorstock.com/i/thumb-large/25/66/one-token-coin-icon-vector-31612566.jpg', // A string url of the token logo
//         },
//       },
//     });
//     console.log('Thanks for your interest!');

//     if (wasAdded) {
//       console.log('Thanks for your interest!');
//     } else {
//       console.log('Your loss!');
//     }
//   } catch (error) {
//     console.log('Token Wallet', error);
//   }
// };

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [isStarted, setIsStarted] = useState('');

  const checkWalletIsConected = async () => {
    try {
      if (!ethereum) return alert('Please install metamask!');

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log('No Accounts found');
      }
    } catch (error) {
      console.log('checkWalletIsConected', error);
      throw new Error('No ethereum object');
    }

    ethereum.on('accountsChanged', function (accounts) {
      setCurrentAccount(accounts[0]);
      console.log(`Selected account ${accounts[0]}`);
    });
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install metamask!');

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log('connectWallet', error);
      throw new Error('No ethereum object');
    }
  };

  const getBalance = useCallback(async () => {
    const contract = getEthereumContract();

    const result = await contract.methods
      .getBalanceIndividual()
      .call({ from: currentAccount });

    const balanceFormatd = result / 10 ** 18;

    setBalance(balanceFormatd);
  }, [currentAccount]);

  const getInitialCoin = useCallback(async () => {
    try {
      const contract = getEthereumContract();

      const amount = 10 * 10 ** 18;
      const result = await contract.methods
        .mintLbc(amount.toString())
        .send({ from: currentAccount });

      await contract.methods
        .approve(amount.toString())
        .send({ from: currentAccount });

      if (result.transactionHash) {
        alert('Você minerou 10 LBC, agora pode iniciar o jogo');
      }

      console.log('getInitialCoin', result);
    } catch (error) {
      console.log('Mint lbc', error);
    }
  }, [currentAccount]);

  const startGame = useCallback(async () => {
    try {
      const contract = getEthereumContract();

      const amount = 1 * 10 ** 18;
      const result = await contract.methods
        .startGame(amount.toString())
        .send({ from: currentAccount });

      setIsStarted(true);
      await getBalance();
      console.log('StartGame', result);
    } catch (error) {
      console.log('startGame', error);
    }
  }, [currentAccount, getBalance]);

  const correcAnswer = useCallback(async () => {
    try {
      const contract = getEthereumContract();
      const amount = 0.5 * 10 ** 18;
      await contract.methods
        .correctAnswer(amount.toString())
        .send({ from: currentAccount });

      await getBalance();
      setIsStarted(false);
    } catch (error) {
      console.log('correcAnswer', error);
    }
  }, [currentAccount, getBalance]);

  const incorrecAnswer = useCallback(async () => {
    try {
      const contract = getEthereumContract();
      const amount = 0.5 * 10 ** 18;
      await contract.methods
        .incorrectAnswer(amount.toString())
        .send({ from: currentAccount });

      await getBalance();
      setIsStarted(false);
    } catch (error) {
      console.log('correcAnswer', error);
    }
  }, [currentAccount, getBalance]);

  const claimBalance = useCallback(async () => {
    try {
      const contract = getEthereumContract();
      const amount = 0 * 10 ** 18;
      const result = await contract.methods
        .claimBalance(amount.toString())
        .send({ from: currentAccount });

      if (result.transactionHash) {
        alert(`Você acabou de sacar tudo. ${balance} LBC`);
      }
      await getBalance();
      setIsStarted(false);
    } catch (error) {
      console.log('correcAnswer', error);
    }
  }, [currentAccount, getBalance, balance]);

  useEffect(() => {
    checkWalletIsConected();
    getBalance();
  }, [getBalance]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        balance,
        getInitialCoin,
        startGame,
        isStarted,
        correcAnswer,
        incorrecAnswer,
        claimBalance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);

  return context;
};
