const request = axios.create({
  baseURL:'http://localhost:3001/api/',
});

export const setAuth = ()=>{
  const token = JSON.parse(localStorage.getItem("user") || '{}')
  const refreshToken = token.token
  request.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`
}

setAuth()

export default request