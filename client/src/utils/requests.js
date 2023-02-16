const server = process.env.REACT_APP_SERVER;

export async function fetchUser() {
  const res = await fetch(`${server}/user`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchComments(slug) {
  const res = await fetch(`${server}/articles/${slug}/comments`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchFeed(limit, skip) {
  const res = await fetch(`${server}/feed/?limit=${limit}&skip=${skip}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchFollowers(username) {
  const res = await fetch(`${server}/users?followers=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchFollowings(username) {
  const res = await fetch(`${server}/users?following=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchArticle(slug) {
  const res = await fetch(`${server}/articles/${slug}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchProfile(username) {
  const res = await fetch(`${server}/profiles/${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchTimeline(username, skip = 0) {
  const res = await fetch(`${server}/articles?username=${username}&skip=${skip}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function searchUserByUsername(username) {
  const res = await fetch(`${server}/users?username=${username}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchUserByUsername(username) {
  const res = await fetch(`${server}/users/${username}`);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}
  
export async function fetchUserByEmail(email) {
  const res = await fetch(`${server}/users/${email}`);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}








export async function createUserReq(formData) {
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

export async function createArticleReq(formData) {
  const res = await fetch(`${server}/articles`, {
    method: "POST",
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token,
    },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function deleteArticleReq(slug) {
  const res = await fetch(`${server}/articles/${slug}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}


export async function favoriteReq(slug, isFavorite) {
  const res = await fetch(`${server}/articles/${slug}/favorite`, {
    method: isFavorite ? 'DELETE' : 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function followReq(username, isFollowing) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: isFollowing ? 'DELETE' : 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function loginReq(formData) {
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

export async function updateAccountReq(formData) {
  const res = await fetch(`${server}/user`, {
    method: "PUT",
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token,
    },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function updateProfileImageReq(formData) {
  const res = await fetch(`${server}/user/image`, {
    method: "PUT",
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token,
    },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createCommentReq(slug, formData) {

  const res = await fetch(`${server}/articles/${slug}/comments`, {
    method: "POST",
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token,
      "Content-Type": "application/json",
    },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}


export async function deleteCommentReq(slug, commentId) {
  const res = await fetch(`${server}/articles/${slug}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}








