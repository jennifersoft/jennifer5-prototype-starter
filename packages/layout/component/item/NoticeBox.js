import { NoticeBoxWrapper } from '@layout/component/item/styled-components';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    props: {
        data: {
            type: Object,
            required: true,
            validator(d) {
                return 'subject' in d;
            },
        },
        type: {
            type: String,
            default: 'systemEvent',
            validator(t) {
                return ['systemEvent', 'notice'].includes(t);
            },
        },
    },
    render() {
        const { subject, timestamp = undefined, message = '' } = this.data;
        return (
            <NoticeBoxWrapper
                class="notice-box"
                success={this.type === 'notice'}
                danger={this.type === 'systemEvent'}
            >
                {this.type === 'notice' && (
                    <SvgIcon
                        iconType={ICON_TYPE.caution3}
                        width={24}
                        height={24}
                        style="color: #1fa558;"
                    />
                )}
                {this.type === 'systemEvent' && (
                    <SvgIcon
                        iconType={ICON_TYPE.caution}
                        width={24}
                        height={24}
                    />
                )}
                {this.type === 'notice' ? (
                    <div class="content">
                        <span class="message">{subject}</span>
                        <span class="timestamp">{timestamp}</span>
                    </div>
                ) : (
                    <div class="content">
                        <span class="message">{subject}</span>
                        <span class="message">{message}</span>
                    </div>
                )}
            </NoticeBoxWrapper>
        );
    },
};
