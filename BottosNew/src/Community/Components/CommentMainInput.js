import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Keyboard, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Toast } from 'antd-mobile-rn';
import { devlog, hasEmoji } from '../../Tool/FunctionTool';
import config from '../../Tool/Config';
import I18n from '../../Tool/Language';
import { SEND_FOLLOW_POST, SEND_FOLLOW_REPLY_POST } from '../../Redux/Actions/ActionsTypes';
import * as emoticons from '../../Tool/View/Emoticons';
const { width } = Dimensions.get('window');
// 这个是用来缓存上一次回复目标的
var preTargetPostId = 0, pre_follow_id = 0, pre_text = '';
/**
 * 这个组件之所以这样写
 * 是因为 输入框 有时候会被键盘顶起来
 * 并且进而导致整个页面都被顶起来
 * 是一个大坑
 * 所以有的时候需要把键盘弹起的高度传给父组件
 *
 */
class CommentMainInput extends PureComponent {
    constructor(props) {
        super(props);
        this.onKeyPress = () => {
            const onKeyPress = this.props.onKeyPress;
            if (onKeyPress)
                onKeyPress();
        };
        this.sendCommit = () => {
            let content = this.state.text;
            const { router } = this.props;
            const { post_id, main_id, reply_id } = this.props.setTargetPostId;
            if (!content) {
                Toast.info(I18n.t('feedback.write_content'), config.ToestTime);
                return;
            }
            if (hasEmoji(content)) {
                content = emoticons.stringify(content);
            }
            Keyboard.dismiss();
            if (!main_id) {
                this.props.dispatch({
                    type: SEND_FOLLOW_POST,
                    payload: {
                        post_id: post_id.toString(),
                        content,
                        follow_id: main_id ? main_id.toString() : undefined,
                        router
                    }
                });
            }
            else {
                this.props.dispatch({
                    type: SEND_FOLLOW_REPLY_POST,
                    payload: {
                        post_id: post_id.toString(),
                        content,
                        follow_id: main_id ? main_id.toString() : undefined,
                        router
                    }
                });
            }
        };
        const { targetPostId, follow_id } = props;
        let text = '';
        if (targetPostId == preTargetPostId && follow_id == pre_follow_id) {
            text = pre_text;
        }
        this.state = {
            text
        };
        preTargetPostId = targetPostId;
        pre_follow_id = follow_id;
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
    }
    onBlur() {
        // this.props.closeCommentInput()
        // Keyboard.dismiss()
    }
    onFocus() {
        const onFocus = this.props.onFocus;
        if (onFocus)
            onFocus();
    }
    _keyboardDidShow(e) {
        var keyboardHeight = 0;
        if (Platform.OS === 'ios') {
            keyboardHeight = e.startCoordinates.height;
        }
        else {
            devlog('Keyboard Shown endCoordinates: ', e.endCoordinates);
            keyboardHeight = e.endCoordinates.height;
        }
        const onkeyboardHeightChange = this.props.onkeyboardHeightChange;
        if (onkeyboardHeightChange)
            onkeyboardHeightChange(keyboardHeight);
    }
    _keyboardDidHide() {
        // devlog('Keyboard Hidden')
        const onkeyboardDidHide = this.props.onkeyboardDidHide;
        if (onkeyboardDidHide)
            onkeyboardDidHide();
    }
    _keyboardWillShow(e) {
        devlog('Keyboard WillShow e: ', e);
    }
    componentWillUnmount() {
        pre_text = this.state.text;
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.keyboardWillShowListener.remove();
    }
    render() {
        const member_name = this.props.targetName;
        const placeholderText = member_name && I18n.t('community.reply') + member_name + '：';
        return (React.createElement(View, { style: styles.wrapper },
            React.createElement(TextInput, { style: [styles.inputView, styles.textBorder], onChangeText: text => this.setState({ text }), onBlur: this.onBlur, 
                // blurOnSubmit={true}
                onFocus: this.onFocus, onKeyPress: this.onKeyPress, returnKeyType: "send", onSubmitEditing: this.sendCommit, autoFocus: true, underlineColorAndroid: "transparent", placeholderTextColor: "#999", placeholder: placeholderText, clearTextOnFocus: true }),
            React.createElement(TouchableOpacity, { activeOpacity: 0.5, onPress: this.sendCommit },
                React.createElement(Text, { style: [styles.enter, styles.textBorder] }, I18n.t('community.send')))));
    }
}
const mapStateToProps = state => {
    const { setTargetPostId } = state.CommunityPostState;
    return { setTargetPostId };
};
export default connect(mapStateToProps)(CommentMainInput);
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: width,
        paddingLeft: 20,
        paddingRight: 10,
        paddingTop: 7,
        paddingBottom: 7
    },
    textBorder: {
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 5,
        backgroundColor: '#FFFFFF'
    },
    inputView: {
        flexGrow: 9,
        marginRight: 10,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: Platform.OS === 'ios' ? 6 : 2,
        paddingBottom: Platform.OS === 'ios' ? 5 : 0,
        // height: 30,
        maxHeight: 60,
        lineHeight: 16,
        color: '#2F2F2F',
        fontSize: 14
    },
    enter: {
        color: '#999999',
        justifyContent: 'center',
        alignItems: 'center',
        width: 44,
        height: 30,
        lineHeight: 30,
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e3e3e3'
    }
});
