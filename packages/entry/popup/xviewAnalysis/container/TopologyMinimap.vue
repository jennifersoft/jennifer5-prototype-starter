<template>
    <div class="topology-minimap">
        <div class="contents">
            <btn normal
                class="border-none"
                :items="[
                    {
                        iconType: topologyIcons.fullScreen,
                    },
                ]"
                @click="() => $emit('active-topology', true)"
            />
            <topology-chart
                :data="transactionRows"
                :minimap="true"
                :size="{ width: 230, height: 170 }"
            ></topology-chart>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import TopologyChart from '../component/TopologyChart';
import { mapState as baseMapState } from '../store/base';

export default {
    components: {
        Btn,
        TopologyChart,
    },
    computed: {
        ...baseMapState({
            transactionRows: state => state.transactionRows,
        }),
    },
    data() {
        return {
            topologyIcons: {
                fullScreen: ICON_TYPE.fullScreen,
            },
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

@keyframes fadeIn {
    from {
        opacity: 0.4;
    }
    to {
        opacity: 1;
    }
}

.topology-minimap {
    @include themify($themes) {
        position: absolute;
        right: 24px;
        bottom: 24px;
        width: 236px;
        height: 178px;
        border-radius: 8px;
        box-shadow: 0 4px 8px 3px rgba(0, 0, 0, 0.08),
            0 1px 3px 0 rgba(0, 0, 0, 0.2);
        background-color: themed('topology-minimap-background-color');
        opacity: 0.4;

        &:hover {
            animation: fadeIn 0.5s 0s 1 linear alternate;
            opacity: 1;
        }

        > .contents {
            position: relative;
            width: 100%;
            height: 100%;

            &:hover {
                > ::v-deep .aries-ui-btn {
                    opacity: 1;
                }
            }

            > ::v-deep .aries-ui-btn {
                position: absolute;
                right: 5px;
                top: 5px;
                z-index: 1;
                opacity: 0;
            }
        }
    }
}
</style>
