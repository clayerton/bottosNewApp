import * as MyfansConstants from '../Constants/MyfansConstants';
const initialState = {
    fansListData: [],
    fansListStatus: 'running',
    fansListError: false,
    fansfollowListPageCount: 0,
    fansListPage: 0,
    isFansFollow: false,
    cancelFansFollowStatus: 'success',
    addFansFollowStatus: 'success',
    is_follow: false,
};
function change_fans(fansListData, member_id, is_follow) {
    const index = fansListData.findIndex((ele) => ele.member_id == member_id);
    const targetPostDetail = fansListData[index];
    const newPostDetail = Object.assign({}, targetPostDetail, { is_follow });
    const _fansListData = fansListData.slice(0);
    _fansListData[index] = newPostDetail;
    return _fansListData;
}
const myfansListState = (state = initialState, action) => {
    switch (action.type) {
        case MyfansConstants.MYFANS_LIST:
            return Object.assign({}, state, { fansListData: action.fansList });
        case MyfansConstants.UPDATE_MYFANS_LIST:
            return Object.assign({}, state);
        case MyfansConstants.ADD_FANS:
            return Object.assign({}, state, { fansListData: change_fans(state.fansListData, action.member_id, true) });
        case MyfansConstants.CANCEL_FANS:
            return Object.assign({}, state, { fansListData: change_fans(state.fansListData, action.member_id, false) });
        default: return state;
    }
};
export default myfansListState;
