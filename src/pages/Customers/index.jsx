import { useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiUser } from 'react-icons/fi'

import { db } from '../../servers/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'

import { toast } from 'react-toastify'

export default function Customers() {
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [endereco, setEndereco] = useState('')

  async function handleRegister(e) {
    e.preventDefault();

    if(nome !== '' && cnpj !== '' && endereco !== '') {
      await addDoc(collection(db, "customers"), {
        nomeFantasia: nome,
        cnpj: cnpj,
        endereco: endereco,
      })
      .then(() => {
        setNome('')
        setCnpj('')
        setEndereco('')
        toast.success('Empresa registrada!')
      })
      .catch((error) => {
        console.log(error);
        toast.error('Erro ao fazer o cadastro.')
      })

    } else {
      toast.info('Preencha todos os campos!')
    }
  }

  return (
    <div>
      <Header/>

      <div className='md:ml-52 md:p-2'>
        <Title name="Clientes">
          <FiUser size={25}/>
        </Title>

        <div className='flex bg-[#f8f8f8] rounded p-3 items-center m-2 mb-4'>
          <form className='mb-4 rounded-full object-cover flex flex-col gap-3' onSubmit={handleRegister}>
            <label className='font-bold'>Nome fantasia</label>
            <input
              type="text"
              placeholder='Nome da empresa'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label className='font-bold'>CNPJ</label>
            <input
              type="text"
              placeholder='Digite o CNPJ'
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />

            <label className='font-bold'>Endereço</label>
            <input
              type="text"
              placeholder='Endereço da empresa'
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <button className='max-w-xl bg-[#181c2e] text-white p-2 rounded' type='submit'>Salvar</button>
          </form>
        </div>

      </div>
    </div>
  )
}