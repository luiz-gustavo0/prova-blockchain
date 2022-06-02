import './App.css';
import { useWeb3 } from './hooks/useWeb3';

function App() {
  const { contract } = useWeb3();

  console.log(contract);
  return (
    <div className='App'>
      <h1>Dapp: LubyGame</h1>
    </div>
  );
}

export default App;
