const server = process.env.REACT_APP_SERVER;

/* USER  */
export async function fetchUser() {
  const res = await fetch(`${server}/user`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchUsersByUsername(username) {
  const res = await fetch(`${server}/users/?username=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}
  
export async function fetchUsersByEmail(email) {
  const res = await fetch(`${server}/users/?email=${email}`);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createUser(formData) {
  const res = await fetch(`${server}/users`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json'},
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createToken(formData) {
  const res = await fetch(`${server}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function updateAccount(formData) {
  const res = await fetch(`${server}/user`, {
    method: "PUT",
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token,
    },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}


/* ARTICLES */
export async function fetchFeed(limit, skip) {
  const res = await fetch(`${server}/feed/?limit=${limit}&skip=${skip}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchArticle(id) {
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
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token,
    },
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

export async function createFavorite(id) {
  const res = await fetch(`${server}/articles/${id}/favorite`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function deleteFavorite(id) {
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
export async function fetchComments(id) {
  const res = await fetch(`${server}/articles/${id}/comments`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createComment(id, formData) {

  const res = await fetch(`${server}/articles/${id}/comments`, {
    method: "POST",
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: formData
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
export async function fetchProfile(username) {
  const res = await fetch(`${server}/profiles/${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchTimeline(username, skip = 0) {
  const res = await fetch(`${server}/articles/?username=${username}&skip=${skip}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchFollowers(username) {
  const res = await fetch(`${server}/users/?followers=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchFollowings(username) {
  const res = await fetch(`${server}/users/?following=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createFollow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function deleteFollow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}




















