import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@renderer/App';

const root = document.getElementById('root') as HTMLElement

import './index.css'
import { ModalProvider } from './components/Modal/ModalContext';

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </React.StrictMode>
);