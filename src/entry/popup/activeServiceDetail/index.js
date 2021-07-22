import Vue from 'vue';
import App from '@entry/popup/activeServiceDetail/App';
import CircleLoading from '@entry/popup/xviewAnalysis/component/CircleLoading';
import { i18n } from '@common/utility';
import axios from '@library/axios';
import '../base.scss';

function createFormForXViewPopup(
    startTime,
    endTime,
    groupType,
    groupRows,
    transactionIds,
    chartKey = '',
    chartFilter = '',
    instanceOids = '{}',
    transactionCount = 0,
    searchType = '',
    searchName = '',
    dataMode = '',
    transactionRows = '[]'
) {
    const appendChildToForm = (target, _name, _value) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `<input type="hidden" name="${_name}" value="${_value}">`;
        target.appendChild(wrapper.firstChild);
    };

    const _frm = document.getElementById('_frm');

    if (_frm.hasChildNodes()) _frm.innerHTML = ''; // remove all children

    appendChildToForm(_frm, 'startTime', startTime);
    appendChildToForm(_frm, 'endTime', endTime);
    appendChildToForm(_frm, 'transactionIds', transactionIds);
    appendChildToForm(_frm, 'groupRows', groupRows);
    appendChildToForm(_frm, 'chartKey', chartKey);
    appendChildToForm(_frm, 'chartFilter', chartFilter);
    appendChildToForm(_frm, 'instanceOids', instanceOids);
    appendChildToForm(_frm, 'transactionCount', transactionCount);
    appendChildToForm(_frm, 'searchType', searchType);
    appendChildToForm(_frm, 'searchName', searchName);
    appendChildToForm(_frm, 'dataMode', dataMode);
    appendChildToForm(_frm, 'transactionRows', transactionRows);

    return _frm;
}

new Vue({
    el: '#vue-mount',
    provide: {
        theme: ariesuser.theme,
        i18n: {
            pageTitle: i18n.get('ui.title.activeServiceDetail'),
            thread: i18n.get('ui.label.thread'),
            application: i18n.get('ui.label.application'),
            httpMethod: i18n.get('ui.label.http.method'),
            httpQuery: i18n.get('ui.label.http.query'),
            callTime: i18n.get('ui.label.startTime'),
            performTime: i18n.get('ui.label.performTime'),
            sec: i18n.get('ui.label.sec'),
            cpuTime: i18n.get('ui.label.cpuTime'),
            sqlWithTxCount: i18n.get('ui.label.sqlWithTxCount'),
            sqlWithTxTime: i18n.get('ui.label.sqlWithTxTime'),
            runningSql: i18n.get('ui.label.runningSql'),
            advancedFilterSQLParam: i18n.get('ui.label.advancedFilterSQLParam'),
            runningExternalCall: i18n.get('ui.label.runningExternalCall'),
            fetchedCount: i18n.get('ui.label.fetchedCount'),
            threadState: i18n.get('ui.label.threadState'),
            userId: i18n.get('ui.label.userId'),
            guid: i18n.get('ui.label.guid'),
            browser: i18n.get('ui.label.browser'),
            stacktrace: i18n.get('ui.label.stacktrace'),
            clientIp: i18n.get('ui.label.clientIp'),
            activeServiceEnd: i18n.get('ui.label.activeServiceEnd'),
            M0285: i18n.get('M0285'),
            activeProfile: i18n.get('ui.label.profile.active'),
            interrupt: i18n.get('ui.label.interrupt'),
            shareToTalk: i18n.get('ui.button.shareToTalk'),
            threadPriority: i18n.get('ui.label.threadPriority'),
            agentPause: i18n.get('ui.label.agent.pause'),
            play: i18n.get('ui.label.play'),
            stop: i18n.get('ui.label.stop'),
            watchProfilePopup: i18n.get('ui.label.watchProfilePopup'),
            watchSharedProfile: i18n.get('ui.label.watchSharedProfile'),
            M0378: i18n.get('M0378'),
            apply: i18n.get('ui.button.confirm'),
            cancel: i18n.get('ui.button.cancel'),
            confirmMessage: i18n.get('ui.label.confirmMessage'),
            M0443: i18n.get('M0443'),
            alertMessage: i18n.get('ui.label.alertMessage'),
            M0037: i18n.get('M0037'),
            help: i18n.get('ui.label.help'),
            M0633: i18n.get('M0633'),
            end: i18n.get('ui.label.end'),
            batchCount: i18n.get('ui.label.batchCount'),
            batchTime: i18n.get('ui.label.batchTime'),
            txid: i18n.get('ui.label.txid'),
            asyncCallerId: i18n.get('ui.label.asyncCallerId'),
        },
    },
    components: { App, CircleLoading },
    filters: {
        parseNumber: time => parseInt(time),
    },
    data() {
        return {
            isChanged: false,
            loading: 1,
            profileText: '',
            activeProfileTerminated: false,
            threadUncontrollable: false,
        };
    },
    methods: {
        async _activeProfile({ sid, session, thread, txid, stime, etime }) {
            const { data } = await axios.get(
                '/activeService/detail/activeProfile',
                {
                    params: {
                        sid,
                        session,
                        thread,
                        txid,
                        stime,
                        etime,
                    },
                }
            );

            if (data.active) {
                this.profileText = data.text.substring(2);
            } else {
                this.activeProfileTerminated = true;
            }
        },
        async _interrupt({ sid, session, thread, txid }) {
            const { data } = await axios.get(
                '/activeService/detail/interrupt',
                {
                    params: {
                        sid,
                        session,
                        thread,
                        txid,
                    },
                }
            );
            if (!data.result) {
                this.threadUncontrollable = true;
            }
        },
        async _suspend({ sid, session, thread, txid }) {
            if (this.isChanged) return;

            this.isChanged = true;
            this.loading = 0;

            const { data } = await axios.get('/activeService/detail/suspend', {
                params: {
                    sid,
                    session,
                    thread,
                    txid,
                },
            });
            if (!data.result) {
                this.threadUncontrollable = true;
            } else {
                this.isChanged = false;
            }

            this.loading = 1;
        },
        async _resume({ sid, session, thread, txid }) {
            if (this.isChanged) return;

            this.isChanged = true;
            this.loading = 0;

            const { data } = await axios.get('/activeService/detail/resume', {
                params: {
                    sid,
                    session,
                    thread,
                    txid,
                },
            });
            if (!data.result) {
                this.threadUncontrollable = true;
            } else {
                this.isChanged = false;
            }

            this.loading = 1;
        },
        async _threadkill({ sid, session, thread, txid }) {
            const { data } = await axios.get(
                '/activeService/detail/threadkill',
                {
                    params: {
                        sid,
                        session,
                        thread,
                        txid,
                    },
                }
            );
            if (!data.result) {
                this.threadUncontrollable = true;
            }

            location.reload();
        },
        _redirect({ sid, txid, stime, etime }) {
            const transactionIds = { [sid]: [txid] };
            const form = createFormForXViewPopup(
                stime,
                etime,
                '',
                '[]',
                JSON.stringify(transactionIds).replace(/\"/g, '&quot;')
            );

            form.submit();
        },
    },
});
