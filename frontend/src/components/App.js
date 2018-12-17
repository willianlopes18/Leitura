import React, { Component } from 'react'
import { buscarCategorias, fetchPosts, savePost, updatePost, sortPost } from '../actions'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SortBy from './Utils/SortBy'
import PostModal from './Post/PostModal'
import PostList from './Post/PostList'
import PostDetalhes from './Post/PostDetalhes'
import MenuCategoria from './Categoria/MenuCategoria'
import { CONSTS } from '../utils'

const styles = {
  appBar: {
    background: '#1D272F'
  },
  sortBy: {
	  float: 'right'
  }
};

//estado inicial de um novo post
const defaultPostModal = {
  title: 'New Post',
  category: '',
  author: '',
  body: ''
}

class App extends Component {

  state = {
    openModalPost: false,
    postModal: defaultPostModal
  }

  componentDidMount(){
    this.props.carregarCategorias()
    this.props.loadPosts()
      .then(
        () => this.props.sortPost({
          property: CONSTS.SORT_BY.OPTIONS.SCORE_DESC.PROP,
          ascending: CONSTS.SORT_BY.OPTIONS.SCORE_DESC.ASC
        })
      )
  }

  handleOpenPostModal = post => {
    this.setState({
        openModalPost: true,
        postModal: post && post.id ? post : defaultPostModal
      })
  }

  handleClosePostModal = () => {
    this.setState({
      openModalPost: false,
    })
  }

  handleSavePostModal = () => {
    const { postModal } = this.state
    if(postModal && postModal.id){
      this.props.updatePost(postModal).then( () => {
        this.handleClosePostModal()
      })
    }else{
      this.props.savePost(postModal).then( () => {
        this.handleClosePostModal()
      })
    }
  }

  handlePostModalPropChange = propName => event => {
    const { postModal } = this.state
    this.setState({
      postModal: {
        ...postModal,
        [propName]: event.target.value,
      }
    })
  }

  render() {

    const { openModalPost, postModal } = this.state
    const { categorias, classes, sortPost } = this.props

    return (
      <BrowserRouter>
        <div>
          <AppBar position="static" className={classes.appBar}>
            <Toolbar>
              <Typography variant="title" color="inherit">
                Udacity Leitura
              </Typography>
              <SortBy style={classes.sortBy} onChange={sortPost}></SortBy>
              <Button color="inherit" onClick={this.handleOpenPostModal}>Add post</Button>
            </Toolbar>
          </AppBar>
          <PostModal
                open={openModalPost}
                post={postModal}
                handleClose={this.handleClosePostModal}
                handleSave={this.handleSavePostModal}
                handleChange={this.handlePostModalPropChange}
                >
          </PostModal>
          <Grid container spacing={0}>
            <Grid item xs={2} className={classes.navGrid}>
                <MenuCategoria categorias={categorias}></MenuCategoria>
            </Grid>
            <Grid item xs={10}>
              <Switch>
                <Route exact path='/:category' render={ ({match}) => {
                  return <PostList handleOpenPostModal={this.handleOpenPostModal} path={match.params.category} />
                }}/>
                <Route exact path='/:category/:postId' render={ ({match}) => {
                  return <PostDetalhes handleOpenPostModal={this.handleOpenPostModal} postId={match.params.postId} />
                }}/>
                <Route render={ () => {
                  return <PostList handleOpenPostModal={this.handleOpenPostModal} path='/' />
                }}/>
              </Switch>
            </Grid>
          </Grid>
        </div>
      </BrowserRouter>
    );
  }
}

function mapStateToProps ({ categorias }) {
  return { categorias }
}

function mapDispatchToProps (dispatch) {
  return {
    loadPosts: () => dispatch(fetchPosts()),
    carregarCategorias: () => dispatch(buscarCategorias()),
    savePost: (post) => dispatch(savePost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
    sortPost: (option) => dispatch(sortPost(option))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App))