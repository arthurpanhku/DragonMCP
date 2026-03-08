import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://github.com/arthurpanhku/DragonMCP" target="_blank">
          <img src="/logo.png" className="logo" alt="DragonMCP logo" style={{ borderRadius: '50%' }} />
        </a>
      </div>
      <h1>DragonMCP</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the DragonMCP logo to learn more
      </p>
    </>
  );
}

export default App;
