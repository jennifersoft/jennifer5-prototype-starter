export default {
    data() {
        return {
            focusIndex: 0,
            focusTarget: 'item',
        }
    },
    methods: {
        focusPrev() {
            let prevIndex = this.focusIndex - 1;
            if (prevIndex < 0) prevIndex = this.items.length - 1;

            const prevItem = this.$refs['r'].getElementsByClassName(this.focusTarget)[prevIndex];
            prevItem.focus();
            this.focusIndex = prevIndex;
        },
        focusNext() {
            let nextIndex = this.focusIndex + 1;
            if (nextIndex >= this.items.length) nextIndex = 0;

            const nextItem = this.$refs['r'].getElementsByClassName(this.focusTarget)[nextIndex];
            nextItem.focus();
            this.focusIndex = nextIndex;
        },
        onFocusAscendant() {
            const lastFocused = this.$refs['r'].getElementsByClassName(this.focusTarget)[this.focusIndex];
            lastFocused.focus();
        },
    }
}