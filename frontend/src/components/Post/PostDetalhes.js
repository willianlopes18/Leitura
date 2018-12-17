import React, { Component } from 'react'
import { connect } from 'react-redux'
import Post from './Post'
import CommentsList from '../Comment/CommentsList'
import Divider from '@material-ui/core/Divider'
import { getPostComments, sortComment } from '../../actions'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { CONSTS } from '../../utils'

class PostDetalhes extends Component {

  componentDidMount() {
    const { loadComments, sortComment, postId } = this.props
    loadComments(postId)
      .then(
        () => sortComment({
          property: CONSTS.SORT_BY.OPTIONS.SCORE_DESC.PROP,
          ascending: CONSTS.SORT_BY.OPTIONS.SCORE_DESC.ASC
        })
      )
  }

	render(){

		const { post, handleOpenPostModal } = this.props

		return (
        <div>
          { post &&
            <div>
        			<Post post={post} handleOpenPostModal={handleOpenPostModal}/>
              <Divider />
              <CommentsList postParentId={post.id}/>
            </div> }
          { !post &&
            <Typography variant="headline" component="h2" align="center" >
              Either this post does not exist or it was deleted!
            </Typography> }
        </div>
		)
	}
}

function mapStateToProps ({ posts }, ownProps) {
  return { post: posts.find(p => p.id === ownProps.postId) }
}

function mapDispatchToProps (dispatch) {
  return {
    loadComments: (postId) => dispatch(getPostComments(postId)),
    sortComment: (option) => dispatch(sortComment(option))
  }
}

PostDetalhes.propTypes = {
	handleOpenPostModal: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostDetalhes)