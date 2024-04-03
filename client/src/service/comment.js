import { server, getBearerToken } from "./header";

/*
  Comment requests

  1 getComments
  get comments 

  2 createComment
  create a comment

  3 deleteComment
  delete a comment
*/

export async function getComments(id) {
  const res = await fetch(`${server}/posts/${id}/comments`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function createComment(id, content) {
  const res = await fetch(`${server}/posts/${id}/comments`, {
    method: "POST",
    headers: {
      "Authorization": getBearerToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content })
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}


export async function deleteComment(id) {
  const res = await fetch(`${server}/posts/comments/${id}`, {
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



