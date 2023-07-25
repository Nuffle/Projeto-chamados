import { FiX } from 'react-icons/fi'

export default function Modal({ conteudo, close }) {
  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 bg-[#0000006c] z-50 flex justify-center'>
      {/* container */}
      <div className='flex bg-[#f8f8f8] rounded p-3 justify-start m-2 flex-col fixed max-w-xl top-[15%] shadow-lg'>
        {/* close */}
        <button className='bg-orange-500 rounded flex w-20 px-2 py-1 justify-center items-center text-white text-sm' onClick={close}>
          <FiX className='mx-1' size={25} color='#fff'/>
          Voltar
        </button>

        <main className='flex flex-col p-3'>
          <h2 className='font-bold mb-4 text-xl'>Detalhes do chamado</h2>

          {/* row */}
          <div className='mb-4'>
            <span className='font-bold'>
              Cliente: <i className='font-normal'>{conteudo.cliente}</i>
            </span>
          </div>

          {/* row */}
          <div className='mb-4'>
            <span className='font-bold'>
              Assunto: <i className='font-normal mr-8'>{conteudo.assunto}</i>
            </span>
            <span className='font-bold'>
              Cadastrado em: <i className='font-normal'>{conteudo.createdFormat}</i>
            </span>
          </div>

          {/* row */}
          <div className='mb-4'>
            <span className='font-bold'>
              Status:
              <i className='font-normal ml-2 rounded p-1' style={{ colo: '#fff', backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                {conteudo.status}
              </i>
            </span>
          </div>

          {conteudo.complemento !== '' && (
            <>
              <h3 className='font-bold'>Complemento</h3>
              <p>
                {conteudo.complemento}
              </p>
            </>
          )}

        </main>
      </div>
    </div>
  )
}