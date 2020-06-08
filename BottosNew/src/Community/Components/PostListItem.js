// 这是 PostItem 的容器组件
import { connect } from 'react-redux';
import { deletePost, updateOnePost, toggleCommentInputVisible, setTargetPostId } from '../../Redux/Actions/CommunityActions';
import PostItem from './PostItem';
function mapDispatchToProps(dispatch, ownProps) {
    return {
        deletePost(post_id) {
            if (ownProps.onDelete)
                ownProps.onDelete();
            dispatch(deletePost(post_id));
        },
        updateOnePost(postDetail) {
            dispatch(updateOnePost(postDetail));
        },
        showCommentInput() {
            const routeName = ownProps.navigation.state.routeName;
            dispatch(toggleCommentInputVisible(true, routeName));
        },
        setTargetPostId(post_id) {
            dispatch(setTargetPostId(post_id));
        },
    };
}
const PostListItem = connect(null, mapDispatchToProps)(PostItem);
export default PostListItem;
