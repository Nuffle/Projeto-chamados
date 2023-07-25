import { useState, useEffect, useContext } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle } from 'react-icons/fi'

import { AuthContext } from '../../contexts/auth'
import { db } from '../../servers/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
//collection - acessar uma coleção; getDocs - buscar varios documentos, uma lista; getDoc - pegar um item específico; doc.

import { useParams, useNavigate } from 'react-router-dom' //usar os parametros do link - id no caso

import { toast } from 'react-toastify'

const listRef = collection(db, 'customers')

export default function New() {
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const navigate = useNavigate()

  const [customers, setCustomers] = useState([])
  const [loadCustomer, setLoadCustomer] = useState(true) //true para sempre carregar os clientes até buscar
  const [customerSelected, setCustomerSelected] = useState(0)

  const [complemento, setComplemento] = useState('')
  const [assunto, setAssunto] = useState('Suporte')
  const [status, setStatus] = useState('Aberto')
  const [idCustomer, setIdCustomer] = useState(false) //nao começa querendo editar, false

  //buscando os clientes
  useEffect(() => {
    async function loadCustomer() {
      const querySnapshot = await getDocs(listRef) //pegando tudo da colec. customers
      .then((snapshot) => {
        let lista = []

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })

        if(snapshot.docs.size === 0 ) {
          console.log('NENHUMA EMPRESA ENCONTRADA');
          setCustomers([ { id: '1', nomeFantasia: 'FREELA' } ])
          setLoadCustomer(false)
          return
        }

        setCustomers(lista)
        setLoadCustomer(false)

        //se for para editar, chamar o loadId
        if(id) {
          loadId(lista)
        }

      })
      .catch((error) => {
        console.log('ERRO AO BUSCAR OS CLIENTES', error);
        setLoadCustomer(false)
        setCustomers([ { id: '1', nomeFantasia: 'FREELA' } ]) //cliente fictício caso de erro
      })
    }

    loadCustomer()
  }, [id]) //caso tenha um id, usar o useEffects


  //editando, quando for para editar acima, e irá chamar os dados do doc que quero editar, com o id
  async function loadId(lista) {
    const docRef = doc(db, 'chamados', id)
    await getDoc(docRef)
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto)
      setStatus(snapshot.data().status)
      setComplemento(snapshot.data().complemento)

      //comparando se o cliente é o mesmo que buscou (snapshot)
      let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
      setCustomerSelected(index)
      setIdCustomer(true) //carregou tudo e ta na tela pra editar, entao vc quer editar, true
    })
    .catch((error) => {
      console.log(error);
      setIdCustomer(false) //e então, se nao encontrou a tela, então n vai editar, false
    })
  }


  //toda vez que mudar, ira chamar a função handleOptionChange e irá setar de setStatus o valor que ficou
  //toda vez que selecionar em option vai receber seu value

  function handleOptionChange(e) {
    setStatus(e.target.value)
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value)
  }

  function handleChangeCustomer(e) {
    setCustomerSelected(e.target.value)
  }


  //só vai addDoc quando nao tiver um idCustomer, quando tiver numa rota que nao tenha id; Caso tenha um idCustomer (id) vai para a edição no caso
  async function handleRegister(e) {
    e.preventDefault()

    //se tiver o idCustomer, ent é pq quero editar um chamado
    if(idCustomer) {
      //atualizando chamado
      const docRef = doc(db, "chamados", id)
      await updateDoc(docRef, {
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,
      })
      .then(() => {
        toast.info('Chamado atualizado com sucesso!')
        setCustomerSelected(0)
        setComplemento('')
        navigate('/dashboard')
      })
      .catch((error) => {
        toast.error("Erro ao atualizar chamado!")
        console.log(error);
      })
      return
    }

    //registrar um chamado
    await addDoc(collection(db, 'chamados'), {
      created: new Date(),
      //customers - lista e customerSelected para pegar o q tá selecionado no select
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id, //o id dele
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid,
    })
    .then(() => {
      toast.success('Chamado registrado!')
      setComplemento('')
      setCustomerSelected(0)
    })
    .catch((error) => {
      toast.error('Ops, erro ao registrar! Tente novamente mais tarde.')
      console.log(error)
    })
  }



  return (
    <div>
      <Header/>
      
      <div className='md:ml-52 md:p-2'>
        <Title name={id ? 'Editando Chamado' : 'Novo Chamado'}>
          <FiPlusCircle size={25}/>
        </Title>

        <div className='flex bg-[#f8f8f8] rounded p-3 items-center m-2 mb-4'>
          <form className='mb-4 w-full rounded-full object-cover flex flex-col gap-3' onSubmit={handleRegister}>

            <label className='font-bold'>Clientes</label>
            {/* se for true, mostra carregando, se não, os resultados */}
            {
              loadCustomer ? (
                <input type="text" disabled={true} value='Carregando...' />
              ) : (
                <select value={customerSelected} onChange={handleChangeCustomer}>
                  {customers.map((item, index) => {
                    return (
                      <option key={index} value={index}>
                        {item.nomeFantasia}
                      </option>
                    )
                  })}
                </select>
              )
            }

            <label className='font-bold'>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect} className='p-2 rounded'>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label className='font-bold'>Status</label>
            <div>
              <input
                type='radio'
                name='radio'
                value='Aberto'
                onChange={handleOptionChange}
                checked={ status === 'Aberto' }
              />
              <span>Em aberto</span>

              <input
                className='ml-4'
                type='radio'
                name='radio'
                value='Progresso'
                onChange={handleOptionChange}
                checked={ status === 'Progresso' }
              />
              <span>Em progresso</span>

              <input
                className='ml-4'
                type='radio'
                name='radio'
                value='Atendido'
                onChange={handleOptionChange}
                checked={ status === 'Atendido' }
              />
              <span>Atendido</span>
            </div>


            <label className='font-bold'>Complemento</label>
            <textarea
              className='resize-none'
              type='text'
              placeholder='Desgreva seu problema (opcional).'
              value={complemento}
              onChange={ (e) => setComplemento(e.target.value) }
            />

            <button className='bg-[#181c2e] text-white p-2 rounded' type='submit'>Registrar</button>

          </form>
        </div>
      </div>
    </div>
  )
}