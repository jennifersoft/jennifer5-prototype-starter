<template>
    <div class="async-detail-view" :style="style">
        <div class="item" v-for="item in ratedItems">
            <div class="text">{{ item.text }}</div>
            <div class="rate">
                <span
                    class="graph"
                    :style="{ width: `${item.rate}%`, background: item.color }"
                ></span>
            </div>
            <div class="value">{{ item.valueFormat }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        width: {
            type: Number,
            required: false,
            default: 240,
        },
        height: {
            type: Number,
            required: false,
            default: 100,
        },
        left: {
            type: Number,
            required: false,
            default: 0,
        },
        top: {
            type: Number,
            required: false,
            default: 0,
        },
        items: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    computed: {
        style() {
            return {
                width: `${this.width}px`,
                left: `${this.left}px`,
                top: `${this.top}px`,
            };
        },
        ratedItems() {
            const total = this.items.reduce((prev, next) => {
                return prev + next.value;
            }, 0);

            return this.items.map(row => {
                return {
                    rate: ((row.value / total) * 100).toFixed(2),
                    valueFormat: row.value.toLocaleForAries(),
                    ...row,
                };
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import './themes.scss';
.async-detail-view {
    position: absolute;
    z-index: 10000;

    @include themify($themes) {
        margin: 4px 14px 26px 24px;
        padding: 12px;
        border-radius: 3px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2),
            0 2px 8px 0 rgba(0, 0, 0, 0.1);
        background-color: themed('async-detail-view-background-color');

        .item {
            display: flex;
            height: 16px;
            line-height: 16px;
            font-size: 11px;
            color: themed('async-detail-view-font-color');

            *:not(:last-child) {
                margin-bottom: 3px;
            }
            > .text {
                flex: 2;
            }
            > .rate {
                flex: 2;
                > .graph {
                    display: inline-block;
                    height: 8px;
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                }
            }
            > .value {
                flex: 1;
                text-align: right;
            }
        }
    }
}
</style>
