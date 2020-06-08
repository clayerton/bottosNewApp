import React, { Component } from 'react';
import { connect } from 'react-redux';
import { REQUEST_POST_DETAIL } from '../Redux/Actions/ActionsTypes';
import { Text, StyleSheet, View, FlatList, Image, DeviceEventEmitter } from 'react-native';
import { Toast } from 'antd-mobile-rn';
// 自有组件
import PersonalPostsItem from './Components/PersonalPostsItem';
import BTBackButton from '../Tool/View/BTBackButton';
// 方法
import NavStyle from '../Tool/Style/NavStyle';
import I18n from '../Tool/Language';
import { requestWithBody } from '../Tool/NetWork/heightOrderFetch';
import config from '../Tool/Config';
// 当列表为空的时候
const renderEmptyComponent = (React.createElement(View, { style: { flexGrow: 1, margin: '20%' } },
    React.createElement(Image, { style: { width: '100%', maxHeight: 200 }, resizeMode: "contain", source: require('../BTImage/My/my_follow_list_bg.png') }),
    React.createElement(Text, { style: { marginTop: 50, textAlign: 'center' } }, I18n.t('community.noPost'))));
function ListFooter() {
    return (React.createElement(View, { style: styles.touchableFooterView },
        React.createElement(Text, { style: styles.touchableFooterText }, I18n.t('community.loading_wait'))));
}
const navigationOptions = () => {
    return {
        headerLeft: BTBackButton,
        headerTitle: I18n.t('community.Posts'),
        headerRight: React.createElement(View, { style: NavStyle.rightButton })
    };
};
// 这个组件的逻辑：
// 从未读消息进来的时候
// 底部显示 查看更多消息，手动点击触发
// 从消息列表进来的时候
// 显示全部，下拉触发
class PersonalPosts extends Component {
    constructor(props) {
        super(props);
        // 触底加载模块
        this.onEndReached = ({ distanceFromEnd }) => {
            if (this.state.isAll)
                return;
            // 异步回调加载 requestData 帖子总数
            this.loadData(this.page);
        };
        // 点击 跳转到详情
        this.handleNavigateToDetail = (item) => {
            const { navigation, postsData } = this.props;
            const { post_id } = item;
            this.props.dispatch({
                type: REQUEST_POST_DETAIL,
                payload: { post_id }
            });
            const isDataExist = postsData.findIndex(ele => ele.post_id == item.post_id) > -1;
            navigation.navigate('OnePost', { post_id: item.post_id, isDataExist });
        };
        const { params } = props.navigation.state;
        this.mobile = params ? params.mobile : '';
        this.page = 1;
        this.state = {
            data: null,
            isAll: false,
            refreshing: false
        };
    }
    componentDidMount() {
        this.loadData(this.page);
    }
    // 获取消息列表
    loadData(page) {
        const mobile = this.mobile;
        this.setState({ refreshing: true });
        requestWithBody('/post/my', { page, mobile })
            .then((res) => {
            const { code, data } = res;
            if (code === '0') {
                if (data.page == 1) {
                    // 说明是第一页
                    this.setState({ data: data.rows });
                }
                else {
                    const pre_data = this.state.data || [];
                    this.setState({
                        data: [...pre_data, ...data.rows]
                    });
                }
                this.setState({ isAll: data.rows.length < 8 });
                this.page = data.page + 1;
            }
            else if (res.code === '99') {
                DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg);
            }
            else {
                Toast.fail(res.msg, config.ToestTime, undefined, false);
            }
            this.setState({ refreshing: false });
        })
            .catch(() => {
            Toast.offline(I18n.t('tip.offline'), config.ToestTime, undefined, false);
            this.setState({ refreshing: false });
        });
    }
    render() {
        const { data, refreshing, isAll } = this.state;
        if (data == null) {
            return React.createElement(ListFooter, null);
        }
        return (React.createElement(View, { style: { flex: 1, backgroundColor: '#f5f5f9' } },
            React.createElement(FlatList, { data: data, renderItem: ({ item }) => (React.createElement(PersonalPostsItem, { data: item, onclick: item => this.handleNavigateToDetail(item) })), refreshing: refreshing, onEndReached: this.onEndReached, onEndReachedThreshold: 0.2, ListEmptyComponent: renderEmptyComponent, ListFooterComponent: isAll ? null : React.createElement(ListFooter, null), keyExtractor: item => item.post_id.toString(), style: { flex: 1 } })));
    }
}
PersonalPosts.displayName = 'PersonalPosts';
PersonalPosts.navigationOptions = navigationOptions;
function mapStateToProps(state) {
    const { postsData } = state.communityState;
    return { postsData };
}
export default connect(mapStateToProps)(PersonalPosts);
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
