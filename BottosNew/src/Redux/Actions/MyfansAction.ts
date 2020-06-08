import * as MyfansConstants from '../Constants/MyfansConstants'

export const myfansList = (fansList:Array<object>) => {
    return {
        type: MyfansConstants.MYFANS_LIST,
        fansList
    }
}

export const upmyfansList = (upfans:Array<object>) =>{
    return {
        type:MyfansConstants.UPDATE_MYFANS_LIST,
        upfans
    }
}

export const ADD_FANS = (member_id: number) =>{
    return {
        type:MyfansConstants.ADD_FANS,
        member_id
    }
}

export const CANCEL_FANS = (member_id: number) =>{
    return {
        type:MyfansConstants.CANCEL_FANS,
        member_id
    }
}