import { server, getBearerToken } from "./header";


/*
  Post requests

  1 getFeed
  get feed

  2 getPost
  get a post

  3 createPost
  creates a post

  4 deletePost
  delete a post

  5 likePost
  like a post

  6 unlikePost
  unlike a post
*/


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