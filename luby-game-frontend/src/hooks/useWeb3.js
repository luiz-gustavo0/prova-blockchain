import { useCallback, useState } from 'react';
import Web3 from 'web3';

import LubyGameContract from '../contracts/LubyGame.json';

export const useWeb3 = () => {
  const [contract, setContract] = useState({});
  const [selectedAccount, setSelectedAccount] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  const main = useCallback(async () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setSelectedAccount(accounts[0]);
        })
        .catch((err) => {
          console.log(err);
        });

      window.ethereum.on('accountsChanged', function (accounts) {
        setSelectedAccount(accounts[0]);
      });
    }

    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const newContract = new web3.eth.Contract(
      LubyGameContract.abi,
      LubyGameContract.networks[networkId].address
    );

    setContract(newContract);
    setIsLoaded(true);
  }, []);

  return { main, contract, selectedAccount, isLoaded };
};
