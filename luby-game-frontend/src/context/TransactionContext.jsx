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
  const [balance, setBalance] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [data, setData] = useState({
    account: '',
    balance: 0,
    alreadyMintedLBC: false,
  });

  useEffect(() => {
    const storageData = localStorage.getItem(`@lubyCoin${currentAccount}`);

    if (storageData) {
      const dataParsed = JSON.parse(storageData);
      setData(dataParsed);
    }
  }, [currentAccount]);

  const checkWalletIsConected = useCallback(async () => {
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
  }, []);

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install metamask!');

      const contract = getEthereumContract();
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setCurrentAccount(accounts[0]);

      const result = await contract.methods
        .getBalanceIndividual()
        .call({ from: currentAccount });

      const balanceFormatd = result / 10 ** 18;
      const dataObj = {
        account: accounts[0],
        balance: balanceFormatd,
        alreadyMintedLBC: false,
      };
      setData(dataObj);
      localStorage.setItem(`@lubyCoin${accounts[0]}`, JSON.stringify(dataObj));

      console.log('Conect Wallet', dataObj);
    } catch (error) {
      console.log('connectWallet', error);
      throw new Error('No ethereum object');
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const contract = getEthereumContract();

      const result = await contract.methods
        .getBalanceIndividual()
        .call({ from: currentAccount });

      const balanceFormatd = result / 10 ** 18;
      setBalance(balanceFormatd);

      const storageDatadata = localStorage.getItem(
        `@lubyCoin${currentAccount}`
      );

      if (storageDatadata) {
        const data = JSON.parse(storageDatadata);

        localStorage.setItem(
          `@lubyCoin${currentAccount}`,
          JSON.stringify({ ...data, balance: balanceFormatd })
        );

        setData({
          account: currentAccount,
          balance: balanceFormatd,
          alreadyMintedLBC: data.alreadyMintedLBC,
        });
      }
    } catch (error) {
      console.log('getBalance', error);
    }
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
        alert('Voc?? ganhou 10 LBC, agora pode iniciar o jogo');
      }
      await getBalance();
      localStorage.setItem(
        `@lubyCoin${currentAccount}`,
        JSON.stringify({
          account: currentAccount,
          balance: 0,
          alreadyMintedLBC: true,
        })
      );
      setData({ account: currentAccount, balance: 0, alreadyMintedLBC: true });
    } catch (error) {
      console.log('Mint lbc', error);
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
      throw error;
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
      console.log('incorrecAnswer', error);
      throw error;
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
        alert(`Voc?? acabou de sacar tudo. ${balance} LBC`);
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

    function handleAccountsChanged(accounts) {
      setCurrentAccount(accounts[0]);
      const storageDatadata = localStorage.getItem(`@lubyCoin${accounts[0]}`);

      if (storageDatadata) {
        const dataObj = JSON.parse(storageDatadata);
        setData(dataObj);
      } else {
        localStorage.setItem(
          `@lubyCoin${accounts[0]}`,
          JSON.stringify({
            account: accounts[0],
            balance: 0,
            alreadyMintedLBC: false,
          })
        );
      }
    }

    ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [balance, checkWalletIsConected, getBalance]);

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
        data,
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
