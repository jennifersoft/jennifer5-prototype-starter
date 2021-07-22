<template>
    <div class="db-search-wrapper">
        <tab
            class="db-search-navigator"
            :tabs="tabs"
            :active-tab="pageType"
            :delay="200"
            @change="onTabChange" />
        <keep-alive>
            <db-metrics v-if="pageType === 'metrics'" />
            <db-event v-else-if="pageType === 'event'" />
            <db-error v-else-if="pageType === 'error'" />
            <db-service v-else-if="pageType === 'service'" />
            <db-conn-pool v-else-if="pageType === 'connPool'" />
            <db-disk v-else-if="pageType === 'disk'" />
        </keep-alive>
    </div>
</template>

<script>
import Tab from '@vuejs/component/tab/Tab';
import DbMetrics from "@entry/analysis/dbmetrics/metrics/App";
import DbEvent from "@entry/analysis/dbmetrics/event/App";
import DbError from "@entry/analysis/dbmetrics/error/App";
import DbService from "@entry/analysis/dbmetrics/service/App";
import DbConnPool from "@entry/analysis/dbmetrics/connpool/App";
import DbDisk from "@entry/analysis/dbmetrics/disk/App";

export default {
    name: 'App',
    components: {
        Tab,
        DbMetrics,
        DbError,
        DbEvent,
        DbService,
        DbConnPool,
        DbDisk,
    },
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: {
                dbmetrics: 'dbmetrics',
                dbevent: 'dbevent',
                dberror: 'dberror',
                dbservice: 'dbservice',
                dbconnpool: 'dbconnpool',
                dbdisk: 'dbdisk',
            }
        }
    },
    props: {
        pageType: {
            type: String,
            validator(t) {
                return ['metrics', 'event', 'error', 'service', 'connPool', 'disk'].includes(t);
            }
        }
    },
    methods: {
        onTabChange(key) {
            this.$emit('update-page', key);
        },
    },
    created() {
        this.tabs = [
            { key: 'metrics', value: this.i18n.dbmetrics },
            { key: 'event', value: this.i18n.dbevent },
            { key: 'error', value: this.i18n.dberror },
            { key: 'service', value: this.i18n.dbservice },
            { key: 'connPool', value: this.i18n.dbconnpool },
            { key: 'disk', value: this.i18n.dbdisk },
        ];
    },
};
</script>

<style lang="scss" scoped>
.db-search-wrapper {
    height: calc(100% - 65px);
}
</style>
