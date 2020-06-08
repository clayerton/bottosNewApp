import React from 'react';
import { Image, StyleSheet } from 'react-native';
function GroupLevel({ group_level_source = null, style }) {
    if (group_level_source == null) {
        return null;
    }
    else {
        return React.createElement(Image, { style: [styles.group_level_img, style], source: group_level_source });
    }
}
const styles = StyleSheet.create({
    group_level_img: {
        width: 16,
        height: 16,
        position: 'absolute',
        bottom: 2,
        right: 2,
    }
});
export default GroupLevel;
