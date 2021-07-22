import { AlarmBoxWrapper } from './styled-components';

export default {
    name: 'AlarmBox',
    props: {
        data: {
            type: Object,
            required: true,
            validator(d) {
                return 'level' in d && 'name' in d && 'time' in d;
            },
        },
        messageFormatter: {
            type: Function,
            default: a => JSON.stringify(a),
        },
    },
    methods: {
        onClickAlarm() {
            this.$emit('click');
        },
    },
    render() {
        const { name, time, level } = this.data;
        return (
            <AlarmBoxWrapper
                class="alarm-box"
                onClick={this.onClickAlarm}
                normal={level === 'normal'}
                warning={level === 'warning'}
                fatal={level === 'fatal'}
            >
                <span class="name-badge">{name}</span>
                <div class="message">{this.messageFormatter(this.data)}</div>
                <div class="timestamp">{time}</div>
            </AlarmBoxWrapper>
        );
    },
};
