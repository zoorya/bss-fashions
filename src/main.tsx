import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ThriftStore from './ThriftStore';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThriftStore />
  </React.StrictMode>
);