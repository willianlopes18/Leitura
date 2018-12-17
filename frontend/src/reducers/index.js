import { combineReducers } from 'redux'
import posts from './posts'
import categorias from './categorias'
import comments from './comments'

export default combineReducers({
  posts,
  categorias,
  comments
});