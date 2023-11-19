import { server, getBearerToken } from "./header";

export async function getFeed(limit, skip) {
  const res = await fetch(`${server}/posts/feed?limit=${limit}&skip=${skip}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function getPost(id) {
  const res = await fetch(`${server}/posts/${id}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function createPost(formData) {
  const res = await fetch(`${server}/posts`, {
    method: "POST",
    headers: { 
      "Authorization": getBearerToken() 
    },
    body: formData
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${server}/posts/${id}`, {
    method: "DELETE",
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function likePost(id) {
  const res = await fetch(`${server}/posts/${id}/like`, {
    method: "POST",
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function unlikePost(id) {
  const res = await fetch(`${server}/posts/${id}/unlike`, {
    method: "DELETE",
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}