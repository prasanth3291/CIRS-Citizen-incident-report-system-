import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import store from './store/store'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <BrowserRouter>
    

<GoogleOAuthProvider clientId="1013654891852-1nbqppqitq2d6r1bft65grcur39lg1na.apps.googleusercontent.com">
    <Provider store={store}>
        <App />
    </Provider>
    </GoogleOAuthProvider>
    </BrowserRouter>

  
);
reportWebVitals();
