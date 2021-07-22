import $ from '@library/jquery';
import axios from '@library/axios';
import { createNamespacedHelpers } from 'vuex';
import { createFormData } from '@common/utility';
import { GetProfileResultCodeDef, OTypeDef } from '@common/definition';
import {
    TAB_KEYS,
    STORAGE_KEYS,
    MAIN_PADDING,
    DETAIL_MARGIN_TOP,
} from '../constant';
import { setItem, getItem } from '../storage';
import { convertTableData } from '../utility';

export const NAMESPACE = 'xviewAnalysis';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

export const state = {
    // 매개변수 - topology 또는 guid일 경우
    dataMode: '',

    // 매개변수 공통
    startTime: -1,
    endTime: -1,

    // 매개변수 - 일반적인 XView 차트에서 드래그해서 접근했을 경우
    transactionIds: {},
    chartKey: '',
    chartFilter: '',

    // 매개변수 - XView 분석에서 애플리케이션/GUID/UserId 그룹탭에서 접근했을 경우
    groupType: '',
    groupRows: [],

    // 매개변수 - 애플리케이션 현황 분석에서 접근했을 경우
    instanceOids: [],
    transactionCount: 0,
    searchType: '',
    searchName: '',
    isFailed: false,

    // 매개변수 - guid만으로 조회할 경우
    guid: '',

    // 매개변수 or 동적으로 채워주는 상태
    transactionRows: [],

    // 선택된 트랜잭션 변수
    transactionRow: null,
    transactionIndex: -1,

    // 트랜잭션 선택시 하위 컴포넌트 리-렌더링
    activeTab: TAB_KEYS.TIMELINE,
    tabSequence: 1,
    tabLoading: false,

    // 프로파일 자동 검색
    profileAutoSearch: getItem(STORAGE_KEYS.PROFILE_AUTO_SEARCH, true, Boolean),

    // 메인 컨텐츠 영역 크기 (트랜잭션 테이블, 차트, 콜-트리 등등)
    mainWidth: 0,
    mainHeight: 0,
    distHeight: 0, // 추가 높이 (트랜잭션 테이블 높이가 최대값 보다 낮을 경우)

    // 하위탭 상태 변수
    existGuid: false,
    existLink: false,
    existJenniferFront: false,
    profileStatus: GetProfileResultCodeDef.SEARCHED_ALL,
    socketCount: 0,
    fileCount: 0,
    messageCount: 0,
    stacktraceCount: 0,
    errorCount: 0,
    asyncCount: 0,
    cicsCount: 0,
    // 하위탭 상태 변수 (커스텀)
    customLogCount: 0,

    // 트랜잭션 로딩 상태 (-1은 완료 상태)
    loadingPercent: -1,
    loadingPageHidden: false,
};

export const mutations = {
    loadParameters(state, payload) {
        state.dataMode = payload.dataMode;
        state.startTime = payload.startTime;
        state.endTime = payload.endTime;
        state.transactionIds = payload.transactionIds;
        state.chartKey = payload.chartKey;
        state.chartFilter = payload.chartFilter;
        state.groupType = payload.groupType;
        state.groupRows = payload.groupRows;
        state.instanceOids = payload.instanceOids;
        state.transactionCount = payload.transactionCount;
        state.searchType = payload.searchType;
        state.searchName = payload.searchName;
        state.isFailed = payload.isFailed;
        state.guid = payload.guid;
    },
    updateTransactionRows(state, rows) {
        state.transactionRows = rows;
    },
    updateTransactionIds(state, ids) {
        state.transactionIds = ids;
    },
    selectTransactionRow(state, payload) {
        state.transactionRow = payload.data;
        state.transactionIndex = payload.index;
        state.tabSequence += 1; // 탭 변경이 아닌 로우 선택시에도 하위 컨테이터 리-렌더링을 위한 키 값
    },
    updateExistGuidAndLink(state, payload) {
        state.existGuid = payload.guid;
        state.existLink = payload.link;
    },
    updateExistJenniferFront(state, active) {
        state.existJenniferFront = active;
    },
    updateProfileStatus(state, payload) {
        state.profileStatus = payload.profileStatus;
        state.socketCount = payload.socketCount;
        state.fileCount = payload.fileCount;
        state.messageCount = payload.messageCount;
        state.stacktraceCount = payload.stacktraceCount;
        state.errorCount = payload.errorCount;
        state.asyncCount = payload.asyncCount;
        state.cicsCount = payload.cicsCount;
        state.customLogCount = payload.customLogCount;
    },

    changeActiveTab(state, tab) {
        state.activeTab = tab;
    },
    updateTabLoading(state, active) {
        state.tabLoading = active;
    },

    toggleProfileAutoSearch(state) {
        state.profileAutoSearch = !state.profileAutoSearch;
        setItem(STORAGE_KEYS.PROFILE_AUTO_SEARCH, state.profileAutoSearch);
    },
    calculateMainSize(state) {
        const SIDE = state.groupType !== '' ? 300 : 0;
        state.mainWidth = window.innerWidth - MAIN_PADDING - SIDE;
        state.mainHeight =
            window.innerHeight - DETAIL_MARGIN_TOP + state.distHeight;
    },
    updateDistHeight(state, distHeight) {
        state.distHeight = distHeight;
    },

    updateTransactionCount(state, count) {
        state.transactionCount = count;
    },
    updateLoadingPercent(state, percent) {
        state.loadingPercent = percent > 100 ? 100 : percent;
    },
    hideLoadingPage(state) {
        state.loadingPageHidden = true;
    },
};

export const actions = {
    async loadTransactionRows({ commit, state }) {
        const isSearch = state.searchType !== '' && state.searchName !== '';

        let rows = [];
        let payload = {
            stime: state.startTime,
            etime: state.endTime,
            txidsBySid: JSON.stringify(state.transactionIds),
        };

        if (isSearch) {
            payload.oidsBySid = JSON.stringify(state.instanceOids);
            payload.otype = OTypeDef.SYSTEM;
            if (state.searchType === 'application')
                payload.applicationName = state.searchName;
            else if (state.searchType === 'sql')
                payload.sqlName = state.searchName;
            else payload.externalCallName = state.searchName;
        }

        async function run(sessionMap) {
            if (sessionMap == null) {
                commit('updateLoadingPercent', 0);

                const { data } = await axios.post(
                    isSearch
                        ? '/xview/find/pointList/condition/key'
                        : '/xview/find/pointList/multiDomain/key',
                    createFormData(payload)
                );

                await run(data);
            } else {
                const sids = [],
                    keys = [];

                for (let key in sessionMap) {
                    sids.push(key);
                    keys.push(sessionMap[key]);
                }

                const { data } = await axios.post(
                    isSearch
                        ? '/xview/find/pointList/condition/data'
                        : '/xview/find/pointList/multiDomain/data',
                    createFormData(
                        isSearch
                            ? {
                                  sids: sids,
                                  keys: keys,
                                  isFailed: state.isFailed,
                              }
                            : {
                                  sids: sids,
                                  keys: keys,
                              }
                    )
                );

                // 데이터 불변 객체로 병합하기
                // 불변 객체로 병합하면 안됨. 메모리 소모가 너무 심함.
                data.dataList.forEach(row => {
                    rows.push(convertTableData(row));
                });

                // 조회가 끝난 세션 제거하기
                data.completedSids.forEach(exceptSid => {
                    delete sessionMap[exceptSid];
                });

                const isLast = Object.keys(sessionMap).length == 0;
                if (state.loadingPageHidden || isLast) {
                    // 로딩 화면에서 조회 멈춤 버튼을 눌렀거나 조회가 끝났을 때
                    commit('updateTransactionRows', rows);
                    commit('updateLoadingPercent', -1);
                } else {
                    commit(
                        'updateLoadingPercent',
                        (rows.length / state.transactionCount) * 100
                    );
                    await run(sessionMap);
                }
            }
        }

        await run(null);

        return rows;
    },

    async loadProfileStatus({ commit, state, getters }) {
        const {
            errCode,
            cicsGeneralCpuTime,
            cicsJavaCpuTime,
            asyncCallerId,
        } = state.transactionRow;

        const config = {
            params: getters.transactionToProfileSearchParams,
        };

        const [res1, res2, res3, resCustom] = await Promise.all([
            axios.get('/xview/remainingDataCount', config),
            axios.get('/xview/errorAndStackCount', config),
            axios.get('/xview/profile/timeline', config),
            axios.get('/api-v2/configuration'),
        ]);

        const payload = {
            profileStatus: res3.data.resultCode,
            socketCount: res1.data.socketCount,
            fileCount: res1.data.fileCount,
            messageCount: res1.data.messageCount,
            stacktraceCount: res2.data.stackCount,
            errorCount: res2.data.errorCount,
            asyncCount: asyncCallerId !== '-1' && asyncCallerId !== '0' ? 1 : 0, // txid 문자열
            cicsCount:
                cicsGeneralCpuTime !== -1 && cicsJavaCpuTime !== -1 ? 1 : 0,
            customLogCount: resCustom.data.thirdPartyLogEnabled ? 1 : 0,
        };

        commit('updateProfileStatus', payload);
    },
    async loadGuidAndLinkStatus({ commit, getters }) {
        const { data } = await axios.get('/xview/find/pointList/all/exist', {
            params: getters.transactionToProfileSearchParams,
        }); // data.guid_status가 false면 guid 데이터 유실 상태

        commit('updateExistGuidAndLink', data);
    },
    async loadJenniferFrontStatus({ commit, state }) {
        const methodName = 'updateExistJenniferFront';
        const {
            jenniferFrontAppId,
            jenniferFrontPageLoadId,
        } = state.transactionRow;

        if (jenniferFrontAppId !== '' && jenniferFrontPageLoadId !== '') {
            // JSONP 호출로 인해 실행하는 함수 선언
            window.pong = function() {};

            $.ajax({
                timeout: 1000,
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://front.jennifersoft.com/ping',
                cache: false,
                statusCode: {
                    200: () => {
                        commit(methodName, true);
                    },
                },
            }).fail(() => {
                commit(methodName, false);
            });
        } else {
            // JSONP 호출로 인해 실행하는 함수 제거
            delete window['pong'];
            commit(methodName, false);
        }
    },
    async getSherpaOracleURL({ state }, payload) {
        const {
            sherpaOracleInstanceName,
            sherpaOracleSequence,
            sherpaOracleServerConfig,
            sherpaOracleGuid,
        } = payload;

        const { sid, txid, collectionTime } = state.transactionRow;

        if (sherpaOracleServerConfig !== '') {
            if (sherpaOracleInstanceName !== '') {
                const params = {
                    type:
                        location.pathname == '/popup/activeService'
                            ? 'sessionDetail'
                            : 'sqlDetail',
                    name: sherpaOracleInstanceName,
                };

                if (sherpaOracleServerConfig == 'sherpaOracle') {
                    params.domainId = sid;
                    params.txid = txid;
                    params.time = collectionTime;
                    params.seq = sherpaOracleSequence;
                } else if (sherpaOracleServerConfig == 'loupeon') {
                    params.guid = sherpaOracleGuid;
                }

                if (
                    (sherpaOracleServerConfig == 'sherpaOracle' &&
                        sherpaOracleSequence !== -1) ||
                    (sherpaOracleServerConfig == 'loupeon' &&
                        sherpaOracleGuid !== null)
                ) {
                    const { data } = await axios.post(
                        '/anotherService/' + sherpaOracleServerConfig,
                        createFormData(params)
                    );

                    return data;
                }
            }
        }

        return null;
    },

    async downloadProfileAll({}, rows) {
        const body = rows.map(row => {
            return [row.sid, row.collectionTime, row.txid];
        });

        await axios.post('/api-v2/my-background-job/profile-text-export', body);
    },

    async searchGuidTransactionRows({ commit, state }) {
        commit('updateLoadingPercent', 25);

        const { data } = await axios.get('/xview/find/pointList/guid/only', {
            params: {
                guid: state.guid,
                stime: state.startTime,
                etime: state.endTime,
            },
        });

        commit('updateLoadingPercent', -1);

        return data;
    },

    selectTransactionRow({ dispatch, commit }, row) {
        commit('selectTransactionRow', row);
        dispatch('loadProfileStatus');
        dispatch('loadGuidAndLinkStatus');
        dispatch('loadJenniferFrontStatus');
    },
    selectGroupRow({ commit, state }, index) {
        const transactionIds = state.groupRows[index].transactionIds;
        let transactionCount = 0;

        Object.keys(transactionIds).forEach(domainId => {
            transactionCount += transactionIds[domainId].length;
        });

        commit('selectTransactionRow', {
            data: null,
            index: -1,
        });
        commit('updateTransactionCount', transactionCount);
        commit('updateTransactionIds', {
            ...transactionIds,
        });
    },
};

export const getters = {
    transactionToProfileSearchParams: state => {
        const {
            sid,
            sysOid,
            elapsedTime,
            collectionTime,
            txid,
            asyncCallerId,
        } = state.transactionRow;

        return {
            format: 'json',
            sid: sid,
            oid: sysOid,
            stime: collectionTime - elapsedTime,
            etime: collectionTime,
            txid: txid,
            asyncCallerId: asyncCallerId,
        };
    },
};
