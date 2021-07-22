<template>
    <div class="popup-title">
        <div class="left">{{ title }}</div>
        <div class="right">
            <btn v-if="link !== ''"
                :items="[{ iconType: helpIcon }]"
                 class="transparent"
                 @click="onClickHelpBtn"
                 normal />
        </div>
    </div>
</template>

<script>
import { hashManual } from '@common/utility';
import Btn from "@vuejs/component/button/Btn";
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    components: {
        Btn,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: false,
            default: '',
        },
    },
    data() {
        return {
            helpIcon: ICON_TYPE.help,
        };
    },
    methods: {
        onClickHelpBtn() {
            hashManual(this.link);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.popup-title {
    @include themify($themes) {
        display: flex;
        margin-bottom: 24px;

        > * {
            flex: 1;
        }

        > .left {
            font-size: 16px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            color: themed('top-bar-title-font-color');
        }

        > .right {
            .help-link {
                cursor: pointer;
            }

            text-align: right;
            color: themed('top-bar-help-icon-color');
            margin: -8px -8px 0 0;
        }
    }
}
</style>
