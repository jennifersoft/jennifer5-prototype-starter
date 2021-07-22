export default {
    namespaced: true,
    state: {
        isOpenLayer: false,
        dashboardMenus: [],
        realtimeMenus: [],
        userdefinedMenus: [],
        searchByText: '',
        orderBy: 'updatedTime',
        selectedViewGroup: 'viewMyGroup',
        userGroupId: undefined,
        deleteDashboardKey: undefined,
    },
    mutations: {
        setSearchByText(state, text) {
            state.searchByText = text;
        },
        toggleLayer(state) {
            state.isOpenLayer = !state.isOpenLayer;
        },

        setSelectedViewGroup(state, type) {
            state.selectedViewGroup = type;
        },

        setOrderByCondition(state, condition) {
            state.orderBy = condition;
        },

        setGroupId(state, groupId) {
            state.userGroupId = groupId;
        },

        setDashboardMenus(
            state,
            { dashboardMenus, realtimeMenus, userdefinedMenus }
        ) {
            state.dashboardMenus = dashboardMenus;
            state.realtimeMenus = realtimeMenus;
            state.userdefinedMenus = userdefinedMenus;
        },

        setUserdefinedMenus(state, userdefinedMenus) {
            state.userdefinedMenus = userdefinedMenus;
        },
        setDeleteDashboardKey(state, deleteDashboardKey) {
            state.deleteDashboardKey = deleteDashboardKey;
        },

        removeUserDefinedMenu(state, dashboardKey) {
            const removeIndex = state.userdefinedMenus.findIndex(
                menu => menu.key === dashboardKey
            );
            state.userdefinedMenus.splice(removeIndex, 1);
        },
    },
    getters: {
        isShowDeleteConfirmWindow: state => {
            return state.deleteDashboardKey !== undefined;
        },
        isShowContents: state => menus => {
            return (
                (state.searchByText !== '' && menus.length > 0) ||
                state.searchByText === ''
            );
        },
        noDataToShow: (state, getters) => {
            return (
                !getters.isShowContents(getters.dashboardMenusByFilter) &&
                !getters.isShowContents(getters.realtimeMenusByFilter) &&
                !getters.isShowContents(getters.userdefinedMenusByFilter)
            );
        },
        userdefinedMenusByGroup: state => {
            return state.selectedViewGroup === 'viewMyGroup'
                ? state.userdefinedMenus.filter(
                      menu => menu.groupId === state.userGroupId
                  )
                : state.userdefinedMenus;
        },

        dashboardMenusByFilter: (state, getters) => {
            return state.searchByText?.trim() !== ''
                ? state.dashboardMenus.filter(
                      menu =>
                          menu.title
                              .toLowerCase()
                              .indexOf(state.searchByText.toLowerCase()) >= 0
                  )
                : state.dashboardMenus;
        },

        realtimeMenusByFilter: state => {
            return state.searchByText?.trim() !== ''
                ? state.realtimeMenus.filter(
                      menu =>
                          menu.title
                              .toLowerCase()
                              .indexOf(state.searchByText.toLowerCase()) >= 0
                  )
                : state.realtimeMenus;
        },

        userdefinedMenusByFilter: (state, getters) => {
            const userdefinedMenusByGroup =
                state.searchByText?.trim() !== ''
                    ? getters.userdefinedMenusByGroup.filter(
                          menu =>
                              menu.title
                                  .toLowerCase()
                                  .indexOf(state.searchByText.toLowerCase()) >=
                              0
                      )
                    : getters.userdefinedMenusByGroup;

            if (state.orderBy === 'updatedTime') {
                userdefinedMenusByGroup.sort(
                    (a, b) =>
                        (b.lastUpdatedTime ?? 0) - (a.lastUpdatedTime ?? 0)
                );
            } else if (state.orderBy === 'name') {
                userdefinedMenusByGroup.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
            }

            return userdefinedMenusByGroup;
        },
    },
    actions: {},
};
