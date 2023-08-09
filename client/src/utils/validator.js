export function isEmail(email) {
  const emailPattern = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/
  
  if (email.match(emailPattern)) {
    return true;
  } 
  
  return false;   
}

export function isValidUsername(username) {
  const usernamePattern = /^[a-zA-Z0-9]{5,}$/
  
  if (username.match(usernamePattern)) {
    return true;
  }
  
  return false;
}

export function isValidPassword(password) {
  if (password.trim().length >= 5) {
    return true;
  }
  
  return false;
}
