<template>
    <div class="folder">
        <div class="left">
            <span v-if="targetName !== ''">
                {{ i18n.target }} :
                <strong>{{ targetName }}</strong>
            </span>
            <span>
                {{ i18n.searchTerm }} : {{ searchTimeText }} ({{
                    startHourText
                }}~{{ endHourText }})
            </span>
            <span> {{ i18n.interval }} : {{ intervalTypeText }} </span>
        </div>
        <div class="right">
            <btn
                :items="[{ iconType: iconType }]"
                class="border-none"
                normal
                :tooltip-options="foldBtnTooltip"
                @click="onClickFoldBtn"
            ></btn>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { getDayjs, serverDateFormat } from '@common/base';
import { mapState, mapMutations } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        Btn,
    },
    computed: {
        ...mapState({
            targetName: state => state.targetName,
            searchTime: state => state.searchTime,
            period: state => state.period,
            startHourText: state =>
                state.startHour < 10
                    ? `0${state.startHour}`
                    : `${state.startHour}`,
            endHourText: state =>
                state.endHour < 10 ? `0${state.endHour}` : `${state.endHour}`,
            intervalType: state => state.intervalType,
            toolbarFold: state => state.toolbarFold,
        }),
        iconType() {
            return this.toolbarFold ? ICON_TYPE.arrowDown : ICON_TYPE.arrowUp;
        },
        searchTimeText() {
            const startDate = getDayjs(this.searchTime);
            if (this.period === 1) {
                return `${startDate.format(serverDateFormat.short)}`;
            } else {
                const endDate = startDate
                    .clone()
                    .add(this.period, 'day')
                    .subtract(1, 'ms');
                return `${startDate.format(
                    serverDateFormat.short
                )} ~ ${endDate.format(serverDateFormat.short)}`;
            }
        },
        intervalTypeText() {
            return `${this.intervalType}${this.i18n.minute}`;
        },
        foldBtnTooltip() {
            return {
                message: this.toolbarFold
                    ? this.i18n.viewSmaller
                    : this.i18n.viewLarger,
            };
        },
    },
    methods: {
        ...mapMutations(['changeToolbarFold']),
        onClickFoldBtn() {
            this.changeToolbarFold(!this.toolbarFold);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.folder {
    @include themify($themes) {
        display: flex;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid themed('folder-border-color');
        padding-bottom: 10px;

        > div {
            flex: 1;
            &.left {
                font-size: 14px;
                color: themed('folder-font-color');
                > span {
                    margin-right: 24px;
                }
            }
            &.right {
                text-align: right;
            }
        }
    }
}
</style>
