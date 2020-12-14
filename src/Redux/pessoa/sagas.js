import { takeEvery, call, put, all} from 'redux-saga/effects';
import { notification } from 'antd'
import actions from './actions';
import * as crud from '../../services/crud';

export function* CAPTCHA({ payload }) {
  const { dados, url, resolve } = payload
  try {
    const success = yield call(crud.post, [url, dados])
    if (success.status === 200) {
      if (success.data.responseSuccess === 'Sucess') {
        resolve({
          status: 'success',
          isHuman: true
        })
      } else {
        throw new Error()
      }
    } else {
      throw new Error()
    }
  } catch (err) {
    resolve({
      status: 'error',
      isHuman: false
    })
  }
}

export function* UF({ payload }) {
  try {
    const { url } = payload
    const success = yield call(crud.get, [url])
    if (success.status === 200) {
        yield put({
          type: 'pessoa/SET_STATE',
          payload: {
            uf: success.data
          },
        })
    } else {
      throw new Error()
    }
  } catch (err) {
    notification.error({
      message: 'Falhou!',
      description: err,
    })
  }
}

export function* CIDADES({ payload }) {
  try {
    const { url } = payload
    const success = yield call(crud.get, [url])
    if (success.status === 200) {
        yield put({
          type: 'pessoa/SET_STATE',
          payload: {
            cidades: success.data
          },
        })
    } else {
      throw new Error()
    }
  } catch (err) {
    notification.error({
      message: 'Falhou!',
      description: err,
    })
  }
}

export function* FIND_PESSOA({ payload }) {
  try {
    const { dados, url } = payload
    yield put({
      type: 'pessoa/SET_STATE',
      payload: {
        loadingSearch: true
      },
    })
    const success = yield call(crud.post, [url, dados])
    if (success.status === 200) {
      yield put({
        type: 'pessoa/SET_STATE',
        payload: {
          resultFindPessoa: success.data,
          loadingSearch: false
        },
      })
    } else {
      throw new Error()
    }
  } catch (err) {
    yield put({
      type: 'pessoa/SET_STATE',
      payload: {
        loadingSearch: false
      },
    })
  }
}

export function* GET({ payload }) {
  try {
    const { url } = payload
    yield put({
      type: 'pessoa/SET_STATE',
      payload: {
        loadingCRUD: true
      },
    })
    const success = yield call(crud.get, [url])
    if (success.status === 200) {
        yield put({
          type: 'pessoa/SET_STATE',
          payload: {
            loadingCRUD: false,
            pessoas: success.data.map(item => {
              return {...item, key: item._id}
            })
          },
        })
    } else {
      throw new Error()
    }
  } catch (err) {
    notification.error({
      message: 'Falhou!',
      description: err,
    })
    yield put({
      type: 'pessoa/SET_STATE',
      payload: {
        loadingCRUD: false
      },
    })
  }
}

export function* POST({ payload }) {
  let success;
  try {
    const { url, dados } = payload
    yield put({
      type: 'pessoa/SET_STATE',
      payload: {
        loadingCRUD: true
      },
    })
    success = yield call(crud.post, [url, dados])
    if (success.status === 201) {
      notification.success({
        message: 'Feito!',
        description: 'Salvo com sucesso.',
      })
      yield put({
        type: 'pessoa/SET_STATE',
        payload: {
          loadingCRUD: false
        },
      })
    } else {
      throw new Error()
    }
  } catch (err) {
    notification.error({
      message: 'Falhou!',
      description: success.data.message
    })
    yield put({
      type: 'pessoa/SET_STATE',
      payload: {
        loadingCRUD: false
      },
    })
  }
}

export function* PUT({ payload }) {
  let success;
  try {
    const { url, dados } = payload
    yield put({
      type: 'pessoa/SET_STATE',
      payload: {
        loadingCRUD: true
      },
    })
    success = yield call(crud.put, [url, dados])
    if (success.status === 200) {
      notification.success({
        message: 'Feito!',
        description: 'Atualizado com sucesso.',
      })
      yield put({
        type: 'pessoa/SET_STATE',
        payload: {
          loadingCRUD: false
        },
      })
    } else {
      throw new Error()
    }
  } catch (error) {
    notification.error({
      message: 'Falhou!',
      description: success.data.message,
    })
    yield put({
      type: 'pessoa/SET_STATE',
      payload: {
        loadingCRUD: false
      },
    })
  }
}

export function* REMOVE({ payload }) {
  try {
    const { url, dados } = payload
    const success = yield call(crud.remove, [url])
    if (success.status === 200) {
        yield put({
          type: 'pessoa/SET_STATE',
          payload: {
            pessoas: dados
          },
        })
        notification.success({
          message: 'Feito!',
          description: 'Excluído com sucesso.',
        })
    } else {
      throw new Error()
    }
  } catch (err) {
    notification.error({
      message: 'Falhou!',
      description: err,
    })
  }
}

export default all([
  takeEvery(actions.CAPTCHA, CAPTCHA),
  takeEvery(actions.UF, UF),
  takeEvery(actions.CIDADES, CIDADES),
  takeEvery(actions.FIND_PESSOA, FIND_PESSOA),
  takeEvery(actions.GET, GET),
  takeEvery(actions.POST, POST),
  takeEvery(actions.PUT, PUT),
  takeEvery(actions.REMOVE, REMOVE)
])