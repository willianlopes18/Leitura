import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import { saveComment, deleteComment, updateComment, updateCommentVoteScore, updateCommentCount } from '../../actions'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import VoteScore from '../Utils/VoteScore'
import Typography from '@material-ui/core/Typography'
import { formatDate } from '../../utils'
import { CONSTS } from '../../utils'

const styles = {
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}

class Comment extends Component {

  state = {
    editting: false,
    comment: this.props.initValue
  }

  onClickEdit = () => {
    this.setState({editting: true})
  }

  onClickSave = () => {
    const { comment } = this.state
    const { isAdd, afterSaveOrCancel } = this.props
    if(isAdd){
      //dispatch add new comment
      this.props.dispatch(saveComment(comment))
        .then(this.props.dispatch(updateCommentCount({postId: comment.parentId, value: 1})))
    }else{
      //dispatch update comment
      this.props.dispatch(updateComment(comment))
    }

    if(afterSaveOrCancel)
      afterSaveOrCancel()

    this.setState({editting: false})
  }

  onClickCancel = () => {
    const { afterSaveOrCancel, initValue } = this.props
    if(afterSaveOrCancel)
      afterSaveOrCancel()
    this.setState({ comment: initValue, editting: false})
  }

  onClickDelete = () => {
    const { comment } = this.state
    //dispatch delete comment
    this.props.dispatch(deleteComment(comment))
        .then(this.props.dispatch(updateCommentCount({postId: comment.parentId, value: -1})))
  }

  handleChange = propName => event => {
    const { comment } = this.state
    this.setState({
      comment: {
        ...comment,
        [propName]: event.target.value,
      }
    })
  }

  clickVoteScore = (option) => {
    const { comment } = this.state
    const { voteScore } = comment
    this.props.dispatch(updateCommentVoteScore(comment, option))
      .then( () => {
        if(option === CONSTS.VOTE_SCORE.OPTIONS.UP)
          this.setState({comment: {...comment, voteScore: voteScore + 1}})
        if(option === CONSTS.VOTE_SCORE.OPTIONS.DOWN)
          this.setState({comment: {...comment, voteScore: voteScore - 1}})
      })
  }

  render(){

    const { classes, isAdd } = this.props
    const { comment, editting } = this.state
    //formata timestamp para exibição
    const formattedDate = comment ? formatDate(comment.timestamp) : null

    return (
      <div>
        {comment && <Card key={comment.id}>
          <CardContent>
            {!isAdd && !editting &&
              <Typography className={classes.timeStamp} color="textSecondary">
                Creation time: {formattedDate}
              </Typography>
            }
            <TextField
            id="commentBody"
            label="Body"
            multiline
            rowsMax="10"
            disabled={!isAdd && !editting}
            value={comment.body}
            onChange={ this.handleChange('body') }
            margin="normal"
            fullWidth
            />
            <TextField
            id="author"
            label="Author"
            disabled={!isAdd && !editting}
            value={comment.author}
            onChange={ this.handleChange('author') }
            margin="normal"
            fullWidth
            />
          </CardContent>
          <CardActions>
            <Grid container spacing={0}>
               <Grid item xs={6}>
                {(!isAdd && !editting) && <VoteScore voteFunc={this.clickVoteScore} voteValue={comment.voteScore}/> }
              </Grid>
              <Grid item xs={6} className={classes.cardActions}>
                {(isAdd || editting) && <Button color="inherit" onClick={this.onClickSave}> {isAdd? 'Save' : 'Save Changes'} </Button> }
                {(isAdd || editting) && <Button color="inherit" onClick={this.onClickCancel}> Cancel </Button> }
                {!isAdd && !editting &&
                  <Tooltip id="tooltip-detail" title="Edit">
                    <IconButton
                    aria-owns={null}
                    aria-haspopup="false"
                    onClick={this.onClickEdit}
                    color="inherit"
                    >
                      <EditIcon/>
                    </IconButton>
                  </Tooltip>}
                {!isAdd && !editting &&
                  <Tooltip id="tooltip-detail" title="Delete">
                    <IconButton
                    aria-owns={null}
                    aria-haspopup="false"
                    onClick={this.onClickDelete}
                    color="inherit"
                    >
                      <DeleteIcon/>
                    </IconButton>
                  </Tooltip>}
              </Grid>
            </Grid>
          </CardActions>
        </Card>}
      </div>
    )
  }
}

Comment.propTypes = {
	isAdd: PropTypes.bool.isRequired,
	initValue: PropTypes.object.isRequired,
	afterSaveOrCancel: PropTypes.func
}

export default connect()(withStyles(styles)(Comment))