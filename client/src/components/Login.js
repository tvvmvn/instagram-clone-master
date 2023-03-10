import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import { signIn } from "../utils/requests";

export default function Login() {

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      setError(null);

      const { user } = await signIn(email, password);
      
      setUser(user)

      localStorage.setItem('email', email);
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    document.title = `Login - Instagram`
  }, [])

  return (
    <form onSubmit={handleSubmit} className="max-w-xs p-4 mt-16 mx-auto">
      <div className="mt-4 mb-4 flex justify-center">
        <img src="/images/logo.png" className="w-36" />
      </div>

      <div className="mb-2">
        <label className="block">
          <input
            type="text"
            className="border px-2 py-1 w-full rounded"
            value={email}
            placeholder="E-mail"
            onChange={({ target }) => setEmail(target.value)}
          />
        </label>
      </div>

      <div className="mb-2">
        <label className="block relative">
          <input
            type={showPassword ? "text" : "password"}
            className="border px-2 py-1 w-full rounded"
            value={password}
            placeholder="password"
            onChange={({ target }) => setPassword(target.value)}
          />
          {password.trim().length > 0 && (
            <button
              type="button"
              className="absolute right-0 h-full px-4 py-2 text-sm font-semibold"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          )}
        </label>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-sm text-white font-semibold rounded-lg px-4 py-2 w-full disabled:opacity-[0.5]"
        disabled={!email.trim() || password.trim().length < 3}
      >
        Login
      </button>

      {error && <p className="my-4 text-center text-red-500">{error.message}</p>}

      <p className="text-center my-4">
        Don't have an account ?  {" "}
        <Link to="/accounts/signup" className="text-blue-500 font-semibold">Sign Up</Link>
      </p>
    </form>
  )
}