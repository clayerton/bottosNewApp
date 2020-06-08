
import { connect } from 'react-redux'
import { deleteComment, setTargetPostId, toggleCommentInputVisible } from '../../../Redux/Actions/CommunityActions'
import PostCommentItem from './PostCommentItem'


const mapDispatchToProps = (dispatch, ownProps: { routeName: string }) => {
  return {
    deleteComment(post_id: number, reply_id: number): void {
      dispatch(deleteComment(post_id, reply_id))
    },
    setTargetPostId(post_id: number, follow_id: number) {
      dispatch(setTargetPostId(post_id, follow_id))
    },
    showCommentInput() {
      dispatch(toggleCommentInputVisible(true, ownProps.routeName))
    }
  }
}

const AllPostCommentItem = connect(null, mapDispatchToProps)(PostCommentItem)

export default AllPostCommentItem
