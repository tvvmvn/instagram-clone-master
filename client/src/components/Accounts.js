import { useState, useContext, useEffect } from "react";
import AuthContext from "./AuthContext";
import { updateAccountReq } from "../utils/requests";

export default function Accounts() {
  const { user, setUser } = useContext(AuthContext);
  const [updatedUser, setUpdatedUser] = useState({});
  const [active, setActive] = useState(false)

  async function handleUpload(e) {
    try {
      const file = e.target.files[0];

      if (file.size > 1e7) {
        throw new Error('Too big');
      }
      
      const formData = new FormData();
      formData.append('image', file);

      const data = await updateAccountReq(formData);

      setUser(data.user);

      setActive(false);
      alert('Successfully uploaded');

    } catch (error) {
      alert(error)
    }
  }

  async function handleDelete(e) {
    try {
      const formData = new FormData();

      formData.append('image', '');

      const data = await updateAccountReq(formData);

      setUser(data.user);

      setActive(false);
      alert('Successfully deleted');

    } catch (error) {
      alert(error)
    }
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const formData = new FormData();

      for (let prop in updatedUser) {
        formData.append(prop, updatedUser[prop])
      }

      const data = await updateAccountReq(formData);

      setUser(data.user);

      setUpdatedUser({});
      alert("account is updated");

    } catch (error) {
      alert(error);
    }
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setUpdatedUser({ ...updatedUser, [name]: value });
  }

  function close(e) {
    if (e.target === e.currentTarget) {
      setActive(false)
    }
  }

  useEffect(() => {
    document.title = `Edit profile - Instagram`
  }, [])

  console.log(updatedUser);

  const modal = (
    <div className="fixed inset-0 flex justify-center items-center bg-black/[0.2] z-10" onClick={close}>
      <ul className="bg-white w-60 rounded-lg">
        <li className="border-b">
          <label className="block text-center w-full p-2 text-sm font-semibold text-blue-500 cursor-pointer">
            <input 
              type="file" 
              className="hidden" 
              onChange={handleUpload} 
              accept="image/*"
            />
            Upload Photo
          </label>
        </li>
        <li className="border-b">
          <button
            type="button"
            className="w-full p-2 text-red-500 text-sm font-semibold"
            onClick={handleDelete}
          >
            Remove Current Photo
          </button>
        </li>
        <li>
          <button
            type="button"
            className="w-full p-2 text-sm font-semibold"
            onClick={() => setActive(false)}
          >
            Cancel
          </button>
        </li>
      </ul>
    </div>
  )

  return (
    <div className="mt-8 px-4">
      <div className="flex mb-4">
        <img
          src={user.image ? `${process.env.REACT_APP_SERVER}/files/profiles/${user.image}` : '/images/default.png'}
          className="w-20 h-20 object-cover rounded-full border"
        />
        <div className="flex flex-col grow items-start ml-4">
          <h3>{user.username}</h3>

          {active && modal}

          <button
            type="button"
            className="text-sm font-semibold"
            onClick={() => setActive(true)}
          >
            Change profile photo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="" className="block font-semibold">Name</label>
          <input
            type="text"
            name="fullName"
            className="border px-2 py-1 rounded w-full"
            value={updatedUser.fullName || user.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="" className="block font-semibold">Username</label>
          <input
            type="text"
            name="username"
            className="border px-2 py-1 rounded w-full"
            value={updatedUser.username || user.username}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="" className="block font-semibold">Email</label>
          <input
            type="text"
            name="email"
            className="border px-2 py-1 rounded w-full"
            value={updatedUser.email || user.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="" className="block font-semibold">Bio</label>
          <textarea
            rows="3"
            name="bio"
            className="border px-2 py-1 rounded w-full"
            defaultValue={user.bio}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2 disabled:opacity-[0.2]"
          disabled={Object.keys(updatedUser).length < 1}
        >
          Submit
        </button>
      </form>
    </div>
  )
}