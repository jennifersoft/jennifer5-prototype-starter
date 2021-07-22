<template>
    <div class="socket">
        <popup-title :title="i18n.socket"></popup-title>

        <div class="popup-top">
            <div class="title">
                <span>{{ time }}</span>
                <span
                    >{{ i18n.localPort }} (<strong>{{ localPort }}</strong
                    >)</span
                >
                <span
                    >{{ i18n.remoteIpAddress }} (<strong>{{ host }}</strong
                    >)</span
                >
                <span
                    >{{ i18n.remotePort }} (<strong>{{ port }}</strong
                    >)</span
                >
            </div>
        </div>

        <div class="popup-line"></div>

        <div class="popup-body">
            <pre v-for="stack in stackTraces" v-html="stack"></pre>
        </div>
    </div>
</template>

<script>
import PopupTitle from '@entry/popup/activeService/component/PopupTitle';
import { mapState, mapActions } from './vuex';

export default {
    inject: ['i18n'],
    components: {
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
        socketKey: {
            type: Number,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        localPort: {
            type: Number,
            required: true,
        },
        host: {
            type: String,
            required: true,
        },
        port: {
            type: Number,
            required: true,
        },
    },
    computed: {
        ...mapState({
            stackTraces: state => state.stackTraces,
        }),
    },
    methods: {
        ...mapActions(['loadSocketDetail']),
    },
    created() {
        this.loadSocketDetail({
            domainId: this.domainId,
            instanceOid: this.instanceOid,
            socketKey: this.socketKey,
        });
    },
};
</script>

<style lang="scss" scoped>
@import 'themes.scss';

.socket {
    padding: 18px 24px;

    .popup-top {
        display: flex;

        .title {
            flex: 1;
            font-size: 14px;
            > span {
                margin-right: 10px;
            }
        }
    }

    @include themify($themes) {
        .popup-line {
            background: themed('popup-line-border-color');
            height: 1px;
            margin: 16px 0;
        }
    }
}
</style>
