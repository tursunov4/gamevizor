import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter} from 'react-router-dom'

const rootElement = document.getElementById('root') as HTMLElement;

const appDataElement = document.getElementById('app-data');

var data = {is_404: false, is_mobile: false, products: []}

if (appDataElement && appDataElement.textContent !== null) {
  data = JSON.parse(appDataElement.textContent);
}

ReactDOM.hydrateRoot(
  rootElement,
  <React.StrictMode>
    <BrowserRouter >
      <App is_404={data.is_404} is_mobile={data.is_mobile} products={data.products}/>
    </BrowserRouter>
  </React.StrictMode>
);

