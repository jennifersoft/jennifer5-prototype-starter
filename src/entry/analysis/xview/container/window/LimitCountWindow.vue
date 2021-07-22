<template>
    <window
        class="limit-count-window"
        :messages="{ apply: i18n.confirm, cancel: i18n.cancel }"
        :hide-cancel-btn="true"
        animation-name="fade-down"
        :open-w="520"
        :open-h="160"
        @apply="closeLimitCountWindow"
        @cancel="closeLimitCountWindow"
    >
        <template #subject>
            <div class="window-head">
                X-View
            </div>
        </template>
        <div>{{ MAX_XVIEW_UNIT_COUNT }}{{ i18n.M0190 }}</div>
    </window>
</template>

<script>
import { createFormData, i18n } from '@common/utility';
import Window from '@vuejs/component/window/Window';
import InputField from '@vuejs/component/Input/InputField';
import { mapMutations, mapState } from 'vuex';
import axios from 'axios';
import Btn from '@vuejs/component/button/Btn';
import { JWTTypeDef } from '@common/definition';

import { MAX_XVIEW_UNIT_COUNT } from '@entry/analysis/xview/transaction';

export default {
    inject: {
        i18n,
        theme: {
            type: String,
            default: 'classic',
        },
    },
    components: {
        Window,
        Btn,
        InputField,
    },
    data() {
        return {
            link: undefined,
            MAX_XVIEW_UNIT_COUNT: MAX_XVIEW_UNIT_COUNT,
        };
    },

    methods: {
        ...mapMutations('xviewAnalysis', ['closeLimitCountWindow']),

        async makeURL() {
            const url = `/popup/xviewSearch?layout=iframe&domain_ids=${this.domainIds}&start_time=${this.startTime}&end_time=${this.endTime}`;

            const { data } = await axios.post(
                `/auth/token/create`,
                createFormData({
                    tokenType: JWTTypeDef.SHARE_URL,
                    memo: this.i18n.xviewSearch,
                    url: url,
                })
            );

            //data.exist 값은 무시, 기존에 생성 되었거나 아니거나 둘다 동일한 메세지
            this.link = location.origin + '/login/redirect?token=' + data.key;
        },
        copy() {
            const input = document.querySelector(
                '.share-url-window .url-n-btn input'
            );
            input.select();
            document.execCommand('copy');
        },
    },
    computed: {
        ...mapState('xviewAnalysis', {
            domainIds: state => Object.keys(state.searchedCondition.oidList),
            startTime: state => state.searchedCondition.time.start.valueOf(),
            endTime: state => state.searchedCondition.time.end.valueOf(),
        }),
    },
    mounted() {
        this.makeURL();
    },
    beforeMount() {
        this.popupOffset = {
            x: 500,
            y: 210,
        };
    },
};
</script>
<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        url-box-border: #e8e8e8,
        comment-background: #f6f6f6,
    ),
    dark: (
        url-box-border: #4e4e4e,
        comment-background: #222,
    ),
);
.limit-count-window {
    position: absolute;
    left: calc(50% - 260px);
    top: calc(40% - 100px);
}
</style>
