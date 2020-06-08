import * as MyfansConstants from '../Constants/MyfansConstants';
export const myfansList = (fansList) => {
    return {
        type: MyfansConstants.MYFANS_LIST,
        fansList
    };
};
export const upmyfansList = (upfans) => {
    return {
        type: MyfansConstants.UPDATE_MYFANS_LIST,
        upfans
    };
};
export const ADD_FANS = (member_id) => {
    return {
        type: MyfansConstants.ADD_FANS,
        member_id
    };
};
export const CANCEL_FANS = (member_id) => {
    return {
        type: MyfansConstants.CANCEL_FANS,
        member_id
    };
};
