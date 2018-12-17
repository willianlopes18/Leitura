import {
  CARREGAR_CATEGORIA
} from '../actions'


function categorias (state = [], action){
    switch(action.type){
      case CARREGAR_CATEGORIA:
        return action.categorias
      default:
        return state
    }
}

export default categorias