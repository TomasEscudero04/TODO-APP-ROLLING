import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import {Toaster} from 'react-hot-toast';
import { TasksProvider } from './context/TaskContext.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <TasksProvider>
       <App/>
       <Toaster position='top-right' reverseOrder={false} />
      </TasksProvider>
    </AuthProvider>
  </BrowserRouter>
)
