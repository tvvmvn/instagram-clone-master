export async function addDoc(url, data) {

  const opts = {}
  opts.method = 'POST';
  opts.headers = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }

  if (data) {
    if (typeof data === 'string') {
      opts.headers['Content-Type'] = 'application/json';
    }
    opts.body = data;
  }

  const res = await fetch(`http://localhost:3000/api/${url}`, opts)

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getDocs(url) {

  const opts = {};
  opts.method = 'GET'
  opts.headers = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }

  const res = await fetch(`http://localhost:3000/api/${url}`, opts)

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function getDoc(url) {

  const opts = {};
  opts.method = 'GET'
  opts.headers = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }

  const res = await fetch(`http://localhost:3000/api/${url}`, opts)

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function deleteDoc(url) {

  const opts = {};
  opts.method = 'DELETE'
  opts.headers = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }

  const res = await fetch(`http://localhost:3000/api/${url}`, opts)

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function updateDoc(url, data) {

  const opts = {};
  opts.method = 'PUT';
  opts.headers = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token };
  opts.body = data;

  const res = await fetch(`http://localhost:3000/api/${url}`, opts)

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function signIn(formData) {

  const opts = {};
  opts.method = 'POST'
  opts.headers = { 'Content-Type': 'application/json' }
  opts.body = formData;

  const res = await fetch(`http://localhost:3000/api/user/login`, opts)

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function createUser(formData) {

  const opts = {};
  opts.method = 'POST';
  opts.headers = { 'Content-Type': 'application/json' }
  opts.body = formData;

  const res = await fetch(`http://localhost:3000/api/users`, opts);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function updateUser(data) {

  const opts = {};
  opts.method = 'PUT';
  opts.headers = { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token };
  opts.body = data;

  const res = await fetch(`http://localhost:3000/api/user`, opts);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function doesEmailExists(email) {

  const opts = {};
  opts.method = 'GET';

  const res = await fetch(`http://localhost:3000/api/users/?email=${email}`, opts);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  const { userCount } = await res.json();

  return userCount > 0;
}









