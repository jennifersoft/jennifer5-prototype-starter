<template>
    <transition-group
        name="queue"
        class="search-condition-queue-wrapper"
        tag="div"
    >
        <div
            v-for="(item, index) in list"
            class="queue-item"
            @mouseover="onMouseover(index)"
            @mouseleave="onMouseleave"
            :key="item.key"
            :title="formatter(item)"
        >
            <span class="format-text">{{ formatter(item) }}</span>
            <btn
                v-if="hoverIndex === index"
                :tooltip-options="{
                    message: i18n.delete,
                    position: 'top-center',
                }"
                :items="[{ iconType: closeIcon }]"
                @click="$emit('delete-row', { item, index })"
            />
        </div>
    </transition-group>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    name: 'SearchConditionQueue',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                delete: 'delete',
            }),
        },
    },
    components: { Btn },
    props: {
        list: {
            type: Array,
            default: () => [],
            validator(list) {
                // NOTICE: 각 key들은 고유해야 함. ex) 생성 시점의 Date.now()
                return list.every(e => e.key !== undefined);
            }
        },
        formatter: {
            type: Function,
            default: item => item.toString(),
        }
    },
    data() {
        return {
            hoverIndex: -1,
        };
    },
    methods: {
        onMouseover(i) {
            this.hoverIndex = i;
        },
        onMouseleave() {
            this.hoverIndex = -1;
        },
    },
    created() {
        this.closeIcon = ICON_TYPE.close;
    },
};
</script>

<style lang="scss" scoped>
@import "~@vuejs/transition/queueing.scss";
@include queueing;

@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        border-color: #e8e8e8,
        behaviors-hover-color: rgba(0, 0, 0, 0.05),
        typography-color-primary: #212121,
        item-shadow-color: rgba(0, 0, 0, 0.05),
    ),
    dark: (
        border-color: #4e4e4e,
        behaviors-hover-color: rgba(255, 255, 255, 0.05),
        typography-color-primary: #e8e8e8,
        item-shadow-color: rgba(0, 0, 0, 0.3),
    ),
);
.search-condition-queue-wrapper {
    box-sizing: border-box;
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    @include themify($themes) {
        .queue-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            line-height: 16px;
            padding: 12px 8px 12px 16px;
            border: 1px solid themed('border-color');
            border-radius: 3px;
            &:hover {
                background: themed('behaviors-hover-color');
                box-shadow: 0 1px 2px 0 themed('item-shadow-color');
            }
            &:not(:last-child) {
                margin-bottom: 4px;
            }
            .format-text {
                cursor: default;
                color: themed('typography-color-primary');
                padding-right: 12px;
                width: calc(100% - 60px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .aries-ui-btn {
                margin: -6px 0;
            }
        }
    }
}
</style>
