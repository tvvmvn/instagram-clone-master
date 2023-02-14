import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { fetchUser } from "../utils/requests";

export default function AuthProvider({ children }) {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return setIsLoaded(true);
    }

    fetchUser()
      .then(data => {
        setUser(data.user);
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => setIsLoaded(true));

  }, [])

  function signIn(user) {
    setUser(user);
  }

  function signOut() {
    setUser(null);
  }

  const value = { user, setUser, signIn, signOut }

  if (error) {
    return <p className="text-red-500">{error.message}</p>
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