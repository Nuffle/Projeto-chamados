import { useState, createContext, useEffect } from "react";
import { auth, db } from '../servers/firebaseConnection'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore'

import { useNavigate } from 'react-router-dom' //para navegar o usuário
import { toast } from "react-toastify";

export const AuthContext = createContext({})

//tudo que tera de lógica - qualquer comp. poderá acessar pois ele está em volta (global)
function AuthProvider({ children }) {
  const [user, setUser] = useState(null) //user começando deslogado
  const [loadingAuth, setLoadingAuth] = useState(false) //caso demore para fazer o cadastro, ter o loading (foi importado onde será usado também)
  const [loading, setLoading] = useState(true) //ficar carregando até aparecer infos

  const navigate = useNavigate() //para navegar o usuário


  //quando montar a aplicação, buscar no local storage se tem dados do user que fez o login
  useEffect(() => {
    async function loadUser() {
      //buscando do local storage se tem alguma coisa
      const storageUser = localStorage.getItem('@ticketsPRO')

      if(storageUser) {
        setUser(JSON.parse(storageUser)) //converter de volta para objeto
        setLoading(false) //parou
      }

      setLoading(false)
    }

    loadUser()
  }, [])


  //logando um user
  async function signIn(email, password) {
    setLoadingAuth(true) //mostrar o loading

    await signInWithEmailAndPassword(auth, email, password)
      .then( async (value) => {
        let uid = value.user.uid

        const docRef = doc(db, "user", uid) //acessando o user que ta fznd o login
        const docSnap = await getDoc(docRef) //pegando os dados do user (await pois ele vai no banco buscar e pd demorar)

        let data = { //buscando as informações do user
          uid: uid,
          nome: docSnap.data().nome,
          email: value.user.email,
          avatarUrl: docSnap.data().avatarUrl
        }

        setUser(data)
        storageUser(data) //salvando as info do user no local storage
        setLoadingAuth(false) //e acaba aqui o login, ficando false de volta
        toast.success("Bem-vindo(a) de volta!")
        navigate("/dashboard") //assim que logar, manda o usuario para lá
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false)
        toast.error("Ops algo deu errado!")
      })
  }


  //cadastrar um novo user
  async function signUp(email, password, name) {
    setLoadingAuth(true) //quando ele clicar em cadastrar, vai mudar pra true, informando que quer cadastrar

    await createUserWithEmailAndPassword(auth, email, password)
    .then( async (value) => { //pegando tudo que receber
      let uid = value.user.uid //salvar no banco o nome, foto se tem ou não - pegando o id

      await setDoc(doc(db, "user", uid), { //cadastrar dentro de um doc - user > uid > infos
        nome: name,
        avatarUrl: null //null pois n está cadastrando foto ainda
      })
      .then(() => {

        let data = { //passando os dados para espalhar dentro da useState user, falando que cadastrou v
          uid: uid,
          nome: name,
          email: value.user.email,
          avatarUrl: null
        }

        setUser(user) //passou ^
        storageUser(data) //salvando as info do user no local storage
        setLoadingAuth(false) //e acaba aqui o cadastro, ficando false de volta
        toast.success("Seja bem-vindo(a) ao sistema!")
        navigate("/dashboard") //assim que logar, manda o usuario para lá
      })
    })
    .catch((error) => {
      console.log(error);
      setLoadingAuth(false) //e quebrouse
    })
  }

  //salvar os dados do usuario no local storage
  function storageUser(data) {
    localStorage.setItem('@ticketsPRO', JSON.stringify(data)) //convertendo os dados para string
  }

  //deslogar
  async function logout() {
    await signOut(auth)
    localStorage.removeItem('@ticketsPRO') //removeu as info do user do localStorage
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user, //false se n tiver, mas quando tiver, true
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser
      }}>

      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider