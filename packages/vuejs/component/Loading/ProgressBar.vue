<template>
    <div
            class="aries-progress-bar"
            :style="cssValues"
    >
        <div class="indicator" v-if="progress < 1"></div>
    </div>
</template>

<script>
    export default {
        name: "ProgressBar",
        props: {
            progress: {
                type: Number,
                default: 1,
                validator(p) {
                    return p >= 0 && p <= 1;
                }
            },
            indicatorColor: {
                type: String,
                required: false,
                default: '#8652ff',
            },
            height: {
                type: Number,
                default: 2,
            }
        },
        computed: {
            cssValues() {
                const ret = {};
                ret['--indicator-color'] = this.indicatorColor;
                ret['--indicator-height'] = this.height + 'px';
                ret['--indicator-width'] = this.progress * 100 + '%';
                return ret;
            }
        }
    }
</script>

<style lang="scss" scoped>
.aries-progress-bar {
    height: var(--indicator-height, 2px);
    box-sizing: border-box;
    .indicator {
        transition: width 0.3s;
        height: inherit;
        width: var(--indicator-width);
        background-color: var(--indicator-color);
    }
}
</style>