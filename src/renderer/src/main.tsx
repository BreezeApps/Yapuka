import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@renderer/App';

const root = document.getElementById('root') as HTMLElement

import './index.css'

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);