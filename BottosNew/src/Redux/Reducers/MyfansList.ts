import * as MyfansConstants from '../Constants/MyfansConstants'
import {PostDetail} from "./CommunityReducer";
const initialState = {
    fansListData : [],
    fansListStatus: 'running', // 请求粉丝列表 running success failure
    fansListError: false,
    fansfollowListPageCount: 0,
    fansListPage: 0,
    isFansFollow:false, //false 未关注 true已关注
    cancelFansFollowStatus:'success', //取消关注
    addFansFollowStatus:'success',  //添加关注
    is_follow: false, // false 没有关注  true 已关注
}


function change_fans(fansListData:Array<object>, member_id:number, is_follow:boolean) {
    const index = fansListData.findIndex((ele) => ele.member_id == member_id)
    const targetPostDetail = fansListData[index]
    const newPostDetail = { ...targetPostDetail, is_follow}
    const _fansListData = fansListData.slice(0)
    _fansListData[index] = newPostDetail

    return _fansListData
}

const myfansListState = (state = initialState,action: any)=>{
    switch (action.type) {
        case MyfansConstants.MYFANS_LIST:
            return {
                ...state,
                fansListData: action.fansList
            }
        case MyfansConstants.UPDATE_MYFANS_LIST:
            return {
                ...state,
            }
        case MyfansConstants.ADD_FANS:
             return {
            ...state, fansListData: change_fans(state.fansListData, action.member_id, true)
        }
        case MyfansConstants.CANCEL_FANS:
            return {
                ...state, fansListData: change_fans(state.fansListData, action.member_id, false)
            }
        default:return state
    }
}
export default myfansListState