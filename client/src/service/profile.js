import { server, getBearerToken } from "./header";

/*
  profile 

  1 getProfiles
  2 getProfile
  3 getTimeline
  4 getFollowers
  5 getFollowingUsers
  6 follow
  7 unfollow
*/

export async function getProfiles(username) {
  const res = await fetch(`${server}/profiles/?username=${username}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function getProfile(username) {
  const res = await fetch(`${server}/profiles/${username}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function getTimeline(username) {
  const res = await fetch(`${server}/posts/?username=${username}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function getFollowers(username) {
  const res = await fetch(`${server}/profiles/?followers=${username}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function getFollowingUsers(username) {
  const res = await fetch(`${server}/profiles/?following=${username}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function follow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
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

export async function unfollow(username) {
  const res = await fetch(`${server}/profiles/${username}/unfollow`, {
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
