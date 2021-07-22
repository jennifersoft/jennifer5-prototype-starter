<template>
    <div class="method-stacktrace">
        <div class="popup-top">
            <div class="title">{{ methodName }}</div>
        </div>

        <div class="popup-line"></div>

        <div class="popup-body">
            <pre v-html="stackTrace"></pre>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from './vuex';

export default {
    props: {
        domainId: {
            type: Number,
            required: true,
        },
        instanceOid: {
            type: Number,
            required: true,
        },
        methodKey: {
            type: Number,
            required: true,
        },
        methodName: {
            type: String,
            required: true,
        },
    },
    computed: {
        ...mapState({
            stackTrace: state => state.stackTrace,
        }),
    },
    methods: {
        ...mapActions(['loadMethodStacktrace']),
    },
    created() {
        this.loadMethodStacktrace({
            domainId: this.domainId,
            instanceOid: this.instanceOid,
            methodKey: this.methodKey,
        });
    },
};
</script>

<style lang="scss" scoped>
@import 'themes.scss';

.method-stacktrace {
    padding: 18px 24px;

    .popup-top {
        display: flex;

        .title {
            flex: 1;
            font-size: 14px;
            font-weight: bold;
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
