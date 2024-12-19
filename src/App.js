import React from 'react';
import './App.css';
import Board from './components/Board'; // Import the Board component
import './index.css';

function App() {
  return (
    <div className="App">
      <h1>Connect 4 Game</h1>
      <Board />  {/* Add the Board component here */}
    </div>
  );
}

export default App;
