const server = "http://localhost:3000/api";

/* USER  */
export async function createUser(newUser) {
  const res = await fetch(`${server}/users`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(newUser)
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function signIn(email, password) {
  const res = await fetch(`${server}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

/* POST */
export async function getFeed(skip) {
  const res = await fetch(`${server}/feed?skip=${skip}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getPost(id) {
  const res = await fetch(`${server}/posts/${id}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createPost(formData) {
  const res = await fetch(`${server}/posts`, {
    method: "POST",
    headers: { "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${server}/posts/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function likePost(id) {
  const res = await fetch(`${server}/posts/${id}/like`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function unlikePost(id) {
  const res = await fetch(`${server}/posts/${id}/unlike`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

/* COMMENT */
export async function getComments(id) {
  const res = await fetch(`${server}/posts/${id}/comments`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createComment(id, content) {

  const res = await fetch(`${server}/posts/${id}/comments`, {
    method: "POST",
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content })
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}


export async function deleteComment(id) {
  const res = await fetch(`${server}/comments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

/* PROFILES */
export async function updateProfile(editedProfile) {
  const res = await fetch(`${server}/profiles`, {
    method: "PUT",
    headers: { 
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token 
    },
    body: JSON.stringify(editedProfile)
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function updateAvatar(formData) {
  const res = await fetch(`${server}/profiles`, {
    method: "PUT",
    headers: { 
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token 
    },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getProfiles(username) {
  const res = await fetch(`${server}/profiles/?username=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getProfile(username) {
  const res = await fetch(`${server}/profiles/${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getTimeline(username) {
  const res = await fetch(`${server}/posts/?username=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getFollowers(username) {
  const res = await fetch(`${server}/profiles/?followers=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getFollowingUsers(username) {
  const res = await fetch(`${server}/profiles/?following=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function follow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function unfollow(username) {
  const res = await fetch(`${server}/profiles/${username}/unfollow`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).access_token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}















