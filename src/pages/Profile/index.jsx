import { useContext, useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/img/avatar.png'
import { AuthContext } from '../../contexts/auth'

import { db, storage } from '../../servers/firebaseConnection'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

import { toast } from 'react-toastify'

export default function Profile() {

  const { user, storageUser, setUser, logout } = useContext(AuthContext)

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl) //armazenar a url da imagem
  const [imageAvatar, setImageAvatar] = useState(null) //armazenar a imagem de fato
  // se tiver usuario/email, ira mostrar dentro da useState, preenchendo como um valor padrão
  const [nome, setNome] = useState(user && user.nome)
  const [email, setEmail] = useState(user && user.email)



  function handleFile(e) {
    // pegando o primeiro arquivo enviado, posição 0
    if(e.target.files[0]) {
      const image = e.target.files[0]

      // verificando se é jpeg ou png
      if(image.type === 'image/jpeg' || image.type === 'image/png') {
        setImageAvatar(image) // setando a imagem em image do files
        setAvatarUrl(URL.createObjectURL(image)) // transformando ela em URL
      } else {
        alert('Formato de imagem inválido! Use PNG ou JPEG.')
        setAvatarUrl(null)
        return
      }
    }
  }



  async function handleUpload() {
    const currentUid = user.uid //pegando o ID do usuário

    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`) //a onde quero enviar
    
    //referencia - a onde eu quero enviar / e o que eu quero enviar (a foto)
    const uploadTask = uploadBytes(uploadRef, imageAvatar) //enviar usando o método uploadBytes
    
    .then((snapshot) => { //acessar os dados que foram enviados com sucesso
      
      //pegando a URL dela, informando que ela tem uma foto agora
      getDownloadURL(snapshot.ref).then( async (downloadURL) => {
        let urlFoto = downloadURL

        //e atualiza o banco com as infos novas
        const docRef = doc(db, 'user', user.uid)
        await updateDoc(docRef, {
          avatarUrl: urlFoto,
          nome: nome,
        })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
            avatarUrl: urlFoto,
          }

          setUser(data)
          storageUser(data)
          toast.success('Atualização bem sucedida!')
        })
      })
    })
  }



  async function handleSubmit(e) {
    e.preventDefault()

    //null padrão de não ter nenhuma foto/não enviou && nome diferente de vazio
    if(imageAvatar === null && nome !== '') {
      //atualizar apenas o nome do user
      const docRef = doc(db, 'user', user.uid) //onde
      await updateDoc(docRef, { //updateDoc para tal docRef
        nome: nome, //atualizar
      })
      //quando der certo, atualizar o nome, localstorage e o auth o contexto (o user que ta la dentro)
      .then(() => {
        let data = {
          ...user, //pegando as info de user
          nome: nome, //e mudar apenas o nome
        }

        setUser(data)
        storageUser(data)
        toast.success('Atualização bem sucedida!')
      })
    } else if(nome !== '' && imageAvatar !== null) {
      //atualizar tanto nome quanto a foto
      handleUpload()
    }
  }


  return (
    <div>
      <Header />

      <div className='md:ml-52 md:p-2'>
        <Title name='Meu perfil'>
          <FiSettings size={25}/>
        </Title>

        <div className='flex bg-[#f8f8f8] rounded p-3 items-center m-2 mb-4'>
          <form className='mb-4 rounded-full object-cover flex flex-col gap-3' onSubmit={handleSubmit}>
            <label className='w-[250px] h-[250px] flex justify-center items-center cursor-pointer mb-2 rounded-full'>
              <span className='z-20 absolute opacity-70 transition-all hover:opacity-100 hover:scale-125'>
                <FiUpload color='#fff' size={25}/>
              </span>

              <input className='hidden' type="file" accept='image/*' onChange={handleFile}/><br/>
                {/* caso não tenha foto, setar a padrão, se não, quer dizer que avatarUrl não é nulo, então exibe a foto dele de fato. */}
              {avatarUrl === null ? (
                <img src={avatar} alt="Foto de perfil" width={250} height={250} />
              ) : (
                <img src={avatarUrl} alt="Foto de perfil" className='w-[250px] h-[250px] rounded-full object-cover' />
              )}
            </label>

              <label className='font-bold'>Nome</label>
              {/* assim que alterado, passará para nome, indo para o banco de dados */}
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

              <label className='font-bold'>Email</label>
              <input className='cursor-not-allowed' value={email} disabled={true} />

              <button className='max-w-xl bg-[#181c2e] text-white p-2 rounded' type='submit'>Salvar</button>
          </form>
        </div>

          <div className='flex bg-[#f8f8f8] rounded p-3 items-center m-2 mb-4'>
            <button className='p-2 px-5 border border-black bg-transparent rounded text- flex justify-center items-center' onClick={() => logout()}>Sair</button>
          </div>

      </div>
    </div>
  )
}







