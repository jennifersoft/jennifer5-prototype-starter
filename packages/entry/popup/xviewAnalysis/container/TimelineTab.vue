<template>
    <div class="timeline-tab">
        <timeline-chart
            :data="timelineNodes"
            @active-profile="searchCallTreeProfile"
        ></timeline-chart>
        <div class="br"></div>
        <call-tree
            :key="callTreeSequence"
            @search-profile="searchTextProfile"
        ></call-tree>
    </div>
</template>

<script>
import TimelineChart from '../component/TimelineChart';
import CallTree from './CallTree';
import { mapState as baseMapState } from '../store/base';
import { mapState, mapMutations } from '../store/timeline';

export default {
    components: {
        TimelineChart,
        CallTree,
    },
    computed: {
        ...baseMapState({
            mainWidth: state => state.mainWidth,
            profileAutoSearch: state => state.profileAutoSearch,
        }),
        ...mapState({
            timelineNodes: state => state.timelineNodes,
            callTreeSequence: state => state.callTreeSequence,
        }),
    },
    methods: {
        ...mapMutations(['updateActiveCallTreeNodes']),
        searchCallTreeProfile(payload) {
            if ((payload.ready && this.profileAutoSearch) || !payload.ready) {
                this.updateActiveCallTreeNodes(payload.data);
            } else {
                this.updateActiveCallTreeNodes(null);
            }
        },
        searchTextProfile(no) {
            this.$emit('search-profile', no);
        },
    },
};
</script>

<style lang="scss" scoped>
.timeline-tab {
    > .br {
        margin-top: 24px;
    }
}
</style>
