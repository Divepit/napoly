// This file is here to define and handle the secure contact to our API
// We have to import axios from the node module directory
import axios from 'axios'

// If we are not on production, we want to contact the API which is running locally on our host machine. In case you do
// not want to run the database locally, replace 'http://localhost:3000' in the following line with 'https://api.napoly.ch'
// to use the live API

// var API_URL = 'http://localhost:3000' // Development
var API_URL = 'https://api.napoly.ch' //  Production

// This url is only used in production
if (process.env.NODE_ENV === 'production') {
  API_URL = 'https://api.napoly.ch' //  Production
}

// The securedAxiosInstance variable will be often used to access data from the API which requires authentication. This
// applies to all post, update and delete requests
const securedAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// The plainAxiosInstance can always be used when accessing non-encrypted data from the API, which applies to most get
// requests
const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// CSRF Tokens get saved in the localStorage upon sign-up, here they are injected into the request
securedAxiosInstance.interceptors.request.use(config => {
  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': localStorage.csrf
    }
  }
  return config
})

securedAxiosInstance.interceptors.response.use(null, error => {
  if (error.response && error.response.config && error.response.status === 401) {
    // If 401 by expired access cookie, we do a refresh request
    return plainAxiosInstance.post('/refresh', {}, { headers: { 'X-CSRF-TOKEN': localStorage.csrf } })
      .then(response => {
        localStorage.csrf = response.data.csrf
        localStorage.signedIn = true
        // After another successfull refresh - repeat original request
        let retryConfig = error.response.config
        retryConfig.headers['X-CSRF-TOKEN'] = localStorage.csrf
        return plainAxiosInstance.request(retryConfig)
      }).catch(error => {
        delete localStorage.csrf
        delete localStorage.signedIn
        // redirect to signin if refresh fails
        location.replace('/')
        return Promise.reject(error)
      })
  } else {
    return Promise.reject(error)
  }
})

export { securedAxiosInstance, plainAxiosInstance }
