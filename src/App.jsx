import { BrowserRouter, Route } from "react-router-dom"
import RoutesApp from "./routes"

import AuthProvider from "./contexts/auth"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    //todas as pag irão passar por authprovider antes, fazendo a verificação se estã logado ou não
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer autoClose={3000}/>
        <RoutesApp/>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
