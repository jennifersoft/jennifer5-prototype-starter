export default {
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        progress: {
            type: Number,
            default: 1,
            validator(p) {
                return p >= 0 && p <= 1;
            },
        },
        suspendible: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            stopActive: false,
        };
    },
    methods: {
        onMouseover() {
            if (!this.suspendible) return;
            this.stopActive = true;
        },
        onMouseleave() {
            if (!this.suspendible) return;
            this.stopActive = false;
        },
        onClickSearch() {
            this.stopActive = false;
            this.$emit('search');
        },
        onClickStopSearch() {
            if (!this.suspendible) return;
            this.$emit('stop-search');
        },
    },
};
