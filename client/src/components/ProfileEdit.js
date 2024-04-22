import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { updateProfile, updateAvatar } from "../service/user";
import AuthContext from "./auth/AuthContext";

export default function ProfileEdit() {
  const { user, setUser } = useContext(AuthContext);
  const [newName, setNewName] = useState(user.name);
  const [newBio, setNewBio] = useState(user.bio);
  const disabled = user.name === newName && user.bio === newBio;

  // key state tracking
  console.log(user) 
  
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      
      const editedProfile = { 
        name: newName, 
        bio: newBio 
      };
      
      const { user } = await updateProfile(editedProfile);
      
      setUser(user);

      alert("Done");

    } catch (error) {
      alert(error);
    }
  }

  async function handleFile(file) {
    if (file) {
      try {
        const formData = new FormData();

        formData.append("avatar", file);

        const { user } = await updateAvatar(formData);

        setUser(user);

        alert("Done");
        
      } catch (error) {
        alert(error)
      }
    }
  }

  useEffect(() => {
    document.title = "Edit profile - Instagram";
  }, [])

  return (
    <div className="px-4">
      <h3 className="my-4 text-lg font-semibold">Edit Profile</h3>

      {/* Avatar form */}
      <div className="flex mb-4">
        <img
          src={user.avatarUrl}
          className="w-16 h-16 object-cover rounded-full border"
        />

        <div className="grow ml-4">
          <h3>{user.username}</h3>

          <label className="text-sm font-semibold text-blue-500 cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={({ target }) => handleFile(target.files[0])}
              accept="image/png, image/jpg, image/jpeg, image/webp"
            />
            Change Photo
          </label>
        </div>
      </div>

      {/* Info form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="name" className="block font-semibold">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="border px-2 py-1 rounded w-full"
            value={newName}
            onChange={({ target }) => setNewName(target.value)}
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
            className="text-sm font-semibold bg-blue-500 text-white rounded-lg px-4 py-2 disabled:opacity-[0.2]"
            disabled={disabled}
          >
            Save
          </button>

          <Link
            to={`/profiles/${user.username}`}
            className="ml-2  px-4 py-2 text-sm font-semibold bg-gray-200 rounded-lg"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}