import { combineReducers } from 'redux';
import featuresReducer from './features';


export default combineReducers({
    features: featuresReducer
})