<template>
    <div class="editor-title">
        <div class="item">
            <span>{{ i18n.domain }}</span>
            <strong>{{ activeDomainGroup }}</strong>
        </div>
        <div class="line"></div>
        <div class="item">
            <span>{{ i18n.operatingTime }}</span>
            <strong>{{ operationTimeText }}</strong>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { i18n } from '@common/utility';

const { mapState } = createNamespacedHelpers('template');

export default {
    data() {
        return {
            i18n: {
                operatingTime: i18n.get('ui.label.operatingTime'),
                domain: i18n.get('ui.label.domain'),
            },
        };
    },
    computed: {
        ...mapState(['buildDay', 'buildTime', 'domainGroupTitle']),
        operationTimeText() {
            const buildDayTokens = this.buildDay.split(',');
            const buildTimeTokens = this.buildTime.split(',');

            if (buildDayTokens[0] == '1') {
                let startHour = parseInt(buildTimeTokens[1]);
                let endHour = parseInt(buildTimeTokens[2]);
                if (startHour < 10) startHour = `0${startHour}`;
                if (endHour < 10) endHour = `0${endHour}`;
                return `${startHour} ~ ${endHour}`;
            } else {
                return '00 ~ 24';
            }
        },
        activeDomainGroup() {
            if (!this.domainGroupTitle) return this.i18n.noChoice;
            return this.domainGroupTitle;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.editor-title {
    @include themify($themes) {
        padding: 0px 24px;
        height: 38px;
        line-height: 38px;
        border-bottom: solid 1px themed('common-border-color');
        > .item {
            display: inline-block;
            color: themed('common-font-color');

            > span {
                font-size: 11px;
                margin-right: 8px;
            }
            > strong {
                font-size: 14px;
            }
        }
        > .line {
            display: inline-block;
            margin: 0px 16px -5px 16px;
            width: 1px;
            height: 20px;
            background-color: themed('common-border-color');
        }
    }
}
</style>
