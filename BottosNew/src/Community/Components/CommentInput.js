import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Keyboard, Platform, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { Toast } from 'antd-mobile-rn';
import { devlog, hasEmoji } from '../../Tool/FunctionTool';
import config from '../../Tool/Config';
import UserInfo from '../../Tool/UserInfo';
import I18n from '../../Tool/Language';
import { addComment, toggleCommentInputVisible } from '../../Redux/Actions/CommunityActions';
import { requestWithBody } from '../../Tool/NetWork/heightOrderFetch';
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
class CommentInput extends PureComponent {
    constructor(props) {
        super(props);
        this.onKeyPress = () => {
            const onKeyPress = this.props.onKeyPress;
            if (onKeyPress)
                onKeyPress();
        };
        this.sendCommit = () => {
            let content = this.state.text;
            devlog('CommentInput sendCommit 发送 text: ', content);
            if (!content) {
                Toast.info(I18n.t('feedback.write_content'), config.ToestTime);
                return;
            }
            if (hasEmoji(content)) {
                content = emoticons.stringify(content);
            }
            Keyboard.dismiss();
            Toast.loading(I18n.t('tip.wait_text'), 0);
            const token = UserInfo.token;
            const { targetPostId: post_id, follow_id, targetName } = this.props;
            let param = {
                token,
                post_id: post_id.toString(),
                content,
                follow_id: follow_id == -1 ? undefined : follow_id.toString()
            };
            requestWithBody('/post/followPost', param)
                .then((res) => {
                Toast.hide();
                if (res.code === '0') {
                    this.props.closeCommentInput();
                    const comment = {
                        post_id,
                        follow_id: follow_id == -1 ? null : follow_id,
                        follow_name: targetName,
                        reply_id: res.data,
                        member_name: UserInfo.member_name,
                        reply_content: content,
                        mobile: UserInfo.mobile
                    };
                    this.props.addComment(comment);
                }
                else if (res.code === '99') {
                    DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg);
                }
                else {
                    Toast.fail(res.msg, config.ToestTime);
                }
                pre_text = '';
            })
                .catch(() => {
                Toast.offline(I18n.t('tip.offline'), config.ToestTime);
            });
        };
        const { targetPostId, follow_id } = props;
        let text = '';
        if (targetPostId == preTargetPostId && follow_id == pre_follow_id) {
            text = pre_text;
        }
        this.state = {
            text
            // keyboardHeight: 0,
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
        this.props.closeCommentInput();
        // Keyboard.dismiss()
    }
    onFocus() {
        // devlog('CommentInput onFocus')
        const onFocus = this.props.onFocus;
        if (onFocus)
            onFocus();
    }
    _keyboardDidShow(e) {
        var keyboardHeight = 0;
        if (Platform.OS === 'ios') {
            keyboardHeight = e.startCoordinates.height;
            // this.setState({ keyboardHeight })
        }
        else {
            devlog('Keyboard Shown endCoordinates: ', e.endCoordinates);
            keyboardHeight = e.endCoordinates.height;
            // this.setState({ keyboardHeight })
        }
        const onkeyboardHeightChange = this.props.onkeyboardHeightChange;
        if (onkeyboardHeightChange)
            onkeyboardHeightChange(keyboardHeight);
    }
    _keyboardDidHide() {
        devlog('Keyboard Hidden');
        const onkeyboardDidHide = this.props.onkeyboardDidHide;
        if (onkeyboardDidHide)
            onkeyboardDidHide();
        // this.setState({ keyboardHeight: 0 })
    }
    _keyboardWillShow(e) {
        devlog('Keyboard WillShow e: ', e);
        // const onkeyboardWillShow = this.props.onkeyboardWillShow
        // if (onkeyboardWillShow) onkeyboardWillShow()
    }
    componentWillUnmount() {
        pre_text = this.state.text;
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.keyboardWillShowListener.remove();
    }
    render() {
        // let marginBottom = Platform.OS === 'ios' ? this.state.keyboardHeight : 10
        // let bottom = Math.max(this.state.keyboardHeight - 48, 0)
        // let bottom = this.state.keyboardHeight
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
    const { HomePageContentList, HomePageList, CurrentMenuOption, CommentInputVisible, targetPostId, follow_id } = state.CommunityPostState;
    var targetName = '0000';
    if (follow_id != -1) {
        const post = HomePageContentList.data.find(ele => ele.post_id == targetPostId);
    }
    return { targetPostId, follow_id, targetName };
};
const mapDispatchToProps = dispatch => ({
    addComment(comment) {
        dispatch(addComment(comment));
    },
    closeCommentInput() {
        dispatch(toggleCommentInputVisible(false));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(CommentInput);
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
