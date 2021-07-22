<template>
    <div class="except-profile-package">
        <div :class="['top', ignoreClassOrPackages.length === 0 ? 'none' : '']">
            <btn
                small
                icon-first
                :items="[
                    {
                        iconType: iconTypes.add,
                        text: i18n.selectPackageAndClass,
                    },
                ]"
                @click="onToggleMethodTreeWindow"
            ></btn>
            <method-tree-window
                v-if="showMethodTreeWindow"
                :allow-method="false"
                :allow-package="true"
                :open-x="100"
                :open-y="methodTreeWindowTop"
                enable-search-list-type
                @add="addIgnoreClassOrPackages"
                @close="showMethodTreeWindow = false"
            ></method-tree-window>
        </div>
        <div class="bottom" v-if="ignoreClassOrPackages.length > 0">
            <profile-queue
                :items="ignoreClassOrPackages"
                @delete="removeIgnoreClassOrPackages"
            ></profile-queue>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import MethodTreeWindow from '@entry/analysis/methodStacktrace/container/MethodTreeWindow';
import ProfileQueue from '../component/ProfileQueue';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState, mapMutations } from '../store/autoProfile';
import { mapState as isMapState } from '../store/instanceSelector';
import { createNamespacedHelpers } from 'vuex';

const methodTreeStore = createNamespacedHelpers('methodTree');

export default {
    inject: ['i18n'],
    components: {
        Btn,
        ProfileQueue,
        MethodTreeWindow,
    },
    computed: {
        ...mapState(['instanceOid', 'ignoreClassOrPackages']),
        ...isMapState(['domainId']),
        methodTreeWindowTop() {
            return window.innerHeight - 430;
        },
    },
    data() {
        return {
            showMethodTreeWindow: false,
            iconTypes: {
                add: ICON_TYPE.add,
            },
        };
    },
    methods: {
        ...mapMutations([
            'addIgnoreClassOrPackages',
            'removeIgnoreClassOrPackages',
        ]),
        ...methodTreeStore.mapMutations(['updateTargetData']),
        ...methodTreeStore.mapActions(['loadMethodTreeNodes']),
        async onToggleMethodTreeWindow() {
            if (!this.showMethodTreeWindow) {
                this.updateTargetData({
                    domainId: this.domainId,
                    instanceOid: this.instanceOid,
                });
                await this.loadMethodTreeNodes();
            }

            this.showMethodTreeWindow = !this.showMethodTreeWindow;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.except-profile-package {
    @include themify($themes) {
        border: 1px solid themed('common-border-color');
        border-radius: 4px;
        > .top {
            display: flex;
            padding: 8px;
            &:not(.none) {
                border-bottom: 1px solid themed('common-border-color');
            }
            ::v-deep .search-input-wrapper {
                margin-right: 8px;
            }
        }
        > .bottom {
            padding: 16px;
            max-height: 230px;
            overflow-y: auto;
        }
    }
}
</style>
