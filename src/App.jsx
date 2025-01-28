import React from 'react'
import { Toaster } from 'react-hot-toast';
import ListUsers from './Component/UserManagementDashboard/ListUsers'
import './App.css'
const App = () => {
  return (
    <div className='app-container'>
    <ListUsers/>
    <Toaster />
    </div>
  )
}

export default App