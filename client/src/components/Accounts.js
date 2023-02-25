import { useState, useContext, useEffect, useRef } from "react";
import { updateProfile } from "../utils/requests";
import AuthContext from "./AuthContext";

export default function Accounts() {
  const { user, setUser } = useContext(AuthContext);
  const [updatedUser, setUpdatedUser] = useState({});

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const formData = new FormData();

      Object.keys(updatedUser).map(prop => {
        formData.append(prop, updatedUser[prop]);
      })

      const data = await updateProfile(formData);

      setUser(data.user);

      setUpdatedUser({});
      alert('Successfully updated');

    } catch (error) {
      alert(error)
    }
  }

  function handleFile(e) {
    const file = e.target.files[0];
    
    if (file) {
      setUpdatedUser({ ...updatedUser, image: file })
    }
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setUpdatedUser({ ...updatedUser, [name]: value });
  }

  useEffect(() => {
    document.title = 'Edit profile - Instagram';
  }, [])

  console.log(updatedUser);

  return (
    <div className="mt-8 px-4">
      {Object.keys(updatedUser).length > 0 && (
        <p className="mb-4 bg-blue-500 text-white p-2">
          Click button to save updated data.
        </p>
      )}
      <div className="flex mb-4">
        <img
          src={
            updatedUser.image ? URL.createObjectURL(updatedUser.image)
            : `${process.env.REACT_APP_SERVER}/files/profiles/${user.image}`
          }
          className="w-16 h-16 object-cover rounded-full border"
          />
        <div className="flex flex-col grow items-start ml-4">
          <h3>{user.username}</h3>

          <label className="text-sm font-semibold text-blue-500 cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFile}
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
            defaultValue={user.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="" className="block font-semibold">Username</label>
          <input
            type="text"
            name="username"
            className="border px-2 py-1 rounded w-full read-only:bg-gray-100"
            defaultValue={user.username}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="" className="block font-semibold">Email</label>
          <input
            type="text"
            name="email"
            className="border px-2 py-1 rounded w-full read-only:bg-gray-100"
            defaultValue={user.email}
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
          Save
        </button>
      </form>
    </div>
  )
}