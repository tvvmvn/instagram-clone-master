import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser, updateAccountReq, updateProfileImageReq } from "../utils/requests";
import AuthContext from "./AuthContext";

export default function Accounts() {
  const { user, setUser } = useContext(AuthContext);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [updatedAccount, setUpdatedAccount] = useState({})

  useEffect(() => {
    fetchUser()
      .then(data => {
        setAccount(data.account)
      })
      .catch(error => {
        navigate('/notfound', { replace: true });
      })
  }, [])

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const formData = new FormData();

      Object.keys(updatedAccount).map(prop => {
        formData.append(prop, updatedAccount[prop])
      })

      const data = await updateAccountReq(formData);
      setAccount(data.account);

      const updatedUser = { ...user, image: data.account.image };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUpdatedAccount({});
      alert('Successfully updated');

    } catch (error) {
      alert(error)
    }
  }

  console.log(updatedAccount);

  function handleUpload(e) {
    const file = e.target.files[0];
    
    if (file) {
      setUpdatedAccount({ ...updatedAccount, image: file })
    }
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setUpdatedAccount({ ...updatedAccount, [name]: value });
  }

  useEffect(() => {
    document.title = `Edit profile - Instagram`;
  }, [])

  if (!account) {
    return <p>fetching account...</p>
  }

  return (
    <div className="mt-8 px-4">
      {Object.keys(updatedAccount).length > 0 && (
        <p className="mb-4 bg-blue-500 text-white p-2">
          Click to save updated
        </p>
      )}
      <div className="flex mb-4">
        <img
          src={
            updatedAccount.image ? URL.createObjectURL(updatedAccount.image)
            : `${process.env.REACT_APP_SERVER}/files/profiles/${account.image}`
          }
          className="w-16 h-16 object-cover rounded-full border"
          />
        <div className="flex flex-col grow items-start ml-4">
          <h3>{account.username}</h3>

          <label className="text-sm font-semibold text-blue-500 cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              accept="image/*"
            />
            Change Photo
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="" className="block font-semibold">Name</label>
          <input
            type="text"
            name="fullName"
            className="border px-2 py-1 rounded w-full"
            value={updatedAccount.fullName || account.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="" className="block font-semibold">Username</label>
          <input
            type="text"
            name="username"
            className="border px-2 py-1 rounded w-full"
            value={updatedAccount.username || account.username}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="" className="block font-semibold">Email</label>
          <input
            type="text"
            name="email"
            className="border px-2 py-1 rounded w-full"
            value={updatedAccount.email || account.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="" className="block font-semibold">Bio</label>
          <textarea
            rows="3"
            name="bio"
            className="border px-2 py-1 rounded w-full"
            value={updatedAccount.bio || account.bio}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2 disabled:opacity-[0.2]"
          disabled={Object.keys(updatedAccount).length < 1}
        >
          Save
        </button>
      </form>
    </div>
  )
}