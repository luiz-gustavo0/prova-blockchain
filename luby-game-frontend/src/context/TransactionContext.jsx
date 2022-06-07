import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Web3 from 'web3';

import { contractABI, contractAddress } from '../utils/contractAbi';

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const web3 = new Web3(ethereum);
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  return contract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [hasAlreadyMined, setHasAlreadyMined] = useState(false);

  const checkWalletIsConected = useCallback(async () => {
    try {
      if (!ethereum) return alert('Please install metamask!');

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        if (balance >= 1) {
          setHasAlreadyMined(true);
        }
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
  }, [balance]);

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
        setHasAlreadyMined(true);
      }
      await getBalance();
      console.log('getInitialCoin', result);
    } catch (error) {
      console.log('Mint lbc', error);
      setHasAlreadyMined(false);
    }
  }, [currentAccount, getBalance]);

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
  }, [getBalance, checkWalletIsConected]);

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
        hasAlreadyMined,
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
