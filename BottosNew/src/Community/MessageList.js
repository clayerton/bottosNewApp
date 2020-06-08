import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, View, FlatList, Image } from 'react-native';
import { REQUEST_POST_DETAIL } from '../Redux/Actions/ActionsTypes';
// 公共组件
import BTBackButton from '../Tool/View/BTBackButton';
import ThrottledTouchableOpacity from '../Tool/View/ThrottledTouchableOpacity';
// 子组件
import MessageListItem from './Components/MessageListItem';
import { requestWithBody } from '../Tool/NetWork/heightOrderFetch';
import I18n from '../Tool/Language';
import NavStyle from '../Tool/Style/NavStyle';
// 当列表为空的时候
const renderEmpty = () => {
    return (React.createElement(View, { style: { flexGrow: 1, margin: '20%' } },
        React.createElement(Image, { style: { width: '100%', maxHeight: 200 }, resizeMode: "contain", source: require('../BTImage/My/my_follow_list_bg.png') }),
        React.createElement(Text, { style: { marginTop: 50, textAlign: 'center' } }, I18n.t('community.no_messages'))));
};
const navigationOptions = () => {
    return {
        headerLeft: BTBackButton,
        headerRight: React.createElement(View, { style: NavStyle.rightButton }),
        headerTitle: I18n.t('community.messages_title')
    };
};
// 这个组件的逻辑：
// 从未读消息进来的时候
// 底部显示 查看更多消息，手动点击触发
// 从消息列表进来的时候
// 显示全部，下拉触发
class MessageList extends Component {
    constructor(props) {
        super(props);
        this.page = 1;
        this.canNavigate = true;
        // 点击 查看更多消息
        this.handleLoadMoreMessage = () => {
            this.loadData(this.page);
        };
        // 点击 跳转到详情
        this.handleNavigateToDetail = (post_id) => {
            // 1. 首先为了防止重复点击
            if (!this.canNavigate)
                return;
            this.canNavigate = false;
            const { HomePageContentList } = this.props;
            this.props.dispatch({
                type: REQUEST_POST_DETAIL,
                payload: { post_id }
            });
            // 2. 确认现有的帖子里面有没有数据
            const isDataExist = HomePageContentList.data.findIndex(ele => ele.post_id == post_id) > -1;
            this.props.navigation.navigate('OnePost', {
                post_id,
                isDataExist,
                isCommunity: true
            });
        };
        this.renderFooter = () => {
            const { params } = this.props.navigation.state;
            // 如果 params 不是 undefined，就是查看未读消息
            // 查看未读消息是不渲染 footer 的
            if (this.is_read != undefined) {
                return null;
            }
            return (React.createElement(ThrottledTouchableOpacity, { style: styles.touchableFooterView, onPress: this.handleLoadMoreMessage },
                React.createElement(Text, { style: styles.touchableFooterText }, I18n.t('community.load_more_messages'))));
        };
        const { params } = props.navigation.state;
        // 0 是未读，1 是已读，undefined 是全部
        this.is_read = params == undefined ? undefined : params.is_read;
        this.state = {
            data: [],
            isAll: false,
            refreshing: true
        };
        props.navigation.addListener('didFocus', () => {
            this.canNavigate = true;
        });
    }
    componentDidMount() {
        this.loadData(this.page);
    }
    // 获取消息列表
    loadData(page) {
        const body = {
            page,
            is_read: this.is_read // 0 是未读，1 是已读，undefined 是全部
        };
        requestWithBody('/message/unread', body, (res) => {
            const { code, data } = res;
            this.setState({ refreshing: false });
            if (code === '0') {
                if (data.page == 1) {
                    // 说明是第一页
                    this.setState({ data: data.rows });
                }
                else {
                    this.setState({
                        data: [...this.state.data, ...data.rows]
                    });
                }
                if (data.rows && data.rows.length < 8) {
                    this.setState({ isAll: false });
                }
                this.page = data.page + 1;
                this.is_read = undefined;
            }
        });
    }
    getPostDetail(callback) { }
    render() {
        const { refreshing, data } = this.state;
        return (React.createElement(View, { style: { flex: 1, backgroundColor: '#f5f5f9' } },
            React.createElement(FlatList, { data: data, ListEmptyComponent: refreshing ? null : renderEmpty, renderItem: ({ item }) => (React.createElement(MessageListItem, { data: item, onclick: this.handleNavigateToDetail })), ListFooterComponent: this.renderFooter(), keyExtractor: item => item.reply_id.toString(), style: { flex: 1 }, refreshing: refreshing })));
    }
}
MessageList.displayName = 'MessageList';
MessageList.navigationOptions = navigationOptions;
function mapStateToProps(state) {
    const { HomePageContentList } = state.CommunityPostState;
    const { postsData } = state.communityState;
    return { postsData, HomePageContentList };
}
export default connect(mapStateToProps)(MessageList);
const styles = StyleSheet.create({
    touchableFooterView: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#E1E1E1'
    },
    touchableFooterText: {
        color: '#999999',
        fontSize: 10,
        padding: 20,
        textAlign: 'center'
    }
});
