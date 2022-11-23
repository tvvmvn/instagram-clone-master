import {useEffect, useState} from "react";
import AuthContext from "./AuthContext";
import fetchData from "./fetchData";

export default function AuthProvider({children}) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return setIsLoaded(true);
    }

    fetchData(`${process.env.REACT_APP_HOSTNAME}/user`)
    .then(data => {
      setUser(data)
    })
    .catch(error => {
      setError(error);
    })
    .finally(() => setIsLoaded(true));
  }, [])

  function signIn(data, callback) {
    setUser(data.user);
    localStorage.setItem("token", data.token);
    callback()
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("token");
  }
  
  const value = {user, setUser, signIn, signOut}

  if (error) {
    return <p>failed to fetch a user</p>
  } 
  if (!isLoaded) {
    return <p>fething a user...</p>
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>  
  )
}