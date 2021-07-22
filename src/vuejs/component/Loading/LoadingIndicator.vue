<template>
    <div
        class="aries-loading-indicator"
        :style="cssValues"
    >
        <div class="indicator"></div>
    </div>
</template>

<script>
export default {
    name: 'LoadingIndicator',
    props: {
        //시안에 있는 컬러는 1가지, 나중을 위해 props로 처리.
        //https://zpl.io/bJrpNq3
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
            return ret;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.aries-loading-indicator {
    position: absolute;
    z-index: 20;
    top: 0;
    left: 0;
    right: 0;
    height: var(--indicator-height, 2px);
    width: 100%;
    box-sizing: border-box;
    background-color: var(--indicator-color, #8652ff);
    @keyframes loading-animation {
        0% {
            transform: translate(-50%, 0) scaleX(0);
        }
        25% {
            transform: translate(-25%, 0) scaleX(0.25);
        }
        50% {
            transform: translate(0%, 0) scaleX(0.5);
        }
        75% {
            transform: translate(25%, 0) scaleX(0.25);
        }
        100% {
            transform: translate(50%, 0) scaleX(0);
        }
    }

    animation: loading-animation 2s infinite linear;
}
</style>
