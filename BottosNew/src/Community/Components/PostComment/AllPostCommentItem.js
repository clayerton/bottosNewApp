import { connect } from 'react-redux';
import { deleteComment, setTargetPostId, toggleCommentInputVisible } from '../../../Redux/Actions/CommunityActions';
import PostCommentItem from './PostCommentItem';
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        deleteComment(post_id, reply_id) {
            dispatch(deleteComment(post_id, reply_id));
        },
        setTargetPostId(post_id, follow_id) {
            dispatch(setTargetPostId(post_id, follow_id));
        },
        showCommentInput() {
            dispatch(toggleCommentInputVisible(true, ownProps.routeName));
        }
    };
};
const AllPostCommentItem = connect(null, mapDispatchToProps)(PostCommentItem);
export default AllPostCommentItem;
