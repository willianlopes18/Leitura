import {
  LOAD_POSTS,
  ADD_POST,
  REMOVE_POST,
  EDIT_POST,
  SORT_POST,
  UPDATE_COMMENT_COUNT
} from '../actions'
import { sortFunc } from '../utils'

function posts (state = [], action){
  switch(action.type){
    case LOAD_POSTS:
      return action.posts
    case ADD_POST:
      const { post } = action
      return state.concat([post])
    case EDIT_POST:
      return state.map(p => p.id === action.post.id ? {...p, ...action.post} : p)
    case REMOVE_POST:
      return state.filter(p => p.id !== action.post.id)
    case SORT_POST:
      return sortFunc(state, action.property, action.ascending)
    case UPDATE_COMMENT_COUNT:
      return state.map(p => {
          if(p.id === action.postId){
            return {
              ...p,
              commentCount: p['commentCount'] + action.value
            }
          }
          return p})
    default:
      return state
  }
}

export default posts