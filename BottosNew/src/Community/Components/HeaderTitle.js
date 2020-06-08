import React from 'react';
import { Alert, View } from 'react-native';
import { SearchBar } from 'antd-mobile-rn';
const HeaderTitle = props => {
    clear = () => {
        // console.log('clear--------- ', clear)
    };
    onChange = value => {
        // console.log('onChange---- ', onChange)
    };
    return (React.createElement(View, { style: {
            backgroundColor: '#aac',
            width: 277,
            height: 29,
            borderRadius: 14,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center'
        } },
        React.createElement(SearchBar, { value: 'ddddd', placeholder: "\u641C\u7D22", onSubmit: value => Alert.alert(value), onChange: this.onChange, showCancelButton: false, style: {
                backgroundColor: '#aac',
                width: 277,
                height: 29,
                borderRadius: 14,
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center'
            } })));
};
export default HeaderTitle;
