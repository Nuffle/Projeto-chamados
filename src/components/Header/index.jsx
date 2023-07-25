import { useContext } from 'react'
import avatarImg from '../../assets/img/avatar.png'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'

export default function Header() {
  const { user } = useContext(AuthContext)
  
  return (
    <div className='w-full md:w-auto relative h-auto m-0 p-0 bg-[#181c2e] md:fixed md:h-full overflow-auto'>
      <div className='hidden md:flex ml-0 bg-coverImg bg-[#181c2e] bg-center bg-no-repeat bg-cover h-36 pt-8'>
        {/* se não tiver foto, usa a padrão, se tiver, usa ela */}
        <img className='w-24 h-24 block rounded-full object-cover m-14'
        src={user.avatarUrl === null ? avatarImg : user.avatarUrl } alt="Foto do usuário" />
      </div>


      <Link to="/dashboard" className='float-left md:float-none md:mt-12 flex p-4 text-gray-300 flex-row items-center transition-all ease-in-out hover:bg-[#121212] hover:text-[#fff]'>
        <FiHome className='hidden md:flex mr-2' color='#FFF' size={25}/> Home
      </Link>

      <Link to="/customers" className='float-left md:float-none flex p-4 text-gray-300 flex-row items-center transition-all ease-in-out hover:bg-[#121212] hover:text-[#fff]'>
        <FiUser className='hidden md:flex mr-2' color='#FFF' size={25}/> Clientes
      </Link>

      <Link to="/profile" className='float-left md:float-none flex p-4 text-gray-300 flex-row items-center transition-all ease-in-out hover:bg-[#121212] hover:text-[#fff]'>
        <FiSettings className='hidden md:flex mr-2' color='#FFF' size={25}/> Perfil
      </Link>

    </div>
  )
}