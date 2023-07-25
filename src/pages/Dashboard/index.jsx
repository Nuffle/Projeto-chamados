import { useContext, useState, useEffect } from "react"
import { AuthContext } from '../../contexts/auth'

import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi'

import { Link } from "react-router-dom"
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore"
import { db } from "../../servers/firebaseConnection"

import { format } from 'date-fns'
import Modal from "../../components/Modal"

const listRef = collection(db, 'chamados')

export default function Dashboard() {
  const { logout } = useContext(AuthContext)

  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true) //tela carregando até buscar e botar na chamados

  const [isEmpty, setIsEmpty] = useState(false) //verificar se a lista está vazia
  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false)

  const [showPostModal, setShowPostModal] = useState(false)
  const [detail, setDetail] = useState()

  useEffect(() => {
    async function loadChamados() {
      //consultar a ref, por ordem de criação decrescente, limitando a 5
      const q = query(listRef, orderBy('created', 'desc'), limit(5))

      const querySnapshot = await getDocs(q) // buscar os doc com base nas condições de 'q' - query
      setChamados([])

      await updateState(querySnapshot)

      setLoading(false)

    }

    loadChamados()

    return () => { }
  }, [])


  //recebe entao a lista para percorrer, todos os chamados que encontrou
  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0 //verificando se está vazia

    if(!isCollectionEmpty) {
      let lista = []

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
        })
      })

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] //pegando o ultimo item

      setChamados(chamados => [...chamados, ...lista])
      setLastDocs(lastDoc) //armazenou o ultimo item em setLastDocs

    } else {
      setIsEmpty(true)
    }

    setLoadingMore(false)

  }


  async function handleMore() {
    setLoadingMore(true)

    //consultar a ref, por ordem de criação decrescente, começando do last, limitando a 5
    const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5))
    const querySnapshot = await getDocs(q) // buscar os doc com base nas condições de 'q' - query
    await updateState(querySnapshot)
  }


  //modal
  function toggleModal(item) {
    setShowPostModal(!showPostModal) //tiver false, vai para true, abrindo o modal
    setDetail(item) //item que cliquei vai para useState detail
  }


  if(loading) {
    return (
      <div>
        <Header/>

        <div className='md:ml-52 md:p-2'>
          <Title name='Tickets'>
            <FiMessageSquare size={25}/>
          </Title>

          <div className='flex bg-[#f8f8f8] rounded p-3 items-center m-2 flex-col'>
            <span className="font-bold">Buscando chamados...</span>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div>
      <Header/>

      <div className='md:ml-52 md:p-2'>
        <Title name='Tickets'>
          <FiMessageSquare size={25}/>
        </Title>

        <>
          {/* se for igual a 0, quer dizer que nao tem chamado */}
          {chamados.length === 0 ? (
            <div className='flex bg-[#f8f8f8] rounded p-3 items-center m-2 flex-col'>
              <span className="m-4 font-bold">Nenhum chamado encontrado...</span>
              <Link to='/new' className="float-right m-4 bg-green-500 p-2 mr-2 rounded flex justify-center items-center border-0 font-semibold text-white hover:bg-green-600 hover:scale-105 transition-all">
                <FiPlus className="mr-1" color="#FFF" size={25}/>
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to='/new' className="float-right mb-6 bg-green-500 p-2 mr-2 rounded flex justify-center items-center border-0 font-semibold text-white hover:bg-green-600 hover:scale-105 transition-all">
                <FiPlus className="mr-1" color="#FFF" size={25}/>
                Novo chamado
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrando em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span className="rounded p-1" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="#" className="flex items-center justify-center h-11 gap-2">
                          <button>
                            <FiSearch className="rounded" color="#FFF" size={17} style={{ backgroundColor: '#3583f6' }} onClick={ () => toggleModal(item)}/>
                          </button>
                          <Link to={`/new/${item.id}`}>
                            <FiEdit2 className="rounded" color="#FFF" size={17} style={{ backgroundColor: '#f6a935' }}/>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

                {/* se o loadingMore for true, mostra o h3, false, nem mostra */}
              {loadingMore && <h3 className="font-bold mt-4">Buscando mais chamados...</h3>}
                {/* se não tiver carregando e a lista não estiver vazia, mostra o botão */}
              {!loadingMore && !isEmpty && <button className="mt-6 p-2 bg-[#181c2e] border-0 rounded text-base text-white"
              onClick={handleMore}>Buscar mais</button>}
            </>
          )}
        </>
      </div>
      
      {showPostModal && (
        <Modal
          conteudo={detail} //conteudo que passei na useState setDetail e veio para ca
          close={ () => setShowPostModal(!showPostModal) } //tiver aberto vai fechar, vice versa
        />
      )}

    </div>
  )
}