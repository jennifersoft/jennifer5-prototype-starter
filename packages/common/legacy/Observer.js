/**
 * aries.core.js 를 분리함.
 * Observer Pattern을 사용한것이니 Observer 클래스 이름을 사용.
 * @type {{store: {}, emptyString: string, emptyArray: Array, zero: number, zeroString: string, image: {}, txid: Array}}
 */

// aries cache
let cache = {
    store: {},
    emptyString: '',
    emptyArray: [],
    zero: 0 | 0,
    zeroString: '0',
    image: {},
    txid: [],
};

let events = {};

class Observer {
    static set(name, value) {
        cache.store[name] = value;
        this.emit('set.' + name);
    }

    static get(name) {
        return cache.store[name];
    }

    static hasCache(name) {
        return typeof cache.store[name] != undefined;
    }

    static deprecated(msg) {
        console.warn('Do not use it anymoore.', msg);
    }

    // custom 이벤트 로직 구현
    // handler 를 등록하지 않는다.
    // 모든 것은 이벤트로 제어한다.
    // 핸들러 관리하는 개념이 여러개로 흩어지면 안된다.
    // 이벤트 이름은  각각의   class.method  명으로 한다.
    // 예를 들어   aries.manager.element 클래스의 select method 는
    // aries.emit("aries.manager.element:select")  이벤트를 발생시킨다.

    static on(name, func, context, options) {
        let handlers = events[name] || (events[name] = []);
        handlers.push({
            callback: func,
            context: context,
            options: options || { once: false },
        });
        return func;
    }

    static has(name) {
        return !!events[name];
    }

    static once(name, func, context) {
        return this.on(name, func, context, { once: true });
    }

    static off(name, func) {
        if (arguments.length == 0) {
            events = {};
        } else if (arguments.length == 1) {
            events[name] = [];
        } else if (arguments.length == 2) {
            let handlers = events[name] || [];

            let newHandlers = [];
            for (let i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i].callback == func) {
                    continue;
                }

                newHandlers.push(handlers[i]);
            }

            events[name] = newHandlers;
        }
    }

    static emit(name, args) {
        let handlers = events[name] || [];

        if (handlers.length == 0) {
            return;
        }
        args = args || [];
        let onceList = [];
        for (let i = 0, len = handlers.length; i < len; i++) {
            let h = handlers[i];
            h.callback?.apply(h.context, args);

            if (h.options.once) {
                onceList.push(i);
            }
        }

        for (let i = 0, len = onceList.length; i < len; i++) {
            this.off(name, handlers[onceList[i]].callback);
        }
    }
}

export { Observer };
