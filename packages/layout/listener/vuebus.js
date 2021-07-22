import { vuebus } from '@common/base';
import mngMenus from '@entry/mng/menus';

const MessageVuebus = {
    init: function() {
        if (typeof MessageVuebus.onMessageCallback !== 'function') {
            console.warn(
                '[JENNIFER Warning] - 관리화면 메시지 핸들러를 정의해주세요.'
            );
        }
    },
};

vuebus.$on('modal.changeMngUrl', url => {
    const key = url.split('/')[2];
    const menu = mngMenus[key];

    if (!menu) {
        // 새로운 관리화면은 메타정보가 없고, 바로 페이지 변경을 한다.
        if (url.startsWith('/settings#/')) MessageVuebus.onMessageCallback(url);
        else
            console.warn(
                '[JENNIFER Warning] - @entry/mng/menus.js에 관리화면에 대한 메타 정보를 추가하세요.'
            );
        return;
    }

    if (
        !(
            menu.hasOwnProperty('title') &&
            menu.hasOwnProperty('width') &&
            menu.hasOwnProperty('height') &&
            menu.hasOwnProperty('scroll') &&
            menu.hasOwnProperty('useFooter')
        )
    ) {
        console.warn(
            '[JENNIFER Warning] - 관리화면 메타정보에 필수 값이 누락되었습니다.'
        );
        return;
    }

    MessageVuebus.onMessageCallback({
        ...menu,
        url,
        useLoading: true,
    });
});

export default MessageVuebus;
