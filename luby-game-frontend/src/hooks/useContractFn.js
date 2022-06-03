import { useCallback } from 'react';
import { useWeb3 } from './useWeb3';

export const useContractFn = () => {
  const { contract, isLoaded, main, selectedAccount } = useWeb3();

  const getBalance = useCallback(async () => {
    try {
      if (!isLoaded) {
        await main();
      }

      const total = await contract.methods
        .getBalanceIndividual()
        .call({ from: selectedAccount });
      console.log('getBalance', total);
      return total;
    } catch (error) {
      console.log('getBalance error', error);
    }
  }, [contract, selectedAccount, isLoaded, main]);

  const mintLbc = useCallback(async () => {
    try {
      if (!isLoaded) {
        await main();
      }

      const amount = 10 * 10 ** 18;
      const result = await contract.methods
        .mintLbc(amount.toString())
        .send({ from: selectedAccount });
      console.log('mintLbc', result);
    } catch (error) {
      console.log('mintLbc error', error);
    }
  }, [contract, selectedAccount, isLoaded, main]);

  const startGame = useCallback(async () => {
    try {
      if (!isLoaded && !selectedAccount) {
        await main();
      }

      const amount = 1 * 10 ** 18;
      const result = await contract.methods
        .startGame(amount.toString())
        .send({ from: selectedAccount });
      console.log('startGame', result);
      return result;
    } catch (error) {
      console.log('startGame error', error);
    }
  }, [contract, selectedAccount, isLoaded, main]);

  return { getBalance, mintLbc, startGame };
};
