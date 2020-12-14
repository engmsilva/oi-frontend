
import { all} from 'redux-saga/effects';

import pessoa from './pessoa/sagas';

export default function* rootSaga() {
  return yield all([pessoa]);
}