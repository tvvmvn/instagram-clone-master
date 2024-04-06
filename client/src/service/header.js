// Server URL 
export const server = "http://localhost:3000/api";

// Get access token 
export function getBearerToken() {
  const user = JSON.parse(localStorage.getItem("authUser"));
  
  return "Bearer " + user.access_token;
}






















