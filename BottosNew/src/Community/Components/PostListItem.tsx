// 这是 PostItem 的容器组件
import { connect } from 'react-redux'
import { deletePost, updateOnePost, toggleCommentInputVisible, setTargetPostId } from '../../Redux/Actions/CommunityActions'
import { PostDetail } from '../../Redux/Reducers/CommunityReducer'

import PostItem from './PostItem'

interface OwnProps {
  item: PostDetail;
  navigation: any;
  onDelete?(): void;
}

function mapDispatchToProps(dispatch, ownProps: OwnProps) {
  return {
    deletePost(post_id: number) {
      if (ownProps.onDelete) ownProps.onDelete();
      dispatch(deletePost(post_id))
    },
    updateOnePost(postDetail: PostDetail) {
      dispatch(updateOnePost(postDetail))
    },
    showCommentInput() {
      const routeName = ownProps.navigation.state.routeName
      dispatch(toggleCommentInputVisible(true, routeName))
    },
    setTargetPostId(post_id: number) {
      dispatch(setTargetPostId(post_id))
    },
  }
}

const PostListItem = connect(null, mapDispatchToProps)(PostItem)

export default PostListItem
