import apiClient from '../axios'

export async function get(config) {
  return apiClient
    .get(...config)
    .then(response => {
      if (response) {
        return response
      }
      return false
    })
    .catch(err => {
      return err.response
    })
}

export async function post(config) {
  return apiClient
    .post(...config)
    .then(response => {
      if (response) {
        return response
      }
      return false
    })
    .catch(err => {
      return err.response
    })
}

export async function put(config) {
  return apiClient
    .put(...config)
    .then(response => {
      if (response) {
        return response
      }
      return false
    })
    .catch(err => {
      return err.response
    })
}

export async function remove(config) {
  return apiClient
    .delete(...config)
    .then(response => {
      if (response) {
        return response
      }
      return false
    })
    .catch(err => {
      return err.response
    })
}
