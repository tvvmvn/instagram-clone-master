import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../utils/requests";

export default function SignUp() {

  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const newUser = { email, fullName, username, password }
      await createUser(newUser);

      alert(`Welcome ${fullName}!`);
      navigate('/');
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    try {
      const _error = {};

      if (!email) {
        _error.email = "E-mail is required";
      }

      if (email.indexOf("@") < 0) {
        _error.email = "E-mail is not valid";
      }

      if (username.length < 5) {
        _error.username = "Username is too short";
      }

      if (username.match(/[^a-z0-9_]/)) {
        _error.username = "Username is only allowed in lowercase alphabet and number"
      }

      if (password.length < 5) {
        _error.password = "Unsafe password";
      }

      if (Object.keys(_error).length > 0) {
        throw _error;
      }

      setError({});
      
    } catch (error) {
      setError(error)
    }
  }, [username, email, password])

  useEffect(() => {
    document.title = 'Sign Up - Instagram';
  }, [])

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto p-4 mt-16">
      <div className="mt-4 mb-4 flex justify-center">
        <img src="/images/logo.png" className="w-36" />
      </div>

      <div className="mb-2">
        <label className="block">
          <input
            type="text"
            name="email"
            className="border px-2 py-1 rounded w-full"
            onChange={({ target }) => setEmail(target.value)}
            placeholder="Email address"
          />
        </label>
        {error.email && <p className="text-red-500">{error.email}</p>}
      </div>

      <div className="mb-2">
        <label className="block">
          <input
            type="text"
            name="fullName"
            className="border rounded px-2 py-1 w-full"
            onChange={({ target }) => setFullName(target.value)}
            placeholder="Full Name"
          />
        </label>
      </div>

      <div className="mb-2">
        <label className="block">
          <input
            type="text"
            name="username"
            className="border px-2 py-1 rounded w-full"
            onChange={({ target }) => setUsername(target.value)}
            placeholder="Username"
          />
        </label>
        {error.username && <p className="text-red-500">{error.username}</p>}
      </div>

      <div className="mb-2">
        <label className="block">
          <input
            type="password"
            name="password"
            className="border rounded px-2 py-1 w-full"
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Password"
            autoComplete="new-password"
          />
        </label>
        {error.password && <p className="text-red-500">{error.password}</p>}
      </div>

      <div className="mb-2">
        <button
          type="submit"
          className="bg-blue-500 rounded-lg text-sm font-semibold px-4 py-2 text-white w-full disabled:opacity-[0.5]"
          disabled={error}
        >
          Sign Up
        </button>
        {error.message && <p className="text-red-500 text-center my-4">{error.message}</p>}
      </div>

      {/* Login Link */}
      <p className="text-center mt-4">
         Do you already have an account ?  {" "}
        <Link to="/accounts/login" className="text-blue-500 font-semibold">
          Login
        </Link>
      </p>
    </form>
  )
}