<template>
    <window
        class="share-url-window"
        :messages="{ apply: i18n.apply, cancel: i18n.cancel }"
        animation-name="fade-down"
        :open-w="520"
        :open-h="420"
        @apply="closeShareUrlWindow"
        @cancel="closeShareUrlWindow"
    >
        <template #subject>
            <div class="window-head">
                {{ i18n.shareMessage }}
            </div>
        </template>
        <div>
            <div class="url-n-btn">
                <input-field small :value="link" :width="360" />
                <btn
                    :items="[{ text: i18n.copy }]"
                    class="border-none size-medium primary outlined"
                    @click="copy"
                />
            </div>
            <div class="comment" v-html="i18n.M0459"></div>
        </div>
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

export default {
    name: 'AdvancedSearchConditionWindow',
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
        };
    },

    methods: {
        ...mapMutations('xviewAnalysis', ['closeShareUrlWindow']),

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
.share-url-window {
    left: calc(50vw - 260px);
    top: calc(40vh - 200px);
    .comment {
        margin-top: 8px;
        padding: 15px 16px 16px;
        border-radius: 4px;
        @include themify($themes) {
            background: themed('comment-background');
        }
    }
    .url-n-btn {
        padding: 2px 9px;
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        @include themify($themes) {
            border: 1px solid themed('url-box-border');
        }
        .input-field-wrapper {
            border: none;
        }
    }
}
</style>
