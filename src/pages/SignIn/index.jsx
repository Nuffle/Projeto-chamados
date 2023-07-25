import { useState, useContext } from 'react'
import logo from '../../assets/img/logo.png'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn, loadingAuth } = useContext(AuthContext)

  async function handleSignIn(event) {
    event.preventDefault()

    if(email !== '' && password !== '') {
      await signIn(email, password)
    }
  }


  return (
    <div className="h-full flex justify-center items-center bg-[#121212] p-3">
      <div className='bg-[#EAEAEC] w-[600px] flex items-center justify-center flex-col'>
        <div className='bg-[#181c2e] w-full flex justify-center'>
          <img
            className='w-44 h-36 p-5'
            src={logo} alt="Logo do sistema" />
        </div>

        <form onSubmit={handleSignIn} className='mt-6 w-4/5 flex flex-col'>
          <h1 className='text-center mb-4 text-[#181c2e] font-bold text-2xl'>Entrar</h1>
          <input
            className='mb-4 h-9 rounded border-0 p-3 text-sm bg-white'
            type="text"
            placeholder='email@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className='mb-4 h-9 rounded border-0 p-3 text-sm bg-white'
            type="password"
            placeholder='********'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
          className='h-9 border-0 rounded bg-[#181c2e] text-white text-xl'
          type="submit">
            {loadingAuth ? "Carregando..." : "Acessar"}
          </button>
        </form>

        <Link className='m-6 text-black cursor-pointer' 
        to='/registro'>Criar uma conta</Link>

      </div>
    </div>
  )
}