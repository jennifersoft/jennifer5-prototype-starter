<template>
    <div class="active-score">
        <div class="graph">
            <div class="fatal"><i></i> {{ fatal | numberFormat }}</div>
            <div class="warn"><i></i> {{ warn | numberFormat }}</div>
            <div class="info"><i></i> {{ info | numberFormat }}</div>
            <div class="normal"><i></i> {{ normal | numberFormat }}</div>
        </div>
        <div class="total">
            {{ i18n.total }} <strong>{{ total | numberFormat }}</strong>
        </div>
    </div>
</template>

<script>
export default {
    inject: ['i18n'],
    props: {
        fatal: {
            type: Number,
            required: false,
            default: 0,
        },
        warn: {
            type: Number,
            required: false,
            default: 0,
        },
        info: {
            type: Number,
            required: false,
            default: 0,
        },
        normal: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    computed: {
        total() {
            return this.fatal + this.warn + this.info + this.normal;
        },
    },
    filters: {
        numberFormat(val) {
            return val.toLocaleForAries();
        },
    },
};
</script>

<style lang="scss" scoped>
@import './themes.scss';
@import '../../style/active-score-cell.scss';

.active-score {
    @include themify($themes) {
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        font-weight: 500;
        color: themed('active-score-font-color');

        > * {
            display: inline-block;
        }
        > .graph {
            > div {
                display: inline-block;
                margin-right: 12px;

                > i {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 8px;
                    margin-right: 3px;
                }

                &.fatal > i {
                    background-color: themed(
                        'active-score-fatal-background-color'
                    );
                }

                &.warn > i {
                    background-color: themed(
                        'active-score-warn-background-color'
                    );
                }

                &.info > i {
                    background-color: themed(
                        'active-score-info-background-color'
                    );
                }

                &.normal > i {
                    background-color: themed(
                        'active-score-normal-background-color'
                    );
                }
            }
        }
        > .total {
            > strong {
                margin-left: 2px;
                color: themed('active-score-total-font-color');
            }
        }
    }
}
</style>
