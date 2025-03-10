import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  RouterProvider,
} from "react-router-dom";
import { router } from './Components/Routes/Routes';
// import { router } from './Components/Routes/Routes.jsx'
import { ToastContainer } from 'react-toastify';
// import AuthProvider from './Components/Authentication/AuthProvider/AuthProvider.jsx';
import AuthProvider from './Components/Authentication/AuthProvider/AuthProvider'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <AuthProvider>

      <div className='max-w-screen-2xl mx-auto bg-gray-100'>
        <RouterProvider router={router} />
      </div>
      <ToastContainer />
    </AuthProvider>




  </React.StrictMode>
)