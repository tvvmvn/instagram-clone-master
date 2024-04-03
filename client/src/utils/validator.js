/*
  Validation for form data

  1 isEmail
  check email
  
  2 isUsername
  check username
  
  3 isPassword
  check password
*/


export function isEmail(email) {
  const patt = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/
  
  if (email.match(patt)) {
    return true;
  } 
  
  return false;   
}

export function isUsername(username) {
  const patt = /^[a-zA-Z0-9]{5,}$/
  
  if (username.match(patt)) {
    return true;
  }
  
  return false;
}

export function isPassword(password) {
  if (password.trim().length >= 5) {
    return true;
  }
  
  return false;
}
