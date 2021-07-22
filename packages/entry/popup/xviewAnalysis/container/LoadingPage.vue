<template>
    <div class="loading-page">
        <div class="layer">
            <div class="top">
                <circle-loading
                    :percent="loadingPercent"
                    v-if="useProgress"
                ></circle-loading>
                <div class="bar-loading" v-else>
                    <loading-indicator></loading-indicator>
                </div>
            </div>
            <div class="title">{{ i18n.M0627 }}</div>

            <template v-if="useProgress">
                <div class="detail" v-html="i18n.M0628"></div>
                <div class="tool">
                    <btn
                        large
                        :items="[{ text: i18n.M0629 }]"
                        @click="hideLoadingPage"
                    />
                </div>
            </template>
            <template v-else>
                <div class="detail" v-html="i18n.M0636"></div>
            </template>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import LoadingIndicator from '@vuejs/component/Loading/LoadingIndicator';
import CircleLoading from '../component/CircleLoading';
import {
    mapState as baseMapState,
    mapMutations as baseMapMutations,
} from '../store/base';

export default {
    inject: {
        i18n: {
            default: {
                M0627: 'M0627',
                M0628: 'M0628',
                M0629: 'M0629',
                M0636: 'M0636',
            },
        },
    },
    components: {
        CircleLoading,
        Btn,
        LoadingIndicator,
    },
    computed: {
        ...baseMapState({
            loadingPercent: state => state.loadingPercent,
            useProgress: state => state.guid === '',
        }),
    },
    methods: {
        ...baseMapMutations(['hideLoadingPage']),
    },
};
</script>

<style lang="scss" scoped>
@import '../style/LoadingPage.scss';
.loading-page {
    @include loading-page;

    .bar-loading {
        height: 150px;
    }
}
</style>
