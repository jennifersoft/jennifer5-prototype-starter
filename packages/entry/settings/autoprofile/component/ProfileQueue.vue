<template>
    <div class="profile-queue">
        <div
            v-for="(item, index) in items"
            class="queue-item"
            @mouseover="onMouseover(index)"
            @mouseleave="onMouseleave"
        >
            <span class="target-text">{{ item }}</span>

            <!-- TODO: 에이전트가 준비되면 활성화하기 -->
            <div class="button-group" v-if="hoverIndex === index && false">
                <btn
                    :tooltip-options="{
                        message: iconMessage,
                        position: 'center-left',
                    }"
                    :items="[{ iconType: iconType }]"
                    @click="removeRow(item)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    inject: ['i18n'],
    components: { Btn },
    props: {
        items: {
            type: Array,
            required: true,
        },
        useDeleteBtn: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    computed: {
        iconMessage() {
            return this.i18n[this.useDeleteBtn ? 'delete' : 'except'];
        },
        iconType() {
            return this.useDeleteBtn ? ICON_TYPE.close : ICON_TYPE.remove;
        },
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
        removeRow(item) {
            this.$emit(this.useDeleteBtn ? 'delete' : 'except', item);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.profile-queue {
    overflow-y: auto;
    overflow-x: hidden;

    @include themify($themes) {
        .queue-item {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            cursor: pointer;
            box-sizing: border-box;
            line-height: 16px;
            padding: 12px 8px;
            border: 1px solid themed('profile-queue-border-color');
            border-radius: 3px;

            &:hover {
                background: themed('profile-queue-behaviors-hover-color');
                box-shadow: 0 1px 2px 0
                    themed('profile-queue-item-shadow-color');
            }
            &:not(:last-child) {
                margin-bottom: 4px;
            }

            .target-text {
                color: themed('profile-queue-typography-color-primary');
                padding-right: 5px;
            }

            .button-group {
                position: absolute;
                right: 10px;
                z-index: 10;

                .aries-ui-btn {
                    margin: -6px 0;
                    ::v-deep .item {
                        background: themed('profile-queue-btn-bg-color');
                    }
                }
            }
        }
    }
}
</style>
