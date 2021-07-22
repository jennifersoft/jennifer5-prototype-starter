import _ from '@library/lodash';
import jquery from '@library/jquery';
import $ from '@library/jquery';
import { ElementManager } from '@common/legacy/ElementManager';
import { BusinessManager } from '@common/legacy/BusinessManager';
import { getDayjs, serverDateFormat, vuebus } from '@common/base';
import { OTypeDef } from '@common/definition';
import { Observer } from '@common/legacy/Observer';
import { ChartKeywordInObserver } from '@common/ObserverKeyword';

let _currentLoading = false;

function createFormForXViewPopup(
    stime,
    etime,
    groupType = '',
    groupRows = '[]',
    transactionIds = '{}',
    chartKey = '',
    chartFilter = '',
    instanceOids = '{}',
    transactionCount = 0,
    searchType = '',
    searchName = '',
    isFailed = false,
    dataMode = '',
    transactionRows = '[]'
) {
    jquery('#frm').empty();
    jquery('#frm').append(
        "<input type='hidden' name='startTime' value='" + stime + "' />"
    );
    jquery('#frm').append(
        "<input type='hidden' name='endTime' value='" + etime + "' />"
    );
    jquery('#frm').append(
        "<input type='hidden' name='groupType' value='" + groupType + "' />"
    );
    jquery('#frm').append(
        "<input type='hidden' name='groupRows' value='" + groupRows + "' />"
    );

    jquery('#frm').append(
        "<input type='hidden' name='transactionIds' value='" +
            transactionIds +
            "' />"
    );
    jquery('#frm').append(
        "<input type='hidden' name='chartKey' value='" + chartKey + "' />"
    );
    jquery('#frm').append(
        "<input type='hidden' name='chartFilter' value='" + chartFilter + "' />"
    );

    jquery('#frm').append(
        "<input type='hidden' name='instanceOids' value='" +
            instanceOids +
            "' />"
    );
    jquery('#frm').append(
        "<input type='hidden' name='transactionCount' value='" +
            transactionCount +
            "' />"
    );

    // 애플리케이션 현황 분석에서 호출/실패 건수로 진입할 경우
    jquery('#frm').append(
        "<input type='hidden' name='searchType' value='" + searchType + "' />"
    );
    jquery('#frm').append(
        "<input type='hidden' name='searchName' value='" + searchName + "' />"
    );
    jquery('#frm').append(
        "<input type='hidden' name='isFailed' value='" + isFailed + "' />"
    );

    // X-View 분석 그룹 차트에서 진입할 경우
    jquery('#frm').append(
        "<input type='hidden' name='dataMode' value='" + dataMode + "' />"
    );
    jquery('#frm').append(
        "<input type='hidden' name='transactionRows' value='" +
            transactionRows +
            "' />"
    );
}

export class UIManager {
    static update(url, id, callback) {
        jquery.get(url, function(data) {
            if (!id) {
                jquery('#main').html(data);
            } else {
                jquery(id).html(data);
            }

            if (callback) {
                callback();
            }

            // FIXME
            //jquery(id).jsScrollbar();
        });
    }

    static get(url, data, callback) {
        if (callback) {
            jquery.get(url, data, callback);
        } else {
            jquery.get(url, data);
        }
    }

    static getJSON(url, data, callback) {
        if (data) {
            data += '&format=json';
        } else {
            data = 'format=json';
        }

        if (callback) {
            jquery.getJSON(url, data, callback);
        } else {
            jquery.getJSON(url, data);
        }
    }

    static post(url, data, callback) {
        if (callback) {
            jquery.post(url, data, callback);
        } else {
            jquery.post(url, data);
        }
    }

    static redirectPost(url, params) {
        var _frm = document.frm;
        _frm.target = '';
        _frm.method = 'post';
        _frm.action = url;

        var keys = _.keys(params);
        jquery('#frm').empty();

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            jquery('#frm').append(
                "<input type='hidden' name='" +
                    key +
                    "' value='" +
                    params[key] +
                    "' />"
            );
        }

        _frm.submit();
    }

    static management(url) {
        vuebus.$emit('modal.changeMngUrl', url);
    }

    static openManagement(title, src, width, height) {
        window
            .open(
                '',
                'management',
                "location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no',width=" +
                    width +
                    ',height=' +
                    height
            )
            .focus();

        $('#frm')
            .empty()
            .append(
                "<input type='hidden' name='title' value='" + title + "' />"
            );
        $('#frm').append(
            "<input type='hidden' name='src' value='" + src + "' />"
        );

        document.frm.method = 'post';
        document.frm.action = '/popup/management';
        document.frm.target = 'management';
        document.frm.submit();
    }

    static isLoading() {
        return _currentLoading;
    }

    static showLoading(text, marginLeft) {
        _currentLoading = true;
        setTimeout(function() {
            UIManager.showLoading();
        }, 10);
    }

    static closeLoading() {
        _currentLoading = false;
        setTimeout(function() {
            UIManager.closeLoading();
        }, 10);
    }

    static getXViewPointListForFilter(
        oidsBySid,
        otype,
        stime,
        etime,
        isFailed,
        applicationName,
        sqlName,
        externalCallName,
        totalCount
    ) {
        const target = 'xviewAnalysis';
        const pop = window.open(
                `/popup/${target}`,
                target,
                "width=1280,height=800,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        let searchType = '',
            searchName = '';
        if (applicationName !== null) {
            searchType = 'application';
            searchName = applicationName;
        } else if (sqlName !== null) {
            searchType = 'sql';
            searchName = sqlName;
        } else if (externalCallName !== null) {
            searchType = 'externalCall';
            searchName = externalCallName;
        }

        // 폼 데이터 설정하기
        createFormForXViewPopup(
            stime,
            etime,
            '',
            '[]',
            '{}',
            '',
            '',
            oidsBySid,
            totalCount,
            searchType,
            searchName,
            isFailed
        );

        _frm.method = 'post';
        _frm.action = `/popup/${target}`;
        _frm.target = target;
        _frm.submit();
    }

    static getXViewPointList(
        sid,
        txids,
        stime,
        etime,
        txid,
        filterCondition,
        chartDataKey,
        popupTarget
    ) {
        if (txids.length == 0) return;

        UIManager.getXViewPointListForMultiDomain(
            { [sid]: txids },
            stime,
            etime,
            filterCondition,
            chartDataKey,
            popupTarget
        );
    }

    static getXViewPointListForMultiDomain(
        txidsBySid,
        stime,
        etime,
        filterCondition,
        chartDataKey,
        popupTarget = 'xviewAnalysis'
    ) {
        const pop = window.open(
                '',
                popupTarget,
                "width=1280,height=800,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        let chartFilter = '';
        if (filterCondition) {
            if (filterCondition.serviceName) {
                chartFilter = 'serviceName';
            } else if (filterCondition.wmonId) {
                chartFilter = 'wmonId';
            } else if (filterCondition.ip) {
                chartFilter = 'ip';
            } else if (filterCondition.userId) {
                chartFilter = 'userId';
            }
        }

        // 전체 트랜잭션 개수 구하기
        let transactionCount = 0;
        for (let sid in txidsBySid) {
            transactionCount += txidsBySid[sid].length;
        }

        // 폼 데이터 설정하기
        createFormForXViewPopup(
            stime,
            etime,
            '',
            '[]',
            JSON.stringify(txidsBySid),
            chartDataKey,
            chartFilter,
            '{}',
            transactionCount
        );

        _frm.method = 'post';
        _frm.action = '/popup/xviewAnalysis';
        _frm.target = popupTarget;
        _frm.submit();
    }

    static getXViewPointListForTopologyOrGuid(
        mode,
        stime,
        etime,
        data,
        popupTarget = 'xviewAnalysisAll'
    ) {
        const pop = window.open(
                '',
                popupTarget,
                "width=1280,height=800,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        // 폼 데이터 설정하기
        createFormForXViewPopup(
            stime,
            etime,
            '',
            '[]',
            '{}',
            '',
            '',
            '{}',
            0,
            '',
            '',
            false,
            mode,
            JSON.stringify(data)
                .split("'")
                .join('')
        );

        _frm.method = 'post';
        _frm.action = '/popup/xviewAnalysis';
        _frm.target = popupTarget;
        _frm.submit();
    }

    static getXViewAppPointList(
        serviceHashList,
        serviceNameList,
        txidsList,
        avgResTimes,
        recentResTimes,
        maxResTimes,
        startTimes,
        lastTimes,
        sqlTimes,
        cpuTimes,
        fetchTimes,
        errorCounts,
        stime,
        etime
    ) {
        if (serviceHashList.length == 0) return;

        const target = 'xviewAnalysis',
            pop = window.open(
                '',
                target,
                "width=1480,height=800,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        const groupRows = [];
        for (let i = 0, len = serviceHashList.length; i < len; i++) {
            groupRows.push({
                groupName: serviceNameList[i],
                transactionIds: txidsList[i],
                startTime: startTimes[i],
                endTime: lastTimes[i],
                averageResponseTime: avgResTimes[i],
                recentResponseTime: recentResTimes[i],
                maxResponseTime: maxResTimes[i],
                sqlTime: sqlTimes[i],
                cpuTime: cpuTimes[i],
                fetchTime: fetchTimes[i],
                errorCount: errorCounts[i],
            });
        }

        // 폼 데이터 설정하기
        createFormForXViewPopup(
            stime,
            etime,
            'application',
            JSON.stringify(groupRows)
        );

        _frm.method = 'post';
        _frm.action = `/popup/${target}`;
        _frm.target = target;
        _frm.submit();
    }
    static getXViewCLIENTIDPointList(
        userIds,
        txidsList,
        startTimes,
        lastTimes,
        stime,
        etime
    ) {
        if (userIds.length == 0) return;

        const target = 'xviewAnalysis',
            pop = window.open(
                '',
                target,
                "width=1480,height=800,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        const groupRows = [];
        for (let i = 0, len = userIds.length; i < len; i++) {
            groupRows.push({
                groupName: userIds[i],
                transactionIds: txidsList[i],
                startTime: startTimes[i],
                endTime: lastTimes[i],
            });
        }

        // 폼 데이터 설정하기
        createFormForXViewPopup(
            stime,
            etime,
            'clientId',
            JSON.stringify(groupRows)
        );

        _frm.method = 'post';
        _frm.action = `/popup/${target}`;
        _frm.target = target;
        _frm.submit();
    }

    static getXViewGUIDPointList(
        guids,
        txidsList,
        avgResTimes,
        recentResTimes,
        maxResTimes,
        startTimes,
        lastTimes,
        stime,
        etime
    ) {
        if (guids.length == 0) return;

        const target = 'xviewAnalysis',
            pop = window.open(
                '',
                target,
                "width=1480,height=800,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        const groupRows = [];
        for (let i = 0, len = guids.length; i < len; i++) {
            groupRows.push({
                groupName: guids[i],
                transactionIds: txidsList[i],
                startTime: startTimes[i],
                endTime: lastTimes[i],
                averageResponseTime: avgResTimes[i],
                recentResponseTime: recentResTimes[i],
                maxResponseTime: maxResTimes[i],
            });
        }

        // 폼 데이터 설정하기
        createFormForXViewPopup(
            stime,
            etime,
            'guid',
            JSON.stringify(groupRows)
        );

        _frm.method = 'post';
        _frm.action = `/popup/${target}`;
        _frm.target = target;
        _frm.submit();
    }

    static getXViewUserPointList(
        userIds,
        txidsList,
        avgResTimes,
        recentResTimes,
        maxResTimes,
        startTimes,
        lastTimes,
        stime,
        etime
    ) {
        if (userIds.length === 0) return;

        const target = 'xviewAnalysis',
            pop = window.open(
                '',
                target,
                "width=1480,height=800,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        const groupRows = [];
        for (let i = 0, len = userIds.length; i < len; i++) {
            groupRows.push({
                groupName: userIds[i],
                transactionIds: txidsList[i],
                startTime: startTimes[i],
                endTime: lastTimes[i],
                averageResponseTime: avgResTimes[i],
                recentResponseTime: recentResTimes[i],
                maxResponseTime: maxResTimes[i],
            });
        }

        // 폼 데이터 설정하기
        createFormForXViewPopup(
            stime,
            etime,
            'userId',
            JSON.stringify(groupRows)
        );

        _frm.method = 'post';
        _frm.action = `/popup/${target}`;
        _frm.target = target;
        _frm.submit();
    }

    static getXViewCLIENTIPPointList(
        clientIPList,
        txidsList,
        avgResTimes,
        recentResTimes,
        maxResTimes,
        startTimes,
        lastTimes,
        stime,
        etime
    ) {
        if (clientIPList.length === 0) return;

        const target = 'xviewAnalysis',
            pop = window.open(
                '',
                target,
                "width=1480,height=800,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        const groupRows = [];
        for (let i = 0, len = clientIPList.length; i < len; i++) {
            groupRows.push({
                groupName: clientIPList[i],
                transactionIds: txidsList[i],
                startTime: startTimes[i],
                endTime: lastTimes[i],
                averageResponseTime: avgResTimes[i],
                recentResponseTime: recentResTimes[i],
                maxResponseTime: maxResTimes[i],
            });
        }

        // 폼 데이터 설정하기
        createFormForXViewPopup(
            stime,
            etime,
            'clientIp',
            JSON.stringify(groupRows)
        );

        _frm.method = 'post';
        _frm.action = `/popup/${target}`;
        _frm.target = target;
        _frm.submit();
    }

    static getDeployListForMultiDomain(stime, etime, list) {
        var pop = window.open(
                '/popup/applicationHistory',
                'applicationHistory',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();
        jquery('#frm').append(
            "<input type='hidden' name='stime' value='" + stime + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='etime' value='" + etime + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='list' value='" +
                JSON.stringify(list) +
                "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        _frm.method = 'post';
        _frm.action = '/popup/applicationHistory';
        _frm.target = 'applicationHistory';
        _frm.submit();
    }

    static getEventList(url, sid, otype, oid, name) {
        var pop = window.open(
                '',
                'eventList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();
        jquery('#frm').append(
            "<input type='hidden' name='sid' value='" + sid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='otype' value='" + otype + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='oid' value='" + oid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='name' value='" + name + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'eventList';
        _frm.submit();
    }

    static getEventListV2(visibleTargetHirachy) {
        var pop = window.open(
                '',
                'eventList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='domainJson' value='" +
                JSON.stringify(visibleTargetHirachy) +
                "' />"
        );

        _frm.method = 'post';
        _frm.action = '/popup/eventList';
        _frm.target = 'eventList';
        _frm.submit();
    }

    static getEventNoticeList(url) {
        var pop = window.open(
                '',
                'eventList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm')
            .empty()
            .append("<input type='hidden' name='layout' value='popup' />");

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'eventList';
        _frm.submit();
    }

    static getActiveServiceList(url, sid, oid) {
        var pop = window.open(
                url,
                'activeServiceList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();
        if (oid) {
            jquery('#frm').append(
                "<input type='hidden' name='agent' value='" + oid + "' />"
            );
        }

        jquery('#frm').append(
            "<input type='hidden' name='sid' value='" + sid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='isSql' value='false' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'activeServiceList';
        _frm.submit();
    }

    static activeServiceListForBatchjob(url, sid) {
        var pop = window.open(
                url,
                'activeServiceList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();

        jquery('#frm').append(
            "<input type='hidden' name='sid' value='" + sid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='isFromBatchjobDomain' value='true' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'activeServiceList';
        _frm.submit();
    }

    static activeServiceListForIncoming(
        url,
        sourceSid,
        sourceOid,
        targetSid,
        targetOid,
        existReverse
    ) {
        var pop = window.open(
                '',
                'activeServiceList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();

        jquery('#frm').append(
            "<input type='hidden' name='sourceSid' value='" + sourceSid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='sourceOid' value='" + sourceOid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='targetSid' value='" + targetSid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='targetOid' value='" + targetOid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='isIncoming' value='true' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        if (existReverse)
            jquery('#frm').append(
                "<input type='hidden' name='existReverse' value='true' />"
            );
        else
            jquery('#frm').append(
                "<input type='hidden' name='existReverse' value='false' />"
            );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'activeServiceList';
        _frm.submit();
    }

    static activeServiceListForOutgoing(
        url,
        sourceSid,
        sourceOid,
        targetRemoteCallType,
        targetCustomMethodDescHashOrZero,
        targetIpAddressOrEmpty,
        targetPortOrZero
    ) {
        var pop = window.open(
                '',
                'activeServiceList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();

        jquery('#frm').append(
            "<input type='hidden' name='sourceSid' value='" + sourceSid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='sourceOid' value='" + sourceOid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='targetRemoteCallType' value='" +
                targetRemoteCallType +
                "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='targetCustomMethodDescHashOrZero' value='" +
                targetCustomMethodDescHashOrZero +
                "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='targetIpAddressOrEmpty' value='" +
                targetIpAddressOrEmpty +
                "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='targetPortOrZero' value='" +
                targetPortOrZero +
                "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='isOutgoing' value='true' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'activeServiceList';
        _frm.submit();
    }

    static activeServiceListForGroupNode(url, sourceInfoList, targetInfoList) {
        var pop = window.open(
                '',
                'activeServiceList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();

        jquery('#frm').append(
            "<input type='hidden' name='sourceInfoList' value='" +
                JSON.stringify(sourceInfoList) +
                "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='targetInfoList' value='" +
                JSON.stringify(targetInfoList) +
                "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='isGroupNode' value='true' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'activeServiceList';
        _frm.submit();
    }

    static getActiveServiceListForBusiness(url, sid, oid) {
        var pop = window.open(
                '',
                'activeServiceList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();
        if (oid) {
            jquery('#frm').append(
                "<input type='hidden' name='agent' value='" + oid + "' />"
            );
        }

        jquery('#frm').append(
            "<input type='hidden' name='sid' value='" + sid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='otype' value='" +
                OTypeDef.BUSINESS +
                "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='isSql' value='false' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'activeServiceList';
        _frm.submit();
    }

    static getActiveServiceListInSql(url, sid, oid, dataSourceName) {
        var pop = window.open(
                '',
                'activeServiceList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();
        if (oid) {
            jquery('#frm').append(
                "<input type='hidden' name='agent' value='" + oid + "' />"
            );
        }

        if (dataSourceName) {
            jquery('#frm').append(
                "<input type='hidden' name='dataSourceName' value='" +
                    dataSourceName +
                    "' />"
            );
        }

        jquery('#frm').append(
            "<input type='hidden' name='sid' value='" + sid + "' />"
        );
        //jquery('#frm').append("<input type='hidden' name='isSql' value='true' />");
        jquery('#frm').append(
            "<input type='hidden' name='defaultTab' value='SQL' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'activeServiceList';
        _frm.submit();
    }

    static getActiveServiceListInExternalcall(url, sid, oid, dataSourceName) {
        var pop = window.open(
                '',
                'activeServiceList',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();
        if (oid) {
            jquery('#frm').append(
                "<input type='hidden' name='agent' value='" + oid + "' />"
            );
        }

        if (dataSourceName) {
            jquery('#frm').append(
                "<input type='hidden' name='dataSourceName' value='" +
                    dataSourceName +
                    "' />"
            );
        }

        jquery('#frm').append(
            "<input type='hidden' name='sid' value='" + sid + "' />"
        );

        jquery('#frm').append(
            "<input type='hidden' name='defaultTab' value='EXTERNALCALL' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'activeServiceList';
        _frm.submit();
    }

    static activeServiceDetail(url, session, threadHash, sid) {
        var pop = window.open(
                '',
                'activeServiceDetail',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm')
            .empty()
            .append(
                "<input type='hidden' name='session' value='" + session + "' />"
            );
        jquery('#frm').append(
            "<input type='hidden' name='threadHash' value='" +
                threadHash +
                "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='sid' value='" + sid + "' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'activeServiceDetail';
        _frm.submit();
    }

    static methodStacktraceDetail(url, data) {
        var pop = window.open(
                '',
                'methodStacktraceDetail',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=no,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        $('#frm')
            .empty()
            .append(
                "<input type='hidden' name='key' value='" + data.key + "' />"
            );
        $('#frm').append(
            "<input type='hidden' name='name' value='" + data.name + "' />"
        );
        $('#frm').append("<input type='hidden' name='layout' value='popup' />");

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'methodStacktraceDetail';
        _frm.submit();
    }

    static socketDetail(url, data) {
        var pop = window.open(
            '',
            'socketDetail',
            'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=no,menubar=no'
        );

        var _frm = document.frm;
        if (pop) pop.focus();

        $('#frm')
            .empty()
            .append(
                "<input type='hidden' name='key' value='" + data.key + "' />"
            );
        $('#frm').append(
            "<input type='hidden' name='localport' value='" +
                data.localport +
                "' />"
        );
        $('#frm').append(
            "<input type='hidden' name='host' value='" + data.host + "' />"
        );
        $('#frm').append(
            "<input type='hidden' name='port' value='" + data.port + "' />"
        );
        $('#frm').append(
            "<input type='hidden' name='time' value='" +
                getDayjs(data.time).format(serverDateFormat.long) +
                "' />"
        );
        $('#frm').append("<input type='hidden' name='layout' value='popup' />");

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'socketDetail';
        _frm.submit();
    }

    static serviceDetail(
        url,
        type,
        name,
        hash,
        sid,
        otype,
        oids,
        stime,
        etime
    ) {
        var pop = window.open(
                '',
                'serviceDetail',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm')
            .empty()
            .append("<input type='hidden' name='sid' value='" + sid + "' />");
        jquery('#frm').append(
            "<input type='hidden' name='name' value='" + name + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='hash' value='" + hash + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='otype' value='" + otype + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='oids' value='" + oids + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='stime' value='" + stime + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='etime' value='" + etime + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='type' value='" + type + "' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'serviceDetail';
        _frm.submit();
    }

    static serviceDumpDetail(url, sid, oid, fname) {
        var pop = window.open(
                '',
                'serviceDumpDetail',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();
        jquery('#frm')
            .empty()
            .append("<input type='hidden' name='sid' value='" + sid + "' />");
        jquery('#frm').append(
            "<input type='hidden' name='oid' value='" + oid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='fname' value='" + fname + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='layout' value='popup' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'serviceDumpDetail';
        _frm.submit();
    }

    static popup(url, width, height) {
        var pop = window.open(
            url,
            url,
            'width=' +
                width +
                ',height=' +
                height +
                ',history=no,resizable=no,status=no,scrollbars=no,menubar=no'
        );

        if (pop) pop.focus();
    }

    static realtimePopup(url, width, height, params = []) {
        var pop = window.open(
                '',
                url,
                'width=' +
                    width +
                    ',height=' +
                    height +
                    ',history=no,resizable=yes,status=no,scrollbars=no,menubar=no,location=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        const $frm = jquery('#frm');
        $frm.empty();
        $frm.append("<input type='hidden' name='layout' value='iframe' />");
        params.forEach(param => {
            const { key, value } = param;
            $frm.append(
                "<input type='hidden' name=" + key + ' value=' + value + ' />'
            );
        });

        _frm.method = 'get';
        _frm.action = url;
        _frm.target = url;
        _frm.submit();
    }

    static getDbconDetailChart(url, sid, oid, instanceName, isJMX) {
        var pop = window.open(
                '',
                'dbconDetailChart',
                'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
            ),
            _frm = document.frm;

        if (pop) pop.focus();

        jquery('#frm').empty();
        jquery('#frm').append(
            "<input type='hidden' name='sid' value='" + sid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='oid' value='" + oid + "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='instanceName' value='" +
                instanceName +
                "' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='isJMX' value='" + isJMX + "' />"
        );

        jquery('#frm').append(
            "<input type='hidden' name='title' value='ui.label.dbconnection' />"
        );
        jquery('#frm').append(
            "<input type='hidden' name='charttype' value='equalizer.dbcon' />"
        );
        jquery('#frm').append("<input type='hidden' name='mxid' value='0' />");
        jquery('#frm').append(
            "<input type='hidden' name='pkey' value='db_connection_detail' />"
        );

        _frm.method = 'post';
        _frm.action = url;
        _frm.target = 'dbconDetailChart';
        _frm.submit();
    }

    /**
     *  실시간 라인차트이면서 TPS, 동시사용자 매트릭을 보여주고 있다면 라인합치기 기능이 들어간다.
     *	http://issue.jennifersoft.com/browse/ARIES-5360
     */
    static changeRuntimeLineChartRenderModeAfterPaintChart(iconDom) {
        var $chartDom = jquery(iconDom)
                .parent()
                .parent(),
            key = $chartDom.attr('data-key');

        Observer.emit(ChartKeywordInObserver.TOGGLE_LINE_MERGE + key);
    }

    /**
     * 이벤트차트의 모드 변경 아이콘 (리스트형, 아이콘형)
     */
    static changeEventChartRenderModeAfterPaintChart(iconDom) {
        var $chartDom = jquery(iconDom)
                .parent()
                .parent(),
            key = $chartDom.attr('data-key');

        Observer.emit(ChartKeywordInObserver.TOGGLE_EVENT_LIST + key);
    }

    static submit(form, target, showProgress) {
        if (form) {
            jquery(form).bind('submit', function(event) {
                event.preventDefault();

                var $form = jquery(this),
                    url = $form.attr('action');

                jquery.post(url, jquery(form).serialize(), function(data) {
                    jquery(target).html(data);
                });
                //if(showProgress) progress();
            });

            jquery(form).submit();
            jquery(form).unbind('submit');
        }
    }
}

function getDomainSelectString($chart) {
    var domainBarSync = $chart.attr('domainbarsync') === 'true';
    var isBusiness = $chart.attr('datatype') === 'business';
    const chartType = $chart.attr('charttype');

    //[realtime > xview] 는 대상 선택 컴포넌트에 걸려있어서 무시함.
    if (domainBarSync && chartType.startsWith('xview.realtime') === false) {
        if (isBusiness) {
            return BusinessManager.names();
        } else {
            return ElementManager.names();
        }
    } else {
        return '';
    }
}
