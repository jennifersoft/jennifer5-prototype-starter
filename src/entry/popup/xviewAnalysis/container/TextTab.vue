<template>
    <div class="text-tab">
        <textarea
            ref="textarea"
            :style="{ width: `${mainWidth}px`, height: `${mainHeight}px` }"
            :value="profileText"
            wrap="off"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            readonly
        ></textarea>
    </div>
</template>

<script>
import { mapState as baseMapState } from '../store/base';
import { mapState, mapMutations } from '../store/text';

export default {
    computed: {
        ...baseMapState({
            mainWidth: state => state.mainWidth - 32,
            mainHeight: state => state.mainHeight - 36,
        }),
        ...mapState({
            profileText: state => state.profileText,
            profileNo: state => state.profileNo,
        }),
    },
    watch: {
        profileNo(newVal) {
            if (!newVal) return;
            this.selectProfile(newVal);
        },
    },
    methods: {
        ...mapMutations(['updateProfileNo']),
        selectProfile(profileNo) {
            const textarea = this.$refs.textarea;
            const text = textarea.value;
            const profile = '[' + profileNo + ']';
            const nextProfile =
                '[' + this.pad(parseInt(profileNo) + 1, profileNo.length) + ']';
            const lines = text.split('\n');
            let top = 0;
            let size = 0;

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith(profile)) {
                    top = i * 14;
                    size = lines[i].length;
                    break;
                }
            }

            if (top > 0) {
                let start = text.indexOf(profile),
                    end = text.indexOf(nextProfile);
                textarea.focus();
                textarea.setSelectionRange(
                    start,
                    end == -1 ? start + size : end
                );
                textarea.scrollTop = top;
            }

            this.updateProfileNo('');
        },
        pad(n, width) {
            n = n + '';
            return n.length >= width
                ? n
                : new Array(width - n.length + 1).join('0') + n;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../style/PlainText.scss';

.text-tab {
    @include plain-text;
}
</style>
