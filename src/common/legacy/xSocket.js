import $ from 'jquery';

import {
    AriesServerConnectCheck,
    AriesServerConnectCheckStatusCode,
} from '@layout/listener/AriesServerConnectCheck';
import { WebSocketCloseCode } from '@common/definition';

class xSocket {
    constructor(url, passcheckKeepAlive) {
        this.url = url;

        this.reconnectCount = 0;
        this.socket;

        //send와 callback받을시에 다 체크하여 lastAccessTime을 갱신한다.
        this.lastAccessTime;

        //서버의 keepAliveTime은 5분이지만 화면에서는 아래값으로 정한다.
        //10초
        //this.keepAliveTime = 10 * 1000;
        //60초로 변경함.
        //this.keepAliveTime = 60 * 1000;
        //keepAliveTime을 체크하지 않기 위해 -1로 지정한다.
        this.keepAliveTime = -1;
        //패스라면 -1 세팅
        if (passcheckKeepAlive) {
            this.keepAliveTime = -1;
        }

        this.intervalId;
        this.onOpenCallback;
        this.onCloseCallback;
        this.onMessageCallback;

        this.wsProtocol = location.protocol === 'https:' ? 'wss://' : 'ws://';

        this.lastCloseCode;
    }

    init() {
        var that = this;

        that.reconnectCount++;

        if ('WebSocket' in window) {
            this.socket = new WebSocket(
                that.wsProtocol + window.location.host + this.url
            );
        } else if (window.MozWebSocket) {
            this.socket = new MozWebSocket(
                that.wsProtocol + window.location.host + this.url
            );
        }

        this.socket.onopen = function(event) {
            if (that.onOpenCallback) {
                that.onOpenCallback();
            }

            console.log('websocket create ' + this.url);
        };

        this.socket.onerror = function(errorEvent) {};

        this.socket.onclose = function(closeEvent) {
            //CloseEvent code
            //https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent?redirectlocale=en-US&redirectslug=WebSockets%2FWebSockets_reference%2FCloseEvent#Status_codes

            //현재 화면에서 소켓을 사용하고 있는 경우만 생성해서 써야 timeout 을 잡을수 있다.

            //의도적으로 소켓을 끊은경우는 재성성하지 않는다.
            if (closeEvent.code === WebSocketCloseCode.ARIES_RECONNECT) {
                if (that.onCloseCallback) {
                    that.onCloseCallback(
                        /*done*/ function() {
                            that.init();
                        }
                    );
                } else {
                    that.init();
                }
            } else if (
                closeEvent.code === WebSocketCloseCode.ARIES_NO_SESSION
            ) {
                const message = AriesServerConnectCheck.getMessage(
                    AriesServerConnectCheckStatusCode.SESSION_LOST
                );
                AriesServerConnectCheck.showMessageNStopCharts(message);

                setTimeout(() => {
                    document.location = '/login';
                }, 6 * 1000);
            } else if (closeEvent.code === WebSocketCloseCode.ARIES_NORMAL) {
                if (that.onCloseCallback) that.onCloseCallback();
            } else {
                if (that.onCloseCallback) {
                    that.onCloseCallback(
                        /*done*/ function() {
                            setTimeout(function() {
                                that.init();
                            }, 10 * 1000);
                        }
                    );
                } else {
                    setTimeout(function() {
                        that.init();
                    }, 10 * 1000);
                }

                //1006인 경우는 크게 2가지가 있다.
                //1. 뷰서버가 다운된 경우, 네트워크 연결이 끊긴 경우
                //2. 외부(Proxy, 보안, 방화벽)때문에 차단된 경우...
                if (closeEvent.code === WebSocketCloseCode.NO_CLOSE) {
                    $.ajax({
                        url: '/heartbeat/ping',
                        success: function() {
                            AriesServerConnectCheck.requestCannotConnect(
                                AriesServerConnectCheckStatusCode.EXTERNAL_PROBLEM
                            );
                        },
                        error: function() {
                            AriesServerConnectCheck.requestCannotConnect(
                                AriesServerConnectCheckStatusCode.SERVERDOWN_OR_NETWORKFAIL
                            );
                        },
                    });
                }
            }

            console.log('websocket close ' + this.url);
            console.log(
                'websocket close code=' +
                    closeEvent.code +
                    ', reason=' +
                    closeEvent.reason
            );

            that.lastCloseCode = closeEvent.code;
        };

        this.socket.onmessage = function(message) {
            that.lastAccessTime = Date.now();

            if (that.onMessageCallback) {
                that.onMessageCallback(message);
            }
        };
    }

    /**
     * TODO socket.readyState 값이 0(CONNECTING)일때 close 하면 closeCode가 1006으로 떨어진다.
     *
     * @param msg
     */
    reconnect(msg) {
        // 4000 : restart
        this.socket.close(WebSocketCloseCode.ARIES_RECONNECT, msg);

        // 연결 종료 후 close 이벤트가 발생하면 socket 을 다시 연결한다.
    }

    send(param) {
        try {
            this.lastAccessTime = Date.now();
            this.socket.send(param);
        } catch (e) {
            console.log('xSocket send error');
            console.log(e);
        }
    }

    getJSON(e) {
        var data;

        if (e && e.data) {
            data = JSON.parse(e.data);
        }

        return data;
    }
}

export { xSocket };
