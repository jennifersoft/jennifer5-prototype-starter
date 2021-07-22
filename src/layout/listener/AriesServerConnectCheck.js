/**
 * 전과후의 시간을 체크하는것이라 서버타임을 사용하지 않고 Date.now()를 사용했다.
 *
 * https://medium.com/@davidrhyswhite/private-members-in-es6-db1ccd6128a5
 * TODO Class 안에서 private 메소드를 구현하기 위해 Symbol을 사용했다.
 *
 * 차후에 webpack를 통해 빌드시스템을 갖추게 되면 Symbol은 export 하지 않는다.
 */
import $ from 'jquery';
import {
    ChartKeywordInObserver,
    DataKeywordInObserver,
} from '@common/ObserverKeyword';
import { Observer } from '@common/legacy/Observer';

const ifHasReqInLast10SecAfterShowLayer = Symbol(
    'ifHasReqInLast10SecAfterShowLayer'
);
const ifCanConnectAfterHideLayer = Symbol('ifCanConnectAfterHideLayer');
const clearServerConnect = Symbol('clearServerConnect');

const showCannotConnect = Symbol('showCannotConnect');
const hideCannotConnect = Symbol('hideCannotConnect');

export const AriesServerConnectCheckStatusCode = {
    SERVERDOWN_OR_NETWORKFAIL: 0,
    EXTERNAL_PROBLEM: 1,
    SESSION_LOST: 2,
};
export class AriesServerConnectCheck {
    static requestCannotConnect(statusCode) {
        this.lastRequestTime = Date.now();
        this.lastStatusCode = statusCode;

        if (this.prevRequestTimerId === undefined) {
            this.prevRequestTimerId = setTimeout(() => {
                this[ifHasReqInLast10SecAfterShowLayer]();
            }, 15 * 1000);
        }
    }

    static [ifHasReqInLast10SecAfterShowLayer]() {
        if (this.lastRequestTime > Date.now() - 10 * 1000)
            this[showCannotConnect]();

        this.prevRequestTimerId = undefined;
    }

    static [ifCanConnectAfterHideLayer]() {
        if (this.lastRequestTime < Date.now() - 20 * 1000) {
            this[hideCannotConnect]();

            this[clearServerConnect]();

            window.clearInterval(this.checkCanConnectIntervalId);
        }
    }

    static [showCannotConnect]() {
        console.log('cannot server-connect code = ' + this.lastStatusCode);

        if (this.isShowConnectFailLayer) {
            return;
        }

        const message = this.getMessage(this.lastStatusCode);

        this.showMessageNStopCharts(message);

        this.isShowConnectFailLayer = true;
        this.checkCanConnectIntervalId = setInterval(() => {
            this[ifCanConnectAfterHideLayer]();
        }, 2 * 1000);
    }

    static showMessageNStopCharts(message) {
        Observer.emit(ChartKeywordInObserver.STOP_ALL_RENDER);

        Observer.emit(DataKeywordInObserver.SHOW_MESSAGE_WHEN_WS_CLOSE, [
            message,
        ]);
    }

    static getMessage(statusCode) {
        let message;
        switch (statusCode) {
            case AriesServerConnectCheckStatusCode.SERVERDOWN_OR_NETWORKFAIL:
                message = i18n.get('M0517');
                break;
            case AriesServerConnectCheckStatusCode.EXTERNAL_PROBLEM:
                message = i18n.get('M0518');
                break;
            case AriesServerConnectCheckStatusCode.SESSION_LOST:
                message = i18n.get('M0563');
                break;
            default:
                console.error(
                    'AriesServerConnectCheck.getMessage() statusCode is not valid.'
                );
        }

        return message;
    }

    static [hideCannotConnect]() {
        Observer.emit(ChartKeywordInObserver.START_ALL_RENDER);

        Observer.emit(DataKeywordInObserver.HIDE_MESSAGE_WHEN_WS_CLOSE);

        this.isShowConnectFailLayer = false;
    }

    static [clearServerConnect]() {
        this.prevRequestTimerId = undefined;

        this.lastRequestTime = undefined;
        this.lastStatusCode = undefined;
    }
}
