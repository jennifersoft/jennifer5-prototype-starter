<template>
    <div class="tool-bar">
        <div class="left">
            <btn
                :disabled="!useServiceDump"
                :items="[{ text: i18n.serviceDump }]"
                @click="onClickServiceDumpBtn"
            ></btn>
        </div>
        <div class="right">
            <auto-refresh
                :interval="10000"
                @run="loadActiveServiceList"
            ></auto-refresh>
        </div>

        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import AlertWindow from '@vuejs/component/window/AlertWindow';
import Btn from '@vuejs/component/button/Btn';
import AutoRefresh from '../component/AutoRefresh';
import { getDomainAndInstanceInfo } from '../utility';
import { mapState, mapActions } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        AlertWindow,
        Btn,
        AutoRefresh,
    },
    computed: {
        ...mapState({
            useServiceDump: state => state.useServiceDump,
        }),
    },
    methods: {
        ...mapActions(['loadActiveServiceList', 'createServiceDump']),
        onClickServiceDumpBtn() {
            const { instanceOids } = getDomainAndInstanceInfo();
            const tokens = instanceOids[0].split('/');
            const params = {
                sid: parseInt(tokens[1]),
                agent: parseInt(tokens[3]),
            };

            this.createServiceDump(params).then(() => {
                const url = `/analysis/servicedump?sid=${params.sid}&oid=${params.agent}`;
                if (opener) opener.location.href = url;
                else location.href = url;
                this.alertMessage = this.i18n.M0050;
            });
        },
    },
    data() {
        return {
            alertMessage: '',
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.tool-bar {
    @include themify($themes) {
        display: flex;
        margin-top: 8px;
        padding: 8px;
        border-radius: 4px;
        border: solid 1px themed('tool-bar-border-color');
        background-color: themed('tool-bar-background-color');

        > * {
            flex: 1;
        }
        > .right {
            text-align: right;
        }
    }
}
</style>
