export default {
    props: {
        small: Boolean,
        normal: Boolean,
        large: Boolean,
    },
    computed: {
        size() {
            return this.small ? 'small' : this.large ? 'large' : 'normal';
        },
    },
};
