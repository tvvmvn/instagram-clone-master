import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { updateProfile, updateAvatar } from "../utils/requests";
import AuthContext from "./AuthContext";

export default function ProfileEdit() {
  const { user, setUser } = useContext(AuthContext);
  const [newFullName, setNewFullName] = useState(user.fullName);
  const [newBio, setNewBio] = useState(user.bio);

  const isEqual = {
    fullName: user.fullName === newFullName,
    bio: user.bio === newBio,
  }
  
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      
      const editedProfile = { 
        fullName: newFullName, 
        bio: newBio 
      };
      
      const { user } = await updateProfile(editedProfile);
      
      setUser(user);

      alert('Done');

    } catch (error) {
      alert(error);
    }
  }

  async function handleFile(e) {
    try {
      const file = e.target.files[0];

      const formData = new FormData();

      formData.append("avatar", file);

      const { user } = await updateAvatar(formData);

      setUser(user);

      alert("Done");

    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    document.title = 'Edit profile - Instagram';
  }, [])

  return (
    <div className="mt-8 px-4">
      {/* Avatar Image */}
      <div className="flex mb-4">
        <img
          src={`${process.env.REACT_APP_SERVER}/files/avatar/${user.avatar}`}
          className="w-16 h-16 object-cover rounded-full border"
        />
        <div className="flex flex-col grow items-start ml-4">
          <h3>{user.username}</h3>

          <label className="text-sm font-semibold text-blue-500 cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFile}
              accept="image/png, image/jpg, image/jpeg"
            />
            Change Photo
          </label>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="fullName" className="block font-semibold">Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="border px-2 py-1 rounded w-full"
            value={newFullName}
            onChange={({ target }) => setNewFullName(target.value)}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="bio" className="block font-semibold">Bio</label>
          <textarea
            id="bio"
            rows="3"
            name="bio"
            className="border px-2 py-1 rounded w-full resize-none"
            value={newBio}
            onChange={({ target }) => setNewBio(target.value)}
          />
        </div>

        <div className="flex">
          <button
            type="submit"
            className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2 disabled:opacity-[0.2]"
            disabled={isEqual.fullName && isEqual.bio}
          >
            Save
          </button>
          <Link
            to={`/profiles/${user.username}`}
            className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2 ml-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}