<template>
    <div class="tooltip-wrapper" ref="r">
        <div class="tooltip-target" @mouseover="onMouseover" @mouseleave="onMouseleave">
            <slot></slot>
        </div>
        <tooltip-balloon
            v-if="isActive"
            :background-color="backgroundColor"
            :cursor-none="cursorNone"
            :position="position"
            :style="
                tooltipStyle(position, cursorOffset, backgroundColor, width)
            "
            v-html="message"
        >
        </tooltip-balloon>
    </div>
</template>

<script>
import TooltipBalloon from '@vuejs/component/tooltip/TooltipBalloon';

export function tooltipStyle(
    pos,
    offset = 4,
    bg = 'rgba(0, 0, 0, 0.75)',
    width = undefined
) {
    let ret = {
        '--tooltip-background-color': bg,
        '--tooltip-width': width ? width + 'px' : 'max-content',
    };
    const [vert, hori] = pos.split('-');

    if (vert === 'top') ret.bottom = `calc(100% + ${offset}px)`;
    else if (vert === 'bottom') ret.top = `calc(100% + ${offset}px)`;
    else {
        ret.top = '50%';
        ret.transform = 'translateY(-50%)';

        if (hori === 'left') ret.right = `calc(100% + ${offset}px)`;
        else ret.left = `calc(100% + ${offset}px)`;

        return ret;
    }

    if (hori === 'left') ret.left = 0;
    else if (hori === 'right') ret.right = 0;
    else {
        ret.left = '50%';
        ret.transform = 'translateX(-50%)';
    }

    return ret;
}

export default {
    name: 'tooltip',
    components: { TooltipBalloon },
    props: {
        message: {
            type: String,
            required: true,
            default: '',
        },
        offset: {
            type: Number,
            default: 4,
        },
        position: {
            type: String,
            default: 'center-right',
            validator(p) {
                return (
                    [
                        'top-left',
                        'top-center',
                        'top-right',
                        'bottom-left',
                        'bottom-center',
                        'bottom-right',
                        'center-right',
                        'center-left',
                    ].indexOf(p) !== -1
                );
            },
        },
        cursorNone: {
            type: Boolean,
            default: false,
        },
        backgroundColor: {
            type: String,
            default: () => 'rgba(0, 0, 0, 0.75)',
        },
        width: {
            type: Number,
            default: undefined,
        },
        showTooltip: {
            type: Boolean,
            default: undefined, // set on mouseover by default
        },
        delay: {
            type: Number, // ms
            default: undefined, // work if showTooltip is undefined
            validator(d) {
                return d > 0;
            },
        },
    },
    data() {
        return {
            active: false,
            timer: null,
        };
    },
    computed: {
        cursorOffset() {
            return this.cursorNone ? this.offset : this.offset + 4;
        },
        cursorPosition() {
            const [vert, hori] = this.position.split('-');

            if (vert === 'top' || vert === 'bottom') return [vert, hori];
            return hori;
        },
        isActive() {
            return this.showTooltip !== undefined
                ? this.showTooltip
                : this.active;
        },
    },
    watch: {
        active(next) {
            if (next === true && this.delay !== undefined) {
                this.timer = setTimeout(() => {
                    this.active = false;
                    clearTimeout(this.timer);
                }, this.delay);
            }
        },
    },
    methods: {
        onMouseover() {
            this.active = true;
        },
        onMouseleave() {
            if (this.timer) return;
            this.active = false;
        },
    },
    created() {
        this.tooltipStyle = tooltipStyle;
    },
};
</script>

<style lang="scss" scoped>
.tooltip-wrapper {
    display: inline-flex;
    width: max-content;
    position: relative;
    .tooltip-target {
        display: inline-flex;
        align-items: center;
    }
}
</style>
