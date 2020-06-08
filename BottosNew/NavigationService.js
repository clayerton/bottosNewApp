// NavigationService.js

import { NavigationActions } from 'react-navigation';
import throttle from 'lodash-es/throttle'

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            type: NavigationActions.NAVIGATE,
            routeName,
            params,
        })
    );
}

/**
 * 这个函数返回的是一个函数
 * @param {number} wait 等待时间，默认 1000ms 最多执行一次
 */
export function throttledNavigate(wait = 1000) {
    return throttle(navigate, wait)
}

// add other navigation functions that you need and export them

export default {
    navigate,
    setTopLevelNavigator,
    throttledNavigate,
};