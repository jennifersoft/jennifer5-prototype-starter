<template>
    <div class="sidebar-with-extra">
        <side-bar
            :logo-path="logoPath"
            :use-userdefine="useUserdefine"
            :use-template="useTemplate"
            :use-document="useDocument"
            :use-board="useBoard"
            :use-management="useManagement"
            :use-notification="useNotification"
        >
        </side-bar>
        <div id="notify-sounds">
            <audio
                v-for="sound in alarmSounds"
                :name="sound.name"
                :data-key="sound.key"
                :key="sound.key"
                muted
            >
                <source
                    v-if="sound.key > 0 && sound.key < 4"
                    :src="`/sound/${sound.name}`"
                    type="audio/mpeg"
                />
                <source
                    v-else
                    :src="`/static/sound/read?name=${sound.name}`"
                    type="audio/mpeg"
                />
            </audio>
        </div>

        <message-layer-when-w-s-close />
        <setting-link-window :url="pageUrl" @close="() => (pageUrl = '')" />
    </div>
</template>

<script>
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import SideBar from '@layout/container/SideBar';
import { mapState, mapMutations, mapActions } from '@layout/vuex';
import MessageVuebus from '@layout/listener/vuebus';
import MessageLayerWhenWSClose from '@layout/component/layer/MessageLayerWhenWSClose';
import SettingLinkWindow from '@layout/container/SettingLinkWindow';

export default {
    inject: ['theme', 'i18n'],
    props: {
        logoPath: {
            type: String,
            required: false,
            default: '/image/logo/jennifer5.svg',
        },
        useUserdefine: {
            type: Boolean,
            required: true,
        },
        useTemplate: {
            type: Boolean,
            required: true,
        },
        useDocument: {
            type: Boolean,
            required: true,
        },
        useBoard: {
            type: Boolean,
            required: true,
        },
        useManagement: {
            type: Boolean,
            required: true,
        },
        useNotification: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        SettingLinkWindow,
        ConfirmWindow,
        MessageLayerWhenWSClose,
        SideBar,
    },
    computed: {
        ...mapState({
            alarmSounds: state => state.alarm.sounds,
        }),
    },
    data() {
        return {
            pageUrl: '',
        };
    },
    methods: {
        ...mapMutations([
            'updateAlarmList',
            'updateNoticeAndSystemEvent',
            'updateMngData',
        ]),
        ...mapActions(['initializeSocket', 'fetchAlarmSounds']),
    },
    async mounted() {
        if (this.useNotification) {
            await this.fetchAlarmSounds();
            this.initializeSocket();

            MessageVuebus.onMessageCallback = param => {
                if (typeof param === 'string') this.pageUrl = param;
                else this.updateMngData(param);
            };
            MessageVuebus.init();
        }
    },
};
</script>

<style lang="scss" scoped>
.app {
    margin-bottom: 20px;
}
</style>
