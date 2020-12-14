import actions from './actions'

const initialState = {
  captcha: undefined,
  resultFindPessoa: {},
  tipoPessoa: 'F',
  uf: [],
  cidades: [],
  loadingSearch: false,
  loadingCRUD: false,
  pessoas: []
}

export default function pessoa(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state;
  }
}