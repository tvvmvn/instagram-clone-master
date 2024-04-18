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
  
  return patt.test(email);  
}

export function isUsername(username) {
  const patt = /^[a-zA-Z0-9]{5,}$/

  return patt.test(username);
}

export function isPassword(password) {
  return password.trim().length >= 5;
}
