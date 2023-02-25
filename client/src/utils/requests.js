const server = process.env.REACT_APP_SERVER;

/* USER  */
export async function createUser(email, fullName, username, password) {
  const res = await fetch(`${server}/users`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ 
      email, 
      fullName, 
      username, 
      password 
    })
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

export async function updateProfile(formData) {
  const res = await fetch(`${server}/user`, {
    method: "PUT",
    headers: { "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function searchUsers(username) {
  const res = await fetch(`${server}/users/?username=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}
  
export async function doesEmailExists(email) {
  const res = await fetch(`${server}/users/?email=${email}`);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  const { userCount } = await res.json();

  return userCount > 0;
}

/* ARTICLES */
export async function getFeed() {
  const res = await fetch(`${server}/feed`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getArticle(id) {
  const res = await fetch(`${server}/articles/${id}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createArticle(formData) {
  const res = await fetch(`${server}/articles`, {
    method: "POST",
    headers: { "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function deleteArticle(id) {
  const res = await fetch(`${server}/articles/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function favorite(id) {
  const res = await fetch(`${server}/articles/${id}/favorite`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function unfavorite(id) {
  const res = await fetch(`${server}/articles/${id}/favorite`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

/* COMMENTS */
export async function getComments(id) {
  const res = await fetch(`${server}/articles/${id}/comments`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createComment(id, content) {

  const res = await fetch(`${server}/articles/${id}/comments`, {
    method: "POST",
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token,
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
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}


/* PROFILES */
export async function getProfile(username) {
  const res = await fetch(`${server}/profiles/${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getTimeline(username) {
  const res = await fetch(`${server}/articles/?username=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getFollowers(username) {
  const res = await fetch(`${server}/users/?followers=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getFollowings(username) {
  const res = await fetch(`${server}/users/?following=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function follow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function unfollow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}















