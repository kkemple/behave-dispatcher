const registry = {};
const isPending = {};
const isHandled = {};

var isFunction = (candidate) => {
    return Object.prototype.toString.call(candidate) === '[object Function]';
};

class BehaveDispatcher {
    constructor() {
        this._isDispatching = false;
        this._pendingPayload = null;
    }

    register(id, deps, callback) {
        if (isFunction(deps) && !callback) {
            callback = deps;
            deps = [];
        }
        let errorMessage = `${id} is already registered with the dispatcher!`;
        if (registry[id]) throw new Error(errorMessage);
        registry[id] = {
            deps: deps,
            fn: callback
        };
    }

    unregister(id) {
        delete registry[id];
    }

    purge() {
        for (let id in registry) delete registry[id];
        for (let id in isPending) delete isPending[id];
        for (let id in isHandled) delete isHandled[id];
    }

    dispatch(payload) {
        this._startDispatching(payload);
        try {
            for (let id in registry) {
                if (isPending[id])  continue;
                this._invokeCallback(id);
            }
        } finally {
            this._stopDispatching();
        }
    }

    _invokeCallback(id) {
        var cb = registry[id];

        isPending[id] = true;
        if (cb.deps.length) this._waitFor(cb.deps);
        registry[id].fn(this._pendingPayload);
        isHandled[id] = true;
    }

    _waitFor(ids) {
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            if (isPending[id]) continue;
            this._invokeCallback(id);
        }
    }

    _startDispatching(payload) {
        for (var id in registry) {
            isPending[id] = false;
            isHandled[id] = false;
        }
        this._pendingPayload = payload;
        this._isDispatching = true;
    }

    _stopDispatching() {
        this._pendingPayload = null;
        this._isDispatching = false;
    }
}

export default new BehaveDispatcher();
