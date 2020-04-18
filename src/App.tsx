import React, { useState } from 'react';
import './App.css';
import { Block } from './models/block';

function App() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  return (
    <div className="App"></div>
  );
}

export default App;
