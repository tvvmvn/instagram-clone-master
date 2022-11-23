import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (password.length < 5) {
      alert("Not safe password");
      return;
    }

    if (password !== passwordConfirm) {
      alert("Password not match")
      return;
    }

    const formData = {username, email, password};

    fetch(`${process.env.REACT_APP_HOSTNAME}/accounts/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then(data => {
      navigate('/login');
      console.log(data);
    })
    .catch(error => {
      if (error.status===400) {
        return alert("Username and email must be unique");
      }
      alert("Something's broken");
    })
  }

  const disabled = !username.trim() || !email.trim() || !password.trim() || !passwordConfirm.trim();

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto px-2">
      <div className="mb-4 flex h-24 items-end">
        <h1 className="text-2xl">Sign up</h1>
      </div>

      <div className="mb-2">
        <label htmlFor="">Username</label>
        <input 
          type="text" 
          className="border px-2 py-1 w-full" 
          onChange={(e) => setUsername(e.target.value)} 
        />
      </div>
      <div className="mb-2">
        <label htmlFor="">Email</label>
        <input 
          type="text" 
          className="border px-2 py-1 w-full" 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className="mb-2">
        <label htmlFor="">Password</label>
        <input 
          type="password" 
          className="border px-2 py-1 w-full" 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <div className="mb-2">
        <label htmlFor="">Password confirm</label>
        <input 
          type="password" 
          className="border px-2 py-1 w-full" 
          onChange={(e) => setPasswordConfirm(e.target.value)} 
        />
      </div>
      <div className="mb-2">
        <button 
          type="submit"
          className="border border-blue-500 text-blue-500 px-2 py-1 w-full disabled:opacity-[0.2]"
          disabled={disabled}
        >
          Submit
        </button>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
    </form>
  )
}