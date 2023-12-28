import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App';
import store from './app/store'
import { Provider } from 'react-redux'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { LandingPage } from './features/user/LandingPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <RouterProvider router={router}>
    <App />
  </RouterProvider>
  </Provider>
)
