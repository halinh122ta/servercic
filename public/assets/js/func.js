const request = axios.create({
    baseURL: '/api/',
  });
  let apikey;
  let user = undefined
  const setAuth = () => {
    user = localStorage.getItem("user") || undefined
    if (user != undefined) {
      const token = JSON.parse(user)
      const refreshToken = token.token
      apikey = token.data.apikey
      request.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`
      loginChecker(token)
    }else{
      document.querySelector('.login').classList.remove('hidden')
      var lst = document.querySelectorAll('.login_hidden')
      for(let i = 0 ; i < lst.length ;i++){
        lst[i].classList.remove('hidden')
      }
    }
  }
  const loginChecker = (user) =>{
      console.log(user.data)
      document.querySelector('.account_title').classList.remove('hidden')
  }
  setAuth()