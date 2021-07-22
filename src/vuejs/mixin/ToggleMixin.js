export default {
    model: {
        prop: 'active',
        event: 'change',
    },
    props: {
        active: Boolean,
        disabled: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: null,
        },
        color: {
            type: String,
            default: undefined,
        },
    },
    computed: {
        activeClass() {
            return this.active ? 'on' : 'off';
        },
        disabledClass() {
            return this.disabled && 'disabled';
        },
        cssValues() {
            const ret = {};
            if (!!this.color) ret['--label-color'] = this.color;
            return ret;
        },
    },
    methods: {
        change() {
            if (!this.disabled) this.$emit('change', !this.active);
        },
    },
};
