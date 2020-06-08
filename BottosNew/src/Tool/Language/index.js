import I18n from 'react-native-i18n';

import en from './en';
import zh from './zh';

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true;

//设置默认语言
I18n.defaultLocale = 'zh';

I18n.translations = {
    // en,
    zh
};

export default I18n;