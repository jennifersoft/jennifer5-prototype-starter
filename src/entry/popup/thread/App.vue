<template>
    <div class="thread">
        <div class="popup-header">
            <span class="header-text">{{ i18n.thread }}</span>
            <div class="header-btn-group">
                <btn :items="buttons"
                     :tooltip-options="{
                        message: i18n.refresh,
                        position: 'bottom-right'
                    }"
                     @click="onClickRefreshBtn"
                     class="transparent"
                     normal />
            </div>
        </div>
        <div class="popup-body">
            <div class="body-title">
                <span>{{ threadName }}</span>
            </div>
            <div class="snippet">
                <pre v-html="stackTrace"></pre>
            </div>
            <div class="config-box">
                <div>{{ i18n.lockName }} = {{ lockName }}</div>
                <div>{{ i18n.blockedTime }} = {{ blockedTime }}</div>
                <div>{{ i18n.blockedCount }} = {{ blockedCount }}</div>
                <div>{{ i18n.threadUserTime }} = {{ threadUserTime }}</div>
                <div>{{ i18n.lockOwnerId }} = {{ lockOwnerId }}</div>
                <div>{{ i18n.waitedCount }} = {{ waitedCount }}</div>
                <div>{{ i18n.waitedTime }} = {{ waitedTime }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import PopupTitle from '@entry/popup/activeService/component/PopupTitle';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState, mapActions } from './vuex';

export default {
    inject: ['i18n'],
    components: {
        Btn,
        PopupTitle,
    },
    props: {
        domainId: {
            type: Number,
            required: true,
        },
        instanceOid: {
            type: Number,
            required: true,
        },
        threadKey: {
            type: Number,
            required: true,
        },
    },
    computed: {
        ...mapState({
            threadName: state => state.threadName,
            stackTrace: state => state.stackTrace,
            lockName: state => state.lockName,
            blockedTime: state => state.blockedTime.toLocaleForAries(),
            blockedCount: state => state.blockedCount.toLocaleForAries(),
            threadUserTime: state => state.threadUserTime.toLocaleForAries(),
            lockOwnerId: state => state.lockOwnerId,
            waitedCount: state => state.waitedCount.toLocaleForAries(),
            waitedTime: state => state.waitedTime.toLocaleForAries(),
        }),
    },
    data() {
        return {
            buttons: [{ iconType: ICON_TYPE.refresh }],
        };
    },
    methods: {
        ...mapActions(['loadThreadDetail']),
        onClickRefreshBtn() {
            this.loadThreadDetail({
                domainId: this.domainId,
                instanceOid: this.instanceOid,
                threadKey: this.threadKey,
            });
        },
    },
    beforeMount() {
        this.onClickRefreshBtn();
    },
};
</script>

<style lang="scss" scoped>
    .thread {
        > .popup-body > .snippet {
            height: 268px;
        }
    }
</style>
