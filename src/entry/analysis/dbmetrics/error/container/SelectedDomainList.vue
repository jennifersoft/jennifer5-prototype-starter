<template>
    <div class="selected-domain-list">
        <div class="selector-container">
            <resource-selector
                @resource-change="resourceChangeHandler"
                @tab-change="tabChangeHandler"
                :tab="resourceType"
                :no-border="false"
                :resources="resources"
                ref="resourceSelector"
                class="resource-selector"
            />
            <error-type-selector
                class="error-type-selector"
                ref="errorTypeSelector"
                @change="updateErrorTypes"
            />
        </div>
        <div class="selector-footer">
            <loading-btn :progress="progress"
                         :disabled="!isSelectionValid"
                         :suspendible="suspendible"
                         @search="$emit('search')"
                         @stop-search="updateLoading(false)" />
        </div>
    </div>
</template>

<script>
import ResourceSelector from '@vuejs/component/Resource/ResourceSelector/ResourceSelector';
import MetricSelector from '@vuejs/component/Resource/MetricSelector/MetricSelector';
import LoadingBtn from "@vuejs/component/button/LoadingBtn";
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { Business, Instance } from '@service/oidConfig';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import ErrorTypeSelector from '@entry/analysis/dbmetrics/error/component/ErrorTypeSelector';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import {mapState, mapMutations, mapActions, mapGetters, mapRootGetters} from '../store';

export default {
    name: 'SelectedDomainList',
    components: {
        ErrorTypeSelector,
        SvgIcon,
        ResourceSelector,
        MetricSelector,
        LoadingBtn,
    },
    data() {
        return {
            ICON_TYPE,
            resources: [
                { resourceType: 'domain', tree: [] },
                { resourceType: 'instance', tree: [] },
                { resourceType: 'business', tree: [] },
            ],
        };
    },
    watch: {
        startTime(newVal, prev) {
            if (newVal !== prev) {
                setTimeout(this.fetchResource, 100);
                this.$refs.errorTypeSelector.unselectAll();
            }
        },
        endTime(newVal, prev) {
            if (newVal !== prev) {
                setTimeout(this.fetchResource, 100);
                this.$refs.errorTypeSelector.unselectAll();
            }
        },
        sidList(next, prev) {
            if (next !== prev) {
                this.fetchResource();
                this.$refs.errorTypeSelector.unselectAll();
            }
        },
    },
    computed: {
        ...mapState({
            searchType: state => state.searchType,
            startTime: state => state.timeFilter.start.valueOf(),
            endTime: state => state.timeFilter.end.valueOf(),
            progress: state => state.progress,
            resourceType: state => state.resourceType,
        }),
        ...mapGetters(['isSelectionValid']),
        ...mapRootGetters(['sidList']),
        suspendible() {
            return this.searchType === 'list';
        }
    },
    methods: {
        ...mapMutations([
            'updateResourceType',
            'updateResources',
            'updateErrorTypes',
            'updateLoading',
        ]),
        tabChangeHandler(tab) {
            this.updateResourceType(tab);
            this.$refs.errorTypeSelector.unselectAll();
        },
        resourceChangeHandler({ resourceType, tree }) {
            let grouped = {};
            const checked = tree.filter(t => {
                if (this.resourceType === 'domain') {
                    return t.check === 'on';
                }
                return t.data.oid !== -1 && t.check === 'on';
            });

            const sids = tree
                .filter(t => {
                    return t.data.oid === -1 && t.check === 'on';
                })
                .map(t => t.data.sid);
            sids.forEach(s => {
                grouped[s] = [];
            });

            checked.forEach(c => {
                grouped[c.data.sid] = [];
            });
            checked.forEach(c => {
                let id = c.data.oid;
                if (this.resourceType === 'domain') {
                    id = 0;
                }
                if (grouped.hasOwnProperty(c.data.sid)) {
                    grouped[c.data.sid].push(id);
                } else {
                    grouped[c.data.sid] = [id];
                }
            });

            this.updateResources(grouped);
            this.updateResourceType(resourceType);
        },
        async fetchResource() {
            const { sidList, startTime, endTime } = this;

            return Promise.all([
                Instance.get(sidList, startTime, endTime).then(res => {
                    const n = normalizeOidConfigResponse(res, 'instance').map(
                        n => ({
                            ...n,
                            check: 'off',
                        })
                    );
                    const domainNotClickable = n.map(l => {
                        if (l.resourceType === 'domain') {
                            return {
                                ...l,
                                noInteraction: true,
                            };
                        }
                        return l;
                    });
                    this.$set(this.resources, 1, {
                        resourceType: 'instance',
                        tree: Array.from(domainNotClickable),
                    });

                    const domains = n
                        .filter(d => {
                            return d.resourceType === 'domain';
                        })
                        .map(n => ({
                            ...n,
                            fold: 'no-fold',
                            noFoldPadding: true,
                            check: 'off',
                        }));
                    this.$set(this.resources, 0, {
                        resourceType: 'domain',
                        tree: domains,
                    });
                }),
                Business.get(sidList, startTime, endTime).then(res => {
                    const n = normalizeOidConfigResponse(res, 'business')
                        .map(n => ({
                            ...n,
                            check: 'off',
                        }))
                        .map(l => {
                            if (l.resourceType === 'domain') {
                                return {
                                    ...l,
                                    noInteraction: true,
                                };
                            }
                            return l;
                        });
                    this.$set(this.resources, 2, {
                        resourceType: 'business',
                        tree: Array.from(n),
                    });
                }),
            ]);
        },
    },
    async mounted() {
        await this.fetchResource();
    },
};
</script>

<style lang="scss" scoped>
@mixin theme($border-color) {
    border: 1px solid $border-color;
    border-radius: 5px;
    .selector-container {
        display: flex;
        height: 256px;
        padding: 16px;
        box-sizing: border-box;
        .resource-selector {
            margin-right: 10px;
        }
        .aries-ui-btn {
            margin: auto 10px;
        }
        .resource-selector,
        .error-type-selector {
            box-sizing: border-box;
            max-width: 300px;
        }
        .editable-list {
            border: 1px solid $border-color;
            border-radius: 5px;
            height: 100%;
            margin: 0;
            flex-grow: 1;
            list-style: none;
            padding-left: 0;
            .list-item {
                padding: 0 30px 0 10px;
                height: 27px;
                line-height: 27px;
                border-bottom: 1px solid $border-color;
                .icon {
                    cursor: pointer;
                }
            }
        }
    }
    .selector-footer {
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid $border-color;
        padding: 8px;
    }
}

body.classic {
    .selected-domain-list {
        @include theme($border-color: #d9d9d9);
    }
}

body.dark {
    .selected-domain-list {
        @include theme($border-color: #404040);
    }
}
</style>
