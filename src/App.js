import React from 'react';
import './App.css';
import Board from './components/Board';
import './index.css';

function App() {
  return (
    <div className="App">
      <h1 className="text-center mb-4">Connect 4</h1>
      <Board /> 
    </div>
  );
}

export default App;
