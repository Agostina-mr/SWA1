import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App';
import store from './app/store'
import { Provider } from 'react-redux'
import { Profile } from './features/components/Profile'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './App'
import { Navbar } from './features/components/Navbar'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "profile",
    element: <Profile />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <Navbar />
      <App />
    </RouterProvider>
  </Provider>
)
