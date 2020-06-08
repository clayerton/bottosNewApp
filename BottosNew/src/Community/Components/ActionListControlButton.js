import React, { PureComponent } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity';
import styles from '../style';
import NavStyle from '../../Tool/Style/NavStyle';
import { toggleActionListVisible, setTargetForumId } from '../../Redux/Actions/CommunityActions';
export class ActionListControlButton extends PureComponent {
    constructor() {
        super(...arguments);
        this.handlePress = () => {
            const { forum_id } = this.props;
            this.props.toggleVisible();
            this.props.setTargetForumId(forum_id);
        };
    }
    render() {
        return (React.createElement(ThrottledTouchableOpacity, { style: NavStyle.rightButton, onPress: this.handlePress },
            React.createElement(Image, { resizeMode: "contain", style: styles.publishButton, source: require('../../BTImage/CommunityImages/community_ic_publish.png') })));
    }
}
const mapDispatchToProps = dispatch => {
    return {
        toggleVisible() {
            dispatch(toggleActionListVisible());
        },
        setTargetForumId(forum_id) {
            dispatch(setTargetForumId(forum_id));
        }
    };
};
export default connect(null, mapDispatchToProps)(ActionListControlButton);
