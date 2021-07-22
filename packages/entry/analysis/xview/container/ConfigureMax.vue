<template>
    <div class="configure-max" :class="{ editable: editable }">
        <tooltip :message="i18n.configureMax" :position="'top-center'">
            <div
                class="input-max-value"
                contenteditable="true"
                @keydown.enter.prevent="changeMax"
                v-click-outside="changeMax"
                ref="maxInput"
                @click="editable = true"
                v-html="axisMax"
            ></div>
        </tooltip>
    </div>
</template>

<script>
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import { XViewChartKeywordInObserver } from '@common/ObserverKeyword';
import { Observer } from '@common/legacy/Observer';
import clickOutside from '@vuejs/directive/clickOutside';

export default {
    name: 'ConfigureMax',
    inject: ['i18n'],
    components: {
        Tooltip,
    },
    directives: {
        clickOutside,
    },

    data() {
        return {
            axisMax: 8000,
            editable: false,
        };
    },
    methods: {
        changeMax(e) {
            const maxValue = parseInt(this.$refs.maxInput.innerText.trim());
            this.editable = false;
            if (isNaN(maxValue) === false) {
                this.axisMax = maxValue;
                Observer.emit(
                    XViewChartKeywordInObserver.CHANGE_Y_AXIS_MAX_VALUE_FROM_VUE,
                    [this.axisMax]
                );
            }
        },
    },
    mounted() {
        Observer.on(
            XViewChartKeywordInObserver.CHANGE_Y_AXIS_MAX_VALUE_FROM_EVENT_LISTENER,
            axisMax => {
                this.axisMax = axisMax;
            }
        );
    },
};
</script>
<style lang="scss">
@import '~@vuejs/component/themes.scss';
.configure-max {
    position: absolute;
    z-index: 100;
    height: 16px;
    font-size: 11px;
    transform: translate(0, -50%);
    text-align: center;
    border-radius: 8px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    .input-max-value {
        outline: none;
    }

    @include themify($themes) {
        background: themed('topbar-background-color');
        color: themed('typography-color-grey1');
        border: solid 1px themed('tab-border-bottom-color');

        &:not(.editable):hover {
            background-color: themed('topbar-shadow-color');
        }
        &.editable {
            height: 30px;
            font-size: 12px;
            border-radius: 3px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2),
                0 2px 8px 0 rgba(0, 0, 0, 0.1);
            background-color: themed('topbar-background-color');

            .tooltip-balloon {
                display: none;
            }
        }
    }
}
</style>
