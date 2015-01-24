"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var registry = {};
var isPending = {};
var isHandled = {};

var isFunction = function (candidate) {
  return Object.prototype.toString.call(candidate) === "[object Function]";
};

var BehaveDispatcher = (function () {
  function BehaveDispatcher() {
    this._isDispatching = false;
    this._pendingPayload = null;
  }

  _prototypeProperties(BehaveDispatcher, null, {
    register: {
      value: function register(id, deps, callback) {
        if (isFunction(deps) && !callback) {
          callback = deps;
          deps = [];
        }
        var errorMessage = "" + id + " is already registered with the dispatcher!";
        if (registry[id]) throw new Error(errorMessage);
        registry[id] = {
          deps: deps,
          fn: callback
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    unregister: {
      value: function unregister(id) {
        delete registry[id];
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    purge: {
      value: function purge() {
        for (var id in registry) {
          delete registry[id];
        }for (var id in isPending) {
          delete isPending[id];
        }for (var id in isHandled) {
          delete isHandled[id];
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    dispatch: {
      value: function dispatch(payload) {
        this._startDispatching(payload);
        try {
          for (var id in registry) {
            if (isPending[id]) continue;
            this._invokeCallback(id);
          }
        } finally {
          this._stopDispatching();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _invokeCallback: {
      value: function InvokeCallback(id) {
        var cb = registry[id];

        isPending[id] = true;
        if (cb.deps.length) this._waitFor(cb.deps);
        registry[id].fn(this._pendingPayload);
        isHandled[id] = true;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _waitFor: {
      value: function WaitFor(ids) {
        for (var i = 0; i < ids.length; i++) {
          var id = ids[i];
          if (isPending[id]) continue;
          this._invokeCallback(id);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _startDispatching: {
      value: function StartDispatching(payload) {
        for (var id in registry) {
          isPending[id] = false;
          isHandled[id] = false;
        }
        this._pendingPayload = payload;
        this._isDispatching = true;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _stopDispatching: {
      value: function StopDispatching() {
        this._pendingPayload = null;
        this._isDispatching = false;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return BehaveDispatcher;
})();

module.exports = new BehaveDispatcher();