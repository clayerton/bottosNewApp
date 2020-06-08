import { createStore , applyMiddleware} from 'redux'
import rootReducer from './Reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './Saga';      
const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  window.devToolsExtension ? window.devToolsExtension() : undefined,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)                        // 执行rootSaga

export default store
