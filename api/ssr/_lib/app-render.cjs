var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/react/cjs/react.production.js"(exports2) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result, thenable = ctor();
        thenable.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject, void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error, void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = thenable);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    function startTransition(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      currentTransition.types = null !== prevTransition ? prevTransition.types : null;
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    }
    function addTransitionType(type) {
      var transition = ReactSharedInternals.T;
      if (null !== transition) {
        var transitionTypes = transition.types;
        null === transitionTypes ? transition.types = [type] : -1 === transitionTypes.indexOf(type) && transitionTypes.push(type);
      } else startTransition(addTransitionType.bind(null, type));
    }
    var Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports2.Activity = REACT_ACTIVITY_TYPE;
    exports2.Children = Children;
    exports2.Component = Component;
    exports2.Fragment = REACT_FRAGMENT_TYPE;
    exports2.Profiler = REACT_PROFILER_TYPE;
    exports2.PureComponent = PureComponent;
    exports2.StrictMode = REACT_STRICT_MODE_TYPE;
    exports2.Suspense = REACT_SUSPENSE_TYPE;
    exports2.ViewTransition = REACT_VIEW_TRANSITION_TYPE;
    exports2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports2.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports2.addTransitionType = addTransitionType;
    exports2.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports2.cacheSignal = function() {
      return null;
    };
    exports2.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports2.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports2.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports2.createRef = function() {
      return { current: null };
    };
    exports2.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports2.isValidElement = isValidElement;
    exports2.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports2.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports2.startTransition = startTransition;
    exports2.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports2.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports2.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports2.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports2.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports2.useDebugValue = function() {
    };
    exports2.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports2.useEffect = function(create, deps) {
      return ReactSharedInternals.H.useEffect(create, deps);
    };
    exports2.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports2.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports2.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports2.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports2.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports2.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports2.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports2.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports2.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports2.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports2.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports2.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports2.version = "19.3.1";
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports2, module2) {
    "use strict";
    if (true) {
      module2.exports = require_react_production();
    } else {
      module2.exports = null;
    }
  }
});

// node_modules/react-dom/cjs/react-dom.production.js
var require_react_dom_production = __commonJS({
  "node_modules/react-dom/cjs/react-dom.production.js"(exports2) {
    "use strict";
    var React = require_react();
    function formatProdErrorMessage(code) {
      var url = "https://react.dev/errors/" + code;
      if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var i = 2; i < arguments.length; i++)
          url += "&args[]=" + encodeURIComponent(arguments[i]);
      }
      return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function noop() {
    }
    var Internals = {
      d: {
        f: noop,
        r: function() {
          throw Error(formatProdErrorMessage(522));
        },
        D: noop,
        C: noop,
        L: noop,
        m: noop,
        X: noop,
        S: noop,
        M: noop
      },
      p: 0,
      findDOMNode: null
    };
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_RECOVERABLE_TYPE = /* @__PURE__ */ Symbol.for("react.recoverable");
    var REACT_OPTIMISTIC_KEY = /* @__PURE__ */ Symbol.for("react.optimistic_key");
    function createPortal$1(children, containerInfo, implementation) {
      var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return {
        $$typeof: REACT_PORTAL_TYPE,
        key: null == key ? null : key === REACT_OPTIMISTIC_KEY ? REACT_OPTIMISTIC_KEY : "" + key,
        children,
        containerInfo,
        implementation
      };
    }
    var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function getCrossOriginStringAs(as, input) {
      if ("font" === as) return "";
      if ("string" === typeof input)
        return "use-credentials" === input ? input : "";
    }
    exports2.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
    exports2.browser = function(reason) {
      return { $$typeof: REACT_RECOVERABLE_TYPE, _reason: reason };
    };
    exports2.createPortal = function(children, container) {
      var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
        throw Error(formatProdErrorMessage(299));
      return createPortal$1(children, container, null, key);
    };
    exports2.flushSync = function(fn) {
      var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
      try {
        if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
      } finally {
        ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
      }
    };
    exports2.preconnect = function(href, options) {
      "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
    };
    exports2.prefetchDNS = function(href) {
      "string" === typeof href && Internals.d.D(href);
    };
    exports2.preinit = function(href, options) {
      if ("string" === typeof href && options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
        "style" === as ? Internals.d.S(
          href,
          "string" === typeof options.precedence ? options.precedence : void 0,
          {
            crossOrigin,
            integrity,
            fetchPriority
          }
        ) : "script" === as && Internals.d.X(href, {
          crossOrigin,
          integrity,
          fetchPriority,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
      }
    };
    exports2.preinitModule = function(href, options) {
      if ("string" === typeof href)
        if ("object" === typeof options && null !== options) {
          if (null == options.as || "script" === options.as) {
            var crossOrigin = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            );
            Internals.d.M(href, {
              crossOrigin,
              integrity: "string" === typeof options.integrity ? options.integrity : void 0,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0,
              fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0
            });
          }
        } else null == options && Internals.d.M(href);
    };
    exports2.preload = function(href, options) {
      if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
        Internals.d.L(href, as, {
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          type: "string" === typeof options.type ? options.type : void 0,
          fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
          referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
          imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
          imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
          media: "string" === typeof options.media ? options.media : void 0
        });
      }
    };
    exports2.preloadModule = function(href, options) {
      if ("string" === typeof href)
        if (options) {
          var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
          Internals.d.m(href, {
            as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0,
            fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0
          });
        } else Internals.d.m(href);
    };
    exports2.requestFormReset = function(form) {
      Internals.d.r(form);
    };
    exports2.unstable_batchedUpdates = function(fn, a) {
      return fn(a);
    };
    exports2.useFormState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useFormState(action, initialState, permalink);
    };
    exports2.useFormStatus = function() {
      return ReactSharedInternals.H.useHostTransitionStatus();
    };
    exports2.version = "19.3.1";
  }
});

// node_modules/react-dom/index.js
var require_react_dom = __commonJS({
  "node_modules/react-dom/index.js"(exports2, module2) {
    "use strict";
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      if (false) {
        throw new Error("^_^");
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    if (true) {
      checkDCE();
      module2.exports = require_react_dom_production();
    } else {
      module2.exports = null;
    }
  }
});

// node_modules/react-dom/cjs/react-dom-server-legacy.node.production.js
var require_react_dom_server_legacy_node_production = __commonJS({
  "node_modules/react-dom/cjs/react-dom-server-legacy.node.production.js"(exports2) {
    "use strict";
    var React = require_react();
    var ReactDOM = require_react_dom();
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_SCOPE_TYPE = /* @__PURE__ */ Symbol.for("react.scope");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var REACT_LEGACY_HIDDEN_TYPE = /* @__PURE__ */ Symbol.for("react.legacy_hidden");
    var REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
    var REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition");
    var REACT_RECOVERABLE_TYPE = /* @__PURE__ */ Symbol.for("react.recoverable");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var REACT_OPTIMISTIC_KEY = /* @__PURE__ */ Symbol.for("react.optimistic_key");
    var isArrayImpl = Array.isArray;
    function murmurhash3_32_gc(key, seed) {
      var remainder = key.length & 3;
      var bytes = key.length - remainder;
      var h1 = seed;
      for (seed = 0; seed < bytes; ) {
        var k1 = key.charCodeAt(seed) & 255 | (key.charCodeAt(++seed) & 255) << 8 | (key.charCodeAt(++seed) & 255) << 16 | (key.charCodeAt(++seed) & 255) << 24;
        ++seed;
        k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295;
        k1 = k1 << 15 | k1 >>> 17;
        k1 = 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
        h1 ^= k1;
        h1 = h1 << 13 | h1 >>> 19;
        h1 = 5 * (h1 & 65535) + ((5 * (h1 >>> 16) & 65535) << 16) & 4294967295;
        h1 = (h1 & 65535) + 27492 + (((h1 >>> 16) + 58964 & 65535) << 16);
      }
      k1 = 0;
      switch (remainder) {
        case 3:
          k1 ^= (key.charCodeAt(seed + 2) & 255) << 16;
        case 2:
          k1 ^= (key.charCodeAt(seed + 1) & 255) << 8;
        case 1:
          k1 ^= key.charCodeAt(seed) & 255, k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295, k1 = k1 << 15 | k1 >>> 17, h1 ^= 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
      }
      h1 ^= key.length;
      h1 ^= h1 >>> 16;
      h1 = 2246822507 * (h1 & 65535) + ((2246822507 * (h1 >>> 16) & 65535) << 16) & 4294967295;
      h1 ^= h1 >>> 13;
      h1 = 3266489909 * (h1 & 65535) + ((3266489909 * (h1 >>> 16) & 65535) << 16) & 4294967295;
      return (h1 ^ h1 >>> 16) >>> 0;
    }
    var assign = Object.assign;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var VALID_ATTRIBUTE_NAME_REGEX = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    );
    var illegalAttributeNameCache = {};
    var validatedAttributeNameCache = {};
    function isAttributeNameSafe(attributeName) {
      if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
        return true;
      if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
      if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
        return validatedAttributeNameCache[attributeName] = true;
      illegalAttributeNameCache[attributeName] = true;
      return false;
    }
    var unitlessNumbers = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " "
      )
    );
    var aliases = /* @__PURE__ */ new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["maskType", "mask-type"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"]
    ]);
    var matchHtmlRegExp = /["'&<>]/;
    function escapeTextForBrowser(text) {
      if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text)
        return "" + text;
      text = "" + text;
      var match = matchHtmlRegExp.exec(text);
      if (match) {
        var html = "", index, lastIndex = 0;
        for (index = match.index; index < text.length; index++) {
          switch (text.charCodeAt(index)) {
            case 34:
              match = "&quot;";
              break;
            case 38:
              match = "&amp;";
              break;
            case 39:
              match = "&#x27;";
              break;
            case 60:
              match = "&lt;";
              break;
            case 62:
              match = "&gt;";
              break;
            default:
              continue;
          }
          lastIndex !== index && (html += text.slice(lastIndex, index));
          lastIndex = index + 1;
          html += match;
        }
        text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
      }
      return text;
    }
    var uppercasePattern = /([A-Z])/g;
    var msPattern = /^ms-/;
    var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function sanitizeURL(url) {
      return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
    }
    var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var sharedNotPendingObject = {
      pending: false,
      data: null,
      method: null,
      action: null
    };
    var previousDispatcher = ReactDOMSharedInternals.d;
    ReactDOMSharedInternals.d = {
      f: previousDispatcher.f,
      r: previousDispatcher.r,
      D: prefetchDNS,
      C: preconnect,
      L: preload,
      m: preloadModule,
      X: preinitScript,
      S: preinitStyle,
      M: preinitModuleScript
    };
    var PRELOAD_NO_CREDS = [];
    var currentlyFlushingRenderState = null;
    var scriptRegex = /(<\/|<)(s)(cript)/gi;
    function scriptReplacer(match, prefix2, s, suffix2) {
      return "" + prefix2 + ("s" === s ? "\\u0073" : "\\u0053") + suffix2;
    }
    function createResumableState(identifierPrefix, externalRuntimeConfig, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
      return {
        idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
        nextFormID: 0,
        streamingFormat: 0,
        bootstrapScriptContent,
        bootstrapScripts,
        bootstrapModules,
        instructions: 0,
        hasBody: false,
        hasHtml: false,
        unknownResources: {},
        dnsResources: {},
        connectResources: { default: {}, anonymous: {}, credentials: {} },
        imageResources: {},
        styleResources: {},
        scriptResources: {},
        moduleUnknownResources: {},
        moduleScriptResources: {}
      };
    }
    function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
      return {
        insertionMode,
        selectedValue,
        tagScope,
        viewTransition
      };
    }
    function getChildFormatContext(parentContext, type, props) {
      var subtreeScope = parentContext.tagScope & -25;
      switch (type) {
        case "noscript":
          return createFormatContext(2, null, subtreeScope | 1, null);
        case "select":
          return createFormatContext(
            2,
            null != props.value ? props.value : props.defaultValue,
            subtreeScope,
            null
          );
        case "svg":
          return createFormatContext(4, null, subtreeScope, null);
        case "picture":
          return createFormatContext(2, null, subtreeScope | 2, null);
        case "math":
          return createFormatContext(5, null, subtreeScope, null);
        case "foreignObject":
          return createFormatContext(2, null, subtreeScope, null);
        case "table":
          return createFormatContext(6, null, subtreeScope, null);
        case "thead":
        case "tbody":
        case "tfoot":
          return createFormatContext(7, null, subtreeScope, null);
        case "colgroup":
          return createFormatContext(9, null, subtreeScope, null);
        case "tr":
          return createFormatContext(8, null, subtreeScope, null);
        case "head":
          if (2 > parentContext.insertionMode)
            return createFormatContext(3, null, subtreeScope, null);
          break;
        case "html":
          if (0 === parentContext.insertionMode)
            return createFormatContext(1, null, subtreeScope, null);
      }
      return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode ? createFormatContext(2, null, subtreeScope, null) : null !== parentContext.viewTransition || parentContext.tagScope !== subtreeScope ? createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        subtreeScope,
        null
      ) : parentContext;
    }
    function getSuspenseViewTransition(parentViewTransition) {
      return null === parentViewTransition ? null : {
        update: parentViewTransition.update,
        enter: "none",
        exit: "none",
        share: parentViewTransition.update,
        parentEnter: "none",
        parentExit: "none",
        name: parentViewTransition.autoName,
        autoName: parentViewTransition.autoName,
        nameIdx: 0
      };
    }
    function getSuspenseFallbackFormatContext(resumableState, parentContext) {
      parentContext.tagScope & 32 && (resumableState.instructions |= 128);
      return createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        parentContext.tagScope | 12,
        getSuspenseViewTransition(parentContext.viewTransition)
      );
    }
    function getSuspenseContentFormatContext(resumableState, parentContext) {
      resumableState = getSuspenseViewTransition(parentContext.viewTransition);
      var subtreeScope = parentContext.tagScope | 16;
      null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
      return createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        subtreeScope,
        resumableState
      );
    }
    function makeId(resumableState, treeId, localId) {
      resumableState = "_" + resumableState.idPrefix + "R_" + treeId;
      0 < localId && (resumableState += "H" + localId.toString(32));
      return resumableState + "_";
    }
    function pushViewTransitionAttributes(target, formatContext) {
      formatContext = formatContext.viewTransition;
      null !== formatContext && ("auto" !== formatContext.name && (pushStringAttribute(
        target,
        "vt-name",
        0 === formatContext.nameIdx ? formatContext.name : formatContext.name + "_" + formatContext.nameIdx
      ), formatContext.nameIdx++), pushStringAttribute(target, "vt-update", formatContext.update), "none" !== formatContext.enter && pushStringAttribute(target, "vt-enter", formatContext.enter), "none" !== formatContext.exit && pushStringAttribute(target, "vt-exit", formatContext.exit), "none" !== formatContext.share && pushStringAttribute(target, "vt-share", formatContext.share));
    }
    var styleNameCache = /* @__PURE__ */ new Map();
    function pushStyleAttribute(target, style) {
      if ("object" !== typeof style)
        throw Error(
          "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."
        );
      var isFirst = true, styleName;
      for (styleName in style)
        if (hasOwnProperty.call(style, styleName)) {
          var styleValue = style[styleName];
          if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
            if (0 === styleName.indexOf("--")) {
              var nameChunk = escapeTextForBrowser(styleName);
              styleValue = escapeTextForBrowser(("" + styleValue).trim());
            } else
              nameChunk = styleNameCache.get(styleName), void 0 === nameChunk && (nameChunk = escapeTextForBrowser(
                styleName.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-")
              ), styleNameCache.set(styleName, nameChunk)), styleValue = "number" === typeof styleValue ? 0 === styleValue || unitlessNumbers.has(styleName) ? "" + styleValue : styleValue + "px" : escapeTextForBrowser(("" + styleValue).trim());
            isFirst ? (isFirst = false, target.push(' style="', nameChunk, ":", styleValue)) : target.push(";", nameChunk, ":", styleValue);
          }
        }
      isFirst || target.push('"');
    }
    function pushBooleanAttribute(target, name, value) {
      value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '=""');
    }
    function pushStringAttribute(target, name, value) {
      "function" !== typeof value && "symbol" !== typeof value && "boolean" !== typeof value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
    }
    var actionJavaScriptURL = escapeTextForBrowser(
      "javascript:throw new Error('React form unexpectedly submitted.')"
    );
    function pushAdditionalFormField(value, key) {
      this.push('<input type="hidden"');
      validateAdditionalFormField(value);
      pushStringAttribute(this, "name", key);
      pushStringAttribute(this, "value", value);
      this.push("/>");
    }
    function validateAdditionalFormField(value) {
      if ("string" !== typeof value)
        throw Error(
          "File/Blob fields are not yet supported in progressive forms. Will fallback to client hydration."
        );
    }
    function getCustomFormFields(resumableState, formAction) {
      if ("function" === typeof formAction.$$FORM_ACTION) {
        var id = resumableState.nextFormID++;
        resumableState = resumableState.idPrefix + id;
        try {
          var customFields = formAction.$$FORM_ACTION(resumableState);
          if (customFields) {
            var formData = customFields.data;
            null != formData && formData.forEach(validateAdditionalFormField);
          }
          return customFields;
        } catch (x) {
          if ("object" === typeof x && null !== x && "function" === typeof x.then)
            throw x;
        }
      }
      return null;
    }
    function pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name) {
      var formData = null;
      if ("function" === typeof formAction) {
        var customFields = getCustomFormFields(resumableState, formAction);
        null !== customFields ? (name = customFields.name, formAction = customFields.action || "", formEncType = customFields.encType, formMethod = customFields.method, formTarget = customFields.target, formData = customFields.data) : (target.push(" ", "formAction", '="', actionJavaScriptURL, '"'), formTarget = formMethod = formEncType = formAction = name = null, injectFormReplayingRuntime(resumableState, renderState));
      }
      null != name && pushAttribute(target, "name", name);
      null != formAction && pushAttribute(target, "formAction", formAction);
      null != formEncType && pushAttribute(target, "formEncType", formEncType);
      null != formMethod && pushAttribute(target, "formMethod", formMethod);
      null != formTarget && pushAttribute(target, "formTarget", formTarget);
      return formData;
    }
    function pushAttribute(target, name, value) {
      switch (name) {
        case "className":
          pushStringAttribute(target, "class", value);
          break;
        case "tabIndex":
          pushStringAttribute(target, "tabindex", value);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          pushStringAttribute(target, name, value);
          break;
        case "style":
          pushStyleAttribute(target, value);
          break;
        case "src":
        case "href":
          if ("" === value) break;
        case "action":
        case "formAction":
          if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
            break;
          value = sanitizeURL("" + value);
          target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          break;
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "ref":
          break;
        case "autoFocus":
        case "multiple":
        case "muted":
          pushBooleanAttribute(target, name.toLowerCase(), value);
          break;
        case "xlinkHref":
          if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
            break;
          value = sanitizeURL("" + value);
          target.push(" ", "xlink:href", '="', escapeTextForBrowser(value), '"');
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "credentialless":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '=""');
          break;
        case "capture":
        case "download":
          true === value ? target.push(" ", name, '=""') : false !== value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          break;
        case "rowSpan":
        case "start":
          "function" === typeof value || "symbol" === typeof value || isNaN(value) || target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          break;
        case "xlinkActuate":
          pushStringAttribute(target, "xlink:actuate", value);
          break;
        case "xlinkArcrole":
          pushStringAttribute(target, "xlink:arcrole", value);
          break;
        case "xlinkRole":
          pushStringAttribute(target, "xlink:role", value);
          break;
        case "xlinkShow":
          pushStringAttribute(target, "xlink:show", value);
          break;
        case "xlinkTitle":
          pushStringAttribute(target, "xlink:title", value);
          break;
        case "xlinkType":
          pushStringAttribute(target, "xlink:type", value);
          break;
        case "xmlBase":
          pushStringAttribute(target, "xml:base", value);
          break;
        case "xmlLang":
          pushStringAttribute(target, "xml:lang", value);
          break;
        case "xmlSpace":
          pushStringAttribute(target, "xml:space", value);
          break;
        default:
          if (!(2 < name.length) || "o" !== name[0] && "O" !== name[0] || "n" !== name[1] && "N" !== name[1]) {
            if (name = aliases.get(name) || name, isAttributeNameSafe(name)) {
              switch (typeof value) {
                case "function":
                case "symbol":
                  return;
                case "boolean":
                  var prefix$8 = name.toLowerCase().slice(0, 5);
                  if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
              }
              target.push(" ", name, '="', escapeTextForBrowser(value), '"');
            }
          }
      }
    }
    function pushInnerHTML(target, innerHTML, children) {
      if (null != innerHTML) {
        if (null != children)
          throw Error(
            "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
          );
        if ("object" !== typeof innerHTML || !("__html" in innerHTML))
          throw Error(
            "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
          );
        innerHTML = innerHTML.__html;
        null !== innerHTML && void 0 !== innerHTML && target.push("" + innerHTML);
      }
    }
    function flattenOptionChildren(children) {
      var content = "";
      React.Children.forEach(children, function(child) {
        null != child && (content += child);
      });
      return content;
    }
    function injectFormReplayingRuntime(resumableState, renderState) {
      if (0 === (resumableState.instructions & 16)) {
        resumableState.instructions |= 16;
        var preamble = renderState.preamble, bootstrapChunks = renderState.bootstrapChunks;
        (preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length ? (bootstrapChunks.push(renderState.startInlineScript), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
          ">",
          `addEventListener("submit",function(a){if(!a.defaultPrevented){var b=a.target,d=a.submitter,c=b.action,e=d;if(d){var f=d.getAttribute("formAction");null!=f&&(c=f,e=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===c&&(a.preventDefault(),a=new FormData(b,e),c=b.ownerDocument||b,(c.$$reactFormReplay=c.$$reactFormReplay||[]).push(b,d,a))}});`,
          "</script>"
        )) : bootstrapChunks.unshift(
          renderState.startInlineScript,
          ">",
          `addEventListener("submit",function(a){if(!a.defaultPrevented){var b=a.target,d=a.submitter,c=b.action,e=d;if(d){var f=d.getAttribute("formAction");null!=f&&(c=f,e=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===c&&(a.preventDefault(),a=new FormData(b,e),c=b.ownerDocument||b,(c.$$reactFormReplay=c.$$reactFormReplay||[]).push(b,d,a))}});`,
          "</script>"
        );
      }
    }
    function pushLinkImpl(target, props) {
      target.push(startChunkForTag("link"));
      for (var propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(
                  "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                );
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push("/>");
      return null;
    }
    var styleRegex = /(<\/|<)(s)(tyle)/gi;
    function styleReplacer(match, prefix2, s, suffix2) {
      return "" + prefix2 + ("s" === s ? "\\73 " : "\\53 ") + suffix2;
    }
    function pushSelfClosing(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      for (var propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(
                  tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                );
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push("/>");
      return null;
    }
    function pushTitleImpl(target, props) {
      target.push(startChunkForTag("title"));
      var children = null, innerHTML = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push(">");
      props = Array.isArray(children) ? 2 > children.length ? children[0] : null : children;
      "function" !== typeof props && "symbol" !== typeof props && null !== props && void 0 !== props && target.push(escapeTextForBrowser("" + props));
      pushInnerHTML(target, innerHTML, children);
      target.push(endChunkForTag("title"));
      return null;
    }
    function pushScriptImpl(target, props) {
      target.push(startChunkForTag("script"));
      var children = null, innerHTML = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push(">");
      pushInnerHTML(target, innerHTML, children);
      "string" === typeof children && target.push(("" + children).replace(scriptRegex, scriptReplacer));
      target.push(endChunkForTag("script"));
      return null;
    }
    function pushStartSingletonElement(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      var innerHTML = tag = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                tag = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push(">");
      pushInnerHTML(target, innerHTML, tag);
      return tag;
    }
    function pushStartGenericElement(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      var innerHTML = tag = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                tag = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push(">");
      pushInnerHTML(target, innerHTML, tag);
      return "string" === typeof tag ? (target.push(escapeTextForBrowser(tag)), null) : tag;
    }
    var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
    var validatedTagCache = /* @__PURE__ */ new Map();
    function startChunkForTag(tag) {
      var tagStartChunk = validatedTagCache.get(tag);
      if (void 0 === tagStartChunk) {
        if (!VALID_TAG_REGEX.test(tag)) throw Error("Invalid tag: " + tag);
        tagStartChunk = "<" + tag;
        validatedTagCache.set(tag, tagStartChunk);
      }
      return tagStartChunk;
    }
    function pushStartInstance(target$jscomp$0, type, props, resumableState, renderState, preambleState, hoistableState, formatContext, textEmbedded) {
      switch (type) {
        case "div":
        case "span":
        case "svg":
        case "path":
          break;
        case "a":
          target$jscomp$0.push(startChunkForTag("a"));
          var children = null, innerHTML = null, propKey;
          for (propKey in props)
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (null != propValue)
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  case "href":
                    "" === propValue ? pushStringAttribute(target$jscomp$0, "href", "") : pushAttribute(target$jscomp$0, propKey, propValue);
                    break;
                  default:
                    pushAttribute(target$jscomp$0, propKey, propValue);
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          pushInnerHTML(target$jscomp$0, innerHTML, children);
          if ("string" === typeof children) {
            target$jscomp$0.push(escapeTextForBrowser(children));
            var JSCompiler_inline_result = null;
          } else JSCompiler_inline_result = children;
          return JSCompiler_inline_result;
        case "g":
        case "p":
        case "li":
          break;
        case "select":
          target$jscomp$0.push(startChunkForTag("select"));
          var children$jscomp$0 = null, innerHTML$jscomp$0 = null, propKey$jscomp$0;
          for (propKey$jscomp$0 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$0)) {
              var propValue$jscomp$0 = props[propKey$jscomp$0];
              if (null != propValue$jscomp$0)
                switch (propKey$jscomp$0) {
                  case "children":
                    children$jscomp$0 = propValue$jscomp$0;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$0 = propValue$jscomp$0;
                    break;
                  case "defaultValue":
                  case "value":
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$0,
                      propValue$jscomp$0
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
          return children$jscomp$0;
        case "option":
          var selectedValue = formatContext.selectedValue;
          target$jscomp$0.push(startChunkForTag("option"));
          var children$jscomp$1 = null, value = null, selected = null, innerHTML$jscomp$1 = null, propKey$jscomp$1;
          for (propKey$jscomp$1 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$1)) {
              var propValue$jscomp$1 = props[propKey$jscomp$1];
              if (null != propValue$jscomp$1)
                switch (propKey$jscomp$1) {
                  case "children":
                    children$jscomp$1 = propValue$jscomp$1;
                    break;
                  case "selected":
                    selected = propValue$jscomp$1;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$1 = propValue$jscomp$1;
                    break;
                  case "value":
                    value = propValue$jscomp$1;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$1,
                      propValue$jscomp$1
                    );
                }
            }
          if (null != selectedValue) {
            var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
            if (isArrayImpl(selectedValue))
              for (var i = 0; i < selectedValue.length; i++) {
                if ("" + selectedValue[i] === stringValue) {
                  target$jscomp$0.push(' selected=""');
                  break;
                }
              }
            else
              "" + selectedValue === stringValue && target$jscomp$0.push(' selected=""');
          } else selected && target$jscomp$0.push(' selected=""');
          target$jscomp$0.push(">");
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
          return children$jscomp$1;
        case "textarea":
          target$jscomp$0.push(startChunkForTag("textarea"));
          var value$jscomp$0 = null, defaultValue = null, children$jscomp$2 = null, propKey$jscomp$2;
          for (propKey$jscomp$2 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$2)) {
              var propValue$jscomp$2 = props[propKey$jscomp$2];
              if (null != propValue$jscomp$2)
                switch (propKey$jscomp$2) {
                  case "children":
                    children$jscomp$2 = propValue$jscomp$2;
                    break;
                  case "value":
                    value$jscomp$0 = propValue$jscomp$2;
                    break;
                  case "defaultValue":
                    defaultValue = propValue$jscomp$2;
                    break;
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "`dangerouslySetInnerHTML` does not make sense on <textarea>."
                    );
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$2,
                      propValue$jscomp$2
                    );
                }
            }
          null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          if (null != children$jscomp$2) {
            if (null != value$jscomp$0)
              throw Error(
                "If you supply `defaultValue` on a <textarea>, do not pass children."
              );
            if (isArrayImpl(children$jscomp$2)) {
              if (1 < children$jscomp$2.length)
                throw Error("<textarea> can only have at most one child.");
              value$jscomp$0 = "" + children$jscomp$2[0];
            }
            value$jscomp$0 = "" + children$jscomp$2;
          }
          "string" === typeof value$jscomp$0 && "\n" === value$jscomp$0[0] && target$jscomp$0.push("\n");
          null !== value$jscomp$0 && target$jscomp$0.push(escapeTextForBrowser("" + value$jscomp$0));
          return null;
        case "input":
          target$jscomp$0.push(startChunkForTag("input"));
          var name = null, formAction = null, formEncType = null, formMethod = null, formTarget = null, value$jscomp$1 = null, defaultValue$jscomp$0 = null, checked = null, defaultChecked = null, propKey$jscomp$3;
          for (propKey$jscomp$3 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$3)) {
              var propValue$jscomp$3 = props[propKey$jscomp$3];
              if (null != propValue$jscomp$3)
                switch (propKey$jscomp$3) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  case "name":
                    name = propValue$jscomp$3;
                    break;
                  case "formAction":
                    formAction = propValue$jscomp$3;
                    break;
                  case "formEncType":
                    formEncType = propValue$jscomp$3;
                    break;
                  case "formMethod":
                    formMethod = propValue$jscomp$3;
                    break;
                  case "formTarget":
                    formTarget = propValue$jscomp$3;
                    break;
                  case "defaultChecked":
                    defaultChecked = propValue$jscomp$3;
                    break;
                  case "defaultValue":
                    defaultValue$jscomp$0 = propValue$jscomp$3;
                    break;
                  case "checked":
                    checked = propValue$jscomp$3;
                    break;
                  case "value":
                    value$jscomp$1 = propValue$jscomp$3;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$3,
                      propValue$jscomp$3
                    );
                }
            }
          var formData = pushFormActionAttribute(
            target$jscomp$0,
            resumableState,
            renderState,
            formAction,
            formEncType,
            formMethod,
            formTarget,
            name
          );
          null !== checked ? pushBooleanAttribute(target$jscomp$0, "checked", checked) : null !== defaultChecked && pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
          null !== value$jscomp$1 ? pushAttribute(target$jscomp$0, "value", value$jscomp$1) : null !== defaultValue$jscomp$0 && pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push("/>");
          null != formData && formData.forEach(pushAdditionalFormField, target$jscomp$0);
          return null;
        case "button":
          target$jscomp$0.push(startChunkForTag("button"));
          var children$jscomp$3 = null, innerHTML$jscomp$2 = null, name$jscomp$0 = null, formAction$jscomp$0 = null, formEncType$jscomp$0 = null, formMethod$jscomp$0 = null, formTarget$jscomp$0 = null, propKey$jscomp$4;
          for (propKey$jscomp$4 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$4)) {
              var propValue$jscomp$4 = props[propKey$jscomp$4];
              if (null != propValue$jscomp$4)
                switch (propKey$jscomp$4) {
                  case "children":
                    children$jscomp$3 = propValue$jscomp$4;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$2 = propValue$jscomp$4;
                    break;
                  case "name":
                    name$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formAction":
                    formAction$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formEncType":
                    formEncType$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formMethod":
                    formMethod$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formTarget":
                    formTarget$jscomp$0 = propValue$jscomp$4;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$4,
                      propValue$jscomp$4
                    );
                }
            }
          var formData$jscomp$0 = pushFormActionAttribute(
            target$jscomp$0,
            resumableState,
            renderState,
            formAction$jscomp$0,
            formEncType$jscomp$0,
            formMethod$jscomp$0,
            formTarget$jscomp$0,
            name$jscomp$0
          );
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          null != formData$jscomp$0 && formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
          if ("string" === typeof children$jscomp$3) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$3));
            var JSCompiler_inline_result$jscomp$0 = null;
          } else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
          return JSCompiler_inline_result$jscomp$0;
        case "form":
          target$jscomp$0.push(startChunkForTag("form"));
          var children$jscomp$4 = null, innerHTML$jscomp$3 = null, formAction$jscomp$1 = null, formEncType$jscomp$1 = null, formMethod$jscomp$1 = null, formTarget$jscomp$1 = null, propKey$jscomp$5;
          for (propKey$jscomp$5 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$5)) {
              var propValue$jscomp$5 = props[propKey$jscomp$5];
              if (null != propValue$jscomp$5)
                switch (propKey$jscomp$5) {
                  case "children":
                    children$jscomp$4 = propValue$jscomp$5;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$3 = propValue$jscomp$5;
                    break;
                  case "action":
                    formAction$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "encType":
                    formEncType$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "method":
                    formMethod$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "target":
                    formTarget$jscomp$1 = propValue$jscomp$5;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$5,
                      propValue$jscomp$5
                    );
                }
            }
          var formData$jscomp$1 = null, formActionName = null;
          if ("function" === typeof formAction$jscomp$1) {
            var customFields = getCustomFormFields(
              resumableState,
              formAction$jscomp$1
            );
            null !== customFields ? (formAction$jscomp$1 = customFields.action || "", formEncType$jscomp$1 = customFields.encType, formMethod$jscomp$1 = customFields.method, formTarget$jscomp$1 = customFields.target, formData$jscomp$1 = customFields.data, formActionName = customFields.name) : (target$jscomp$0.push(
              " ",
              "action",
              '="',
              actionJavaScriptURL,
              '"'
            ), formTarget$jscomp$1 = formMethod$jscomp$1 = formEncType$jscomp$1 = formAction$jscomp$1 = null, injectFormReplayingRuntime(resumableState, renderState));
          }
          null != formAction$jscomp$1 && pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
          null != formEncType$jscomp$1 && pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
          null != formMethod$jscomp$1 && pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
          null != formTarget$jscomp$1 && pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          null !== formActionName && (target$jscomp$0.push('<input type="hidden"'), pushStringAttribute(target$jscomp$0, "name", formActionName), target$jscomp$0.push("/>"), null != formData$jscomp$1 && formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
          if ("string" === typeof children$jscomp$4) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$4));
            var JSCompiler_inline_result$jscomp$1 = null;
          } else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
          return JSCompiler_inline_result$jscomp$1;
        case "menuitem":
          target$jscomp$0.push(startChunkForTag("menuitem"));
          for (var propKey$jscomp$6 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$6)) {
              var propValue$jscomp$6 = props[propKey$jscomp$6];
              if (null != propValue$jscomp$6)
                switch (propKey$jscomp$6) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "menuitems cannot have `children` nor `dangerouslySetInnerHTML`."
                    );
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$6,
                      propValue$jscomp$6
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          return null;
        case "object":
          target$jscomp$0.push(startChunkForTag("object"));
          var children$jscomp$5 = null, innerHTML$jscomp$4 = null, propKey$jscomp$7;
          for (propKey$jscomp$7 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$7)) {
              var propValue$jscomp$7 = props[propKey$jscomp$7];
              if (null != propValue$jscomp$7)
                switch (propKey$jscomp$7) {
                  case "children":
                    children$jscomp$5 = propValue$jscomp$7;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$4 = propValue$jscomp$7;
                    break;
                  case "data":
                    var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
                    if ("" === sanitizedValue) break;
                    target$jscomp$0.push(
                      " ",
                      "data",
                      '="',
                      escapeTextForBrowser(sanitizedValue),
                      '"'
                    );
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$7,
                      propValue$jscomp$7
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
          if ("string" === typeof children$jscomp$5) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$5));
            var JSCompiler_inline_result$jscomp$2 = null;
          } else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
          return JSCompiler_inline_result$jscomp$2;
        case "title":
          var noscriptTagInScope = formatContext.tagScope & 1, isFallback = formatContext.tagScope & 4;
          if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(
              target$jscomp$0,
              props
            );
          else
            isFallback ? JSCompiler_inline_result$jscomp$3 = null : (pushTitleImpl(renderState.hoistableChunks, props), JSCompiler_inline_result$jscomp$3 = void 0);
          return JSCompiler_inline_result$jscomp$3;
        case "link":
          var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1, isFallback$jscomp$0 = formatContext.tagScope & 4, rel = props.rel, href = props.href, precedence = props.precedence;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$0 || null != props.itemProp || "string" !== typeof rel || "string" !== typeof href || "" === href) {
            pushLinkImpl(target$jscomp$0, props);
            var JSCompiler_inline_result$jscomp$4 = null;
          } else if ("stylesheet" === props.rel)
            if ("string" !== typeof precedence || null != props.disabled || props.onLoad || props.onError)
              JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
                target$jscomp$0,
                props
              );
            else {
              var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
              if (null !== resourceState) {
                resumableState.styleResources[href] = null;
                styleQueue || (styleQueue = {
                  precedence: escapeTextForBrowser(precedence),
                  rules: [],
                  hrefs: [],
                  sheets: /* @__PURE__ */ new Map()
                }, renderState.styles.set(precedence, styleQueue));
                var resource = {
                  state: 0,
                  props: assign({}, props, {
                    "data-precedence": props.precedence,
                    precedence: null
                  })
                };
                if (resourceState) {
                  2 === resourceState.length && adoptPreloadCredentials(resource.props, resourceState);
                  var preloadResource = renderState.preloads.stylesheets.get(href);
                  preloadResource && 0 < preloadResource.length ? preloadResource.length = 0 : resource.state = 1;
                }
                styleQueue.sheets.set(href, resource);
                hoistableState && hoistableState.stylesheets.add(resource);
              } else if (styleQueue) {
                var resource$9 = styleQueue.sheets.get(href);
                resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
              }
              textEmbedded && target$jscomp$0.push("<!-- -->");
              JSCompiler_inline_result$jscomp$4 = null;
            }
          else
            props.onLoad || props.onError ? JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
              target$jscomp$0,
              props
            ) : (textEmbedded && target$jscomp$0.push("<!-- -->"), JSCompiler_inline_result$jscomp$4 = isFallback$jscomp$0 ? null : pushLinkImpl(renderState.hoistableChunks, props));
          return JSCompiler_inline_result$jscomp$4;
        case "script":
          var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1, asyncProp = props.async;
          if ("string" !== typeof props.src || !props.src || !asyncProp || "function" === typeof asyncProp || "symbol" === typeof asyncProp || props.onLoad || props.onError || 4 === formatContext.insertionMode || noscriptTagInScope$jscomp$1 || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(
              target$jscomp$0,
              props
            );
          else {
            var key = props.src;
            if ("module" === props.type) {
              var resources = resumableState.moduleScriptResources;
              var preloads = renderState.preloads.moduleScripts;
            } else
              resources = resumableState.scriptResources, preloads = renderState.preloads.scripts;
            var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
            if (null !== resourceState$jscomp$0) {
              resources[key] = null;
              var scriptProps = props;
              if (resourceState$jscomp$0) {
                2 === resourceState$jscomp$0.length && (scriptProps = assign({}, props), adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
                var preloadResource$jscomp$0 = preloads.get(key);
                preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
              }
              var resource$jscomp$0 = [];
              renderState.scripts.add(resource$jscomp$0);
              pushScriptImpl(resource$jscomp$0, scriptProps);
            }
            textEmbedded && target$jscomp$0.push("<!-- -->");
            JSCompiler_inline_result$jscomp$5 = null;
          }
          return JSCompiler_inline_result$jscomp$5;
        case "style":
          var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1, precedence$jscomp$0 = props.precedence, href$jscomp$0 = props.href, nonce = props.nonce;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$2 || null != props.itemProp || "string" !== typeof precedence$jscomp$0 || "string" !== typeof href$jscomp$0 || "" === href$jscomp$0) {
            target$jscomp$0.push(startChunkForTag("style"));
            var children$jscomp$6 = null, innerHTML$jscomp$5 = null, propKey$jscomp$8;
            for (propKey$jscomp$8 in props)
              if (hasOwnProperty.call(props, propKey$jscomp$8)) {
                var propValue$jscomp$8 = props[propKey$jscomp$8];
                if (null != propValue$jscomp$8)
                  switch (propKey$jscomp$8) {
                    case "children":
                      children$jscomp$6 = propValue$jscomp$8;
                      break;
                    case "dangerouslySetInnerHTML":
                      innerHTML$jscomp$5 = propValue$jscomp$8;
                      break;
                    default:
                      pushAttribute(
                        target$jscomp$0,
                        propKey$jscomp$8,
                        propValue$jscomp$8
                      );
                  }
              }
            target$jscomp$0.push(">");
            var child = Array.isArray(children$jscomp$6) ? 2 > children$jscomp$6.length ? children$jscomp$6[0] : null : children$jscomp$6;
            "function" !== typeof child && "symbol" !== typeof child && null !== child && void 0 !== child && target$jscomp$0.push(("" + child).replace(styleRegex, styleReplacer));
            pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
            target$jscomp$0.push(endChunkForTag("style"));
            var JSCompiler_inline_result$jscomp$6 = null;
          } else {
            var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
            if (null !== (resumableState.styleResources.hasOwnProperty(href$jscomp$0) ? resumableState.styleResources[href$jscomp$0] : void 0)) {
              resumableState.styleResources[href$jscomp$0] = null;
              styleQueue$jscomp$0 || (styleQueue$jscomp$0 = {
                precedence: escapeTextForBrowser(precedence$jscomp$0),
                rules: [],
                hrefs: [],
                sheets: /* @__PURE__ */ new Map()
              }, renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
              var nonceStyle = renderState.nonce.style;
              if (!nonceStyle || nonceStyle === nonce) {
                styleQueue$jscomp$0.hrefs.push(escapeTextForBrowser(href$jscomp$0));
                var target = styleQueue$jscomp$0.rules, children$jscomp$7 = null, innerHTML$jscomp$6 = null, propKey$jscomp$9;
                for (propKey$jscomp$9 in props)
                  if (hasOwnProperty.call(props, propKey$jscomp$9)) {
                    var propValue$jscomp$9 = props[propKey$jscomp$9];
                    if (null != propValue$jscomp$9)
                      switch (propKey$jscomp$9) {
                        case "children":
                          children$jscomp$7 = propValue$jscomp$9;
                          break;
                        case "dangerouslySetInnerHTML":
                          innerHTML$jscomp$6 = propValue$jscomp$9;
                      }
                  }
                var child$jscomp$0 = Array.isArray(children$jscomp$7) ? 2 > children$jscomp$7.length ? children$jscomp$7[0] : null : children$jscomp$7;
                "function" !== typeof child$jscomp$0 && "symbol" !== typeof child$jscomp$0 && null !== child$jscomp$0 && void 0 !== child$jscomp$0 && target.push(
                  ("" + child$jscomp$0).replace(styleRegex, styleReplacer)
                );
                pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
              }
            }
            styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
            textEmbedded && target$jscomp$0.push("<!-- -->");
            JSCompiler_inline_result$jscomp$6 = void 0;
          }
          return JSCompiler_inline_result$jscomp$6;
        case "meta":
          var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1, isFallback$jscomp$1 = formatContext.tagScope & 4;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$3 || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(
              target$jscomp$0,
              props,
              "meta",
              formatContext
            );
          else
            textEmbedded && target$jscomp$0.push("<!-- -->"), JSCompiler_inline_result$jscomp$7 = isFallback$jscomp$1 ? null : "string" === typeof props.charSet ? pushSelfClosing(
              renderState.charsetChunks,
              props,
              "meta",
              formatContext
            ) : "viewport" === props.name ? pushSelfClosing(
              renderState.viewportChunks,
              props,
              "meta",
              formatContext
            ) : pushSelfClosing(
              renderState.hoistableChunks,
              props,
              "meta",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$7;
        case "listing":
        case "pre":
          target$jscomp$0.push(startChunkForTag(type));
          var children$jscomp$8 = null, innerHTML$jscomp$7 = null, propKey$jscomp$10;
          for (propKey$jscomp$10 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$10)) {
              var propValue$jscomp$10 = props[propKey$jscomp$10];
              if (null != propValue$jscomp$10)
                switch (propKey$jscomp$10) {
                  case "children":
                    children$jscomp$8 = propValue$jscomp$10;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$7 = propValue$jscomp$10;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$10,
                      propValue$jscomp$10
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          if (null != innerHTML$jscomp$7) {
            if (null != children$jscomp$8)
              throw Error(
                "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
              );
            if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7))
              throw Error(
                "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
              );
            var html = innerHTML$jscomp$7.__html;
            null !== html && void 0 !== html && ("string" === typeof html && 0 < html.length && "\n" === html[0] ? target$jscomp$0.push("\n", html) : target$jscomp$0.push("" + html));
          }
          "string" === typeof children$jscomp$8 && "\n" === children$jscomp$8[0] && target$jscomp$0.push("\n");
          return children$jscomp$8;
        case "img":
          var pictureOrNoScriptTagInScope = formatContext.tagScope & 3, src = props.src, srcSet = props.srcSet;
          if (!("lazy" === props.loading || !src && !srcSet || "string" !== typeof src && null != src || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || pictureOrNoScriptTagInScope) && ("string" !== typeof src || ":" !== src[4] || "d" !== src[0] && "D" !== src[0] || "a" !== src[1] && "A" !== src[1] || "t" !== src[2] && "T" !== src[2] || "a" !== src[3] && "A" !== src[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
            null !== hoistableState && formatContext.tagScope & 64 && (hoistableState.suspenseyImages = true);
            var sizes = "string" === typeof props.sizes ? props.sizes : void 0, key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src, promotablePreloads = renderState.preloads.images, resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
            if (resource$jscomp$1) {
              if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size)
                promotablePreloads.delete(key$jscomp$0), renderState.highImagePreloads.add(resource$jscomp$1);
            } else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
              resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
              var input = props.crossOrigin;
              var JSCompiler_inline_result$jscomp$8 = "string" === typeof input ? "use-credentials" === input ? input : "" : void 0;
              var headers = renderState.headers, header;
              headers && 0 < headers.remainingCapacity && "string" !== typeof props.srcSet && ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) && (header = getPreloadAsHeader(src, "image", {
                imageSrcSet: props.srcSet,
                imageSizes: props.sizes,
                crossOrigin: JSCompiler_inline_result$jscomp$8,
                integrity: props.integrity,
                nonce: props.nonce,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy
              }), 0 <= (headers.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS, headers.highImagePreloads && (headers.highImagePreloads += ", "), headers.highImagePreloads += header) : (resource$jscomp$1 = [], pushLinkImpl(resource$jscomp$1, {
                rel: "preload",
                as: "image",
                href: srcSet ? void 0 : src,
                imageSrcSet: srcSet,
                imageSizes: sizes,
                crossOrigin: JSCompiler_inline_result$jscomp$8,
                integrity: props.integrity,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy
              }), "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size ? renderState.highImagePreloads.add(resource$jscomp$1) : (renderState.bulkPreloads.add(resource$jscomp$1), promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
            }
          }
          return pushSelfClosing(target$jscomp$0, props, "img", formatContext);
        case "base":
        case "area":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "param":
        case "source":
        case "track":
        case "wbr":
          return pushSelfClosing(target$jscomp$0, props, type, formatContext);
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          break;
        case "head":
          if (2 > formatContext.insertionMode) {
            var preamble = preambleState || renderState.preamble;
            if (preamble.headChunks)
              throw Error("The `<head>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push("<!--head-->");
            preamble.headChunks = [];
            var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(
              preamble.headChunks,
              props,
              "head",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "head",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$9;
        case "body":
          if (2 > formatContext.insertionMode) {
            var preamble$jscomp$0 = preambleState || renderState.preamble;
            if (preamble$jscomp$0.bodyChunks)
              throw Error("The `<body>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push("<!--body-->");
            preamble$jscomp$0.bodyChunks = [];
            var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(
              preamble$jscomp$0.bodyChunks,
              props,
              "body",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "body",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$10;
        case "html":
          if (0 === formatContext.insertionMode) {
            var preamble$jscomp$1 = preambleState || renderState.preamble;
            if (preamble$jscomp$1.htmlChunks)
              throw Error("The `<html>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push("<!--html-->");
            preamble$jscomp$1.htmlChunks = [""];
            var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(
              preamble$jscomp$1.htmlChunks,
              props,
              "html",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "html",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$11;
        default:
          if (-1 !== type.indexOf("-")) {
            target$jscomp$0.push(startChunkForTag(type));
            var children$jscomp$9 = null, innerHTML$jscomp$8 = null, propKey$jscomp$11;
            for (propKey$jscomp$11 in props)
              if (hasOwnProperty.call(props, propKey$jscomp$11)) {
                var propValue$jscomp$11 = props[propKey$jscomp$11];
                if (null != propValue$jscomp$11) {
                  var attributeName = propKey$jscomp$11;
                  switch (propKey$jscomp$11) {
                    case "children":
                      children$jscomp$9 = propValue$jscomp$11;
                      break;
                    case "dangerouslySetInnerHTML":
                      innerHTML$jscomp$8 = propValue$jscomp$11;
                      break;
                    case "style":
                      pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
                      break;
                    case "suppressContentEditableWarning":
                    case "suppressHydrationWarning":
                    case "ref":
                      break;
                    case "className":
                      attributeName = "class";
                    default:
                      if (isAttributeNameSafe(propKey$jscomp$11) && "function" !== typeof propValue$jscomp$11 && "symbol" !== typeof propValue$jscomp$11 && false !== propValue$jscomp$11) {
                        if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
                        else if ("object" === typeof propValue$jscomp$11) continue;
                        target$jscomp$0.push(
                          " ",
                          attributeName,
                          '="',
                          escapeTextForBrowser(propValue$jscomp$11),
                          '"'
                        );
                      }
                  }
                }
              }
            pushViewTransitionAttributes(target$jscomp$0, formatContext);
            target$jscomp$0.push(">");
            pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
            return children$jscomp$9;
          }
      }
      return pushStartGenericElement(target$jscomp$0, props, type, formatContext);
    }
    var endTagCache = /* @__PURE__ */ new Map();
    function endChunkForTag(tag) {
      var chunk = endTagCache.get(tag);
      void 0 === chunk && (chunk = "</" + tag + ">", endTagCache.set(tag, chunk));
      return chunk;
    }
    function hoistPreambleState(renderState, preambleState) {
      renderState = renderState.preamble;
      null === renderState.htmlChunks && preambleState.htmlChunks && (renderState.htmlChunks = preambleState.htmlChunks);
      null === renderState.headChunks && preambleState.headChunks && (renderState.headChunks = preambleState.headChunks);
      null === renderState.bodyChunks && preambleState.bodyChunks && (renderState.bodyChunks = preambleState.bodyChunks);
    }
    function writeBootstrap(destination, renderState) {
      renderState = renderState.bootstrapChunks;
      for (var i = 0; i < renderState.length - 1; i++)
        destination.push(renderState[i]);
      return i < renderState.length ? (i = renderState[i], renderState.length = 0, destination.push(i)) : true;
    }
    function writeStartPendingSuspenseBoundary(destination, renderState, id) {
      destination.push('<!--$?--><template id="');
      if (null === id)
        throw Error(
          "An ID must have been assigned before we can complete the boundary."
        );
      destination.push(renderState.boundaryPrefix);
      renderState = id.toString(16);
      destination.push(renderState);
      return destination.push('"></template>');
    }
    function writeStartSegment(destination, renderState, formatContext, id) {
      switch (formatContext.insertionMode) {
        case 0:
        case 1:
        case 3:
        case 2:
          return destination.push('<div hidden id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 4:
          return destination.push('<svg aria-hidden="true" style="display:none" id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 5:
          return destination.push('<math aria-hidden="true" style="display:none" id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 6:
          return destination.push('<table hidden id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 7:
          return destination.push('<table hidden><tbody id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 8:
          return destination.push('<table hidden><tr id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 9:
          return destination.push('<table hidden><colgroup id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        default:
          throw Error("Unknown insertion mode. This is a bug in React.");
      }
    }
    function writeEndSegment(destination, formatContext) {
      switch (formatContext.insertionMode) {
        case 0:
        case 1:
        case 3:
        case 2:
          return destination.push("</div>");
        case 4:
          return destination.push("</svg>");
        case 5:
          return destination.push("</math>");
        case 6:
          return destination.push("</table>");
        case 7:
          return destination.push("</tbody></table>");
        case 8:
          return destination.push("</tr></table>");
        case 9:
          return destination.push("</colgroup></table>");
        default:
          throw Error("Unknown insertion mode. This is a bug in React.");
      }
    }
    var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
    function escapeJSStringsForInstructionScripts(input) {
      return JSON.stringify(input).replace(
        regexForJSStringsInInstructionScripts,
        function(match) {
          switch (match) {
            case "<":
              return "\\u003c";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            default:
              throw Error(
                "escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
              );
          }
        }
      );
    }
    var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
    function escapeJSObjectForInstructionScripts(input) {
      return JSON.stringify(input).replace(
        regexForJSStringsInScripts,
        function(match) {
          switch (match) {
            case "&":
              return "\\u0026";
            case ">":
              return "\\u003e";
            case "<":
              return "\\u003c";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            default:
              throw Error(
                "escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
              );
          }
        }
      );
    }
    var currentlyRenderingBoundaryHasStylesToHoist = false;
    var destinationHasCapacity = true;
    function flushStyleTagsLateForBoundary(styleQueue) {
      var rules = styleQueue.rules, hrefs = styleQueue.hrefs, i = 0;
      if (hrefs.length) {
        this.push(currentlyFlushingRenderState.startInlineStyle);
        this.push(' media="not all" data-precedence="');
        this.push(styleQueue.precedence);
        for (this.push('" data-href="'); i < hrefs.length - 1; i++)
          this.push(hrefs[i]), this.push(" ");
        this.push(hrefs[i]);
        this.push('">');
        for (i = 0; i < rules.length; i++) this.push(rules[i]);
        destinationHasCapacity = this.push("</style>");
        currentlyRenderingBoundaryHasStylesToHoist = true;
        rules.length = 0;
        hrefs.length = 0;
      }
    }
    function hasStylesToHoist(stylesheet) {
      return 2 !== stylesheet.state ? currentlyRenderingBoundaryHasStylesToHoist = true : false;
    }
    function writeHoistablesForBoundary(destination, hoistableState, renderState) {
      currentlyRenderingBoundaryHasStylesToHoist = false;
      destinationHasCapacity = true;
      currentlyFlushingRenderState = renderState;
      hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
      currentlyFlushingRenderState = null;
      hoistableState.stylesheets.forEach(hasStylesToHoist);
      currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = true);
      return destinationHasCapacity;
    }
    function flushResource(resource) {
      for (var i = 0; i < resource.length; i++) this.push(resource[i]);
      resource.length = 0;
    }
    var stylesheetFlushingQueue = [];
    function flushStyleInPreamble(stylesheet) {
      pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
      for (var i = 0; i < stylesheetFlushingQueue.length; i++)
        this.push(stylesheetFlushingQueue[i]);
      stylesheetFlushingQueue.length = 0;
      stylesheet.state = 2;
    }
    function flushStylesInPreamble(styleQueue) {
      var hasStylesheets = 0 < styleQueue.sheets.size;
      styleQueue.sheets.forEach(flushStyleInPreamble, this);
      styleQueue.sheets.clear();
      var rules = styleQueue.rules, hrefs = styleQueue.hrefs;
      if (!hasStylesheets || hrefs.length) {
        this.push(currentlyFlushingRenderState.startInlineStyle);
        this.push(' data-precedence="');
        this.push(styleQueue.precedence);
        styleQueue = 0;
        if (hrefs.length) {
          for (this.push('" data-href="'); styleQueue < hrefs.length - 1; styleQueue++)
            this.push(hrefs[styleQueue]), this.push(" ");
          this.push(hrefs[styleQueue]);
        }
        this.push('">');
        for (styleQueue = 0; styleQueue < rules.length; styleQueue++)
          this.push(rules[styleQueue]);
        this.push("</style>");
        rules.length = 0;
        hrefs.length = 0;
      }
    }
    function preloadLateStyle(stylesheet) {
      if (0 === stylesheet.state) {
        stylesheet.state = 1;
        var props = stylesheet.props;
        pushLinkImpl(stylesheetFlushingQueue, {
          rel: "preload",
          as: "style",
          href: stylesheet.props.href,
          crossOrigin: props.crossOrigin,
          fetchPriority: props.fetchPriority,
          integrity: props.integrity,
          media: props.media,
          hrefLang: props.hrefLang,
          referrerPolicy: props.referrerPolicy
        });
        for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++)
          this.push(stylesheetFlushingQueue[stylesheet]);
        stylesheetFlushingQueue.length = 0;
      }
    }
    function preloadLateStyles(styleQueue) {
      styleQueue.sheets.forEach(preloadLateStyle, this);
      styleQueue.sheets.clear();
    }
    function pushCompletedShellIdAttribute(target, resumableState) {
      0 === (resumableState.instructions & 32) && (resumableState.instructions |= 32, target.push(
        ' id="',
        escapeTextForBrowser("_" + resumableState.idPrefix + "R_"),
        '"'
      ));
    }
    function writeStyleResourceDependenciesInJS(destination, hoistableState) {
      destination.push("[");
      var nextArrayOpenBrackChunk = "[";
      hoistableState.stylesheets.forEach(function(resource) {
        if (2 !== resource.state)
          if (3 === resource.state)
            destination.push(nextArrayOpenBrackChunk), resource = escapeJSObjectForInstructionScripts(
              "" + resource.props.href
            ), destination.push(resource), destination.push("]"), nextArrayOpenBrackChunk = ",[";
          else {
            destination.push(nextArrayOpenBrackChunk);
            var precedence = resource.props["data-precedence"], props = resource.props, coercedHref = sanitizeURL("" + resource.props.href);
            coercedHref = escapeJSObjectForInstructionScripts(coercedHref);
            destination.push(coercedHref);
            precedence = "" + precedence;
            destination.push(",");
            precedence = escapeJSObjectForInstructionScripts(precedence);
            destination.push(precedence);
            for (var propKey in props)
              if (hasOwnProperty.call(props, propKey) && (precedence = props[propKey], null != precedence))
                switch (propKey) {
                  case "href":
                  case "rel":
                  case "precedence":
                  case "data-precedence":
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  default:
                    writeStyleResourceAttributeInJS(
                      destination,
                      propKey,
                      precedence
                    );
                }
            destination.push("]");
            nextArrayOpenBrackChunk = ",[";
            resource.state = 3;
          }
      });
      destination.push("]");
    }
    function writeStyleResourceAttributeInJS(destination, name, value) {
      var attributeName = name.toLowerCase();
      switch (typeof value) {
        case "function":
        case "symbol":
          return;
      }
      switch (name) {
        case "innerHTML":
        case "dangerouslySetInnerHTML":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "style":
        case "ref":
          return;
        case "className":
          attributeName = "class";
          name = "" + value;
          break;
        case "hidden":
          if (false === value) return;
          name = "";
          break;
        case "src":
        case "href":
          value = sanitizeURL(value);
          name = "" + value;
          break;
        default:
          if (2 < name.length && ("o" === name[0] || "O" === name[0]) && ("n" === name[1] || "N" === name[1]) || !isAttributeNameSafe(name))
            return;
          name = "" + value;
      }
      destination.push(",");
      attributeName = escapeJSObjectForInstructionScripts(attributeName);
      destination.push(attributeName);
      destination.push(",");
      attributeName = escapeJSObjectForInstructionScripts(name);
      destination.push(attributeName);
    }
    function createHoistableState() {
      return { styles: /* @__PURE__ */ new Set(), stylesheets: /* @__PURE__ */ new Set(), suspenseyImages: false };
    }
    function prefetchDNS(href) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if ("string" === typeof href && href) {
          if (!resumableState.dnsResources.hasOwnProperty(href)) {
            resumableState.dnsResources[href] = null;
            resumableState = renderState.headers;
            var header, JSCompiler_temp;
            if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity)
              JSCompiler_temp = (header = "<" + ("" + href).replace(
                regexForHrefInLinkHeaderURLContext,
                escapeHrefForLinkHeaderURLContextReplacer
              ) + ">; rel=dns-prefetch", 0 <= (resumableState.remainingCapacity -= header.length + 2));
            JSCompiler_temp ? (renderState.resets.dns[href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (header = [], pushLinkImpl(header, { href, rel: "dns-prefetch" }), renderState.preconnects.add(header));
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.D(href);
    }
    function preconnect(href, crossOrigin) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if ("string" === typeof href && href) {
          var bucket = "use-credentials" === crossOrigin ? "credentials" : "string" === typeof crossOrigin ? "anonymous" : "default";
          if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
            resumableState.connectResources[bucket][href] = null;
            resumableState = renderState.headers;
            var header, JSCompiler_temp;
            if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity) {
              JSCompiler_temp = "<" + ("" + href).replace(
                regexForHrefInLinkHeaderURLContext,
                escapeHrefForLinkHeaderURLContextReplacer
              ) + ">; rel=preconnect";
              if ("string" === typeof crossOrigin) {
                var escapedCrossOrigin = ("" + crossOrigin).replace(
                  regexForLinkHeaderQuotedParamValueContext,
                  escapeStringForLinkHeaderQuotedParamValueContextReplacer
                );
                JSCompiler_temp += '; crossorigin="' + escapedCrossOrigin + '"';
              }
              JSCompiler_temp = (header = JSCompiler_temp, 0 <= (resumableState.remainingCapacity -= header.length + 2));
            }
            JSCompiler_temp ? (renderState.resets.connect[bucket][href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (bucket = [], pushLinkImpl(bucket, {
              rel: "preconnect",
              href,
              crossOrigin
            }), renderState.preconnects.add(bucket));
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.C(href, crossOrigin);
    }
    function preload(href, as, options) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (as && href) {
          switch (as) {
            case "image":
              if (options) {
                var imageSrcSet = options.imageSrcSet;
                var imageSizes = options.imageSizes;
                var fetchPriority = options.fetchPriority;
              }
              var key = imageSrcSet ? imageSrcSet + "\n" + (imageSizes || "") : href;
              if (resumableState.imageResources.hasOwnProperty(key)) return;
              resumableState.imageResources[key] = PRELOAD_NO_CREDS;
              resumableState = renderState.headers;
              var header;
              resumableState && 0 < resumableState.remainingCapacity && "string" !== typeof imageSrcSet && "high" === fetchPriority && (header = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key] = PRELOAD_NO_CREDS, resumableState.highImagePreloads && (resumableState.highImagePreloads += ", "), resumableState.highImagePreloads += header) : (resumableState = [], pushLinkImpl(
                resumableState,
                assign(
                  { rel: "preload", href: imageSrcSet ? void 0 : href, as },
                  options
                )
              ), "high" === fetchPriority ? renderState.highImagePreloads.add(resumableState) : (renderState.bulkPreloads.add(resumableState), renderState.preloads.images.set(key, resumableState)));
              break;
            case "style":
              if (resumableState.styleResources.hasOwnProperty(href)) return;
              imageSrcSet = [];
              pushLinkImpl(
                imageSrcSet,
                assign({ rel: "preload", href, as }, options)
              );
              resumableState.styleResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              renderState.preloads.stylesheets.set(href, imageSrcSet);
              renderState.bulkPreloads.add(imageSrcSet);
              break;
            case "script":
              if (resumableState.scriptResources.hasOwnProperty(href)) return;
              imageSrcSet = [];
              renderState.preloads.scripts.set(href, imageSrcSet);
              renderState.bulkPreloads.add(imageSrcSet);
              pushLinkImpl(
                imageSrcSet,
                assign({ rel: "preload", href, as }, options)
              );
              resumableState.scriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              break;
            default:
              if (resumableState.unknownResources.hasOwnProperty(as)) {
                if (imageSrcSet = resumableState.unknownResources[as], imageSrcSet.hasOwnProperty(href))
                  return;
              } else
                imageSrcSet = {}, resumableState.unknownResources[as] = imageSrcSet;
              imageSrcSet[href] = PRELOAD_NO_CREDS;
              if ((resumableState = renderState.headers) && 0 < resumableState.remainingCapacity && "font" === as && (key = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= key.length + 2)))
                renderState.resets.font[href] = PRELOAD_NO_CREDS, resumableState.fontPreloads && (resumableState.fontPreloads += ", "), resumableState.fontPreloads += key;
              else
                switch (resumableState = [], href = assign({ rel: "preload", href, as }, options), pushLinkImpl(resumableState, href), as) {
                  case "font":
                    renderState.fontPreloads.add(resumableState);
                    break;
                  default:
                    renderState.bulkPreloads.add(resumableState);
                }
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.L(href, as, options);
    }
    function preloadModule(href, options) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (href) {
          var as = options && "string" === typeof options.as ? options.as : "script";
          switch (as) {
            case "script":
              if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
              as = [];
              resumableState.moduleScriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              renderState.preloads.moduleScripts.set(href, as);
              break;
            default:
              if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
                var resources = resumableState.moduleUnknownResources[as];
                if (resources.hasOwnProperty(href)) return;
              } else
                resources = {}, resumableState.moduleUnknownResources[as] = resources;
              as = [];
              resources[href] = PRELOAD_NO_CREDS;
          }
          pushLinkImpl(as, assign({ rel: "modulepreload", href }, options));
          renderState.bulkPreloads.add(as);
          enqueueFlush(request);
        }
      } else previousDispatcher.m(href, options);
    }
    function preinitStyle(href, precedence, options) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (href) {
          precedence = precedence || "default";
          var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
          null !== resourceState && (resumableState.styleResources[href] = null, styleQueue || (styleQueue = {
            precedence: escapeTextForBrowser(precedence),
            rules: [],
            hrefs: [],
            sheets: /* @__PURE__ */ new Map()
          }, renderState.styles.set(precedence, styleQueue)), precedence = {
            state: 0,
            props: assign(
              { rel: "stylesheet", href, "data-precedence": precedence },
              options
            )
          }, resourceState && (2 === resourceState.length && adoptPreloadCredentials(precedence.props, resourceState), (renderState = renderState.preloads.stylesheets.get(href)) && 0 < renderState.length ? renderState.length = 0 : precedence.state = 1), styleQueue.sheets.set(href, precedence), enqueueFlush(request));
        }
      } else previousDispatcher.S(href, precedence, options);
    }
    function preinitScript(src, options) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (src) {
          var resourceState = resumableState.scriptResources.hasOwnProperty(src) ? resumableState.scriptResources[src] : void 0;
          null !== resourceState && (resumableState.scriptResources[src] = null, options = assign({ src, async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.scripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
        }
      } else previousDispatcher.X(src, options);
    }
    function preinitModuleScript(src, options) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (src) {
          var resourceState = resumableState.moduleScriptResources.hasOwnProperty(
            src
          ) ? resumableState.moduleScriptResources[src] : void 0;
          null !== resourceState && (resumableState.moduleScriptResources[src] = null, options = assign({ src, type: "module", async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.moduleScripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
        }
      } else previousDispatcher.M(src, options);
    }
    function adoptPreloadCredentials(target, preloadState) {
      null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
      null == target.integrity && (target.integrity = preloadState[1]);
    }
    function getPreloadAsHeader(href, as, params) {
      href = ("" + href).replace(
        regexForHrefInLinkHeaderURLContext,
        escapeHrefForLinkHeaderURLContextReplacer
      );
      as = ("" + as).replace(
        regexForLinkHeaderQuotedParamValueContext,
        escapeStringForLinkHeaderQuotedParamValueContextReplacer
      );
      as = "<" + href + '>; rel=preload; as="' + as + '"';
      for (var paramName in params)
        hasOwnProperty.call(params, paramName) && (href = params[paramName], "string" === typeof href && (as += "; " + paramName.toLowerCase() + '="' + ("" + href).replace(
          regexForLinkHeaderQuotedParamValueContext,
          escapeStringForLinkHeaderQuotedParamValueContextReplacer
        ) + '"'));
      return as;
    }
    var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
    function escapeHrefForLinkHeaderURLContextReplacer(match) {
      switch (match) {
        case "<":
          return "%3C";
        case ">":
          return "%3E";
        case "\n":
          return "%0A";
        case "\r":
          return "%0D";
        default:
          throw Error(
            "escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
          );
      }
    }
    var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
    function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
      switch (match) {
        case '"':
          return "%22";
        case "'":
          return "%27";
        case ";":
          return "%3B";
        case ",":
          return "%2C";
        case "\n":
          return "%0A";
        case "\r":
          return "%0D";
        default:
          throw Error(
            "escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
          );
      }
    }
    function hoistStyleQueueDependency(styleQueue) {
      this.styles.add(styleQueue);
    }
    function hoistStylesheetDependency(stylesheet) {
      this.stylesheets.add(stylesheet);
    }
    function hoistHoistables(parentState, childState) {
      childState.styles.forEach(hoistStyleQueueDependency, parentState);
      childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
      childState.suspenseyImages && (parentState.suspenseyImages = true);
    }
    function createRenderState(resumableState, generateStaticMarkup) {
      var idPrefix = resumableState.idPrefix, bootstrapChunks = [], bootstrapScriptContent = resumableState.bootstrapScriptContent, bootstrapScripts = resumableState.bootstrapScripts, bootstrapModules = resumableState.bootstrapModules;
      void 0 !== bootstrapScriptContent && (bootstrapChunks.push("<script"), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
        ">",
        ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer),
        "</script>"
      ));
      bootstrapScriptContent = idPrefix + "P:";
      var JSCompiler_object_inline_segmentPrefix_1724 = idPrefix + "S:";
      idPrefix += "B:";
      var JSCompiler_object_inline_preconnects_1738 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_fontPreloads_1739 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_highImagePreloads_1740 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_styles_1741 = /* @__PURE__ */ new Map(), JSCompiler_object_inline_bootstrapScripts_1742 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_scripts_1743 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_bulkPreloads_1744 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_preloads_1745 = {
        images: /* @__PURE__ */ new Map(),
        stylesheets: /* @__PURE__ */ new Map(),
        scripts: /* @__PURE__ */ new Map(),
        moduleScripts: /* @__PURE__ */ new Map()
      };
      if (void 0 !== bootstrapScripts)
        for (var i = 0; i < bootstrapScripts.length; i++) {
          var scriptConfig = bootstrapScripts[i], src, crossOrigin = void 0, integrity = void 0, props = {
            rel: "preload",
            as: "script",
            fetchPriority: "low",
            nonce: void 0
          };
          "string" === typeof scriptConfig ? props.href = src = scriptConfig : (props.href = src = scriptConfig.src, props.integrity = integrity = "string" === typeof scriptConfig.integrity ? scriptConfig.integrity : void 0, props.crossOrigin = crossOrigin = "string" === typeof scriptConfig || null == scriptConfig.crossOrigin ? void 0 : "use-credentials" === scriptConfig.crossOrigin ? "use-credentials" : "");
          scriptConfig = resumableState;
          var href = src;
          scriptConfig.scriptResources[href] = null;
          scriptConfig.moduleScriptResources[href] = null;
          scriptConfig = [];
          pushLinkImpl(scriptConfig, props);
          JSCompiler_object_inline_bootstrapScripts_1742.add(scriptConfig);
          bootstrapChunks.push('<script src="', escapeTextForBrowser(src), '"');
          "string" === typeof integrity && bootstrapChunks.push(
            ' integrity="',
            escapeTextForBrowser(integrity),
            '"'
          );
          "string" === typeof crossOrigin && bootstrapChunks.push(
            ' crossorigin="',
            escapeTextForBrowser(crossOrigin),
            '"'
          );
          pushCompletedShellIdAttribute(bootstrapChunks, resumableState);
          bootstrapChunks.push(' async=""></script>');
        }
      if (void 0 !== bootstrapModules)
        for (bootstrapScripts = 0; bootstrapScripts < bootstrapModules.length; bootstrapScripts++)
          props = bootstrapModules[bootstrapScripts], crossOrigin = src = void 0, integrity = {
            rel: "modulepreload",
            fetchPriority: "low",
            nonce: void 0
          }, "string" === typeof props ? integrity.href = i = props : (integrity.href = i = props.src, integrity.integrity = crossOrigin = "string" === typeof props.integrity ? props.integrity : void 0, integrity.crossOrigin = src = "string" === typeof props || null == props.crossOrigin ? void 0 : "use-credentials" === props.crossOrigin ? "use-credentials" : ""), props = resumableState, scriptConfig = i, props.scriptResources[scriptConfig] = null, props.moduleScriptResources[scriptConfig] = null, props = [], pushLinkImpl(props, integrity), JSCompiler_object_inline_bootstrapScripts_1742.add(props), bootstrapChunks.push(
            '<script type="module" src="',
            escapeTextForBrowser(i),
            '"'
          ), "string" === typeof crossOrigin && bootstrapChunks.push(
            ' integrity="',
            escapeTextForBrowser(crossOrigin),
            '"'
          ), "string" === typeof src && bootstrapChunks.push(
            ' crossorigin="',
            escapeTextForBrowser(src),
            '"'
          ), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(' async=""></script>');
      return {
        placeholderPrefix: bootstrapScriptContent,
        segmentPrefix: JSCompiler_object_inline_segmentPrefix_1724,
        boundaryPrefix: idPrefix,
        startInlineScript: "<script",
        startInlineStyle: "<style",
        preamble: { htmlChunks: null, headChunks: null, bodyChunks: null },
        externalRuntimeScript: null,
        bootstrapChunks,
        importMapChunks: [],
        onHeaders: void 0,
        headers: null,
        resets: {
          font: {},
          dns: {},
          connect: { default: {}, anonymous: {}, credentials: {} },
          image: {},
          style: {}
        },
        charsetChunks: [],
        viewportChunks: [],
        hoistableChunks: [],
        preconnects: JSCompiler_object_inline_preconnects_1738,
        fontPreloads: JSCompiler_object_inline_fontPreloads_1739,
        highImagePreloads: JSCompiler_object_inline_highImagePreloads_1740,
        styles: JSCompiler_object_inline_styles_1741,
        bootstrapScripts: JSCompiler_object_inline_bootstrapScripts_1742,
        scripts: JSCompiler_object_inline_scripts_1743,
        bulkPreloads: JSCompiler_object_inline_bulkPreloads_1744,
        preloads: JSCompiler_object_inline_preloads_1745,
        nonce: { script: void 0, style: void 0 },
        stylesToHoist: false,
        generateStaticMarkup
      };
    }
    function pushTextInstance(target, text, renderState, textEmbedded) {
      if (renderState.generateStaticMarkup)
        return target.push(escapeTextForBrowser(text)), false;
      "" === text ? target = textEmbedded : (textEmbedded && target.push("<!-- -->"), target.push(escapeTextForBrowser(text)), target = true);
      return target;
    }
    function pushSegmentFinale(target, renderState, lastPushedText, textEmbedded) {
      renderState.generateStaticMarkup || lastPushedText && textEmbedded && target.push("<!-- -->");
    }
    var bind = Function.prototype.bind;
    var REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
    function getComponentNameFromType(type) {
      if (null == type) return null;
      if ("function" === typeof type)
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
        case REACT_VIEW_TRANSITION_TYPE:
          return "ViewTransition";
      }
      if ("object" === typeof type)
        switch (type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {
            }
        }
      return null;
    }
    var emptyContextObject = {};
    var currentActiveSnapshot = null;
    function popToNearestCommonAncestor(prev, next) {
      if (prev !== next) {
        prev.context._currentValue2 = prev.parentValue;
        prev = prev.parent;
        var parentNext = next.parent;
        if (null === prev) {
          if (null !== parentNext)
            throw Error(
              "The stacks must reach the root at the same time. This is a bug in React."
            );
        } else {
          if (null === parentNext)
            throw Error(
              "The stacks must reach the root at the same time. This is a bug in React."
            );
          popToNearestCommonAncestor(prev, parentNext);
        }
        next.context._currentValue2 = next.value;
      }
    }
    function popAllPrevious(prev) {
      prev.context._currentValue2 = prev.parentValue;
      prev = prev.parent;
      null !== prev && popAllPrevious(prev);
    }
    function pushAllNext(next) {
      var parentNext = next.parent;
      null !== parentNext && pushAllNext(parentNext);
      next.context._currentValue2 = next.value;
    }
    function popPreviousToCommonLevel(prev, next) {
      prev.context._currentValue2 = prev.parentValue;
      prev = prev.parent;
      if (null === prev)
        throw Error(
          "The depth must equal at least at zero before reaching the root. This is a bug in React."
        );
      prev.depth === next.depth ? popToNearestCommonAncestor(prev, next) : popPreviousToCommonLevel(prev, next);
    }
    function popNextToCommonLevel(prev, next) {
      var parentNext = next.parent;
      if (null === parentNext)
        throw Error(
          "The depth must equal at least at zero before reaching the root. This is a bug in React."
        );
      prev.depth === parentNext.depth ? popToNearestCommonAncestor(prev, parentNext) : popNextToCommonLevel(prev, parentNext);
      next.context._currentValue2 = next.value;
    }
    function switchContext(newSnapshot) {
      var prev = currentActiveSnapshot;
      prev !== newSnapshot && (null === prev ? pushAllNext(newSnapshot) : null === newSnapshot ? popAllPrevious(prev) : prev.depth === newSnapshot.depth ? popToNearestCommonAncestor(prev, newSnapshot) : prev.depth > newSnapshot.depth ? popPreviousToCommonLevel(prev, newSnapshot) : popNextToCommonLevel(prev, newSnapshot), currentActiveSnapshot = newSnapshot);
    }
    var classComponentUpdater = {
      enqueueSetState: function(inst, payload) {
        inst = inst._reactInternals;
        null !== inst.queue && inst.queue.push(payload);
      },
      enqueueReplaceState: function(inst, payload) {
        inst = inst._reactInternals;
        inst.replace = true;
        inst.queue = [payload];
      },
      enqueueForceUpdate: function() {
      }
    };
    var emptyTreeContext = { id: 1, overflow: "" };
    function getTreeId(context) {
      var overflow = context.overflow;
      context = context.id;
      return (context & ~(1 << 32 - clz32(context) - 1)).toString(32) + overflow;
    }
    function pushTreeContext(baseContext, totalChildren, index) {
      var baseIdWithLeadingBit = baseContext.id;
      baseContext = baseContext.overflow;
      var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
      baseIdWithLeadingBit &= ~(1 << baseLength);
      index += 1;
      var length = 32 - clz32(totalChildren) + baseLength;
      if (30 < length) {
        var numberOfOverflowBits = baseLength - baseLength % 5;
        length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
        baseIdWithLeadingBit >>= numberOfOverflowBits;
        baseLength -= numberOfOverflowBits;
        return {
          id: 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit,
          overflow: length + baseContext
        };
      }
      return {
        id: 1 << length | index << baseLength | baseIdWithLeadingBit,
        overflow: baseContext
      };
    }
    var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
    var log = Math.log;
    var LN2 = Math.LN2;
    function clz32Fallback(x) {
      x >>>= 0;
      return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
    }
    function noop() {
    }
    var SuspenseException = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
    );
    function trackUsedThenable(thenableState2, thenable, index) {
      index = thenableState2[index];
      void 0 === index ? thenableState2.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          thenableState2 = thenable.reason;
          if (void 0 === thenableState2 && !("reason" in thenable))
            throw Error(
              "A rejected Promise was passed to React without a `reason` property. React threw a generic error from where the Promise was used to assist in identifying the problematic Promise. Make sure that instrumented Promises correctly set the `reason` property when setting `status` to `'rejected'`."
            );
          throw thenableState2;
        default:
          "string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState2 = thenable, thenableState2.status = "pending", thenableState2.then(
            function(fulfilledValue) {
              if ("pending" === thenable.status) {
                var fulfilledThenable = thenable;
                fulfilledThenable.status = "fulfilled";
                fulfilledThenable.value = fulfilledValue;
              }
            },
            function(error) {
              if ("pending" === thenable.status) {
                var rejectedThenable = thenable;
                rejectedThenable.status = "rejected";
                rejectedThenable.reason = error;
              }
            }
          ));
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
          suspendedThenable = thenable;
          throw SuspenseException;
      }
    }
    var suspendedThenable = null;
    function getSuspendedThenable() {
      if (null === suspendedThenable)
        throw Error(
          "Expected a suspended thenable. This is a bug in React. Please file an issue."
        );
      var thenable = suspendedThenable;
      suspendedThenable = null;
      return thenable;
    }
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is;
    var currentlyRenderingComponent = null;
    var currentlyRenderingTask = null;
    var currentlyRenderingRequest = null;
    var currentlyRenderingKeyPath = null;
    var firstWorkInProgressHook = null;
    var workInProgressHook = null;
    var isReRender = false;
    var didScheduleRenderPhaseUpdate = false;
    var localIdCounter = 0;
    var actionStateCounter = 0;
    var actionStateMatchingIndex = -1;
    var thenableIndexCounter = 0;
    var thenableState = null;
    function createRecoverableError(recoverable) {
      recoverable = recoverable._reason;
      if ("function" === typeof recoverable)
        try {
          var initializedReason = recoverable();
        } catch ($jscomp$unused$catch) {
          initializedReason = "The reason for browser-only rendering could not be determined because its initializer threw.";
        }
      else initializedReason = recoverable;
      initializedReason = Error(
        "Browser-only rendering was requested by `browser()`.",
        void 0 === recoverable ? void 0 : { cause: initializedReason }
      );
      Object.defineProperty(initializedReason, REACT_RECOVERABLE_TYPE, {
        value: true
      });
      return initializedReason;
    }
    function isRecoverableError(error) {
      return "object" !== typeof error || null === error ? false : true === error[REACT_RECOVERABLE_TYPE];
    }
    function cloneRecoverableErrorAsFatal(recoverableError) {
      var fatalRecoverableError = Error(
        "The server render could not complete because client rendering was requested outside a Suspense boundary. See this error's cause for additional details.",
        hasOwnProperty.call(recoverableError, "cause") ? { cause: recoverableError.cause } : void 0
      );
      recoverableError = recoverableError.stack;
      if (void 0 !== recoverableError) {
        var frameStart = recoverableError.indexOf("\n");
        fatalRecoverableError.stack = fatalRecoverableError.name + ": " + fatalRecoverableError.message + (-1 === frameStart ? "" : recoverableError.slice(frameStart));
      } else fatalRecoverableError.stack = void 0;
      return fatalRecoverableError;
    }
    var renderPhaseUpdates = null;
    var numberOfReRenders = 0;
    function resolveCurrentlyRenderingComponent() {
      if (null === currentlyRenderingComponent)
        throw Error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
      return currentlyRenderingComponent;
    }
    function createHook() {
      if (0 < numberOfReRenders)
        throw Error("Rendered more hooks than during the previous render");
      return { memoizedState: null, queue: null, next: null };
    }
    function createWorkInProgressHook() {
      null === workInProgressHook ? null === firstWorkInProgressHook ? (isReRender = false, firstWorkInProgressHook = workInProgressHook = createHook()) : (isReRender = true, workInProgressHook = firstWorkInProgressHook) : null === workInProgressHook.next ? (isReRender = false, workInProgressHook = workInProgressHook.next = createHook()) : (isReRender = true, workInProgressHook = workInProgressHook.next);
      return workInProgressHook;
    }
    function getThenableStateAfterSuspending() {
      var state = thenableState;
      thenableState = null;
      return state;
    }
    function resetHooksState() {
      currentlyRenderingKeyPath = currentlyRenderingRequest = currentlyRenderingTask = currentlyRenderingComponent = null;
      didScheduleRenderPhaseUpdate = false;
      firstWorkInProgressHook = null;
      numberOfReRenders = 0;
      workInProgressHook = renderPhaseUpdates = null;
    }
    function basicStateReducer(state, action) {
      return "function" === typeof action ? action(state) : action;
    }
    function useReducer(reducer, initialArg, init) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      if (isReRender) {
        var queue = workInProgressHook.queue;
        initialArg = queue.dispatch;
        if (null !== renderPhaseUpdates && (init = renderPhaseUpdates.get(queue), void 0 !== init)) {
          renderPhaseUpdates.delete(queue);
          queue = workInProgressHook.memoizedState;
          do
            queue = reducer(queue, init.action), init = init.next;
          while (null !== init);
          workInProgressHook.memoizedState = queue;
          return [queue, initialArg];
        }
        return [workInProgressHook.memoizedState, initialArg];
      }
      reducer = reducer === basicStateReducer ? "function" === typeof initialArg ? initialArg() : initialArg : void 0 !== init ? init(initialArg) : initialArg;
      workInProgressHook.memoizedState = reducer;
      reducer = workInProgressHook.queue = { last: null, dispatch: null };
      reducer = reducer.dispatch = dispatchAction.bind(
        null,
        currentlyRenderingComponent,
        reducer
      );
      return [workInProgressHook.memoizedState, reducer];
    }
    function useMemo(nextCreate, deps) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      if (null !== workInProgressHook) {
        var prevState = workInProgressHook.memoizedState;
        if (null !== prevState && null !== deps) {
          var prevDeps = prevState[1];
          a: if (null === prevDeps) prevDeps = false;
          else {
            for (var i = 0; i < prevDeps.length && i < deps.length; i++)
              if (!objectIs(deps[i], prevDeps[i])) {
                prevDeps = false;
                break a;
              }
            prevDeps = true;
          }
          if (prevDeps) return prevState[0];
        }
      }
      nextCreate = nextCreate();
      workInProgressHook.memoizedState = [nextCreate, deps];
      return nextCreate;
    }
    function dispatchAction(componentIdentity, queue, action) {
      if (25 <= numberOfReRenders)
        throw Error(
          "Too many re-renders. React limits the number of renders to prevent an infinite loop."
        );
      if (componentIdentity === currentlyRenderingComponent)
        if (didScheduleRenderPhaseUpdate = true, componentIdentity = { action, next: null }, null === renderPhaseUpdates && (renderPhaseUpdates = /* @__PURE__ */ new Map()), action = renderPhaseUpdates.get(queue), void 0 === action)
          renderPhaseUpdates.set(queue, componentIdentity);
        else {
          for (queue = action; null !== queue.next; ) queue = queue.next;
          queue.next = componentIdentity;
        }
    }
    function throwOnUseEffectEventCall() {
      throw Error(
        "A function wrapped in useEffectEvent can't be called during rendering."
      );
    }
    function unsupportedStartTransition() {
      throw Error("startTransition cannot be called during server rendering.");
    }
    function unsupportedSetOptimisticState() {
      throw Error("Cannot update optimistic state while rendering.");
    }
    function useActionState(action, initialState, permalink) {
      resolveCurrentlyRenderingComponent();
      var actionStateHookIndex = actionStateCounter++, request = currentlyRenderingRequest;
      if ("function" === typeof action.$$FORM_ACTION) {
        var nextPostbackStateKey = null, componentKeyPath = currentlyRenderingKeyPath;
        request = request.formState;
        var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
        if (null !== request && "function" === typeof isSignatureEqual) {
          var postbackKey = request[1];
          isSignatureEqual.call(action, request[2], request[3]) && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(
            JSON.stringify([componentKeyPath, null, actionStateHookIndex]),
            0
          ), postbackKey === nextPostbackStateKey && (actionStateMatchingIndex = actionStateHookIndex, initialState = request[0]));
        }
        var boundAction = action.bind(null, initialState);
        action = function(payload) {
          boundAction(payload);
        };
        "function" === typeof boundAction.$$FORM_ACTION && (action.$$FORM_ACTION = function(prefix2) {
          prefix2 = boundAction.$$FORM_ACTION(prefix2);
          void 0 !== permalink && (permalink += "", prefix2.action = permalink);
          var formData = prefix2.data;
          formData && (null === nextPostbackStateKey && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(
            JSON.stringify([
              componentKeyPath,
              null,
              actionStateHookIndex
            ]),
            0
          )), formData.append("$ACTION_KEY", nextPostbackStateKey));
          return prefix2;
        });
        return [initialState, action, false];
      }
      var boundAction$22 = action.bind(null, initialState);
      return [
        initialState,
        function(payload) {
          boundAction$22(payload);
        },
        false
      ];
    }
    function unwrapThenable(thenable) {
      var index = thenableIndexCounter;
      thenableIndexCounter += 1;
      null === thenableState && (thenableState = []);
      return trackUsedThenable(thenableState, thenable, index);
    }
    function unsupportedRefresh() {
      throw Error("Cache cannot be refreshed during server rendering.");
    }
    var HooksDispatcher = {
      readContext: function(context) {
        return context._currentValue2;
      },
      use: function(usable) {
        if (null !== usable && "object" === typeof usable) {
          if ("function" === typeof usable.then) return unwrapThenable(usable);
          if (usable.$$typeof === REACT_RECOVERABLE_TYPE)
            throw createRecoverableError(usable);
          if (usable.$$typeof === REACT_CONTEXT_TYPE)
            return usable._currentValue2;
        }
        throw Error("An unsupported type was passed to use(): " + String(usable));
      },
      useContext: function(context) {
        resolveCurrentlyRenderingComponent();
        return context._currentValue2;
      },
      useMemo,
      useReducer,
      useRef: function(initialValue) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        var previousRef = workInProgressHook.memoizedState;
        return null === previousRef ? (initialValue = { current: initialValue }, workInProgressHook.memoizedState = initialValue) : previousRef;
      },
      useState: function(initialState) {
        return useReducer(basicStateReducer, initialState);
      },
      useInsertionEffect: noop,
      useLayoutEffect: noop,
      useCallback: function(callback, deps) {
        return useMemo(function() {
          return callback;
        }, deps);
      },
      useImperativeHandle: noop,
      useEffect: noop,
      useDebugValue: noop,
      useDeferredValue: function(value, initialValue) {
        resolveCurrentlyRenderingComponent();
        return void 0 !== initialValue ? initialValue : value;
      },
      useTransition: function() {
        resolveCurrentlyRenderingComponent();
        return [false, unsupportedStartTransition];
      },
      useId: function() {
        var treeId = getTreeId(currentlyRenderingTask.treeContext), resumableState = currentResumableState;
        if (null === resumableState)
          throw Error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component."
          );
        var localId = localIdCounter++;
        return makeId(resumableState, treeId, localId);
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        if (void 0 === getServerSnapshot)
          throw Error(
            "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
          );
        return getServerSnapshot();
      },
      useOptimistic: function(passthrough) {
        resolveCurrentlyRenderingComponent();
        return [passthrough, unsupportedSetOptimisticState];
      },
      useActionState,
      useFormState: useActionState,
      useHostTransitionStatus: function() {
        resolveCurrentlyRenderingComponent();
        return sharedNotPendingObject;
      },
      useMemoCache: function(size) {
        for (var data = Array(size), i = 0; i < size; i++)
          data[i] = REACT_MEMO_CACHE_SENTINEL;
        return data;
      },
      useCacheRefresh: function() {
        return unsupportedRefresh;
      },
      useEffectEvent: function() {
        return throwOnUseEffectEventCall;
      }
    };
    var currentResumableState = null;
    var DefaultAsyncDispatcher = {
      getCacheForType: function() {
        throw Error("Not implemented.");
      },
      cacheSignal: function() {
        throw Error("Not implemented.");
      }
    };
    var prefix;
    var suffix;
    function describeBuiltInComponentFrame(name) {
      if (void 0 === prefix)
        try {
          throw Error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || "";
          suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return "\n" + prefix + name + suffix;
    }
    var reentry = false;
    function describeNativeComponentFrame(fn, construct) {
      if (!fn || reentry) return "";
      reentry = true;
      var previousPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var RunInRootFrame = {
          DetermineComponentFrameRoot: function() {
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if ("object" === typeof Reflect && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    var control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x$24) {
                    control = x$24;
                  }
                  Fake = false;
                  try {
                    var prevProps = Object.getOwnPropertyDescriptor(
                      fn.prototype,
                      "props"
                    );
                    Object.defineProperty(fn.prototype, "props", {
                      configurable: true,
                      set: function() {
                        throw Error();
                      }
                    });
                    Fake = true;
                    new fn();
                  } finally {
                    Fake && (void 0 !== prevProps ? Object.defineProperty(fn.prototype, "props", prevProps) : delete fn.prototype.props);
                  }
                }
              } else {
                try {
                  throw Error();
                } catch (x$25) {
                  control = x$25;
                }
                (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
                });
              }
            } catch (sample) {
              if (sample && control && "string" === typeof sample.stack)
                return [sample.stack, control.stack];
            }
            return [null, null];
          }
        };
        RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var namePropDescriptor = Object.getOwnPropertyDescriptor(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name"
        );
        namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
        if (sampleStack && controlStack) {
          var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
          for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
            RunInRootFrame++;
          for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
            "DetermineComponentFrameRoot"
          ); )
            namePropDescriptor++;
          if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
            for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
              namePropDescriptor--;
          for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
            if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
              if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
                do
                  if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                    var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                    fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                    return frame;
                  }
                while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
              }
              break;
            }
        }
      } finally {
        reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
      }
      return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
    }
    function describeComponentStackByType(type) {
      if ("string" === typeof type) return describeBuiltInComponentFrame(type);
      if ("function" === typeof type)
        return type.prototype && type.prototype.isReactComponent ? describeNativeComponentFrame(type, true) : describeNativeComponentFrame(type, false);
      if ("object" === typeof type && null !== type) {
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            return describeNativeComponentFrame(type.render, false);
          case REACT_MEMO_TYPE:
            return describeNativeComponentFrame(type.type, false);
          case REACT_LAZY_TYPE:
            var lazyComponent = type, payload = lazyComponent._payload;
            lazyComponent = lazyComponent._init;
            try {
              type = lazyComponent(payload);
            } catch (x) {
              return describeBuiltInComponentFrame("Lazy");
            }
            return describeComponentStackByType(type);
        }
        if ("string" === typeof type.name) {
          a: {
            payload = type.name;
            lazyComponent = type.env;
            var location = type.debugLocation;
            if (null != location && (type = Error.prepareStackTrace, Error.prepareStackTrace = void 0, location = location.stack, Error.prepareStackTrace = type, location.startsWith("Error: react-stack-top-frame\n") && (location = location.slice(29)), type = location.indexOf("\n"), -1 !== type && (location = location.slice(type + 1)), type = location.indexOf("react_stack_bottom_frame"), -1 !== type && (type = location.lastIndexOf("\n", type)), type = -1 !== type ? location = location.slice(0, type) : "", location = type.lastIndexOf("\n"), type = -1 === location ? type : type.slice(location + 1), -1 !== type.indexOf(payload))) {
              payload = "\n" + type;
              break a;
            }
            payload = describeBuiltInComponentFrame(
              payload + (lazyComponent ? " [" + lazyComponent + "]" : "")
            );
          }
          return payload;
        }
      }
      switch (type) {
        case REACT_SUSPENSE_LIST_TYPE:
          return describeBuiltInComponentFrame("SuspenseList");
        case REACT_SUSPENSE_TYPE:
          return describeBuiltInComponentFrame("Suspense");
        case REACT_VIEW_TRANSITION_TYPE:
          return describeBuiltInComponentFrame("ViewTransition");
      }
      return "";
    }
    function isEligibleForOutlining(request, boundary) {
      return (500 < boundary.byteSize || boundary.defer) && null === boundary.preamble;
    }
    function defaultErrorHandler(error) {
      if ("object" === typeof error && null !== error && "string" === typeof error.environmentName) {
        var JSCompiler_inline_result = error.environmentName;
        error = [error].slice(0);
        "string" === typeof error[0] ? error.splice(
          0,
          1,
          "[%s] " + error[0],
          " " + JSCompiler_inline_result + " "
        ) : error.splice(0, 0, "[%s]", " " + JSCompiler_inline_result + " ");
        error.unshift(console);
        JSCompiler_inline_result = bind.apply(console.error, error);
        JSCompiler_inline_result();
      } else console.error(error);
      return null;
    }
    function RequestInstance(resumableState, renderState, rootFormatContext, progressiveChunkSize, onError2, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError, formState) {
      var abortSet = /* @__PURE__ */ new Set();
      this.destination = null;
      this.flushScheduled = false;
      this.resumableState = resumableState;
      this.renderState = renderState;
      this.rootFormatContext = rootFormatContext;
      this.progressiveChunkSize = void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
      this.status = 10;
      this.fatalError = null;
      this.aborted = false;
      this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
      this.completedPreambleSegments = this.completedRootSegment = null;
      this.byteSize = 0;
      this.abortableTasks = abortSet;
      this.pingedTasks = [];
      this.currentTask = null;
      this.clientRenderedBoundaries = [];
      this.completedBoundaries = [];
      this.partialBoundaries = [];
      this.postponedState = this.trackedPostpones = null;
      this.onError = void 0 === onError2 ? defaultErrorHandler : onError2;
      this.onBrowserBailout = void 0 === onBrowserBailout ? noop : onBrowserBailout;
      this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
      this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
      this.onShellError = void 0 === onShellError ? noop : onShellError;
      this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
      this.renderLifetimeController = null;
      this.formState = void 0 === formState ? null : formState;
    }
    function createRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError2, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError, formState) {
      resumableState = new RequestInstance(
        resumableState,
        renderState,
        rootFormatContext,
        progressiveChunkSize,
        onError2,
        onBrowserBailout,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        formState
      );
      renderState = createPendingSegment(
        resumableState,
        0,
        null,
        rootFormatContext,
        false,
        false
      );
      renderState.parentFlushed = true;
      children = createRenderTask(
        resumableState,
        null,
        children,
        -1,
        null,
        renderState,
        null,
        null,
        resumableState.abortableTasks,
        null,
        rootFormatContext,
        null,
        emptyTreeContext,
        null,
        null
      );
      pushComponentStack(children);
      resumableState.pingedTasks.push(children);
      return resumableState;
    }
    var currentRequest = null;
    function pingTask(request, task) {
      request.pingedTasks.push(task);
      1 === request.pingedTasks.length && (request.flushScheduled = null !== request.destination, performWork(request));
    }
    function createSuspenseBoundary(request, row, fallbackAbortableTasks, preamble, defer) {
      fallbackAbortableTasks = {
        status: 0,
        rootSegmentID: -1,
        parentFlushed: false,
        pendingTasks: 0,
        row,
        completedSegments: [],
        byteSize: 0,
        defer,
        fallbackAbortableTasks,
        errorDigest: null,
        contentState: createHoistableState(),
        fallbackState: createHoistableState(),
        preamble,
        tracked: null
      };
      null !== row && (row.pendingTasks++, preamble = row.boundaries, null !== preamble && (request.allPendingTasks++, fallbackAbortableTasks.pendingTasks++, preamble.push(fallbackAbortableTasks)), request = row.inheritedHoistables, null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
      return fallbackAbortableTasks;
    }
    function createRenderTask(request, thenableState2, node, childIndex, blockedBoundary, blockedSegment, blockedPreamble, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
      request.allPendingTasks++;
      null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
      null !== row && row.pendingTasks++;
      var task = {
        replay: null,
        node,
        childIndex,
        ping: {
          resolve: function() {
            return pingTask(request, task);
          },
          reject: function(error) {
            request.aborted ? task.abortSet.delete(task) && finishAbortedTask(task, request, error) : pingTask(request, task);
          }
        },
        blockedBoundary,
        blockedSegment,
        blockedPreamble,
        hoistableState,
        abortSet,
        keyPath,
        formatContext,
        context,
        treeContext,
        row,
        componentStack,
        thenableState: thenableState2
      };
      abortSet.add(task);
      return task;
    }
    function createReplayTask(request, thenableState2, replay, node, childIndex, blockedBoundary, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
      request.allPendingTasks++;
      null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
      null !== row && row.pendingTasks++;
      replay.pendingTasks++;
      var task = {
        replay,
        node,
        childIndex,
        ping: {
          resolve: function() {
            return pingTask(request, task);
          },
          reject: function(error) {
            request.aborted ? task.abortSet.delete(task) && finishAbortedTask(task, request, error) : pingTask(request, task);
          }
        },
        blockedBoundary,
        blockedSegment: null,
        blockedPreamble: null,
        hoistableState,
        abortSet,
        keyPath,
        formatContext,
        context,
        treeContext,
        row,
        componentStack,
        thenableState: thenableState2
      };
      abortSet.add(task);
      return task;
    }
    function createPendingSegment(request, index, boundary, parentFormatContext, lastPushedText, textEmbedded) {
      return {
        status: 0,
        parentFlushed: false,
        id: -1,
        index,
        chunks: [],
        children: [],
        preambleChildren: [],
        parentFormatContext,
        boundary,
        lastPushedText,
        textEmbedded
      };
    }
    function pushComponentStack(task) {
      var node = task.node;
      if ("object" === typeof node && null !== node)
        switch (node.$$typeof) {
          case REACT_ELEMENT_TYPE:
            task.componentStack = { parent: task.componentStack, type: node.type };
        }
    }
    function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
      return null === componentStack ? null : { parent: componentStack.parent, type: "Suspense Fallback" };
    }
    function getThrownInfo(node$jscomp$0) {
      var errorInfo = {};
      node$jscomp$0 && Object.defineProperty(errorInfo, "componentStack", {
        configurable: true,
        enumerable: true,
        get: function() {
          try {
            var info = "", node = node$jscomp$0;
            do
              info += describeComponentStackByType(node.type), node = node.parent;
            while (node);
            var JSCompiler_inline_result = info;
          } catch (x) {
            JSCompiler_inline_result = "\nError generating stack: " + x.message + "\n" + x.stack;
          }
          Object.defineProperty(errorInfo, "componentStack", {
            value: JSCompiler_inline_result
          });
          return JSCompiler_inline_result;
        }
      });
      return errorInfo;
    }
    function logRecoverableError(request, error, errorInfo) {
      if (isRecoverableError(error))
        return request = request.onBrowserBailout, request(error, errorInfo), "";
      request = request.onError;
      error = request(error, errorInfo);
      if (null == error || "string" === typeof error)
        return "" === error ? void 0 : error;
    }
    function fatalError(request, error) {
      var onShellError = request.onShellError, onFatalError = request.onFatalError;
      0 !== request.pendingRootTasks && onShellError(error);
      onFatalError(error);
      endRenderLifetime(request);
      null !== request.destination ? (request.status = 13, request.destination.destroy(error)) : (request.status = 12, request.aborted || (request.fatalError = error));
    }
    function finishSuspenseListRow(request, row) {
      unblockSuspenseListRow(request, row.next, row.hoistables);
    }
    function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
      for (; null !== unblockedRow; ) {
        null !== inheritedHoistables && (hoistHoistables(unblockedRow.hoistables, inheritedHoistables), unblockedRow.inheritedHoistables = inheritedHoistables);
        var unblockedBoundaries = unblockedRow.boundaries;
        if (null !== unblockedBoundaries) {
          unblockedRow.boundaries = null;
          for (var i = 0; i < unblockedBoundaries.length; i++) {
            var unblockedBoundary = unblockedBoundaries[i];
            null !== inheritedHoistables && hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
            finishedTask(request, unblockedBoundary, null, null);
          }
        }
        unblockedRow.pendingTasks--;
        if (0 < unblockedRow.pendingTasks) break;
        inheritedHoistables = unblockedRow.hoistables;
        unblockedRow = unblockedRow.next;
      }
    }
    function tryToResolveTogetherRow(request, togetherRow) {
      var boundaries = togetherRow.boundaries;
      if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
        for (var allCompleteAndInlinable = true, i = 0; i < boundaries.length; i++) {
          var rowBoundary = boundaries[i];
          if (1 !== rowBoundary.pendingTasks || rowBoundary.parentFlushed || isEligibleForOutlining(request, rowBoundary)) {
            allCompleteAndInlinable = false;
            break;
          }
        }
        allCompleteAndInlinable && unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
      }
    }
    function createSuspenseListRow(previousRow) {
      var newRow = {
        pendingTasks: 1,
        boundaries: null,
        hoistables: createHoistableState(),
        inheritedHoistables: null,
        together: false,
        next: null
      };
      null !== previousRow && 0 < previousRow.pendingTasks && (newRow.pendingTasks++, newRow.boundaries = [], previousRow.next = newRow);
      return newRow;
    }
    function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
      var prevKeyPath = task.keyPath, prevTreeContext = task.treeContext, prevRow = task.row;
      task.keyPath = keyPath;
      keyPath = rows.length;
      var previousSuspenseListRow = null;
      if (null !== task.replay) {
        var resumeSlots = task.replay.slots;
        if (null !== resumeSlots && "object" === typeof resumeSlots)
          for (var n = 0; n < keyPath; n++) {
            var i = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? n : keyPath - 1 - n, node = rows[i];
            task.row = previousSuspenseListRow = createSuspenseListRow(
              previousSuspenseListRow
            );
            task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
            var resumeSegmentID = resumeSlots[i];
            "number" === typeof resumeSegmentID ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i]) : renderNode(request, task, node, i);
            0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
          }
        else
          for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++)
            n = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? resumeSlots : keyPath - 1 - resumeSlots, i = rows[n], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, n), renderNode(request, task, i, n), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
      } else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder)
        for (revealOrder = 0; revealOrder < keyPath; revealOrder++)
          resumeSlots = rows[revealOrder], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(
            prevTreeContext,
            keyPath,
            revealOrder
          ), renderNode(request, task, resumeSlots, revealOrder), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
      else {
        resumeSlots = task.blockedSegment;
        n = resumeSlots.children.length;
        i = resumeSlots.chunks.length;
        for (node = 0; node < keyPath; node++) {
          resumeSegmentID = "unstable_legacy-backwards" === revealOrder ? keyPath - 1 - node : node;
          var node$39 = rows[resumeSegmentID];
          task.row = previousSuspenseListRow = createSuspenseListRow(
            previousSuspenseListRow
          );
          task.treeContext = pushTreeContext(
            prevTreeContext,
            keyPath,
            resumeSegmentID
          );
          var newSegment = createPendingSegment(
            request,
            i,
            null,
            task.formatContext,
            0 === resumeSegmentID ? resumeSlots.lastPushedText : true,
            true
          );
          resumeSlots.children.splice(n, 0, newSegment);
          task.blockedSegment = newSegment;
          try {
            renderNode(request, task, node$39, resumeSegmentID), pushSegmentFinale(
              newSegment.chunks,
              request.renderState,
              newSegment.lastPushedText,
              newSegment.textEmbedded
            ), newSegment.status = 1, 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
          } catch (thrownValue) {
            throw newSegment.status = request.aborted ? 3 : 4, thrownValue;
          }
        }
        task.blockedSegment = resumeSlots;
        resumeSlots.lastPushedText = false;
      }
      null !== prevRow && null !== previousSuspenseListRow && 0 < previousSuspenseListRow.pendingTasks && (prevRow.pendingTasks++, previousSuspenseListRow.next = prevRow);
      task.treeContext = prevTreeContext;
      task.row = prevRow;
      task.keyPath = prevKeyPath;
    }
    function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
      var prevThenableState = task.thenableState;
      task.thenableState = null;
      currentlyRenderingComponent = {};
      currentlyRenderingTask = task;
      currentlyRenderingRequest = request;
      currentlyRenderingKeyPath = keyPath;
      actionStateCounter = localIdCounter = 0;
      actionStateMatchingIndex = -1;
      thenableIndexCounter = 0;
      thenableState = prevThenableState;
      for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
        didScheduleRenderPhaseUpdate = false, actionStateCounter = localIdCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, numberOfReRenders += 1, workInProgressHook = null, request = Component(props, secondArg);
      resetHooksState();
      return request;
    }
    function finishFunctionComponent(request, task, keyPath, children, hasId, actionStateCount, actionStateMatchingIndex2) {
      var didEmitActionStateMarkers = false;
      if (0 !== actionStateCount && null !== request.formState) {
        var segment = task.blockedSegment;
        if (null !== segment) {
          didEmitActionStateMarkers = true;
          segment = segment.chunks;
          for (var i = 0; i < actionStateCount; i++)
            i === actionStateMatchingIndex2 ? segment.push("<!--F!-->") : segment.push("<!--F-->");
        }
      }
      actionStateCount = task.keyPath;
      task.keyPath = keyPath;
      hasId ? (keyPath = task.treeContext, task.treeContext = pushTreeContext(keyPath, 1, 0), renderNode(request, task, children, -1), task.treeContext = keyPath) : didEmitActionStateMarkers ? renderNode(request, task, children, -1) : renderNodeDestructive(request, task, children, -1);
      task.keyPath = actionStateCount;
    }
    function renderElement(request, task, keyPath, type, props, ref) {
      if ("function" === typeof type)
        if (type.prototype && type.prototype.isReactComponent) {
          var newProps = props;
          if ("ref" in props) {
            newProps = {};
            for (var propName in props)
              "ref" !== propName && (newProps[propName] = props[propName]);
          }
          var defaultProps = type.defaultProps;
          if (defaultProps) {
            newProps === props && (newProps = assign({}, newProps, props));
            for (var propName$44 in defaultProps)
              void 0 === newProps[propName$44] && (newProps[propName$44] = defaultProps[propName$44]);
          }
          var JSCompiler_inline_result = newProps;
          var context = emptyContextObject, contextType = type.contextType;
          "object" === typeof contextType && null !== contextType && (context = contextType._currentValue2);
          var JSCompiler_inline_result$jscomp$0 = new type(
            JSCompiler_inline_result,
            context
          );
          var initialState = void 0 !== JSCompiler_inline_result$jscomp$0.state ? JSCompiler_inline_result$jscomp$0.state : null;
          JSCompiler_inline_result$jscomp$0.updater = classComponentUpdater;
          JSCompiler_inline_result$jscomp$0.props = JSCompiler_inline_result;
          JSCompiler_inline_result$jscomp$0.state = initialState;
          var internalInstance = { queue: [], replace: false };
          JSCompiler_inline_result$jscomp$0._reactInternals = internalInstance;
          var contextType$jscomp$0 = type.contextType;
          JSCompiler_inline_result$jscomp$0.context = "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 ? contextType$jscomp$0._currentValue2 : emptyContextObject;
          var getDerivedStateFromProps = type.getDerivedStateFromProps;
          if ("function" === typeof getDerivedStateFromProps) {
            var partialState = getDerivedStateFromProps(
              JSCompiler_inline_result,
              initialState
            );
            var JSCompiler_inline_result$jscomp$1 = null === partialState || void 0 === partialState ? initialState : assign({}, initialState, partialState);
            JSCompiler_inline_result$jscomp$0.state = JSCompiler_inline_result$jscomp$1;
          }
          if ("function" !== typeof type.getDerivedStateFromProps && "function" !== typeof JSCompiler_inline_result$jscomp$0.getSnapshotBeforeUpdate && ("function" === typeof JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount || "function" === typeof JSCompiler_inline_result$jscomp$0.componentWillMount)) {
            var oldState = JSCompiler_inline_result$jscomp$0.state;
            "function" === typeof JSCompiler_inline_result$jscomp$0.componentWillMount && JSCompiler_inline_result$jscomp$0.componentWillMount();
            "function" === typeof JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount && JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount();
            oldState !== JSCompiler_inline_result$jscomp$0.state && classComponentUpdater.enqueueReplaceState(
              JSCompiler_inline_result$jscomp$0,
              JSCompiler_inline_result$jscomp$0.state,
              null
            );
            if (null !== internalInstance.queue && 0 < internalInstance.queue.length) {
              var oldQueue = internalInstance.queue, oldReplace = internalInstance.replace;
              internalInstance.queue = null;
              internalInstance.replace = false;
              if (oldReplace && 1 === oldQueue.length)
                JSCompiler_inline_result$jscomp$0.state = oldQueue[0];
              else {
                for (var nextState = oldReplace ? oldQueue[0] : JSCompiler_inline_result$jscomp$0.state, dontMutate = true, i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                  var partial = oldQueue[i], partialState$jscomp$0 = "function" === typeof partial ? partial.call(
                    JSCompiler_inline_result$jscomp$0,
                    nextState,
                    JSCompiler_inline_result,
                    void 0
                  ) : partial;
                  null != partialState$jscomp$0 && (dontMutate ? (dontMutate = false, nextState = assign({}, nextState, partialState$jscomp$0)) : assign(nextState, partialState$jscomp$0));
                }
                JSCompiler_inline_result$jscomp$0.state = nextState;
              }
            } else internalInstance.queue = null;
          }
          var nextChildren = JSCompiler_inline_result$jscomp$0.render();
          if (request.aborted) throw null;
          var prevKeyPath = task.keyPath;
          task.keyPath = keyPath;
          renderNodeDestructive(request, task, nextChildren, -1);
          task.keyPath = prevKeyPath;
        } else {
          var value = renderWithHooks(request, task, keyPath, type, props, void 0);
          if (request.aborted) throw null;
          finishFunctionComponent(
            request,
            task,
            keyPath,
            value,
            0 !== localIdCounter,
            actionStateCounter,
            actionStateMatchingIndex
          );
        }
      else if ("string" === typeof type) {
        var segment = task.blockedSegment;
        if (null === segment) {
          var children = props.children, prevContext = task.formatContext, prevKeyPath$jscomp$0 = task.keyPath;
          task.formatContext = getChildFormatContext(prevContext, type, props);
          task.keyPath = keyPath;
          renderNode(request, task, children, -1);
          task.formatContext = prevContext;
          task.keyPath = prevKeyPath$jscomp$0;
        } else {
          var children$41 = pushStartInstance(
            segment.chunks,
            type,
            props,
            request.resumableState,
            request.renderState,
            task.blockedPreamble,
            task.hoistableState,
            task.formatContext,
            segment.lastPushedText
          );
          segment.lastPushedText = false;
          var prevContext$42 = task.formatContext, prevKeyPath$43 = task.keyPath;
          task.keyPath = keyPath;
          if (3 === (task.formatContext = getChildFormatContext(
            prevContext$42,
            type,
            props
          )).insertionMode) {
            var preambleSegment = createPendingSegment(
              request,
              0,
              null,
              task.formatContext,
              false,
              false
            );
            segment.preambleChildren.push(preambleSegment);
            task.blockedSegment = preambleSegment;
            try {
              renderNode(request, task, children$41, -1), pushSegmentFinale(
                preambleSegment.chunks,
                request.renderState,
                preambleSegment.lastPushedText,
                preambleSegment.textEmbedded
              ), preambleSegment.status = 1;
            } finally {
              task.blockedSegment = segment;
            }
          } else renderNode(request, task, children$41, -1);
          task.formatContext = prevContext$42;
          task.keyPath = prevKeyPath$43;
          a: {
            var target = segment.chunks, resumableState = request.resumableState;
            switch (type) {
              case "title":
              case "style":
              case "script":
              case "area":
              case "base":
              case "br":
              case "col":
              case "embed":
              case "hr":
              case "img":
              case "input":
              case "keygen":
              case "link":
              case "meta":
              case "param":
              case "source":
              case "track":
              case "wbr":
                break a;
              case "body":
                if (1 >= prevContext$42.insertionMode) {
                  resumableState.hasBody = true;
                  break a;
                }
                break;
              case "html":
                if (0 === prevContext$42.insertionMode) {
                  resumableState.hasHtml = true;
                  break a;
                }
                break;
              case "head":
                if (1 >= prevContext$42.insertionMode) break a;
            }
            target.push(endChunkForTag(type));
          }
          segment.lastPushedText = false;
        }
      } else {
        switch (type) {
          case REACT_LEGACY_HIDDEN_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_FRAGMENT_TYPE:
            var prevKeyPath$jscomp$1 = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, props.children, -1);
            task.keyPath = prevKeyPath$jscomp$1;
            return;
          case REACT_ACTIVITY_TYPE:
            var segment$jscomp$0 = task.blockedSegment;
            if (null === segment$jscomp$0) {
              if ("hidden" !== props.mode) {
                var prevKeyPath$jscomp$2 = task.keyPath;
                task.keyPath = keyPath;
                renderNode(request, task, props.children, -1);
                task.keyPath = prevKeyPath$jscomp$2;
              }
            } else if ("hidden" !== props.mode) {
              request.renderState.generateStaticMarkup || segment$jscomp$0.chunks.push("<!--&-->");
              segment$jscomp$0.lastPushedText = false;
              var prevKeyPath$46 = task.keyPath;
              task.keyPath = keyPath;
              renderNode(request, task, props.children, -1);
              task.keyPath = prevKeyPath$46;
              request.renderState.generateStaticMarkup || segment$jscomp$0.chunks.push("<!--/&-->");
              segment$jscomp$0.lastPushedText = false;
            }
            return;
          case REACT_SUSPENSE_LIST_TYPE:
            a: {
              var children$jscomp$0 = props.children, revealOrder = props.revealOrder;
              if ("independent" !== revealOrder && "together" !== revealOrder) {
                if (isArrayImpl(children$jscomp$0)) {
                  renderSuspenseListRows(
                    request,
                    task,
                    keyPath,
                    children$jscomp$0,
                    revealOrder
                  );
                  break a;
                }
                var iteratorFn = getIteratorFn(children$jscomp$0);
                if (iteratorFn) {
                  var iterator = iteratorFn.call(children$jscomp$0);
                  if (iterator) {
                    var step = iterator.next();
                    if (!step.done) {
                      do
                        step = iterator.next();
                      while (!step.done);
                      renderSuspenseListRows(
                        request,
                        task,
                        keyPath,
                        children$jscomp$0,
                        revealOrder
                      );
                    }
                    break a;
                  }
                }
              }
              if ("together" === revealOrder) {
                var prevKeyPath$40 = task.keyPath, prevRow = task.row, newRow = task.row = createSuspenseListRow(null);
                newRow.boundaries = [];
                newRow.together = true;
                task.keyPath = keyPath;
                renderNodeDestructive(request, task, children$jscomp$0, -1);
                0 === --newRow.pendingTasks && finishSuspenseListRow(request, newRow);
                task.keyPath = prevKeyPath$40;
                task.row = prevRow;
                null !== prevRow && 0 < newRow.pendingTasks && (prevRow.pendingTasks++, newRow.next = prevRow);
              } else {
                var prevKeyPath$jscomp$3 = task.keyPath;
                task.keyPath = keyPath;
                renderNodeDestructive(request, task, children$jscomp$0, -1);
                task.keyPath = prevKeyPath$jscomp$3;
              }
            }
            return;
          case REACT_VIEW_TRANSITION_TYPE:
            var prevContext$jscomp$0 = task.formatContext, prevKeyPath$jscomp$4 = task.keyPath;
            var resumableState$jscomp$0 = request.resumableState;
            if (null == props.name || "auto" === props.name) {
              var treeId = getTreeId(task.treeContext);
              makeId(resumableState$jscomp$0, treeId, 0);
            }
            task.formatContext = prevContext$jscomp$0;
            task.keyPath = keyPath;
            if (null != props.name && "auto" !== props.name)
              renderNodeDestructive(request, task, props.children, -1);
            else {
              var prevTreeContext = task.treeContext;
              task.treeContext = pushTreeContext(prevTreeContext, 1, 0);
              renderNode(request, task, props.children, -1);
              task.treeContext = prevTreeContext;
            }
            task.formatContext = prevContext$jscomp$0;
            task.keyPath = prevKeyPath$jscomp$4;
            return;
          case REACT_SCOPE_TYPE:
            throw Error("ReactDOMServer does not yet support scope components.");
          case REACT_SUSPENSE_TYPE:
            a: if (null !== task.replay) {
              var prevKeyPath$26 = task.keyPath, prevContext$27 = task.formatContext, prevRow$28 = task.row;
              task.keyPath = keyPath;
              task.formatContext = getSuspenseContentFormatContext(
                request.resumableState,
                prevContext$27
              );
              task.row = null;
              var content$29 = props.children;
              try {
                renderNode(request, task, content$29, -1);
              } finally {
                task.keyPath = prevKeyPath$26, task.formatContext = prevContext$27, task.row = prevRow$28;
              }
            } else {
              var prevKeyPath$jscomp$5 = task.keyPath, prevContext$jscomp$1 = task.formatContext, prevRow$jscomp$0 = task.row, parentBoundary = task.blockedBoundary, parentPreamble = task.blockedPreamble, parentHoistableState = task.hoistableState, parentSegment = task.blockedSegment, fallback = props.fallback, content = props.children, fallbackAbortSet = /* @__PURE__ */ new Set(), newBoundary = createSuspenseBoundary(
                request,
                task.row,
                fallbackAbortSet,
                null,
                false
              ), boundarySegment = createPendingSegment(
                request,
                parentSegment.chunks.length,
                newBoundary,
                task.formatContext,
                false,
                false
              );
              parentSegment.children.push(boundarySegment);
              parentSegment.lastPushedText = false;
              var contentRootSegment = createPendingSegment(
                request,
                0,
                null,
                task.formatContext,
                false,
                false
              );
              contentRootSegment.parentFlushed = true;
              var trackedPostpones = request.trackedPostpones;
              if (null !== trackedPostpones) {
                var suspenseComponentStack = task.componentStack, fallbackKeyPath = [keyPath[0], "Suspense Fallback", keyPath[2]];
                if (null !== trackedPostpones) {
                  var fallbackReplayNode = [
                    fallbackKeyPath[1],
                    fallbackKeyPath[2],
                    [],
                    null
                  ];
                  trackedPostpones.workingMap.set(
                    fallbackKeyPath,
                    fallbackReplayNode
                  );
                  newBoundary.tracked = {
                    contentKeyPath: keyPath,
                    fallbackNode: fallbackReplayNode
                  };
                }
                task.blockedSegment = boundarySegment;
                task.blockedPreamble = null === newBoundary.preamble ? null : newBoundary.preamble.fallback;
                task.keyPath = fallbackKeyPath;
                task.formatContext = getSuspenseFallbackFormatContext(
                  request.resumableState,
                  prevContext$jscomp$1
                );
                task.componentStack = replaceSuspenseComponentStackWithSuspenseFallbackStack(
                  suspenseComponentStack
                );
                try {
                  renderNode(request, task, fallback, -1), pushSegmentFinale(
                    boundarySegment.chunks,
                    request.renderState,
                    boundarySegment.lastPushedText,
                    boundarySegment.textEmbedded
                  ), boundarySegment.status = 1;
                } catch (thrownValue) {
                  throw boundarySegment.status = request.aborted ? 3 : 4, thrownValue;
                } finally {
                  task.blockedSegment = parentSegment, task.blockedPreamble = parentPreamble, task.keyPath = prevKeyPath$jscomp$5, task.formatContext = prevContext$jscomp$1;
                }
                var suspendedPrimaryTask = createRenderTask(
                  request,
                  null,
                  content,
                  -1,
                  newBoundary,
                  contentRootSegment,
                  null === newBoundary.preamble ? null : newBoundary.preamble.content,
                  newBoundary.contentState,
                  task.abortSet,
                  keyPath,
                  getSuspenseContentFormatContext(
                    request.resumableState,
                    task.formatContext
                  ),
                  task.context,
                  task.treeContext,
                  null,
                  suspenseComponentStack
                );
                pushComponentStack(suspendedPrimaryTask);
                request.pingedTasks.push(suspendedPrimaryTask);
              } else {
                task.blockedBoundary = newBoundary;
                task.blockedPreamble = null === newBoundary.preamble ? null : newBoundary.preamble.content;
                task.hoistableState = newBoundary.contentState;
                task.blockedSegment = contentRootSegment;
                task.keyPath = keyPath;
                task.formatContext = getSuspenseContentFormatContext(
                  request.resumableState,
                  prevContext$jscomp$1
                );
                task.row = null;
                try {
                  if (renderNode(request, task, content, -1), pushSegmentFinale(
                    contentRootSegment.chunks,
                    request.renderState,
                    contentRootSegment.lastPushedText,
                    contentRootSegment.textEmbedded
                  ), contentRootSegment.status = 1, queueCompletedSegment(newBoundary, contentRootSegment), 0 === newBoundary.pendingTasks && 0 === newBoundary.status) {
                    if (newBoundary.status = 1, !isEligibleForOutlining(request, newBoundary)) {
                      null !== prevRow$jscomp$0 && 0 === --prevRow$jscomp$0.pendingTasks && finishSuspenseListRow(request, prevRow$jscomp$0);
                      0 === request.pendingRootTasks && task.blockedPreamble && preparePreamble(request);
                      break a;
                    }
                  } else
                    null !== prevRow$jscomp$0 && prevRow$jscomp$0.together && tryToResolveTogetherRow(request, prevRow$jscomp$0);
                } catch (thrownValue$30) {
                  newBoundary.status = 4;
                  if (request.aborted) {
                    contentRootSegment.status = 3;
                    var error = request.fatalError;
                  } else contentRootSegment.status = 4, error = thrownValue$30;
                  var thrownInfo = getThrownInfo(task.componentStack), errorDigest = logRecoverableError(request, error, thrownInfo);
                  newBoundary.errorDigest = errorDigest;
                  untrackBoundary(request, newBoundary);
                } finally {
                  task.blockedBoundary = parentBoundary, task.blockedPreamble = parentPreamble, task.hoistableState = parentHoistableState, task.blockedSegment = parentSegment, task.keyPath = prevKeyPath$jscomp$5, task.formatContext = prevContext$jscomp$1, task.row = prevRow$jscomp$0;
                }
                var suspendedFallbackTask = createRenderTask(
                  request,
                  null,
                  fallback,
                  -1,
                  parentBoundary,
                  boundarySegment,
                  null === newBoundary.preamble ? null : newBoundary.preamble.fallback,
                  newBoundary.fallbackState,
                  fallbackAbortSet,
                  [keyPath[0], "Suspense Fallback", keyPath[2]],
                  getSuspenseFallbackFormatContext(
                    request.resumableState,
                    task.formatContext
                  ),
                  task.context,
                  task.treeContext,
                  task.row,
                  replaceSuspenseComponentStackWithSuspenseFallbackStack(
                    task.componentStack
                  )
                );
                pushComponentStack(suspendedFallbackTask);
                request.pingedTasks.push(suspendedFallbackTask);
              }
            }
            return;
        }
        if ("object" === typeof type && null !== type)
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              if ("ref" in props) {
                var propsWithoutRef = {};
                for (var key in props)
                  "ref" !== key && (propsWithoutRef[key] = props[key]);
              } else propsWithoutRef = props;
              var children$jscomp$1 = renderWithHooks(
                request,
                task,
                keyPath,
                type.render,
                propsWithoutRef,
                ref
              );
              finishFunctionComponent(
                request,
                task,
                keyPath,
                children$jscomp$1,
                0 !== localIdCounter,
                actionStateCounter,
                actionStateMatchingIndex
              );
              return;
            case REACT_MEMO_TYPE:
              renderElement(request, task, keyPath, type.type, props, ref);
              return;
            case REACT_CONTEXT_TYPE:
              var children$jscomp$2 = props.children, prevKeyPath$jscomp$6 = task.keyPath, nextValue = props.value;
              var prevValue = type._currentValue2;
              type._currentValue2 = nextValue;
              var prevNode = currentActiveSnapshot, newNode = {
                parent: prevNode,
                depth: null === prevNode ? 0 : prevNode.depth + 1,
                context: type,
                parentValue: prevValue,
                value: nextValue
              };
              currentActiveSnapshot = newNode;
              task.context = newNode;
              task.keyPath = keyPath;
              renderNodeDestructive(request, task, children$jscomp$2, -1);
              var prevSnapshot = currentActiveSnapshot;
              if (null === prevSnapshot)
                throw Error(
                  "Tried to pop a Context at the root of the app. This is a bug in React."
                );
              prevSnapshot.context._currentValue2 = prevSnapshot.parentValue;
              var JSCompiler_inline_result$jscomp$2 = currentActiveSnapshot = prevSnapshot.parent;
              task.context = JSCompiler_inline_result$jscomp$2;
              task.keyPath = prevKeyPath$jscomp$6;
              return;
            case REACT_CONSUMER_TYPE:
              var render = props.children, newChildren = render(type._context._currentValue2), prevKeyPath$jscomp$7 = task.keyPath;
              task.keyPath = keyPath;
              renderNodeDestructive(request, task, newChildren, -1);
              task.keyPath = prevKeyPath$jscomp$7;
              return;
            case REACT_LAZY_TYPE:
              var init = type._init;
              var Component = init(type._payload);
              if (request.aborted) throw null;
              renderElement(request, task, keyPath, Component, props, ref);
              return;
          }
        throw Error(
          "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + ((null == type ? type : typeof type) + ".")
        );
      }
    }
    function resumeNode(request, task, segmentId, node, childIndex) {
      var prevReplay = task.replay, blockedBoundary = task.blockedBoundary, resumedSegment = createPendingSegment(
        request,
        0,
        null,
        task.formatContext,
        false,
        false
      );
      resumedSegment.id = segmentId;
      resumedSegment.parentFlushed = true;
      try {
        task.replay = null, task.blockedSegment = resumedSegment, renderNode(request, task, node, childIndex), resumedSegment.status = 1, null === blockedBoundary ? request.completedRootSegment = resumedSegment : (queueCompletedSegment(blockedBoundary, resumedSegment), blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary));
      } finally {
        task.replay = prevReplay, task.blockedSegment = null;
      }
    }
    function renderNodeDestructive(request, task, node, childIndex) {
      null !== task.replay && "number" === typeof task.replay.slots ? resumeNode(request, task, task.replay.slots, node, childIndex) : (task.node = node, task.childIndex = childIndex, node = task.componentStack, pushComponentStack(task), retryNode(request, task), task.componentStack = node);
    }
    function retryNode(request, task) {
      var node = task.node, childIndex = task.childIndex;
      if (null !== node) {
        if ("object" === typeof node) {
          switch (node.$$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = node.type, key = node.key, props = node.props;
              node = props.ref;
              var ref = void 0 !== node ? node : null, name = getComponentNameFromType(type), keyOrIndex = null == key || key === REACT_OPTIMISTIC_KEY ? -1 === childIndex ? 0 : childIndex : key;
              key = [task.keyPath, name, keyOrIndex];
              if (null !== task.replay)
                a: {
                  var replay = task.replay;
                  childIndex = replay.nodes;
                  for (node = 0; node < childIndex.length; node++) {
                    var node$jscomp$0 = childIndex[node];
                    if (keyOrIndex === node$jscomp$0[1]) {
                      if (4 === node$jscomp$0.length) {
                        if (null !== name && name !== node$jscomp$0[0])
                          throw Error(
                            "Expected the resume to render <" + node$jscomp$0[0] + "> in this slot but instead it rendered <" + name + ">. The tree doesn't match so React will fallback to client rendering."
                          );
                        var childNodes = node$jscomp$0[2], childSlots = node$jscomp$0[3], currentNode = task.node;
                        task.replay = {
                          nodes: childNodes,
                          slots: childSlots,
                          pendingTasks: 1
                        };
                        try {
                          renderElement(request, task, key, type, props, ref);
                          if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                            throw Error(
                              "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                            );
                          task.replay.pendingTasks--;
                        } catch (x) {
                          if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then || "Maximum call stack size exceeded" === x.message))
                            throw task.node === currentNode ? task.replay = replay : childIndex.splice(node, 1), x;
                          task.replay.pendingTasks--;
                          key = getThrownInfo(task.componentStack);
                          currentNode = request;
                          props = task.blockedBoundary;
                          request = request.aborted ? request.fatalError : x;
                          key = logRecoverableError(currentNode, request, key);
                          abortRemainingReplayNodes(
                            currentNode,
                            props,
                            childNodes,
                            childSlots,
                            request,
                            key
                          );
                        }
                        task.replay = replay;
                      } else {
                        if (type !== REACT_SUSPENSE_TYPE)
                          throw Error(
                            "Expected the resume to render <Suspense> in this slot but instead it rendered <" + (getComponentNameFromType(type) || "Unknown") + ">. The tree doesn't match so React will fallback to client rendering."
                          );
                        b: {
                          replay = node$jscomp$0[5];
                          type = node$jscomp$0[2];
                          ref = node$jscomp$0[3];
                          name = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
                          node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
                          keyOrIndex = task.keyPath;
                          var prevContext = task.formatContext, prevRow = task.row, previousReplaySet = task.replay, parentBoundary = task.blockedBoundary, parentHoistableState = task.hoistableState, content = props.children;
                          props = props.fallback;
                          var fallbackAbortSet = /* @__PURE__ */ new Set(), resumedBoundary = createSuspenseBoundary(
                            request,
                            task.row,
                            fallbackAbortSet,
                            null,
                            false
                          );
                          resumedBoundary.parentFlushed = true;
                          resumedBoundary.rootSegmentID = replay;
                          task.blockedBoundary = resumedBoundary;
                          task.hoistableState = resumedBoundary.contentState;
                          task.keyPath = key;
                          task.formatContext = getSuspenseContentFormatContext(
                            request.resumableState,
                            prevContext
                          );
                          task.row = null;
                          task.replay = {
                            nodes: type,
                            slots: ref,
                            pendingTasks: 1
                          };
                          try {
                            renderNode(request, task, content, -1);
                            if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                              throw Error(
                                "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                              );
                            task.replay.pendingTasks--;
                            if (0 === resumedBoundary.pendingTasks && 0 === resumedBoundary.status) {
                              resumedBoundary.status = 1;
                              request.completedBoundaries.push(resumedBoundary);
                              break b;
                            }
                          } catch (thrownValue) {
                            resumedBoundary.status = 4, childNodes = request.aborted ? request.fatalError : thrownValue, childSlots = getThrownInfo(task.componentStack), currentNode = logRecoverableError(
                              request,
                              childNodes,
                              childSlots
                            ), resumedBoundary.errorDigest = currentNode, task.replay.pendingTasks--, request.clientRenderedBoundaries.push(
                              resumedBoundary
                            );
                          } finally {
                            task.blockedBoundary = parentBoundary, task.hoistableState = parentHoistableState, task.replay = previousReplaySet, task.keyPath = keyOrIndex, task.formatContext = prevContext, task.row = prevRow;
                          }
                          childNodes = createReplayTask(
                            request,
                            null,
                            { nodes: name, slots: node$jscomp$0, pendingTasks: 0 },
                            props,
                            -1,
                            parentBoundary,
                            resumedBoundary.fallbackState,
                            fallbackAbortSet,
                            [key[0], "Suspense Fallback", key[2]],
                            getSuspenseFallbackFormatContext(
                              request.resumableState,
                              task.formatContext
                            ),
                            task.context,
                            task.treeContext,
                            task.row,
                            replaceSuspenseComponentStackWithSuspenseFallbackStack(
                              task.componentStack
                            )
                          );
                          pushComponentStack(childNodes);
                          request.pingedTasks.push(childNodes);
                        }
                      }
                      childIndex.splice(node, 1);
                      break a;
                    }
                  }
                }
              else renderElement(request, task, key, type, props, ref);
              return;
            case REACT_PORTAL_TYPE:
              throw Error(
                "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render."
              );
            case REACT_LAZY_TYPE:
              childNodes = node._init;
              node = childNodes(node._payload);
              if (request.aborted) throw null;
              renderNodeDestructive(request, task, node, childIndex);
              return;
          }
          if (isArrayImpl(node)) {
            renderChildrenArray(request, task, node, childIndex);
            return;
          }
          if (childNodes = getIteratorFn(node)) {
            if (childNodes = childNodes.call(node)) {
              node = childNodes.next();
              if (!node.done) {
                childSlots = [];
                do
                  childSlots.push(node.value), node = childNodes.next();
                while (!node.done);
                renderChildrenArray(request, task, childSlots, childIndex);
              }
              return;
            }
          }
          if ("function" === typeof node.then)
            return task.thenableState = null, renderNodeDestructive(request, task, unwrapThenable(node), childIndex);
          if (node.$$typeof === REACT_CONTEXT_TYPE)
            return renderNodeDestructive(
              request,
              task,
              node._currentValue2,
              childIndex
            );
          childIndex = Object.prototype.toString.call(node);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === childIndex ? "object with keys {" + Object.keys(node).join(", ") + "}" : childIndex) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        if ("string" === typeof node)
          childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
            childIndex.chunks,
            node,
            request.renderState,
            childIndex.lastPushedText
          ));
        else if ("number" === typeof node || "bigint" === typeof node)
          childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
            childIndex.chunks,
            "" + node,
            request.renderState,
            childIndex.lastPushedText
          ));
      }
    }
    function renderChildrenArray(request, task, children, childIndex) {
      var prevKeyPath = task.keyPath;
      if (-1 !== childIndex && (task.keyPath = [task.keyPath, "Fragment", childIndex], null !== task.replay)) {
        for (var replay = task.replay, replayNodes = replay.nodes, j = 0; j < replayNodes.length; j++) {
          var node = replayNodes[j];
          if (node[1] === childIndex) {
            childIndex = node[2];
            node = node[3];
            task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
            try {
              renderChildrenArray(request, task, children, -1);
              if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                throw Error(
                  "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                );
              task.replay.pendingTasks--;
            } catch (x) {
              if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then))
                throw x;
              task.replay.pendingTasks--;
              var thrownInfo = getThrownInfo(task.componentStack);
              children = request;
              var boundary = task.blockedBoundary;
              request = request.aborted ? request.fatalError : x;
              thrownInfo = logRecoverableError(children, request, thrownInfo);
              abortRemainingReplayNodes(
                children,
                boundary,
                childIndex,
                node,
                request,
                thrownInfo
              );
            }
            task.replay = replay;
            replayNodes.splice(j, 1);
            break;
          }
        }
        task.keyPath = prevKeyPath;
        return;
      }
      replay = task.treeContext;
      replayNodes = children.length;
      if (null !== task.replay && (j = task.replay.slots, null !== j && "object" === typeof j)) {
        for (childIndex = 0; childIndex < replayNodes; childIndex++)
          node = children[childIndex], task.treeContext = pushTreeContext(replay, replayNodes, childIndex), boundary = j[childIndex], "number" === typeof boundary ? (resumeNode(request, task, boundary, node, childIndex), delete j[childIndex]) : renderNode(request, task, node, childIndex);
        task.treeContext = replay;
        task.keyPath = prevKeyPath;
        return;
      }
      for (j = 0; j < replayNodes; j++)
        childIndex = children[j], task.treeContext = pushTreeContext(replay, replayNodes, j), renderNode(request, task, childIndex, j);
      task.treeContext = replay;
      task.keyPath = prevKeyPath;
    }
    function trackPostponedBoundary(request, trackedPostpones, boundary) {
      boundary.status = 5;
      boundary.rootSegmentID = request.nextSegmentId++;
      var tracked = boundary.tracked;
      if (null === tracked)
        throw Error(
          "It should not be possible to postpone at the root. This is a bug in React."
        );
      request = tracked.contentKeyPath;
      if (null === request)
        throw Error(
          "It should not be possible to postpone at the root. This is a bug in React."
        );
      tracked = tracked.fallbackNode;
      var children = [], boundaryNode = trackedPostpones.workingMap.get(request);
      if (void 0 === boundaryNode)
        return boundary = [
          request[1],
          request[2],
          children,
          null,
          tracked,
          boundary.rootSegmentID
        ], trackedPostpones.workingMap.set(request, boundary), addToReplayParent(boundary, request[0], trackedPostpones), boundary;
      boundaryNode[4] = tracked;
      boundaryNode[5] = boundary.rootSegmentID;
      return boundaryNode;
    }
    function trackPostpone(request, trackedPostpones, task, segment) {
      segment.status = 5;
      var keyPath = task.keyPath, boundary = task.blockedBoundary;
      if (null === boundary)
        segment.id = request.nextSegmentId++, trackedPostpones.rootSlots = segment.id, null !== request.completedRootSegment && (request.completedRootSegment.status = 5);
      else {
        if (null !== boundary && 0 === boundary.status) {
          var boundaryNode = trackPostponedBoundary(
            request,
            trackedPostpones,
            boundary
          );
          if (null !== boundary.tracked && boundary.tracked.contentKeyPath === keyPath && -1 === task.childIndex) {
            -1 === segment.id && (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
            boundaryNode[3] = segment.id;
            return;
          }
        }
        -1 === segment.id && (segment.id = segment.parentFlushed && null !== boundary ? boundary.rootSegmentID : request.nextSegmentId++);
        if (-1 === task.childIndex)
          null === keyPath ? trackedPostpones.rootSlots = segment.id : (task = trackedPostpones.workingMap.get(keyPath), void 0 === task ? (task = [keyPath[1], keyPath[2], [], segment.id], addToReplayParent(task, keyPath[0], trackedPostpones)) : task[3] = segment.id);
        else {
          if (null === keyPath)
            if (request = trackedPostpones.rootSlots, null === request)
              request = trackedPostpones.rootSlots = {};
            else {
              if ("number" === typeof request)
                throw Error(
                  "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React."
                );
            }
          else if (boundary = trackedPostpones.workingMap, boundaryNode = boundary.get(keyPath), void 0 === boundaryNode)
            request = {}, boundaryNode = [keyPath[1], keyPath[2], [], request], boundary.set(keyPath, boundaryNode), addToReplayParent(boundaryNode, keyPath[0], trackedPostpones);
          else if (request = boundaryNode[3], null === request)
            request = boundaryNode[3] = {};
          else if ("number" === typeof request)
            throw Error(
              "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React."
            );
          request[task.childIndex] = segment.id;
        }
      }
    }
    function untrackBoundary(request, boundary) {
      request = request.trackedPostpones;
      null !== request && (boundary = boundary.tracked, null !== boundary && (boundary = boundary.contentKeyPath, null !== boundary && (request = request.workingMap.get(boundary), void 0 !== request && (request.length = 4, request[2] = [], request[3] = null))));
    }
    function spawnNewSuspendedReplayTask(request, task, thenableState2) {
      return createReplayTask(
        request,
        thenableState2,
        task.replay,
        task.node,
        task.childIndex,
        task.blockedBoundary,
        task.hoistableState,
        task.abortSet,
        task.keyPath,
        task.formatContext,
        task.context,
        task.treeContext,
        task.row,
        task.componentStack
      );
    }
    function spawnNewSuspendedRenderTask(request, task, thenableState2) {
      var segment = task.blockedSegment, newSegment = createPendingSegment(
        request,
        segment.chunks.length,
        null,
        task.formatContext,
        segment.lastPushedText,
        true
      );
      segment.children.push(newSegment);
      segment.lastPushedText = false;
      return createRenderTask(
        request,
        thenableState2,
        task.node,
        task.childIndex,
        task.blockedBoundary,
        newSegment,
        task.blockedPreamble,
        task.hoistableState,
        task.abortSet,
        task.keyPath,
        task.formatContext,
        task.context,
        task.treeContext,
        task.row,
        task.componentStack
      );
    }
    function renderNode(request, task, node, childIndex) {
      var previousFormatContext = task.formatContext, previousContext = task.context, previousKeyPath = task.keyPath, previousTreeContext = task.treeContext, previousComponentStack = task.componentStack, segment = task.blockedSegment;
      if (null === segment) {
        segment = task.replay;
        try {
          return renderNodeDestructive(request, task, node, childIndex);
        } catch (thrownValue) {
          if (resetHooksState(), node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, !request.aborted && "object" === typeof node && null !== node) {
            if ("function" === typeof node.then) {
              childIndex = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
              request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
              node.then(request.resolve, request.reject);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              task.replay = segment;
              switchContext(previousContext);
              return;
            }
            if ("Maximum call stack size exceeded" === node.message) {
              node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
              node = spawnNewSuspendedReplayTask(request, task, node);
              request.pingedTasks.push(node);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              task.replay = segment;
              switchContext(previousContext);
              return;
            }
          }
        }
      } else {
        var childrenLength = segment.children.length, chunkLength = segment.chunks.length;
        try {
          return renderNodeDestructive(request, task, node, childIndex);
        } catch (thrownValue$63) {
          if (resetHooksState(), segment.children.length = childrenLength, segment.chunks.length = chunkLength, node = thrownValue$63 === SuspenseException ? getSuspendedThenable() : thrownValue$63, !request.aborted && "object" === typeof node && null !== node) {
            if ("function" === typeof node.then) {
              segment = node;
              node = thrownValue$63 === SuspenseException ? getThenableStateAfterSuspending() : null;
              request = spawnNewSuspendedRenderTask(request, task, node).ping;
              segment.then(request.resolve, request.reject);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
            if ("Maximum call stack size exceeded" === node.message) {
              segment = thrownValue$63 === SuspenseException ? getThenableStateAfterSuspending() : null;
              segment = spawnNewSuspendedRenderTask(request, task, segment);
              request.pingedTasks.push(segment);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
          }
        }
      }
      task.formatContext = previousFormatContext;
      task.context = previousContext;
      task.keyPath = previousKeyPath;
      task.treeContext = previousTreeContext;
      switchContext(previousContext);
      throw node;
    }
    function abortTaskSoft(task) {
      var boundary = task.blockedBoundary, segment = task.blockedSegment;
      null !== segment && (segment.status = 3, finishedTask(this, boundary, task.row, segment));
    }
    function abortRemainingReplayNodes(request$jscomp$0, boundary, nodes, slots, error, errorDigest$jscomp$0) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (4 === node.length)
          abortRemainingReplayNodes(
            request$jscomp$0,
            boundary,
            node[2],
            node[3],
            error,
            errorDigest$jscomp$0
          );
        else {
          node = node[5];
          var request = request$jscomp$0, errorDigest = errorDigest$jscomp$0, resumedBoundary = createSuspenseBoundary(
            request,
            null,
            /* @__PURE__ */ new Set(),
            null,
            false
          );
          resumedBoundary.parentFlushed = true;
          resumedBoundary.rootSegmentID = node;
          resumedBoundary.status = 4;
          resumedBoundary.errorDigest = errorDigest;
          resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
        }
      }
      nodes.length = 0;
      if (null !== slots) {
        if (null === boundary)
          throw Error(
            "We should not have any resumable nodes in the shell. This is a bug in React."
          );
        4 !== boundary.status && (boundary.status = 4, boundary.errorDigest = errorDigest$jscomp$0, boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
        if ("object" === typeof slots) for (var index in slots) delete slots[index];
      }
    }
    function abortTask(task, request) {
      if (task !== request.currentTask) {
        var boundary = task.blockedBoundary;
        task = task.blockedSegment;
        null !== task && (task.status = 3);
        null !== boundary && boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
          return abortTask(fallbackTask, request);
        });
      }
    }
    function finishAbortedTask(task, request, error) {
      if (task !== request.currentTask) {
        var boundary = task.blockedBoundary, segment = task.blockedSegment;
        if (null === segment || 3 === segment.status) {
          var errorInfo = getThrownInfo(task.componentStack), isRecoverableReason = isRecoverableError(error);
          if (null === boundary) {
            boundary = task.replay;
            if (null === boundary) {
              isRecoverableReason || null === request.trackedPostpones || null === segment ? isRecoverableReason ? (task = cloneRecoverableErrorAsFatal(error), logRecoverableError(request, task, errorInfo), 12 !== request.status && 13 !== request.status && fatalError(request, task)) : (logRecoverableError(request, error, errorInfo), 12 !== request.status && 13 !== request.status && fatalError(request, error)) : (boundary = request.trackedPostpones, logRecoverableError(request, error, errorInfo), trackPostpone(request, boundary, task, segment), finishedTask(request, null, task.row, segment));
              return;
            }
            12 !== request.status && 13 !== request.status && (boundary.pendingTasks--, 0 === boundary.pendingTasks && 0 < boundary.nodes.length && (errorInfo = logRecoverableError(request, error, errorInfo), abortRemainingReplayNodes(
              request,
              null,
              boundary.nodes,
              boundary.slots,
              error,
              errorInfo
            )), request.pendingRootTasks--, 0 === request.pendingRootTasks && completeShell(request));
          } else {
            var trackedPostpones$64 = request.trackedPostpones;
            if (4 !== boundary.status) {
              if (!isRecoverableReason && null !== trackedPostpones$64 && null !== segment)
                return logRecoverableError(request, error, errorInfo), trackPostpone(request, trackedPostpones$64, task, segment), boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
                  return finishAbortedTask(fallbackTask, request, error);
                }), boundary.fallbackAbortableTasks.clear(), finishedTask(request, boundary, task.row, segment);
              boundary.status = 4;
              errorInfo = logRecoverableError(request, error, errorInfo);
              boundary.errorDigest = errorInfo;
              untrackBoundary(request, boundary);
              boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
            }
            boundary.pendingTasks--;
            errorInfo = boundary.row;
            null !== errorInfo && 0 === --errorInfo.pendingTasks && finishSuspenseListRow(request, errorInfo);
            boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
              return finishAbortedTask(fallbackTask, request, error);
            });
            boundary.fallbackAbortableTasks.clear();
          }
          task = task.row;
          null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
          request.allPendingTasks--;
          0 === request.allPendingTasks && completeAll(request);
        }
      }
    }
    function safelyEmitEarlyPreloads(request, shellComplete) {
      try {
        var renderState = request.renderState, onHeaders = renderState.onHeaders;
        if (onHeaders) {
          var headers = renderState.headers;
          if (headers) {
            renderState.headers = null;
            var linkHeader = headers.preconnects;
            headers.fontPreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.fontPreloads);
            headers.highImagePreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.highImagePreloads);
            if (!shellComplete) {
              var queueIter = renderState.styles.values(), queueStep = queueIter.next();
              b: for (; 0 < headers.remainingCapacity && !queueStep.done; queueStep = queueIter.next())
                for (var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next(); 0 < headers.remainingCapacity && !sheetStep.done; sheetStep = sheetIter.next()) {
                  var sheet = sheetStep.value, props = sheet.props, key = props.href, props$jscomp$0 = sheet.props, header = getPreloadAsHeader(props$jscomp$0.href, "style", {
                    crossOrigin: props$jscomp$0.crossOrigin,
                    integrity: props$jscomp$0.integrity,
                    nonce: props$jscomp$0.nonce,
                    type: props$jscomp$0.type,
                    fetchPriority: props$jscomp$0.fetchPriority,
                    referrerPolicy: props$jscomp$0.referrerPolicy,
                    media: props$jscomp$0.media
                  });
                  if (0 <= (headers.remainingCapacity -= header.length + 2))
                    renderState.resets.style[key] = PRELOAD_NO_CREDS, linkHeader && (linkHeader += ", "), linkHeader += header, renderState.resets.style[key] = "string" === typeof props.crossOrigin || "string" === typeof props.integrity ? [props.crossOrigin, props.integrity] : PRELOAD_NO_CREDS;
                  else break b;
                }
            }
            linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
          }
        }
      } catch (error) {
        logRecoverableError(request, error, {});
      }
    }
    function completeShell(request) {
      null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
      null === request.trackedPostpones && preparePreamble(request);
      request = request.onShellReady;
      request();
    }
    function completeAll(request) {
      safelyEmitEarlyPreloads(
        request,
        null === request.trackedPostpones ? true : null === request.completedRootSegment || 5 !== request.completedRootSegment.status
      );
      preparePreamble(request);
      request = request.onAllReady;
      request();
    }
    function queueCompletedSegment(boundary, segment) {
      if (0 === segment.chunks.length && 1 === segment.children.length && null === segment.children[0].boundary && -1 === segment.children[0].id) {
        var childSegment = segment.children[0];
        childSegment.id = segment.id;
        childSegment.parentFlushed = true;
        1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status || queueCompletedSegment(boundary, childSegment);
      } else boundary.completedSegments.push(segment);
    }
    function finishedTask(request, boundary, row, segment) {
      null !== row && (0 === --row.pendingTasks ? finishSuspenseListRow(request, row) : row.together && tryToResolveTogetherRow(request, row));
      request.allPendingTasks--;
      if (null === boundary) {
        if (null !== segment && segment.parentFlushed) {
          if (null !== request.completedRootSegment)
            throw Error(
              "There can only be one root segment. This is a bug in React."
            );
          request.completedRootSegment = segment;
        }
        request.pendingRootTasks--;
        0 === request.pendingRootTasks && completeShell(request);
      } else if (boundary.pendingTasks--, 4 !== boundary.status)
        if (0 === boundary.pendingTasks)
          if (0 === boundary.status && (boundary.status = 1), null !== segment && segment.parentFlushed && (1 === segment.status || 3 === segment.status) && queueCompletedSegment(boundary, segment), boundary.parentFlushed && request.completedBoundaries.push(boundary), 1 === boundary.status)
            row = boundary.row, null !== row && hoistHoistables(row.hoistables, boundary.contentState), isEligibleForOutlining(request, boundary) || (request.allPendingTasks++, boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request), boundary.fallbackAbortableTasks.clear(), null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row), request.allPendingTasks--), 0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary.preamble && preparePreamble(request);
          else {
            if (5 === boundary.status && (boundary = boundary.row, null !== boundary)) {
              if (null !== request.trackedPostpones) {
                row = request.trackedPostpones;
                var postponedRow = boundary.next;
                if (null !== postponedRow && (segment = postponedRow.boundaries, null !== segment))
                  for (postponedRow.boundaries = null, postponedRow = 0; postponedRow < segment.length; postponedRow++) {
                    var postponedBoundary = segment[postponedRow];
                    trackPostponedBoundary(request, row, postponedBoundary);
                    finishedTask(request, postponedBoundary, null, null);
                  }
              }
              request.allPendingTasks++;
              0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
              request.allPendingTasks--;
            }
          }
        else
          null === segment || !segment.parentFlushed || 1 !== segment.status && 3 !== segment.status || (queueCompletedSegment(boundary, segment), 1 === boundary.completedSegments.length && boundary.parentFlushed && request.partialBoundaries.push(boundary)), boundary = boundary.row, null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary);
      0 === request.allPendingTasks && completeAll(request);
    }
    function performWork(request$jscomp$1) {
      if (!(request$jscomp$1.aborted || 11 < request$jscomp$1.status)) {
        var prevContext = currentActiveSnapshot, prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = HooksDispatcher;
        var prevAsyncDispatcher = ReactSharedInternals.A;
        ReactSharedInternals.A = DefaultAsyncDispatcher;
        var prevRequest = currentRequest;
        currentRequest = request$jscomp$1;
        var prevResumableState = currentResumableState;
        currentResumableState = request$jscomp$1.resumableState;
        try {
          var pingedTasks = request$jscomp$1.pingedTasks, i;
          for (i = 0; i < pingedTasks.length; i++) {
            var task = pingedTasks[i], request = request$jscomp$1, segment = task.blockedSegment;
            if (null === segment)
              a: {
                if (0 !== task.replay.pendingTasks) {
                  var prevTask = request.currentTask;
                  request.currentTask = task;
                  switchContext(task.context);
                  var startNode = task.node;
                  try {
                    "number" === typeof task.replay.slots ? resumeNode(
                      request,
                      task,
                      task.replay.slots,
                      task.node,
                      task.childIndex
                    ) : retryNode(request, task);
                    if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                      throw Error(
                        "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                      );
                    task.replay.pendingTasks--;
                    task.abortSet.delete(task);
                    finishedTask(request, task.blockedBoundary, task.row, null);
                  } catch (thrownValue) {
                    resetHooksState();
                    var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                    if (request.aborted) {
                      thrownValue === SuspenseException && (task.thenableState = getThenableStateAfterSuspending());
                      request.currentTask = prevTask;
                      var request$jscomp$0 = request;
                      abortTask(task, request$jscomp$0);
                      task.abortSet.delete(task);
                      finishAbortedTask(
                        task,
                        request$jscomp$0,
                        request$jscomp$0.fatalError
                      );
                    } else {
                      if ("object" === typeof x && null !== x) {
                        if ("function" === typeof x.then) {
                          var ping = task.ping;
                          x.then(ping.resolve, ping.reject);
                          task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                          break a;
                        }
                        if ("Maximum call stack size exceeded" === x.message && task.node !== startNode) {
                          task.thenableState = null;
                          request.pingedTasks.push(task);
                          break a;
                        }
                      }
                      task.replay.pendingTasks--;
                      task.abortSet.delete(task);
                      var errorInfo = getThrownInfo(task.componentStack);
                      request$jscomp$0 = request;
                      var boundary = task.blockedBoundary, error$jscomp$0 = request.aborted ? request.fatalError : x, replayNodes = task.replay.nodes, resumeSlots = task.replay.slots, errorDigest = logRecoverableError(
                        request$jscomp$0,
                        error$jscomp$0,
                        errorInfo
                      );
                      abortRemainingReplayNodes(
                        request$jscomp$0,
                        boundary,
                        replayNodes,
                        resumeSlots,
                        error$jscomp$0,
                        errorDigest
                      );
                      request.pendingRootTasks--;
                      0 === request.pendingRootTasks && completeShell(request);
                      request.allPendingTasks--;
                      0 === request.allPendingTasks && completeAll(request);
                    }
                  } finally {
                    request.currentTask = prevTask;
                  }
                }
              }
            else
              a: if (request$jscomp$0 = segment, 0 === request$jscomp$0.status) {
                var prevTask$jscomp$0 = request.currentTask;
                request.currentTask = task;
                switchContext(task.context);
                var childrenLength = request$jscomp$0.children.length, chunkLength = request$jscomp$0.chunks.length, startNode$jscomp$0 = task.node;
                try {
                  retryNode(request, task), pushSegmentFinale(
                    request$jscomp$0.chunks,
                    request.renderState,
                    request$jscomp$0.lastPushedText,
                    request$jscomp$0.textEmbedded
                  ), task.abortSet.delete(task), request$jscomp$0.status = 1, finishedTask(
                    request,
                    task.blockedBoundary,
                    task.row,
                    request$jscomp$0
                  );
                } catch (thrownValue) {
                  resetHooksState();
                  request$jscomp$0.children.length = childrenLength;
                  request$jscomp$0.chunks.length = chunkLength;
                  var x$jscomp$0 = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                  if (request.aborted)
                    thrownValue === SuspenseException && (task.thenableState = getThenableStateAfterSuspending()), request.currentTask = prevTask$jscomp$0, request$jscomp$0 = request, abortTask(task, request$jscomp$0), task.abortSet.delete(task), finishAbortedTask(
                      task,
                      request$jscomp$0,
                      request$jscomp$0.fatalError
                    );
                  else {
                    if ("object" === typeof x$jscomp$0 && null !== x$jscomp$0) {
                      if ("function" === typeof x$jscomp$0.then) {
                        request$jscomp$0.status = 0;
                        task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                        var ping$jscomp$0 = task.ping;
                        x$jscomp$0.then(
                          ping$jscomp$0.resolve,
                          ping$jscomp$0.reject
                        );
                        break a;
                      }
                      if ("Maximum call stack size exceeded" === x$jscomp$0.message && task.node !== startNode$jscomp$0) {
                        request$jscomp$0.status = 0;
                        task.thenableState = null;
                        request.pingedTasks.push(task);
                        break a;
                      }
                    }
                    var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
                    task.abortSet.delete(task);
                    request$jscomp$0.status = 4;
                    var boundary$jscomp$0 = task.blockedBoundary, row = task.row;
                    null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
                    request.allPendingTasks--;
                    if (null === boundary$jscomp$0)
                      if (isRecoverableError(x$jscomp$0)) {
                        var fatalRecoverableError = cloneRecoverableErrorAsFatal(x$jscomp$0);
                        logRecoverableError(
                          request,
                          fatalRecoverableError,
                          errorInfo$jscomp$0
                        );
                        fatalError(request, fatalRecoverableError);
                      } else
                        logRecoverableError(
                          request,
                          x$jscomp$0,
                          errorInfo$jscomp$0
                        ), fatalError(request, x$jscomp$0);
                    else {
                      var errorDigest$jscomp$0 = logRecoverableError(
                        request,
                        x$jscomp$0,
                        errorInfo$jscomp$0
                      );
                      boundary$jscomp$0.pendingTasks--;
                      if (4 !== boundary$jscomp$0.status) {
                        boundary$jscomp$0.status = 4;
                        boundary$jscomp$0.errorDigest = errorDigest$jscomp$0;
                        untrackBoundary(request, boundary$jscomp$0);
                        var boundaryRow = boundary$jscomp$0.row;
                        null !== boundaryRow && (request.allPendingTasks++, 0 === --boundaryRow.pendingTasks && finishSuspenseListRow(request, boundaryRow), request.allPendingTasks--);
                        boundary$jscomp$0.parentFlushed && request.clientRenderedBoundaries.push(boundary$jscomp$0);
                        0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary$jscomp$0.preamble && preparePreamble(request);
                      }
                      0 === request.allPendingTasks && completeAll(request);
                    }
                  }
                } finally {
                  request.currentTask = prevTask$jscomp$0;
                }
              }
          }
          pingedTasks.splice(0, i);
          null !== request$jscomp$1.destination && flushCompletedQueues(request$jscomp$1, request$jscomp$1.destination);
        } catch (error) {
          logRecoverableError(request$jscomp$1, error, {}), fatalError(request$jscomp$1, error);
        } finally {
          currentResumableState = prevResumableState, ReactSharedInternals.H = prevDispatcher, ReactSharedInternals.A = prevAsyncDispatcher, prevDispatcher === HooksDispatcher && switchContext(prevContext), currentRequest = prevRequest;
        }
      }
    }
    function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
      segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
      for (var pendingPreambles = false, i = 0; i < segment.children.length; i++)
        pendingPreambles = preparePreambleFromSegment(
          request,
          segment.children[i],
          collectedPreambleSegments
        ) || pendingPreambles;
      return pendingPreambles;
    }
    function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
      var boundary = segment.boundary;
      if (null === boundary)
        return preparePreambleFromSubtree(
          request,
          segment,
          collectedPreambleSegments
        );
      var preamble = boundary.preamble;
      if (null === preamble) return false;
      switch (boundary.status) {
        case 1:
          hoistPreambleState(request.renderState, preamble.content);
          request.byteSize += boundary.byteSize;
          segment = boundary.completedSegments[0];
          if (!segment)
            throw Error(
              "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
            );
          return preparePreambleFromSubtree(
            request,
            segment,
            collectedPreambleSegments
          );
        case 5:
          if (null !== request.trackedPostpones) return true;
        case 4:
          if (1 === segment.status)
            return hoistPreambleState(request.renderState, preamble.fallback), preparePreambleFromSubtree(
              request,
              segment,
              collectedPreambleSegments
            );
        default:
          return true;
      }
    }
    function preparePreamble(request) {
      if (request.completedRootSegment && null === request.completedPreambleSegments) {
        var collectedPreambleSegments = [], originalRequestByteSize = request.byteSize, hasPendingPreambles = preparePreambleFromSegment(
          request,
          request.completedRootSegment,
          collectedPreambleSegments
        ), preamble = request.renderState.preamble;
        false === hasPendingPreambles || preamble.headChunks && preamble.bodyChunks ? request.completedPreambleSegments = collectedPreambleSegments : request.byteSize = originalRequestByteSize;
      }
    }
    function flushSubtree(request, destination, segment, hoistableState) {
      segment.parentFlushed = true;
      switch (segment.status) {
        case 0:
          segment.id = request.nextSegmentId++;
        case 5:
          return hoistableState = segment.id, segment.lastPushedText = false, segment.textEmbedded = false, request = request.renderState, destination.push('<template id="'), destination.push(request.placeholderPrefix), request = hoistableState.toString(16), destination.push(request), destination.push('"></template>');
        case 1:
          segment.status = 2;
          var r = true, chunks = segment.chunks, chunkIdx = 0;
          segment = segment.children;
          for (var childIdx = 0; childIdx < segment.length; childIdx++) {
            for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
              destination.push(chunks[chunkIdx]);
            r = flushSegment(request, destination, r, hoistableState);
          }
          for (; chunkIdx < chunks.length - 1; chunkIdx++)
            destination.push(chunks[chunkIdx]);
          chunkIdx < chunks.length && (r = destination.push(chunks[chunkIdx]));
          return r;
        case 3:
          return true;
        default:
          throw Error(
            "Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React."
          );
      }
    }
    var flushedByteSize = 0;
    function flushSegment(request, destination, segment, hoistableState) {
      var boundary = segment.boundary;
      if (null === boundary)
        return flushSubtree(request, destination, segment, hoistableState);
      segment.boundary = null;
      boundary.parentFlushed = true;
      if (4 === boundary.status) {
        var row = boundary.row;
        null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
        request.renderState.generateStaticMarkup || (boundary = boundary.errorDigest, destination.push("<!--$!-->"), destination.push("<template"), null != boundary && (destination.push(' data-dgst="'), boundary = escapeTextForBrowser(boundary), destination.push(boundary), destination.push('"')), destination.push("></template>"));
        flushSubtree(request, destination, segment, hoistableState);
        request = request.renderState.generateStaticMarkup ? true : destination.push("<!--/$-->");
        return request;
      }
      if (1 !== boundary.status)
        return 0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++), 0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
          destination,
          request.renderState,
          boundary.rootSegmentID
        ), hoistableState && hoistHoistables(hoistableState, boundary.fallbackState), flushSubtree(request, destination, segment, hoistableState), destination.push("<!--/$-->");
      if (!flushingPartialBoundaries && isEligibleForOutlining(request, boundary) && (flushedByteSize + boundary.byteSize > request.progressiveChunkSize || boundary.defer))
        return boundary.rootSegmentID = request.nextSegmentId++, request.completedBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
          destination,
          request.renderState,
          boundary.rootSegmentID
        ), flushSubtree(request, destination, segment, hoistableState), destination.push("<!--/$-->");
      flushedByteSize += boundary.byteSize;
      hoistableState && hoistHoistables(hoistableState, boundary.contentState);
      segment = boundary.row;
      null !== segment && isEligibleForOutlining(request, boundary) && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
      request.renderState.generateStaticMarkup || destination.push("<!--$-->");
      segment = boundary.completedSegments;
      if (1 !== segment.length)
        throw Error(
          "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
        );
      flushSegment(request, destination, segment[0], hoistableState);
      request = request.renderState.generateStaticMarkup ? true : destination.push("<!--/$-->");
      return request;
    }
    function flushSegmentContainer(request, destination, segment, hoistableState) {
      writeStartSegment(
        destination,
        request.renderState,
        segment.parentFormatContext,
        segment.id
      );
      flushSegment(request, destination, segment, hoistableState);
      return writeEndSegment(destination, segment.parentFormatContext);
    }
    function flushCompletedBoundary(request, destination, boundary) {
      flushedByteSize = boundary.byteSize;
      for (var completedSegments = boundary.completedSegments, i = 0; i < completedSegments.length; i++)
        flushPartiallyCompletedSegment(
          request,
          destination,
          boundary,
          completedSegments[i]
        );
      completedSegments.length = 0;
      completedSegments = boundary.row;
      null !== completedSegments && isEligibleForOutlining(request, boundary) && 0 === --completedSegments.pendingTasks && finishSuspenseListRow(request, completedSegments);
      writeHoistablesForBoundary(
        destination,
        boundary.contentState,
        request.renderState
      );
      completedSegments = request.resumableState;
      request = request.renderState;
      i = boundary.rootSegmentID;
      boundary = boundary.contentState;
      var requiresStyleInsertion = request.stylesToHoist, requiresViewTransitions = 0 !== (completedSegments.instructions & 128);
      request.stylesToHoist = false;
      destination.push(request.startInlineScript);
      destination.push(">");
      requiresStyleInsertion ? (0 === (completedSegments.instructions & 4) && (completedSegments.instructions |= 4, destination.push(
        '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,null!=c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};'
      )), 0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, destination.push(
        '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};'
      )), requiresViewTransitions && 0 === (completedSegments.instructions & 256) && (completedSegments.instructions |= 256, destination.push(
        `$RV=function(B,g){function h(a,c){var e=a.getAttribute(c);e&&(c=a.style,l.push(a,c.viewTransitionName,c.viewTransitionClass),"auto"!==e&&(c.viewTransitionClass=e),(a=a.getAttribute("vt-name"))||(a="_T_"+N++ +"_"),a=CSS.escape(a)!==a?"r-"+btoa(a).replace(/=/g,""):a,c.viewTransitionName=a,C=!0)}var C=!1,N=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var k=g[f].querySelectorAll("[vt-share]"),d=0;d<k.length;d++){var b=k[d];m.set(b.getAttribute("vt-name"),b)}var u=[];for(k=0;k<g.length;k+=2){var D=g[k],x=D.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){b=D;for(f=0;b;){if(8===b.nodeType){var t=b.data;if("/$"===t)if(0===f)break;else f--;else"$"!==t&&"$?"!==t&&"$~"!==t&&"$!"!==t||f++}else if(1===b.nodeType){d=b;var E=d.getAttribute("vt-name"),y=m.get(E);h(d,y?"vt-share":"vt-exit");y&&(h(y,"vt-share"),m.set(E,null));for(var F=d.querySelectorAll("[vt-share]"),
z=0;z<F.length;z++){var G=F[z],H=G.getAttribute("vt-name"),I=m.get(H);I&&(h(G,"vt-share"),h(I,"vt-share"),m.set(H,null))}var J=d.querySelectorAll("[vt-parent-exit]");for(d=0;d<J.length;d++)h(J[d],"vt-parent-exit")}b=b.nextSibling}for(var K=g[k+1],n=K.firstElementChild;n;){null!==m.get(n.getAttribute("vt-name"))&&h(n,"vt-enter");var L=n.querySelectorAll("[vt-parent-enter]");for(b=0;b<L.length;b++)h(L[b],"vt-parent-enter");n=n.nextElementSibling}b=x;do for(var p=b.firstElementChild;p;){var M=p.getAttribute("vt-update");
M&&"none"!==M&&!l.includes(p)&&h(p,"vt-update");p=p.nextElementSibling}while((b=b.parentNode)&&1===b.nodeType&&"none"!==b.getAttribute("vt-update"));u.push.apply(u,K.querySelectorAll('img[src]:not([loading="lazy"])'))}}}if(C){var A=document.__reactViewTransition=document.startViewTransition({update:function(){B(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],c={},e=0;e<u.length;c={g:c.g},e++)if(c.g=u[e],!c.g.complete){var q=c.g.getBoundingClientRect();0<q.bottom&&0<q.right&&
q.top<window.innerHeight&&q.left<window.innerWidth&&(q=new Promise(function(w){return function(r){w.g.addEventListener("load",r);w.g.addEventListener("error",r)}}(c)),a.push(q))}return Promise.race([Promise.all(a),new Promise(function(w){var r=performance.now();setTimeout(w,2300>r&&2E3<r?2300-r:500)})])},types:[]});A.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var c=l[a],e=c.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];""===c.getAttribute("style")&&c.removeAttribute("style")}});
A.finished.finally(function(){document.__reactViewTransition===A&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}B(g)}.bind(null,$RV);`
      )), 0 === (completedSegments.instructions & 8) ? (completedSegments.instructions |= 8, destination.push(
        '$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll("link[data-precedence],style[data-precedence]"),v=[],k=0;b=e[k++];)"not all"===b.getAttribute("media")?v.push(b):("LINK"===b.tagName&&$RM.set(b.getAttribute("href"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement("link");a.href=d;a.rel=\n"stylesheet";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute("media");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n"$~";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,"CSS failed to load"))};$RR("'
      )) : destination.push('$RR("')) : (0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, destination.push(
        '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};'
      )), requiresViewTransitions && 0 === (completedSegments.instructions & 256) && (completedSegments.instructions |= 256, destination.push(
        `$RV=function(B,g){function h(a,c){var e=a.getAttribute(c);e&&(c=a.style,l.push(a,c.viewTransitionName,c.viewTransitionClass),"auto"!==e&&(c.viewTransitionClass=e),(a=a.getAttribute("vt-name"))||(a="_T_"+N++ +"_"),a=CSS.escape(a)!==a?"r-"+btoa(a).replace(/=/g,""):a,c.viewTransitionName=a,C=!0)}var C=!1,N=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var k=g[f].querySelectorAll("[vt-share]"),d=0;d<k.length;d++){var b=k[d];m.set(b.getAttribute("vt-name"),b)}var u=[];for(k=0;k<g.length;k+=2){var D=g[k],x=D.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){b=D;for(f=0;b;){if(8===b.nodeType){var t=b.data;if("/$"===t)if(0===f)break;else f--;else"$"!==t&&"$?"!==t&&"$~"!==t&&"$!"!==t||f++}else if(1===b.nodeType){d=b;var E=d.getAttribute("vt-name"),y=m.get(E);h(d,y?"vt-share":"vt-exit");y&&(h(y,"vt-share"),m.set(E,null));for(var F=d.querySelectorAll("[vt-share]"),
z=0;z<F.length;z++){var G=F[z],H=G.getAttribute("vt-name"),I=m.get(H);I&&(h(G,"vt-share"),h(I,"vt-share"),m.set(H,null))}var J=d.querySelectorAll("[vt-parent-exit]");for(d=0;d<J.length;d++)h(J[d],"vt-parent-exit")}b=b.nextSibling}for(var K=g[k+1],n=K.firstElementChild;n;){null!==m.get(n.getAttribute("vt-name"))&&h(n,"vt-enter");var L=n.querySelectorAll("[vt-parent-enter]");for(b=0;b<L.length;b++)h(L[b],"vt-parent-enter");n=n.nextElementSibling}b=x;do for(var p=b.firstElementChild;p;){var M=p.getAttribute("vt-update");
M&&"none"!==M&&!l.includes(p)&&h(p,"vt-update");p=p.nextElementSibling}while((b=b.parentNode)&&1===b.nodeType&&"none"!==b.getAttribute("vt-update"));u.push.apply(u,K.querySelectorAll('img[src]:not([loading="lazy"])'))}}}if(C){var A=document.__reactViewTransition=document.startViewTransition({update:function(){B(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],c={},e=0;e<u.length;c={g:c.g},e++)if(c.g=u[e],!c.g.complete){var q=c.g.getBoundingClientRect();0<q.bottom&&0<q.right&&
q.top<window.innerHeight&&q.left<window.innerWidth&&(q=new Promise(function(w){return function(r){w.g.addEventListener("load",r);w.g.addEventListener("error",r)}}(c)),a.push(q))}return Promise.race([Promise.all(a),new Promise(function(w){var r=performance.now();setTimeout(w,2300>r&&2E3<r?2300-r:500)})])},types:[]});A.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var c=l[a],e=c.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];""===c.getAttribute("style")&&c.removeAttribute("style")}});
A.finished.finally(function(){document.__reactViewTransition===A&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}B(g)}.bind(null,$RV);`
      )), destination.push('$RC("'));
      completedSegments = i.toString(16);
      destination.push(request.boundaryPrefix);
      destination.push(completedSegments);
      destination.push('","');
      destination.push(request.segmentPrefix);
      destination.push(completedSegments);
      requiresStyleInsertion ? (destination.push('",'), writeStyleResourceDependenciesInJS(destination, boundary)) : destination.push('"');
      boundary = destination.push(")</script>");
      return writeBootstrap(destination, request) && boundary;
    }
    function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
      if (2 === segment.status) return true;
      var hoistableState = boundary.contentState, segmentID = segment.id;
      if (-1 === segmentID) {
        if (-1 === (segment.id = boundary.rootSegmentID))
          throw Error(
            "A root segment ID must have been assigned by now. This is a bug in React."
          );
        return flushSegmentContainer(request, destination, segment, hoistableState);
      }
      if (segmentID === boundary.rootSegmentID)
        return flushSegmentContainer(request, destination, segment, hoistableState);
      flushSegmentContainer(request, destination, segment, hoistableState);
      boundary = request.resumableState;
      request = request.renderState;
      destination.push(request.startInlineScript);
      destination.push(">");
      0 === (boundary.instructions & 1) ? (boundary.instructions |= 1, destination.push(
        '$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'
      )) : destination.push('$RS("');
      destination.push(request.segmentPrefix);
      segmentID = segmentID.toString(16);
      destination.push(segmentID);
      destination.push('","');
      destination.push(request.placeholderPrefix);
      destination.push(segmentID);
      destination = destination.push('")</script>');
      return destination;
    }
    var flushingPartialBoundaries = false;
    function flushCompletedQueues(request, destination) {
      try {
        if (!(0 < request.pendingRootTasks)) {
          var i, completedRootSegment = request.completedRootSegment;
          if (null !== completedRootSegment) {
            if (5 === completedRootSegment.status) return;
            var completedPreambleSegments = request.completedPreambleSegments;
            if (null === completedPreambleSegments) return;
            flushedByteSize = request.byteSize;
            var resumableState = request.resumableState, renderState = request.renderState, preamble = renderState.preamble, htmlChunks = preamble.htmlChunks, headChunks = preamble.headChunks, i$jscomp$0;
            if (htmlChunks) {
              for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++)
                destination.push(htmlChunks[i$jscomp$0]);
              if (headChunks)
                for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                  destination.push(headChunks[i$jscomp$0]);
              else {
                var chunk = startChunkForTag("head");
                destination.push(chunk);
                destination.push(">");
              }
            } else if (headChunks)
              for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                destination.push(headChunks[i$jscomp$0]);
            var charsetChunks = renderState.charsetChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++)
              destination.push(charsetChunks[i$jscomp$0]);
            charsetChunks.length = 0;
            renderState.preconnects.forEach(flushResource, destination);
            renderState.preconnects.clear();
            var viewportChunks = renderState.viewportChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++)
              destination.push(viewportChunks[i$jscomp$0]);
            viewportChunks.length = 0;
            renderState.fontPreloads.forEach(flushResource, destination);
            renderState.fontPreloads.clear();
            renderState.highImagePreloads.forEach(flushResource, destination);
            renderState.highImagePreloads.clear();
            currentlyFlushingRenderState = renderState;
            renderState.styles.forEach(flushStylesInPreamble, destination);
            currentlyFlushingRenderState = null;
            var importMapChunks = renderState.importMapChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++)
              destination.push(importMapChunks[i$jscomp$0]);
            importMapChunks.length = 0;
            renderState.bootstrapScripts.forEach(flushResource, destination);
            renderState.scripts.forEach(flushResource, destination);
            renderState.scripts.clear();
            renderState.bulkPreloads.forEach(flushResource, destination);
            renderState.bulkPreloads.clear();
            resumableState.instructions |= 32;
            var hoistableChunks = renderState.hoistableChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++)
              destination.push(hoistableChunks[i$jscomp$0]);
            for (resumableState = hoistableChunks.length = 0; resumableState < completedPreambleSegments.length; resumableState++) {
              var segments = completedPreambleSegments[resumableState];
              for (renderState = 0; renderState < segments.length; renderState++)
                flushSegment(request, destination, segments[renderState], null);
            }
            var preamble$jscomp$0 = request.renderState.preamble, headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
            if (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) {
              var chunk$jscomp$0 = endChunkForTag("head");
              destination.push(chunk$jscomp$0);
            }
            var bodyChunks = preamble$jscomp$0.bodyChunks;
            if (bodyChunks)
              for (completedPreambleSegments = 0; completedPreambleSegments < bodyChunks.length; completedPreambleSegments++)
                destination.push(bodyChunks[completedPreambleSegments]);
            flushSegment(request, destination, completedRootSegment, null);
            request.completedRootSegment = null;
            var renderState$jscomp$0 = request.renderState;
            if (0 !== request.allPendingTasks || 0 !== request.clientRenderedBoundaries.length || 0 !== request.completedBoundaries.length || null !== request.trackedPostpones && (0 !== request.trackedPostpones.rootNodes.length || null !== request.trackedPostpones.rootSlots)) {
              var resumableState$jscomp$0 = request.resumableState;
              if (0 === (resumableState$jscomp$0.instructions & 64)) {
                resumableState$jscomp$0.instructions |= 64;
                destination.push(renderState$jscomp$0.startInlineScript);
                if (0 === (resumableState$jscomp$0.instructions & 32)) {
                  resumableState$jscomp$0.instructions |= 32;
                  var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
                  destination.push(' id="');
                  var chunk$jscomp$1 = escapeTextForBrowser(shellId);
                  destination.push(chunk$jscomp$1);
                  destination.push('"');
                }
                destination.push(">");
                destination.push(
                  "requestAnimationFrame(function(){$RT=performance.now()});"
                );
                destination.push("</script>");
              }
            }
            writeBootstrap(destination, renderState$jscomp$0);
          }
          var renderState$jscomp$1 = request.renderState;
          completedRootSegment = 0;
          var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
          for (completedRootSegment = 0; completedRootSegment < viewportChunks$jscomp$0.length; completedRootSegment++)
            destination.push(viewportChunks$jscomp$0[completedRootSegment]);
          viewportChunks$jscomp$0.length = 0;
          renderState$jscomp$1.preconnects.forEach(flushResource, destination);
          renderState$jscomp$1.preconnects.clear();
          renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
          renderState$jscomp$1.fontPreloads.clear();
          renderState$jscomp$1.highImagePreloads.forEach(
            flushResource,
            destination
          );
          renderState$jscomp$1.highImagePreloads.clear();
          renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
          renderState$jscomp$1.scripts.forEach(flushResource, destination);
          renderState$jscomp$1.scripts.clear();
          renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
          renderState$jscomp$1.bulkPreloads.clear();
          var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
          for (completedRootSegment = 0; completedRootSegment < hoistableChunks$jscomp$0.length; completedRootSegment++)
            destination.push(hoistableChunks$jscomp$0[completedRootSegment]);
          hoistableChunks$jscomp$0.length = 0;
          var clientRenderedBoundaries = request.clientRenderedBoundaries;
          for (i = 0; i < clientRenderedBoundaries.length; i++) {
            var boundary = clientRenderedBoundaries[i];
            renderState$jscomp$1 = destination;
            var resumableState$jscomp$1 = request.resumableState, renderState$jscomp$2 = request.renderState, id = boundary.rootSegmentID, errorDigest = boundary.errorDigest;
            renderState$jscomp$1.push(renderState$jscomp$2.startInlineScript);
            renderState$jscomp$1.push(">");
            0 === (resumableState$jscomp$1.instructions & 4) ? (resumableState$jscomp$1.instructions |= 4, renderState$jscomp$1.push(
              '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,null!=c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("'
            )) : renderState$jscomp$1.push('$RX("');
            renderState$jscomp$1.push(renderState$jscomp$2.boundaryPrefix);
            var chunk$jscomp$2 = id.toString(16);
            renderState$jscomp$1.push(chunk$jscomp$2);
            renderState$jscomp$1.push('"');
            if (null != errorDigest)
              if (renderState$jscomp$1.push(","), null == errorDigest)
                renderState$jscomp$1.push("null");
              else {
                var chunk$jscomp$3 = escapeJSStringsForInstructionScripts(errorDigest);
                renderState$jscomp$1.push(chunk$jscomp$3);
              }
            var JSCompiler_inline_result = renderState$jscomp$1.push(")</script>");
            if (!JSCompiler_inline_result) {
              request.destination = null;
              i++;
              clientRenderedBoundaries.splice(0, i);
              return;
            }
          }
          clientRenderedBoundaries.splice(0, i);
          var completedBoundaries = request.completedBoundaries;
          for (i = 0; i < completedBoundaries.length; i++)
            if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
              request.destination = null;
              i++;
              completedBoundaries.splice(0, i);
              return;
            }
          completedBoundaries.splice(0, i);
          flushingPartialBoundaries = true;
          var partialBoundaries = request.partialBoundaries;
          for (i = 0; i < partialBoundaries.length; i++) {
            var boundary$70 = partialBoundaries[i];
            a: {
              clientRenderedBoundaries = request;
              boundary = destination;
              flushedByteSize = boundary$70.byteSize;
              var completedSegments = boundary$70.completedSegments;
              for (JSCompiler_inline_result = 0; JSCompiler_inline_result < completedSegments.length; JSCompiler_inline_result++)
                if (!flushPartiallyCompletedSegment(
                  clientRenderedBoundaries,
                  boundary,
                  boundary$70,
                  completedSegments[JSCompiler_inline_result]
                )) {
                  JSCompiler_inline_result++;
                  completedSegments.splice(0, JSCompiler_inline_result);
                  var JSCompiler_inline_result$jscomp$0 = false;
                  break a;
                }
              completedSegments.splice(0, JSCompiler_inline_result);
              var row = boundary$70.row;
              null !== row && row.together && 1 === boundary$70.pendingTasks && (1 === row.pendingTasks ? unblockSuspenseListRow(
                clientRenderedBoundaries,
                row,
                row.hoistables
              ) : row.pendingTasks--);
              JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
                boundary,
                boundary$70.contentState,
                clientRenderedBoundaries.renderState
              );
            }
            if (!JSCompiler_inline_result$jscomp$0) {
              request.destination = null;
              i++;
              partialBoundaries.splice(0, i);
              return;
            }
          }
          partialBoundaries.splice(0, i);
          flushingPartialBoundaries = false;
          var largeBoundaries = request.completedBoundaries;
          for (i = 0; i < largeBoundaries.length; i++)
            if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
              request.destination = null;
              i++;
              largeBoundaries.splice(0, i);
              return;
            }
          largeBoundaries.splice(0, i);
        }
      } finally {
        flushingPartialBoundaries = false, i = request.postponedState, null !== i && (i.nextSegmentId = request.nextSegmentId), 0 === request.allPendingTasks && 0 === request.clientRenderedBoundaries.length && 0 === request.completedBoundaries.length && (request.flushScheduled = false, i = request.resumableState, i.hasBody && (partialBoundaries = endChunkForTag("body"), destination.push(partialBoundaries)), i.hasHtml && (i = endChunkForTag("html"), destination.push(i)), endRenderLifetime(request), request.status = 13, destination.push(null), request.destination = null);
      }
    }
    function enqueueFlush(request) {
      if (false === request.flushScheduled && 0 === request.pingedTasks.length && null !== request.destination) {
        request.flushScheduled = true;
        var destination = request.destination;
        destination ? flushCompletedQueues(request, destination) : request.flushScheduled = false;
      }
    }
    function startFlowing(request, destination) {
      if (12 === request.status)
        request.status = 13, request = request.fatalError, isRecoverableError(request) && (request = cloneRecoverableErrorAsFatal(request)), destination.destroy(request);
      else if (13 !== request.status && null === request.destination) {
        request.destination = destination;
        try {
          flushCompletedQueues(request, destination);
        } catch (error$72) {
          logRecoverableError(request, error$72, {}), fatalError(request, error$72);
        }
      }
    }
    function finishAbort(request, abortableTasks) {
      try {
        if (0 < abortableTasks.size) {
          var error = request.fatalError;
          abortableTasks.forEach(function(task) {
            return finishAbortedTask(task, request, error);
          });
          abortableTasks.clear();
        }
        null !== request.destination && flushCompletedQueues(request, request.destination);
      } catch (error$73) {
        logRecoverableError(request, error$73, {}), fatalError(request, error$73);
      }
    }
    function endRenderLifetime(request) {
      request = request.renderLifetimeController;
      null !== request && request.abort("The render ended.");
    }
    function abort(request, reason) {
      if (!(request.aborted || 11 !== request.status && 10 !== request.status)) {
        endRenderLifetime(request);
        var isRecoverableReason = "object" === typeof reason && null !== reason && reason.$$typeof === REACT_RECOVERABLE_TYPE;
        request.aborted = true;
        reason = isRecoverableReason ? createRecoverableError(reason) : void 0 === reason ? Error("The render was aborted by the server without a reason.") : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error("The render was aborted by the server with a promise.") : reason;
        request.fatalError = reason;
        reason = request.abortableTasks;
        reason.forEach(function(task) {
          return abortTask(task, request);
        });
        finishAbort(request, reason);
      }
    }
    function addToReplayParent(node, parentKeyPath, trackedPostpones) {
      if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
      else {
        var workingMap = trackedPostpones.workingMap, parentNode = workingMap.get(parentKeyPath);
        void 0 === parentNode && (parentNode = [parentKeyPath[1], parentKeyPath[2], [], null], workingMap.set(parentKeyPath, parentNode), addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
        parentNode[2].push(node);
      }
    }
    function onError() {
    }
    function renderToStringImpl(children, options, generateStaticMarkup, abortReason) {
      var didFatal = false, fatalError2 = null, result = "", readyToStream = false;
      options = createResumableState(options ? options.identifierPrefix : void 0);
      children = createRequest(
        children,
        options,
        createRenderState(options, generateStaticMarkup),
        createFormatContext(0, null, 0, null),
        Infinity,
        onError,
        void 0,
        void 0,
        function() {
          readyToStream = true;
        },
        void 0,
        void 0,
        void 0
      );
      children.flushScheduled = null !== children.destination;
      performWork(children);
      10 === children.status && (children.status = 11);
      null === children.trackedPostpones && safelyEmitEarlyPreloads(children, 0 === children.pendingRootTasks);
      abort(children, abortReason);
      startFlowing(children, {
        push: function(chunk) {
          null !== chunk && (result += chunk);
          return true;
        },
        destroy: function(error) {
          didFatal = true;
          fatalError2 = error;
        }
      });
      if (didFatal && fatalError2 !== abortReason) throw fatalError2;
      if (!readyToStream)
        throw Error(
          "A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition."
        );
      return result;
    }
    exports2.renderToStaticMarkup = function(children, options) {
      return renderToStringImpl(
        children,
        options,
        true,
        'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server'
      );
    };
    exports2.renderToString = function(children, options) {
      return renderToStringImpl(
        children,
        options,
        false,
        'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server'
      );
    };
    exports2.version = "19.3.1";
  }
});

// node_modules/react-dom/cjs/react-dom-server.node.production.js
var require_react_dom_server_node_production = __commonJS({
  "node_modules/react-dom/cjs/react-dom-server.node.production.js"(exports2) {
    "use strict";
    var util = require("util");
    var crypto = require("crypto");
    var async_hooks = require("async_hooks");
    var React = require_react();
    var ReactDOM = require_react_dom();
    var stream = require("stream");
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_SCOPE_TYPE = /* @__PURE__ */ Symbol.for("react.scope");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var REACT_LEGACY_HIDDEN_TYPE = /* @__PURE__ */ Symbol.for("react.legacy_hidden");
    var REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
    var REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition");
    var REACT_RECOVERABLE_TYPE = /* @__PURE__ */ Symbol.for("react.recoverable");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var REACT_OPTIMISTIC_KEY = /* @__PURE__ */ Symbol.for("react.optimistic_key");
    var isArrayImpl = Array.isArray;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var supportsArrayBufferDetached = hasOwnProperty.call(
      ArrayBuffer.prototype,
      "detached"
    );
    var scheduleMicrotask = queueMicrotask;
    function flushBuffered(destination) {
      "function" === typeof destination.flush && destination.flush();
    }
    var currentView = null;
    var writtenBytes = 0;
    var destinationHasCapacity$1 = true;
    function writeChunk(destination, chunk) {
      if ("string" === typeof chunk) {
        if (0 !== chunk.length)
          if (4096 < 3 * chunk.length)
            0 < writtenBytes && (writeToDestination(
              destination,
              currentView.subarray(0, writtenBytes)
            ), currentView = new Uint8Array(4096), writtenBytes = 0), writeToDestination(destination, chunk);
          else {
            var target = currentView;
            0 < writtenBytes && (target = currentView.subarray(writtenBytes));
            target = textEncoder.encodeInto(chunk, target);
            var read = target.read;
            writtenBytes += target.written;
            read < chunk.length && (writeToDestination(
              destination,
              currentView.subarray(0, writtenBytes)
            ), currentView = new Uint8Array(4096), writtenBytes = textEncoder.encodeInto(
              chunk.slice(read),
              currentView
            ).written);
            4096 === writtenBytes && (writeToDestination(destination, currentView), currentView = new Uint8Array(4096), writtenBytes = 0);
          }
      } else if (0 === chunk.byteLength) {
        if (supportsArrayBufferDetached && chunk.buffer.detached)
          throw Error(
            "Cannot transport a detached buffer. This usually happens when trying to transport multiple buffer-spanning views on the same underyling buffer. Either reuse the exact same view by identity or copy the underlying buffer manually via `view.slice()`."
          );
      } else
        4096 < chunk.byteLength ? (0 < writtenBytes && (writeToDestination(
          destination,
          currentView.subarray(0, writtenBytes)
        ), currentView = new Uint8Array(4096), writtenBytes = 0), writeToDestination(destination, chunk)) : (target = currentView.length - writtenBytes, target < chunk.byteLength && (0 === target ? writeToDestination(destination, currentView) : (currentView.set(chunk.subarray(0, target), writtenBytes), writtenBytes += target, writeToDestination(destination, currentView), chunk = chunk.subarray(target)), currentView = new Uint8Array(4096), writtenBytes = 0), currentView.set(chunk, writtenBytes), writtenBytes += chunk.byteLength, 4096 === writtenBytes && (writeToDestination(destination, currentView), currentView = new Uint8Array(4096), writtenBytes = 0));
    }
    function writeToDestination(destination, view) {
      destination = destination.write(view);
      destinationHasCapacity$1 = destinationHasCapacity$1 && destination;
    }
    function writeChunkAndReturn(destination, chunk) {
      writeChunk(destination, chunk);
      return destinationHasCapacity$1;
    }
    function completeWriting(destination) {
      currentView && 0 < writtenBytes && destination.write(currentView.subarray(0, writtenBytes));
      currentView = null;
      writtenBytes = 0;
      destinationHasCapacity$1 = true;
    }
    var textEncoder = new util.TextEncoder();
    function stringToPrecomputedChunk(content) {
      return textEncoder.encode(content);
    }
    function byteLengthOfChunk(chunk) {
      return "string" === typeof chunk ? Buffer.byteLength(chunk, "utf8") : chunk.byteLength;
    }
    var assign = Object.assign;
    var VALID_ATTRIBUTE_NAME_REGEX = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    );
    var illegalAttributeNameCache = {};
    var validatedAttributeNameCache = {};
    function isAttributeNameSafe(attributeName) {
      if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
        return true;
      if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
      if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
        return validatedAttributeNameCache[attributeName] = true;
      illegalAttributeNameCache[attributeName] = true;
      return false;
    }
    var unitlessNumbers = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " "
      )
    );
    var aliases = /* @__PURE__ */ new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["maskType", "mask-type"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"]
    ]);
    var matchHtmlRegExp = /["'&<>]/;
    function escapeTextForBrowser(text) {
      if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text)
        return "" + text;
      text = "" + text;
      var match = matchHtmlRegExp.exec(text);
      if (match) {
        var html = "", index, lastIndex = 0;
        for (index = match.index; index < text.length; index++) {
          switch (text.charCodeAt(index)) {
            case 34:
              match = "&quot;";
              break;
            case 38:
              match = "&amp;";
              break;
            case 39:
              match = "&#x27;";
              break;
            case 60:
              match = "&lt;";
              break;
            case 62:
              match = "&gt;";
              break;
            default:
              continue;
          }
          lastIndex !== index && (html += text.slice(lastIndex, index));
          lastIndex = index + 1;
          html += match;
        }
        text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
      }
      return text;
    }
    var uppercasePattern = /([A-Z])/g;
    var msPattern = /^ms-/;
    var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function sanitizeURL(url) {
      return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
    }
    var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var sharedNotPendingObject = {
      pending: false,
      data: null,
      method: null,
      action: null
    };
    var previousDispatcher = ReactDOMSharedInternals.d;
    ReactDOMSharedInternals.d = {
      f: previousDispatcher.f,
      r: previousDispatcher.r,
      D: prefetchDNS,
      C: preconnect,
      L: preload,
      m: preloadModule,
      X: preinitScript,
      S: preinitStyle,
      M: preinitModuleScript
    };
    var PRELOAD_NO_CREDS = [];
    var currentlyFlushingRenderState = null;
    stringToPrecomputedChunk('"></template>');
    var startInlineScript = stringToPrecomputedChunk("<script");
    var endInlineScript = stringToPrecomputedChunk("</script>");
    var startScriptSrc = stringToPrecomputedChunk('<script src="');
    var startModuleSrc = stringToPrecomputedChunk('<script type="module" src="');
    var scriptNonce = stringToPrecomputedChunk(' nonce="');
    var scriptIntegirty = stringToPrecomputedChunk(' integrity="');
    var scriptCrossOrigin = stringToPrecomputedChunk(' crossorigin="');
    var endAsyncScript = stringToPrecomputedChunk(' async=""></script>');
    var startInlineStyle = stringToPrecomputedChunk("<style");
    var scriptRegex = /(<\/|<)(s)(cript)/gi;
    function scriptReplacer(match, prefix2, s, suffix2) {
      return "" + prefix2 + ("s" === s ? "\\u0073" : "\\u0053") + suffix2;
    }
    var importMapScriptStart = stringToPrecomputedChunk(
      '<script type="importmap">'
    );
    var importMapScriptEnd = stringToPrecomputedChunk("</script>");
    function createRenderState(resumableState, nonce, externalRuntimeConfig, importMap, onHeaders, maxHeadersLength) {
      externalRuntimeConfig = "string" === typeof nonce ? nonce : nonce && nonce.script;
      var inlineScriptWithNonce = void 0 === externalRuntimeConfig ? startInlineScript : stringToPrecomputedChunk(
        '<script nonce="' + escapeTextForBrowser(externalRuntimeConfig) + '"'
      ), nonceStyle = "string" === typeof nonce ? void 0 : nonce && nonce.style, inlineStyleWithNonce = void 0 === nonceStyle ? startInlineStyle : stringToPrecomputedChunk(
        '<style nonce="' + escapeTextForBrowser(nonceStyle) + '"'
      ), idPrefix = resumableState.idPrefix, bootstrapChunks = [], bootstrapScriptContent = resumableState.bootstrapScriptContent, bootstrapScripts = resumableState.bootstrapScripts, bootstrapModules = resumableState.bootstrapModules;
      void 0 !== bootstrapScriptContent && (bootstrapChunks.push(inlineScriptWithNonce), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
        endOfStartTag,
        ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer),
        endInlineScript
      ));
      bootstrapScriptContent = [];
      void 0 !== importMap && (bootstrapScriptContent.push(
        void 0 === externalRuntimeConfig ? importMapScriptStart : stringToPrecomputedChunk(
          '<script type="importmap" nonce="' + escapeTextForBrowser(externalRuntimeConfig) + '">'
        )
      ), bootstrapScriptContent.push(
        ("" + JSON.stringify(importMap)).replace(scriptRegex, scriptReplacer)
      ), bootstrapScriptContent.push(importMapScriptEnd));
      importMap = onHeaders ? {
        preconnects: "",
        fontPreloads: "",
        highImagePreloads: "",
        remainingCapacity: 2 + ("number" === typeof maxHeadersLength ? maxHeadersLength : 2e3)
      } : null;
      onHeaders = {
        placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
        segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
        boundaryPrefix: stringToPrecomputedChunk(idPrefix + "B:"),
        startInlineScript: inlineScriptWithNonce,
        startInlineStyle: inlineStyleWithNonce,
        preamble: createPreambleState(),
        externalRuntimeScript: null,
        bootstrapChunks,
        importMapChunks: bootstrapScriptContent,
        onHeaders,
        headers: importMap,
        resets: {
          font: {},
          dns: {},
          connect: { default: {}, anonymous: {}, credentials: {} },
          image: {},
          style: {}
        },
        charsetChunks: [],
        viewportChunks: [],
        hoistableChunks: [],
        preconnects: /* @__PURE__ */ new Set(),
        fontPreloads: /* @__PURE__ */ new Set(),
        highImagePreloads: /* @__PURE__ */ new Set(),
        styles: /* @__PURE__ */ new Map(),
        bootstrapScripts: /* @__PURE__ */ new Set(),
        scripts: /* @__PURE__ */ new Set(),
        bulkPreloads: /* @__PURE__ */ new Set(),
        preloads: {
          images: /* @__PURE__ */ new Map(),
          stylesheets: /* @__PURE__ */ new Map(),
          scripts: /* @__PURE__ */ new Map(),
          moduleScripts: /* @__PURE__ */ new Map()
        },
        nonce: { script: externalRuntimeConfig, style: nonceStyle },
        hoistableState: null,
        stylesToHoist: false
      };
      if (void 0 !== bootstrapScripts)
        for (importMap = 0; importMap < bootstrapScripts.length; importMap++)
          idPrefix = bootstrapScripts[importMap], nonceStyle = inlineScriptWithNonce = void 0, inlineStyleWithNonce = {
            rel: "preload",
            as: "script",
            fetchPriority: "low",
            nonce
          }, "string" === typeof idPrefix ? inlineStyleWithNonce.href = maxHeadersLength = idPrefix : (inlineStyleWithNonce.href = maxHeadersLength = idPrefix.src, inlineStyleWithNonce.integrity = nonceStyle = "string" === typeof idPrefix.integrity ? idPrefix.integrity : void 0, inlineStyleWithNonce.crossOrigin = inlineScriptWithNonce = "string" === typeof idPrefix || null == idPrefix.crossOrigin ? void 0 : "use-credentials" === idPrefix.crossOrigin ? "use-credentials" : ""), idPrefix = resumableState, bootstrapScriptContent = maxHeadersLength, idPrefix.scriptResources[bootstrapScriptContent] = null, idPrefix.moduleScriptResources[bootstrapScriptContent] = null, idPrefix = [], pushLinkImpl(idPrefix, inlineStyleWithNonce), onHeaders.bootstrapScripts.add(idPrefix), bootstrapChunks.push(
            startScriptSrc,
            escapeTextForBrowser(maxHeadersLength),
            attributeEnd
          ), externalRuntimeConfig && bootstrapChunks.push(
            scriptNonce,
            escapeTextForBrowser(externalRuntimeConfig),
            attributeEnd
          ), "string" === typeof nonceStyle && bootstrapChunks.push(
            scriptIntegirty,
            escapeTextForBrowser(nonceStyle),
            attributeEnd
          ), "string" === typeof inlineScriptWithNonce && bootstrapChunks.push(
            scriptCrossOrigin,
            escapeTextForBrowser(inlineScriptWithNonce),
            attributeEnd
          ), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(endAsyncScript);
      if (void 0 !== bootstrapModules)
        for (nonce = 0; nonce < bootstrapModules.length; nonce++)
          nonceStyle = bootstrapModules[nonce], maxHeadersLength = importMap = void 0, inlineScriptWithNonce = {
            rel: "modulepreload",
            fetchPriority: "low",
            nonce: externalRuntimeConfig
          }, "string" === typeof nonceStyle ? inlineScriptWithNonce.href = bootstrapScripts = nonceStyle : (inlineScriptWithNonce.href = bootstrapScripts = nonceStyle.src, inlineScriptWithNonce.integrity = maxHeadersLength = "string" === typeof nonceStyle.integrity ? nonceStyle.integrity : void 0, inlineScriptWithNonce.crossOrigin = importMap = "string" === typeof nonceStyle || null == nonceStyle.crossOrigin ? void 0 : "use-credentials" === nonceStyle.crossOrigin ? "use-credentials" : ""), nonceStyle = resumableState, inlineStyleWithNonce = bootstrapScripts, nonceStyle.scriptResources[inlineStyleWithNonce] = null, nonceStyle.moduleScriptResources[inlineStyleWithNonce] = null, nonceStyle = [], pushLinkImpl(nonceStyle, inlineScriptWithNonce), onHeaders.bootstrapScripts.add(nonceStyle), bootstrapChunks.push(
            startModuleSrc,
            escapeTextForBrowser(bootstrapScripts),
            attributeEnd
          ), externalRuntimeConfig && bootstrapChunks.push(
            scriptNonce,
            escapeTextForBrowser(externalRuntimeConfig),
            attributeEnd
          ), "string" === typeof maxHeadersLength && bootstrapChunks.push(
            scriptIntegirty,
            escapeTextForBrowser(maxHeadersLength),
            attributeEnd
          ), "string" === typeof importMap && bootstrapChunks.push(
            scriptCrossOrigin,
            escapeTextForBrowser(importMap),
            attributeEnd
          ), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(endAsyncScript);
      return onHeaders;
    }
    function createResumableState(identifierPrefix, externalRuntimeConfig, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
      return {
        idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
        nextFormID: 0,
        streamingFormat: 0,
        bootstrapScriptContent,
        bootstrapScripts,
        bootstrapModules,
        instructions: 0,
        hasBody: false,
        hasHtml: false,
        unknownResources: {},
        dnsResources: {},
        connectResources: { default: {}, anonymous: {}, credentials: {} },
        imageResources: {},
        styleResources: {},
        scriptResources: {},
        moduleUnknownResources: {},
        moduleScriptResources: {}
      };
    }
    function createPreambleState() {
      return { htmlChunks: null, headChunks: null, bodyChunks: null };
    }
    function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
      return {
        insertionMode,
        selectedValue,
        tagScope,
        viewTransition
      };
    }
    function createRootFormatContext(namespaceURI) {
      return createFormatContext(
        "http://www.w3.org/2000/svg" === namespaceURI ? 4 : "http://www.w3.org/1998/Math/MathML" === namespaceURI ? 5 : 0,
        null,
        0,
        null
      );
    }
    function getChildFormatContext(parentContext, type, props) {
      var subtreeScope = parentContext.tagScope & -25;
      switch (type) {
        case "noscript":
          return createFormatContext(2, null, subtreeScope | 1, null);
        case "select":
          return createFormatContext(
            2,
            null != props.value ? props.value : props.defaultValue,
            subtreeScope,
            null
          );
        case "svg":
          return createFormatContext(4, null, subtreeScope, null);
        case "picture":
          return createFormatContext(2, null, subtreeScope | 2, null);
        case "math":
          return createFormatContext(5, null, subtreeScope, null);
        case "foreignObject":
          return createFormatContext(2, null, subtreeScope, null);
        case "table":
          return createFormatContext(6, null, subtreeScope, null);
        case "thead":
        case "tbody":
        case "tfoot":
          return createFormatContext(7, null, subtreeScope, null);
        case "colgroup":
          return createFormatContext(9, null, subtreeScope, null);
        case "tr":
          return createFormatContext(8, null, subtreeScope, null);
        case "head":
          if (2 > parentContext.insertionMode)
            return createFormatContext(3, null, subtreeScope, null);
          break;
        case "html":
          if (0 === parentContext.insertionMode)
            return createFormatContext(1, null, subtreeScope, null);
      }
      return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode ? createFormatContext(2, null, subtreeScope, null) : null !== parentContext.viewTransition || parentContext.tagScope !== subtreeScope ? createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        subtreeScope,
        null
      ) : parentContext;
    }
    function getSuspenseViewTransition(parentViewTransition) {
      return null === parentViewTransition ? null : {
        update: parentViewTransition.update,
        enter: "none",
        exit: "none",
        share: parentViewTransition.update,
        parentEnter: "none",
        parentExit: "none",
        name: parentViewTransition.autoName,
        autoName: parentViewTransition.autoName,
        nameIdx: 0
      };
    }
    function getSuspenseFallbackFormatContext(resumableState, parentContext) {
      parentContext.tagScope & 32 && (resumableState.instructions |= 128);
      return createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        parentContext.tagScope | 12,
        getSuspenseViewTransition(parentContext.viewTransition)
      );
    }
    function getSuspenseContentFormatContext(resumableState, parentContext) {
      resumableState = getSuspenseViewTransition(parentContext.viewTransition);
      var subtreeScope = parentContext.tagScope | 16;
      null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
      return createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        subtreeScope,
        resumableState
      );
    }
    function makeId(resumableState, treeId, localId) {
      resumableState = "_" + resumableState.idPrefix + "R_" + treeId;
      0 < localId && (resumableState += "H" + localId.toString(32));
      return resumableState + "_";
    }
    var textSeparator = stringToPrecomputedChunk("<!-- -->");
    function pushTextInstance(target, text, renderState, textEmbedded) {
      if ("" === text) return textEmbedded;
      textEmbedded && target.push(textSeparator);
      target.push(escapeTextForBrowser(text));
      return true;
    }
    function pushViewTransitionAttributes(target, formatContext) {
      formatContext = formatContext.viewTransition;
      null !== formatContext && ("auto" !== formatContext.name && (pushStringAttribute(
        target,
        "vt-name",
        0 === formatContext.nameIdx ? formatContext.name : formatContext.name + "_" + formatContext.nameIdx
      ), formatContext.nameIdx++), pushStringAttribute(target, "vt-update", formatContext.update), "none" !== formatContext.enter && pushStringAttribute(target, "vt-enter", formatContext.enter), "none" !== formatContext.exit && pushStringAttribute(target, "vt-exit", formatContext.exit), "none" !== formatContext.share && pushStringAttribute(target, "vt-share", formatContext.share));
    }
    var styleNameCache = /* @__PURE__ */ new Map();
    var styleAttributeStart = stringToPrecomputedChunk(' style="');
    var styleAssign = stringToPrecomputedChunk(":");
    var styleSeparator = stringToPrecomputedChunk(";");
    function pushStyleAttribute(target, style) {
      if ("object" !== typeof style)
        throw Error(
          "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."
        );
      var isFirst = true, styleName;
      for (styleName in style)
        if (hasOwnProperty.call(style, styleName)) {
          var styleValue = style[styleName];
          if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
            if (0 === styleName.indexOf("--")) {
              var nameChunk = escapeTextForBrowser(styleName);
              styleValue = escapeTextForBrowser(("" + styleValue).trim());
            } else
              nameChunk = styleNameCache.get(styleName), void 0 === nameChunk && (nameChunk = stringToPrecomputedChunk(
                escapeTextForBrowser(
                  styleName.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-")
                )
              ), styleNameCache.set(styleName, nameChunk)), styleValue = "number" === typeof styleValue ? 0 === styleValue || unitlessNumbers.has(styleName) ? "" + styleValue : styleValue + "px" : escapeTextForBrowser(("" + styleValue).trim());
            isFirst ? (isFirst = false, target.push(
              styleAttributeStart,
              nameChunk,
              styleAssign,
              styleValue
            )) : target.push(styleSeparator, nameChunk, styleAssign, styleValue);
          }
        }
      isFirst || target.push(attributeEnd);
    }
    var attributeSeparator = stringToPrecomputedChunk(" ");
    var attributeAssign = stringToPrecomputedChunk('="');
    var attributeEnd = stringToPrecomputedChunk('"');
    var attributeEmptyString = stringToPrecomputedChunk('=""');
    function pushBooleanAttribute(target, name, value) {
      value && "function" !== typeof value && "symbol" !== typeof value && target.push(attributeSeparator, name, attributeEmptyString);
    }
    function pushStringAttribute(target, name, value) {
      "function" !== typeof value && "symbol" !== typeof value && "boolean" !== typeof value && target.push(
        attributeSeparator,
        name,
        attributeAssign,
        escapeTextForBrowser(value),
        attributeEnd
      );
    }
    var actionJavaScriptURL = stringToPrecomputedChunk(
      escapeTextForBrowser(
        "javascript:throw new Error('React form unexpectedly submitted.')"
      )
    );
    var startHiddenInputChunk = stringToPrecomputedChunk('<input type="hidden"');
    function pushAdditionalFormField(value, key) {
      this.push(startHiddenInputChunk);
      validateAdditionalFormField(value);
      pushStringAttribute(this, "name", key);
      pushStringAttribute(this, "value", value);
      this.push(endOfStartTagSelfClosing);
    }
    function validateAdditionalFormField(value) {
      if ("string" !== typeof value)
        throw Error(
          "File/Blob fields are not yet supported in progressive forms. Will fallback to client hydration."
        );
    }
    function getCustomFormFields(resumableState, formAction) {
      if ("function" === typeof formAction.$$FORM_ACTION) {
        var id = resumableState.nextFormID++;
        resumableState = resumableState.idPrefix + id;
        try {
          var customFields = formAction.$$FORM_ACTION(resumableState);
          if (customFields) {
            var formData = customFields.data;
            null != formData && formData.forEach(validateAdditionalFormField);
          }
          return customFields;
        } catch (x) {
          if ("object" === typeof x && null !== x && "function" === typeof x.then)
            throw x;
        }
      }
      return null;
    }
    function pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name) {
      var formData = null;
      if ("function" === typeof formAction) {
        var customFields = getCustomFormFields(resumableState, formAction);
        null !== customFields ? (name = customFields.name, formAction = customFields.action || "", formEncType = customFields.encType, formMethod = customFields.method, formTarget = customFields.target, formData = customFields.data) : (target.push(
          attributeSeparator,
          "formAction",
          attributeAssign,
          actionJavaScriptURL,
          attributeEnd
        ), formTarget = formMethod = formEncType = formAction = name = null, injectFormReplayingRuntime(resumableState, renderState));
      }
      null != name && pushAttribute(target, "name", name);
      null != formAction && pushAttribute(target, "formAction", formAction);
      null != formEncType && pushAttribute(target, "formEncType", formEncType);
      null != formMethod && pushAttribute(target, "formMethod", formMethod);
      null != formTarget && pushAttribute(target, "formTarget", formTarget);
      return formData;
    }
    function pushAttribute(target, name, value) {
      switch (name) {
        case "className":
          pushStringAttribute(target, "class", value);
          break;
        case "tabIndex":
          pushStringAttribute(target, "tabindex", value);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          pushStringAttribute(target, name, value);
          break;
        case "style":
          pushStyleAttribute(target, value);
          break;
        case "src":
        case "href":
          if ("" === value) break;
        case "action":
        case "formAction":
          if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
            break;
          value = sanitizeURL("" + value);
          target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "ref":
          break;
        case "autoFocus":
        case "multiple":
        case "muted":
          pushBooleanAttribute(target, name.toLowerCase(), value);
          break;
        case "xlinkHref":
          if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
            break;
          value = sanitizeURL("" + value);
          target.push(
            attributeSeparator,
            "xlink:href",
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          "function" !== typeof value && "symbol" !== typeof value && target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "credentialless":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          value && "function" !== typeof value && "symbol" !== typeof value && target.push(attributeSeparator, name, attributeEmptyString);
          break;
        case "capture":
        case "download":
          true === value ? target.push(attributeSeparator, name, attributeEmptyString) : false !== value && "function" !== typeof value && "symbol" !== typeof value && target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value && target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "rowSpan":
        case "start":
          "function" === typeof value || "symbol" === typeof value || isNaN(value) || target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "xlinkActuate":
          pushStringAttribute(target, "xlink:actuate", value);
          break;
        case "xlinkArcrole":
          pushStringAttribute(target, "xlink:arcrole", value);
          break;
        case "xlinkRole":
          pushStringAttribute(target, "xlink:role", value);
          break;
        case "xlinkShow":
          pushStringAttribute(target, "xlink:show", value);
          break;
        case "xlinkTitle":
          pushStringAttribute(target, "xlink:title", value);
          break;
        case "xlinkType":
          pushStringAttribute(target, "xlink:type", value);
          break;
        case "xmlBase":
          pushStringAttribute(target, "xml:base", value);
          break;
        case "xmlLang":
          pushStringAttribute(target, "xml:lang", value);
          break;
        case "xmlSpace":
          pushStringAttribute(target, "xml:space", value);
          break;
        default:
          if (!(2 < name.length) || "o" !== name[0] && "O" !== name[0] || "n" !== name[1] && "N" !== name[1]) {
            if (name = aliases.get(name) || name, isAttributeNameSafe(name)) {
              switch (typeof value) {
                case "function":
                case "symbol":
                  return;
                case "boolean":
                  var prefix$8 = name.toLowerCase().slice(0, 5);
                  if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
              }
              target.push(
                attributeSeparator,
                name,
                attributeAssign,
                escapeTextForBrowser(value),
                attributeEnd
              );
            }
          }
      }
    }
    var endOfStartTag = stringToPrecomputedChunk(">");
    var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
    function pushInnerHTML(target, innerHTML, children) {
      if (null != innerHTML) {
        if (null != children)
          throw Error(
            "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
          );
        if ("object" !== typeof innerHTML || !("__html" in innerHTML))
          throw Error(
            "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
          );
        innerHTML = innerHTML.__html;
        null !== innerHTML && void 0 !== innerHTML && target.push("" + innerHTML);
      }
    }
    function flattenOptionChildren(children) {
      var content = "";
      React.Children.forEach(children, function(child) {
        null != child && (content += child);
      });
      return content;
    }
    var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""');
    var formReplayingRuntimeScript = stringToPrecomputedChunk(
      `addEventListener("submit",function(a){if(!a.defaultPrevented){var b=a.target,d=a.submitter,c=b.action,e=d;if(d){var f=d.getAttribute("formAction");null!=f&&(c=f,e=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===c&&(a.preventDefault(),a=new FormData(b,e),c=b.ownerDocument||b,(c.$$reactFormReplay=c.$$reactFormReplay||[]).push(b,d,a))}});`
    );
    function injectFormReplayingRuntime(resumableState, renderState) {
      if (0 === (resumableState.instructions & 16)) {
        resumableState.instructions |= 16;
        var preamble = renderState.preamble, bootstrapChunks = renderState.bootstrapChunks;
        (preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length ? (bootstrapChunks.push(renderState.startInlineScript), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
          endOfStartTag,
          formReplayingRuntimeScript,
          endInlineScript
        )) : bootstrapChunks.unshift(
          renderState.startInlineScript,
          endOfStartTag,
          formReplayingRuntimeScript,
          endInlineScript
        );
      }
    }
    var formStateMarkerIsMatching = stringToPrecomputedChunk("<!--F!-->");
    var formStateMarkerIsNotMatching = stringToPrecomputedChunk("<!--F-->");
    function pushLinkImpl(target, props) {
      target.push(startChunkForTag("link"));
      for (var propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(
                  "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                );
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push(endOfStartTagSelfClosing);
      return null;
    }
    var styleRegex = /(<\/|<)(s)(tyle)/gi;
    function styleReplacer(match, prefix2, s, suffix2) {
      return "" + prefix2 + ("s" === s ? "\\73 " : "\\53 ") + suffix2;
    }
    function pushSelfClosing(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      for (var propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(
                  tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                );
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push(endOfStartTagSelfClosing);
      return null;
    }
    function pushTitleImpl(target, props) {
      target.push(startChunkForTag("title"));
      var children = null, innerHTML = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push(endOfStartTag);
      props = Array.isArray(children) ? 2 > children.length ? children[0] : null : children;
      "function" !== typeof props && "symbol" !== typeof props && null !== props && void 0 !== props && target.push(escapeTextForBrowser("" + props));
      pushInnerHTML(target, innerHTML, children);
      target.push(endChunkForTag("title"));
      return null;
    }
    var headPreambleContributionChunk = stringToPrecomputedChunk("<!--head-->");
    var bodyPreambleContributionChunk = stringToPrecomputedChunk("<!--body-->");
    var htmlPreambleContributionChunk = stringToPrecomputedChunk("<!--html-->");
    function pushScriptImpl(target, props) {
      target.push(startChunkForTag("script"));
      var children = null, innerHTML = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push(endOfStartTag);
      pushInnerHTML(target, innerHTML, children);
      "string" === typeof children && target.push(("" + children).replace(scriptRegex, scriptReplacer));
      target.push(endChunkForTag("script"));
      return null;
    }
    function pushStartSingletonElement(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      var innerHTML = tag = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                tag = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push(endOfStartTag);
      pushInnerHTML(target, innerHTML, tag);
      return tag;
    }
    function pushStartGenericElement(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      var innerHTML = tag = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                tag = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push(endOfStartTag);
      pushInnerHTML(target, innerHTML, tag);
      return "string" === typeof tag ? (target.push(escapeTextForBrowser(tag)), null) : tag;
    }
    var leadingNewline = stringToPrecomputedChunk("\n");
    var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
    var validatedTagCache = /* @__PURE__ */ new Map();
    function startChunkForTag(tag) {
      var tagStartChunk = validatedTagCache.get(tag);
      if (void 0 === tagStartChunk) {
        if (!VALID_TAG_REGEX.test(tag)) throw Error("Invalid tag: " + tag);
        tagStartChunk = stringToPrecomputedChunk("<" + tag);
        validatedTagCache.set(tag, tagStartChunk);
      }
      return tagStartChunk;
    }
    var doctypeChunk = stringToPrecomputedChunk("<!DOCTYPE html>");
    function pushStartInstance(target$jscomp$0, type, props, resumableState, renderState, preambleState, hoistableState, formatContext, textEmbedded) {
      switch (type) {
        case "div":
        case "span":
        case "svg":
        case "path":
          break;
        case "a":
          target$jscomp$0.push(startChunkForTag("a"));
          var children = null, innerHTML = null, propKey;
          for (propKey in props)
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (null != propValue)
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  case "href":
                    "" === propValue ? pushStringAttribute(target$jscomp$0, "href", "") : pushAttribute(target$jscomp$0, propKey, propValue);
                    break;
                  default:
                    pushAttribute(target$jscomp$0, propKey, propValue);
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          pushInnerHTML(target$jscomp$0, innerHTML, children);
          if ("string" === typeof children) {
            target$jscomp$0.push(escapeTextForBrowser(children));
            var JSCompiler_inline_result = null;
          } else JSCompiler_inline_result = children;
          return JSCompiler_inline_result;
        case "g":
        case "p":
        case "li":
          break;
        case "select":
          target$jscomp$0.push(startChunkForTag("select"));
          var children$jscomp$0 = null, innerHTML$jscomp$0 = null, propKey$jscomp$0;
          for (propKey$jscomp$0 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$0)) {
              var propValue$jscomp$0 = props[propKey$jscomp$0];
              if (null != propValue$jscomp$0)
                switch (propKey$jscomp$0) {
                  case "children":
                    children$jscomp$0 = propValue$jscomp$0;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$0 = propValue$jscomp$0;
                    break;
                  case "defaultValue":
                  case "value":
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$0,
                      propValue$jscomp$0
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
          return children$jscomp$0;
        case "option":
          var selectedValue = formatContext.selectedValue;
          target$jscomp$0.push(startChunkForTag("option"));
          var children$jscomp$1 = null, value = null, selected = null, innerHTML$jscomp$1 = null, propKey$jscomp$1;
          for (propKey$jscomp$1 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$1)) {
              var propValue$jscomp$1 = props[propKey$jscomp$1];
              if (null != propValue$jscomp$1)
                switch (propKey$jscomp$1) {
                  case "children":
                    children$jscomp$1 = propValue$jscomp$1;
                    break;
                  case "selected":
                    selected = propValue$jscomp$1;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$1 = propValue$jscomp$1;
                    break;
                  case "value":
                    value = propValue$jscomp$1;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$1,
                      propValue$jscomp$1
                    );
                }
            }
          if (null != selectedValue) {
            var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
            if (isArrayImpl(selectedValue))
              for (var i = 0; i < selectedValue.length; i++) {
                if ("" + selectedValue[i] === stringValue) {
                  target$jscomp$0.push(selectedMarkerAttribute);
                  break;
                }
              }
            else
              "" + selectedValue === stringValue && target$jscomp$0.push(selectedMarkerAttribute);
          } else selected && target$jscomp$0.push(selectedMarkerAttribute);
          target$jscomp$0.push(endOfStartTag);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
          return children$jscomp$1;
        case "textarea":
          target$jscomp$0.push(startChunkForTag("textarea"));
          var value$jscomp$0 = null, defaultValue = null, children$jscomp$2 = null, propKey$jscomp$2;
          for (propKey$jscomp$2 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$2)) {
              var propValue$jscomp$2 = props[propKey$jscomp$2];
              if (null != propValue$jscomp$2)
                switch (propKey$jscomp$2) {
                  case "children":
                    children$jscomp$2 = propValue$jscomp$2;
                    break;
                  case "value":
                    value$jscomp$0 = propValue$jscomp$2;
                    break;
                  case "defaultValue":
                    defaultValue = propValue$jscomp$2;
                    break;
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "`dangerouslySetInnerHTML` does not make sense on <textarea>."
                    );
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$2,
                      propValue$jscomp$2
                    );
                }
            }
          null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          if (null != children$jscomp$2) {
            if (null != value$jscomp$0)
              throw Error(
                "If you supply `defaultValue` on a <textarea>, do not pass children."
              );
            if (isArrayImpl(children$jscomp$2)) {
              if (1 < children$jscomp$2.length)
                throw Error("<textarea> can only have at most one child.");
              value$jscomp$0 = "" + children$jscomp$2[0];
            }
            value$jscomp$0 = "" + children$jscomp$2;
          }
          "string" === typeof value$jscomp$0 && "\n" === value$jscomp$0[0] && target$jscomp$0.push(leadingNewline);
          null !== value$jscomp$0 && target$jscomp$0.push(escapeTextForBrowser("" + value$jscomp$0));
          return null;
        case "input":
          target$jscomp$0.push(startChunkForTag("input"));
          var name = null, formAction = null, formEncType = null, formMethod = null, formTarget = null, value$jscomp$1 = null, defaultValue$jscomp$0 = null, checked = null, defaultChecked = null, propKey$jscomp$3;
          for (propKey$jscomp$3 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$3)) {
              var propValue$jscomp$3 = props[propKey$jscomp$3];
              if (null != propValue$jscomp$3)
                switch (propKey$jscomp$3) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  case "name":
                    name = propValue$jscomp$3;
                    break;
                  case "formAction":
                    formAction = propValue$jscomp$3;
                    break;
                  case "formEncType":
                    formEncType = propValue$jscomp$3;
                    break;
                  case "formMethod":
                    formMethod = propValue$jscomp$3;
                    break;
                  case "formTarget":
                    formTarget = propValue$jscomp$3;
                    break;
                  case "defaultChecked":
                    defaultChecked = propValue$jscomp$3;
                    break;
                  case "defaultValue":
                    defaultValue$jscomp$0 = propValue$jscomp$3;
                    break;
                  case "checked":
                    checked = propValue$jscomp$3;
                    break;
                  case "value":
                    value$jscomp$1 = propValue$jscomp$3;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$3,
                      propValue$jscomp$3
                    );
                }
            }
          var formData = pushFormActionAttribute(
            target$jscomp$0,
            resumableState,
            renderState,
            formAction,
            formEncType,
            formMethod,
            formTarget,
            name
          );
          null !== checked ? pushBooleanAttribute(target$jscomp$0, "checked", checked) : null !== defaultChecked && pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
          null !== value$jscomp$1 ? pushAttribute(target$jscomp$0, "value", value$jscomp$1) : null !== defaultValue$jscomp$0 && pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTagSelfClosing);
          null != formData && formData.forEach(pushAdditionalFormField, target$jscomp$0);
          return null;
        case "button":
          target$jscomp$0.push(startChunkForTag("button"));
          var children$jscomp$3 = null, innerHTML$jscomp$2 = null, name$jscomp$0 = null, formAction$jscomp$0 = null, formEncType$jscomp$0 = null, formMethod$jscomp$0 = null, formTarget$jscomp$0 = null, propKey$jscomp$4;
          for (propKey$jscomp$4 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$4)) {
              var propValue$jscomp$4 = props[propKey$jscomp$4];
              if (null != propValue$jscomp$4)
                switch (propKey$jscomp$4) {
                  case "children":
                    children$jscomp$3 = propValue$jscomp$4;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$2 = propValue$jscomp$4;
                    break;
                  case "name":
                    name$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formAction":
                    formAction$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formEncType":
                    formEncType$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formMethod":
                    formMethod$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formTarget":
                    formTarget$jscomp$0 = propValue$jscomp$4;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$4,
                      propValue$jscomp$4
                    );
                }
            }
          var formData$jscomp$0 = pushFormActionAttribute(
            target$jscomp$0,
            resumableState,
            renderState,
            formAction$jscomp$0,
            formEncType$jscomp$0,
            formMethod$jscomp$0,
            formTarget$jscomp$0,
            name$jscomp$0
          );
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          null != formData$jscomp$0 && formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
          if ("string" === typeof children$jscomp$3) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$3));
            var JSCompiler_inline_result$jscomp$0 = null;
          } else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
          return JSCompiler_inline_result$jscomp$0;
        case "form":
          target$jscomp$0.push(startChunkForTag("form"));
          var children$jscomp$4 = null, innerHTML$jscomp$3 = null, formAction$jscomp$1 = null, formEncType$jscomp$1 = null, formMethod$jscomp$1 = null, formTarget$jscomp$1 = null, propKey$jscomp$5;
          for (propKey$jscomp$5 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$5)) {
              var propValue$jscomp$5 = props[propKey$jscomp$5];
              if (null != propValue$jscomp$5)
                switch (propKey$jscomp$5) {
                  case "children":
                    children$jscomp$4 = propValue$jscomp$5;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$3 = propValue$jscomp$5;
                    break;
                  case "action":
                    formAction$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "encType":
                    formEncType$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "method":
                    formMethod$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "target":
                    formTarget$jscomp$1 = propValue$jscomp$5;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$5,
                      propValue$jscomp$5
                    );
                }
            }
          var formData$jscomp$1 = null, formActionName = null;
          if ("function" === typeof formAction$jscomp$1) {
            var customFields = getCustomFormFields(
              resumableState,
              formAction$jscomp$1
            );
            null !== customFields ? (formAction$jscomp$1 = customFields.action || "", formEncType$jscomp$1 = customFields.encType, formMethod$jscomp$1 = customFields.method, formTarget$jscomp$1 = customFields.target, formData$jscomp$1 = customFields.data, formActionName = customFields.name) : (target$jscomp$0.push(
              attributeSeparator,
              "action",
              attributeAssign,
              actionJavaScriptURL,
              attributeEnd
            ), formTarget$jscomp$1 = formMethod$jscomp$1 = formEncType$jscomp$1 = formAction$jscomp$1 = null, injectFormReplayingRuntime(resumableState, renderState));
          }
          null != formAction$jscomp$1 && pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
          null != formEncType$jscomp$1 && pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
          null != formMethod$jscomp$1 && pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
          null != formTarget$jscomp$1 && pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          null !== formActionName && (target$jscomp$0.push(startHiddenInputChunk), pushStringAttribute(target$jscomp$0, "name", formActionName), target$jscomp$0.push(endOfStartTagSelfClosing), null != formData$jscomp$1 && formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
          if ("string" === typeof children$jscomp$4) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$4));
            var JSCompiler_inline_result$jscomp$1 = null;
          } else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
          return JSCompiler_inline_result$jscomp$1;
        case "menuitem":
          target$jscomp$0.push(startChunkForTag("menuitem"));
          for (var propKey$jscomp$6 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$6)) {
              var propValue$jscomp$6 = props[propKey$jscomp$6];
              if (null != propValue$jscomp$6)
                switch (propKey$jscomp$6) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "menuitems cannot have `children` nor `dangerouslySetInnerHTML`."
                    );
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$6,
                      propValue$jscomp$6
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          return null;
        case "object":
          target$jscomp$0.push(startChunkForTag("object"));
          var children$jscomp$5 = null, innerHTML$jscomp$4 = null, propKey$jscomp$7;
          for (propKey$jscomp$7 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$7)) {
              var propValue$jscomp$7 = props[propKey$jscomp$7];
              if (null != propValue$jscomp$7)
                switch (propKey$jscomp$7) {
                  case "children":
                    children$jscomp$5 = propValue$jscomp$7;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$4 = propValue$jscomp$7;
                    break;
                  case "data":
                    var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
                    if ("" === sanitizedValue) break;
                    target$jscomp$0.push(
                      attributeSeparator,
                      "data",
                      attributeAssign,
                      escapeTextForBrowser(sanitizedValue),
                      attributeEnd
                    );
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$7,
                      propValue$jscomp$7
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
          if ("string" === typeof children$jscomp$5) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$5));
            var JSCompiler_inline_result$jscomp$2 = null;
          } else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
          return JSCompiler_inline_result$jscomp$2;
        case "title":
          var noscriptTagInScope = formatContext.tagScope & 1, isFallback = formatContext.tagScope & 4;
          if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(
              target$jscomp$0,
              props
            );
          else
            isFallback ? JSCompiler_inline_result$jscomp$3 = null : (pushTitleImpl(renderState.hoistableChunks, props), JSCompiler_inline_result$jscomp$3 = void 0);
          return JSCompiler_inline_result$jscomp$3;
        case "link":
          var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1, isFallback$jscomp$0 = formatContext.tagScope & 4, rel = props.rel, href = props.href, precedence = props.precedence;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$0 || null != props.itemProp || "string" !== typeof rel || "string" !== typeof href || "" === href) {
            pushLinkImpl(target$jscomp$0, props);
            var JSCompiler_inline_result$jscomp$4 = null;
          } else if ("stylesheet" === props.rel)
            if ("string" !== typeof precedence || null != props.disabled || props.onLoad || props.onError)
              JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
                target$jscomp$0,
                props
              );
            else {
              var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
              if (null !== resourceState) {
                resumableState.styleResources[href] = null;
                styleQueue || (styleQueue = {
                  precedence: escapeTextForBrowser(precedence),
                  rules: [],
                  hrefs: [],
                  sheets: /* @__PURE__ */ new Map()
                }, renderState.styles.set(precedence, styleQueue));
                var resource = {
                  state: 0,
                  props: assign({}, props, {
                    "data-precedence": props.precedence,
                    precedence: null
                  })
                };
                if (resourceState) {
                  2 === resourceState.length && adoptPreloadCredentials(resource.props, resourceState);
                  var preloadResource = renderState.preloads.stylesheets.get(href);
                  preloadResource && 0 < preloadResource.length ? preloadResource.length = 0 : resource.state = 1;
                }
                styleQueue.sheets.set(href, resource);
                hoistableState && hoistableState.stylesheets.add(resource);
              } else if (styleQueue) {
                var resource$9 = styleQueue.sheets.get(href);
                resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
              }
              textEmbedded && target$jscomp$0.push(textSeparator);
              JSCompiler_inline_result$jscomp$4 = null;
            }
          else
            props.onLoad || props.onError ? JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
              target$jscomp$0,
              props
            ) : (textEmbedded && target$jscomp$0.push(textSeparator), JSCompiler_inline_result$jscomp$4 = isFallback$jscomp$0 ? null : pushLinkImpl(renderState.hoistableChunks, props));
          return JSCompiler_inline_result$jscomp$4;
        case "script":
          var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1, asyncProp = props.async;
          if ("string" !== typeof props.src || !props.src || !asyncProp || "function" === typeof asyncProp || "symbol" === typeof asyncProp || props.onLoad || props.onError || 4 === formatContext.insertionMode || noscriptTagInScope$jscomp$1 || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(
              target$jscomp$0,
              props
            );
          else {
            var key = props.src;
            if ("module" === props.type) {
              var resources = resumableState.moduleScriptResources;
              var preloads = renderState.preloads.moduleScripts;
            } else
              resources = resumableState.scriptResources, preloads = renderState.preloads.scripts;
            var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
            if (null !== resourceState$jscomp$0) {
              resources[key] = null;
              var scriptProps = props;
              if (resourceState$jscomp$0) {
                2 === resourceState$jscomp$0.length && (scriptProps = assign({}, props), adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
                var preloadResource$jscomp$0 = preloads.get(key);
                preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
              }
              var resource$jscomp$0 = [];
              renderState.scripts.add(resource$jscomp$0);
              pushScriptImpl(resource$jscomp$0, scriptProps);
            }
            textEmbedded && target$jscomp$0.push(textSeparator);
            JSCompiler_inline_result$jscomp$5 = null;
          }
          return JSCompiler_inline_result$jscomp$5;
        case "style":
          var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1, precedence$jscomp$0 = props.precedence, href$jscomp$0 = props.href, nonce = props.nonce;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$2 || null != props.itemProp || "string" !== typeof precedence$jscomp$0 || "string" !== typeof href$jscomp$0 || "" === href$jscomp$0) {
            target$jscomp$0.push(startChunkForTag("style"));
            var children$jscomp$6 = null, innerHTML$jscomp$5 = null, propKey$jscomp$8;
            for (propKey$jscomp$8 in props)
              if (hasOwnProperty.call(props, propKey$jscomp$8)) {
                var propValue$jscomp$8 = props[propKey$jscomp$8];
                if (null != propValue$jscomp$8)
                  switch (propKey$jscomp$8) {
                    case "children":
                      children$jscomp$6 = propValue$jscomp$8;
                      break;
                    case "dangerouslySetInnerHTML":
                      innerHTML$jscomp$5 = propValue$jscomp$8;
                      break;
                    default:
                      pushAttribute(
                        target$jscomp$0,
                        propKey$jscomp$8,
                        propValue$jscomp$8
                      );
                  }
              }
            target$jscomp$0.push(endOfStartTag);
            var child = Array.isArray(children$jscomp$6) ? 2 > children$jscomp$6.length ? children$jscomp$6[0] : null : children$jscomp$6;
            "function" !== typeof child && "symbol" !== typeof child && null !== child && void 0 !== child && target$jscomp$0.push(("" + child).replace(styleRegex, styleReplacer));
            pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
            target$jscomp$0.push(endChunkForTag("style"));
            var JSCompiler_inline_result$jscomp$6 = null;
          } else {
            var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
            if (null !== (resumableState.styleResources.hasOwnProperty(href$jscomp$0) ? resumableState.styleResources[href$jscomp$0] : void 0)) {
              resumableState.styleResources[href$jscomp$0] = null;
              styleQueue$jscomp$0 || (styleQueue$jscomp$0 = {
                precedence: escapeTextForBrowser(precedence$jscomp$0),
                rules: [],
                hrefs: [],
                sheets: /* @__PURE__ */ new Map()
              }, renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
              var nonceStyle = renderState.nonce.style;
              if (!nonceStyle || nonceStyle === nonce) {
                styleQueue$jscomp$0.hrefs.push(escapeTextForBrowser(href$jscomp$0));
                var target = styleQueue$jscomp$0.rules, children$jscomp$7 = null, innerHTML$jscomp$6 = null, propKey$jscomp$9;
                for (propKey$jscomp$9 in props)
                  if (hasOwnProperty.call(props, propKey$jscomp$9)) {
                    var propValue$jscomp$9 = props[propKey$jscomp$9];
                    if (null != propValue$jscomp$9)
                      switch (propKey$jscomp$9) {
                        case "children":
                          children$jscomp$7 = propValue$jscomp$9;
                          break;
                        case "dangerouslySetInnerHTML":
                          innerHTML$jscomp$6 = propValue$jscomp$9;
                      }
                  }
                var child$jscomp$0 = Array.isArray(children$jscomp$7) ? 2 > children$jscomp$7.length ? children$jscomp$7[0] : null : children$jscomp$7;
                "function" !== typeof child$jscomp$0 && "symbol" !== typeof child$jscomp$0 && null !== child$jscomp$0 && void 0 !== child$jscomp$0 && target.push(
                  ("" + child$jscomp$0).replace(styleRegex, styleReplacer)
                );
                pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
              }
            }
            styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
            textEmbedded && target$jscomp$0.push(textSeparator);
            JSCompiler_inline_result$jscomp$6 = void 0;
          }
          return JSCompiler_inline_result$jscomp$6;
        case "meta":
          var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1, isFallback$jscomp$1 = formatContext.tagScope & 4;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$3 || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(
              target$jscomp$0,
              props,
              "meta",
              formatContext
            );
          else
            textEmbedded && target$jscomp$0.push(textSeparator), JSCompiler_inline_result$jscomp$7 = isFallback$jscomp$1 ? null : "string" === typeof props.charSet ? pushSelfClosing(
              renderState.charsetChunks,
              props,
              "meta",
              formatContext
            ) : "viewport" === props.name ? pushSelfClosing(
              renderState.viewportChunks,
              props,
              "meta",
              formatContext
            ) : pushSelfClosing(
              renderState.hoistableChunks,
              props,
              "meta",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$7;
        case "listing":
        case "pre":
          target$jscomp$0.push(startChunkForTag(type));
          var children$jscomp$8 = null, innerHTML$jscomp$7 = null, propKey$jscomp$10;
          for (propKey$jscomp$10 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$10)) {
              var propValue$jscomp$10 = props[propKey$jscomp$10];
              if (null != propValue$jscomp$10)
                switch (propKey$jscomp$10) {
                  case "children":
                    children$jscomp$8 = propValue$jscomp$10;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$7 = propValue$jscomp$10;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$10,
                      propValue$jscomp$10
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          if (null != innerHTML$jscomp$7) {
            if (null != children$jscomp$8)
              throw Error(
                "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
              );
            if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7))
              throw Error(
                "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
              );
            var html = innerHTML$jscomp$7.__html;
            null !== html && void 0 !== html && ("string" === typeof html && 0 < html.length && "\n" === html[0] ? target$jscomp$0.push(leadingNewline, html) : target$jscomp$0.push("" + html));
          }
          "string" === typeof children$jscomp$8 && "\n" === children$jscomp$8[0] && target$jscomp$0.push(leadingNewline);
          return children$jscomp$8;
        case "img":
          var pictureOrNoScriptTagInScope = formatContext.tagScope & 3, src = props.src, srcSet = props.srcSet;
          if (!("lazy" === props.loading || !src && !srcSet || "string" !== typeof src && null != src || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || pictureOrNoScriptTagInScope) && ("string" !== typeof src || ":" !== src[4] || "d" !== src[0] && "D" !== src[0] || "a" !== src[1] && "A" !== src[1] || "t" !== src[2] && "T" !== src[2] || "a" !== src[3] && "A" !== src[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
            null !== hoistableState && formatContext.tagScope & 64 && (hoistableState.suspenseyImages = true);
            var sizes = "string" === typeof props.sizes ? props.sizes : void 0, key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src, promotablePreloads = renderState.preloads.images, resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
            if (resource$jscomp$1) {
              if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size)
                promotablePreloads.delete(key$jscomp$0), renderState.highImagePreloads.add(resource$jscomp$1);
            } else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
              resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
              var input = props.crossOrigin;
              var JSCompiler_inline_result$jscomp$8 = "string" === typeof input ? "use-credentials" === input ? input : "" : void 0;
              var headers = renderState.headers, header;
              headers && 0 < headers.remainingCapacity && "string" !== typeof props.srcSet && ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) && (header = getPreloadAsHeader(src, "image", {
                imageSrcSet: props.srcSet,
                imageSizes: props.sizes,
                crossOrigin: JSCompiler_inline_result$jscomp$8,
                integrity: props.integrity,
                nonce: props.nonce,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy
              }), 0 <= (headers.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS, headers.highImagePreloads && (headers.highImagePreloads += ", "), headers.highImagePreloads += header) : (resource$jscomp$1 = [], pushLinkImpl(resource$jscomp$1, {
                rel: "preload",
                as: "image",
                href: srcSet ? void 0 : src,
                imageSrcSet: srcSet,
                imageSizes: sizes,
                crossOrigin: JSCompiler_inline_result$jscomp$8,
                integrity: props.integrity,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy
              }), "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size ? renderState.highImagePreloads.add(resource$jscomp$1) : (renderState.bulkPreloads.add(resource$jscomp$1), promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
            }
          }
          return pushSelfClosing(target$jscomp$0, props, "img", formatContext);
        case "base":
        case "area":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "param":
        case "source":
        case "track":
        case "wbr":
          return pushSelfClosing(target$jscomp$0, props, type, formatContext);
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          break;
        case "head":
          if (2 > formatContext.insertionMode) {
            var preamble = preambleState || renderState.preamble;
            if (preamble.headChunks)
              throw Error("The `<head>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push(headPreambleContributionChunk);
            preamble.headChunks = [];
            var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(
              preamble.headChunks,
              props,
              "head",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "head",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$9;
        case "body":
          if (2 > formatContext.insertionMode) {
            var preamble$jscomp$0 = preambleState || renderState.preamble;
            if (preamble$jscomp$0.bodyChunks)
              throw Error("The `<body>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push(bodyPreambleContributionChunk);
            preamble$jscomp$0.bodyChunks = [];
            var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(
              preamble$jscomp$0.bodyChunks,
              props,
              "body",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "body",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$10;
        case "html":
          if (0 === formatContext.insertionMode) {
            var preamble$jscomp$1 = preambleState || renderState.preamble;
            if (preamble$jscomp$1.htmlChunks)
              throw Error("The `<html>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push(htmlPreambleContributionChunk);
            preamble$jscomp$1.htmlChunks = [doctypeChunk];
            var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(
              preamble$jscomp$1.htmlChunks,
              props,
              "html",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "html",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$11;
        default:
          if (-1 !== type.indexOf("-")) {
            target$jscomp$0.push(startChunkForTag(type));
            var children$jscomp$9 = null, innerHTML$jscomp$8 = null, propKey$jscomp$11;
            for (propKey$jscomp$11 in props)
              if (hasOwnProperty.call(props, propKey$jscomp$11)) {
                var propValue$jscomp$11 = props[propKey$jscomp$11];
                if (null != propValue$jscomp$11) {
                  var attributeName = propKey$jscomp$11;
                  switch (propKey$jscomp$11) {
                    case "children":
                      children$jscomp$9 = propValue$jscomp$11;
                      break;
                    case "dangerouslySetInnerHTML":
                      innerHTML$jscomp$8 = propValue$jscomp$11;
                      break;
                    case "style":
                      pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
                      break;
                    case "suppressContentEditableWarning":
                    case "suppressHydrationWarning":
                    case "ref":
                      break;
                    case "className":
                      attributeName = "class";
                    default:
                      if (isAttributeNameSafe(propKey$jscomp$11) && "function" !== typeof propValue$jscomp$11 && "symbol" !== typeof propValue$jscomp$11 && false !== propValue$jscomp$11) {
                        if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
                        else if ("object" === typeof propValue$jscomp$11) continue;
                        target$jscomp$0.push(
                          attributeSeparator,
                          attributeName,
                          attributeAssign,
                          escapeTextForBrowser(propValue$jscomp$11),
                          attributeEnd
                        );
                      }
                  }
                }
              }
            pushViewTransitionAttributes(target$jscomp$0, formatContext);
            target$jscomp$0.push(endOfStartTag);
            pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
            return children$jscomp$9;
          }
      }
      return pushStartGenericElement(target$jscomp$0, props, type, formatContext);
    }
    var endTagCache = /* @__PURE__ */ new Map();
    function endChunkForTag(tag) {
      var chunk = endTagCache.get(tag);
      void 0 === chunk && (chunk = stringToPrecomputedChunk("</" + tag + ">"), endTagCache.set(tag, chunk));
      return chunk;
    }
    function hoistPreambleState(renderState, preambleState) {
      renderState = renderState.preamble;
      null === renderState.htmlChunks && preambleState.htmlChunks && (renderState.htmlChunks = preambleState.htmlChunks);
      null === renderState.headChunks && preambleState.headChunks && (renderState.headChunks = preambleState.headChunks);
      null === renderState.bodyChunks && preambleState.bodyChunks && (renderState.bodyChunks = preambleState.bodyChunks);
    }
    function writeBootstrap(destination, renderState) {
      renderState = renderState.bootstrapChunks;
      for (var i = 0; i < renderState.length - 1; i++)
        writeChunk(destination, renderState[i]);
      return i < renderState.length ? (i = renderState[i], renderState.length = 0, writeChunkAndReturn(destination, i)) : true;
    }
    var shellTimeRuntimeScript = stringToPrecomputedChunk(
      "requestAnimationFrame(function(){$RT=performance.now()});"
    );
    var placeholder1 = stringToPrecomputedChunk('<template id="');
    var placeholder2 = stringToPrecomputedChunk('"></template>');
    var startActivityBoundary = stringToPrecomputedChunk("<!--&-->");
    var endActivityBoundary = stringToPrecomputedChunk("<!--/&-->");
    var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
    var startPendingSuspenseBoundary1 = stringToPrecomputedChunk(
      '<!--$?--><template id="'
    );
    var startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>');
    var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
    var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
    var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
    var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"');
    var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
    stringToPrecomputedChunk(' data-msg="');
    stringToPrecomputedChunk(' data-stck="');
    stringToPrecomputedChunk(' data-cstck="');
    var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
    function writeStartPendingSuspenseBoundary(destination, renderState, id) {
      writeChunk(destination, startPendingSuspenseBoundary1);
      if (null === id)
        throw Error(
          "An ID must have been assigned before we can complete the boundary."
        );
      writeChunk(destination, renderState.boundaryPrefix);
      writeChunk(destination, id.toString(16));
      return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
    }
    var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="');
    var startSegmentHTML2 = stringToPrecomputedChunk('">');
    var endSegmentHTML = stringToPrecomputedChunk("</div>");
    var startSegmentSVG = stringToPrecomputedChunk(
      '<svg aria-hidden="true" style="display:none" id="'
    );
    var startSegmentSVG2 = stringToPrecomputedChunk('">');
    var endSegmentSVG = stringToPrecomputedChunk("</svg>");
    var startSegmentMathML = stringToPrecomputedChunk(
      '<math aria-hidden="true" style="display:none" id="'
    );
    var startSegmentMathML2 = stringToPrecomputedChunk('">');
    var endSegmentMathML = stringToPrecomputedChunk("</math>");
    var startSegmentTable = stringToPrecomputedChunk('<table hidden id="');
    var startSegmentTable2 = stringToPrecomputedChunk('">');
    var endSegmentTable = stringToPrecomputedChunk("</table>");
    var startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="');
    var startSegmentTableBody2 = stringToPrecomputedChunk('">');
    var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
    var startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="');
    var startSegmentTableRow2 = stringToPrecomputedChunk('">');
    var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
    var startSegmentColGroup = stringToPrecomputedChunk(
      '<table hidden><colgroup id="'
    );
    var startSegmentColGroup2 = stringToPrecomputedChunk('">');
    var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
    function writeStartSegment(destination, renderState, formatContext, id) {
      switch (formatContext.insertionMode) {
        case 0:
        case 1:
        case 3:
        case 2:
          return writeChunk(destination, startSegmentHTML), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentHTML2);
        case 4:
          return writeChunk(destination, startSegmentSVG), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentSVG2);
        case 5:
          return writeChunk(destination, startSegmentMathML), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentMathML2);
        case 6:
          return writeChunk(destination, startSegmentTable), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentTable2);
        case 7:
          return writeChunk(destination, startSegmentTableBody), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentTableBody2);
        case 8:
          return writeChunk(destination, startSegmentTableRow), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentTableRow2);
        case 9:
          return writeChunk(destination, startSegmentColGroup), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentColGroup2);
        default:
          throw Error("Unknown insertion mode. This is a bug in React.");
      }
    }
    function writeEndSegment(destination, formatContext) {
      switch (formatContext.insertionMode) {
        case 0:
        case 1:
        case 3:
        case 2:
          return writeChunkAndReturn(destination, endSegmentHTML);
        case 4:
          return writeChunkAndReturn(destination, endSegmentSVG);
        case 5:
          return writeChunkAndReturn(destination, endSegmentMathML);
        case 6:
          return writeChunkAndReturn(destination, endSegmentTable);
        case 7:
          return writeChunkAndReturn(destination, endSegmentTableBody);
        case 8:
          return writeChunkAndReturn(destination, endSegmentTableRow);
        case 9:
          return writeChunkAndReturn(destination, endSegmentColGroup);
        default:
          throw Error("Unknown insertion mode. This is a bug in React.");
      }
    }
    var completeSegmentScript1Full = stringToPrecomputedChunk(
      '$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'
    );
    var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
    var completeSegmentScript2 = stringToPrecomputedChunk('","');
    var completeSegmentScriptEnd = stringToPrecomputedChunk('")</script>');
    stringToPrecomputedChunk('<template data-rsi="" data-sid="');
    stringToPrecomputedChunk('" data-pid="');
    var completeBoundaryScriptFunctionOnly = stringToPrecomputedChunk(
      '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};'
    );
    var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
    var completeBoundaryWithStylesScript1FullPartial = stringToPrecomputedChunk(
      '$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll("link[data-precedence],style[data-precedence]"),v=[],k=0;b=e[k++];)"not all"===b.getAttribute("media")?v.push(b):("LINK"===b.tagName&&$RM.set(b.getAttribute("href"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement("link");a.href=d;a.rel=\n"stylesheet";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute("media");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n"$~";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,"CSS failed to load"))};$RR("'
    );
    var completeBoundaryWithStylesScript1Partial = stringToPrecomputedChunk('$RR("');
    var completeBoundaryScript2 = stringToPrecomputedChunk('","');
    var completeBoundaryScript3a = stringToPrecomputedChunk('",');
    var completeBoundaryScript3b = stringToPrecomputedChunk('"');
    var completeBoundaryScriptEnd = stringToPrecomputedChunk(")</script>");
    stringToPrecomputedChunk('<template data-rci="" data-bid="');
    stringToPrecomputedChunk('<template data-rri="" data-bid="');
    stringToPrecomputedChunk('" data-sid="');
    stringToPrecomputedChunk('" data-sty="');
    var clientRenderScriptFunctionOnly = stringToPrecomputedChunk(
      '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,null!=c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};'
    );
    var clientRenderScript1Full = stringToPrecomputedChunk(
      '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,null!=c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("'
    );
    var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
    var clientRenderScript1A = stringToPrecomputedChunk('"');
    var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
    var clientRenderErrorScriptNull = stringToPrecomputedChunk("null");
    var clientRenderScriptEnd = stringToPrecomputedChunk(")</script>");
    stringToPrecomputedChunk('<template data-rxi="" data-bid="');
    stringToPrecomputedChunk('" data-dgst="');
    stringToPrecomputedChunk('" data-msg="');
    stringToPrecomputedChunk('" data-stck="');
    stringToPrecomputedChunk('" data-cstck="');
    var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
    function escapeJSStringsForInstructionScripts(input) {
      return JSON.stringify(input).replace(
        regexForJSStringsInInstructionScripts,
        function(match) {
          switch (match) {
            case "<":
              return "\\u003c";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            default:
              throw Error(
                "escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
              );
          }
        }
      );
    }
    var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
    function escapeJSObjectForInstructionScripts(input) {
      return JSON.stringify(input).replace(
        regexForJSStringsInScripts,
        function(match) {
          switch (match) {
            case "&":
              return "\\u0026";
            case ">":
              return "\\u003e";
            case "<":
              return "\\u003c";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            default:
              throw Error(
                "escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
              );
          }
        }
      );
    }
    var lateStyleTagResourceOpen1 = stringToPrecomputedChunk(
      ' media="not all" data-precedence="'
    );
    var lateStyleTagResourceOpen2 = stringToPrecomputedChunk('" data-href="');
    var lateStyleTagResourceOpen3 = stringToPrecomputedChunk('">');
    var lateStyleTagTemplateClose = stringToPrecomputedChunk("</style>");
    var currentlyRenderingBoundaryHasStylesToHoist = false;
    var destinationHasCapacity = true;
    function flushStyleTagsLateForBoundary(styleQueue) {
      var rules = styleQueue.rules, hrefs = styleQueue.hrefs, i = 0;
      if (hrefs.length) {
        writeChunk(this, currentlyFlushingRenderState.startInlineStyle);
        writeChunk(this, lateStyleTagResourceOpen1);
        writeChunk(this, styleQueue.precedence);
        for (writeChunk(this, lateStyleTagResourceOpen2); i < hrefs.length - 1; i++)
          writeChunk(this, hrefs[i]), writeChunk(this, spaceSeparator);
        writeChunk(this, hrefs[i]);
        writeChunk(this, lateStyleTagResourceOpen3);
        for (i = 0; i < rules.length; i++) writeChunk(this, rules[i]);
        destinationHasCapacity = writeChunkAndReturn(
          this,
          lateStyleTagTemplateClose
        );
        currentlyRenderingBoundaryHasStylesToHoist = true;
        rules.length = 0;
        hrefs.length = 0;
      }
    }
    function hasStylesToHoist(stylesheet) {
      return 2 !== stylesheet.state ? currentlyRenderingBoundaryHasStylesToHoist = true : false;
    }
    function writeHoistablesForBoundary(destination, hoistableState, renderState) {
      currentlyRenderingBoundaryHasStylesToHoist = false;
      destinationHasCapacity = true;
      currentlyFlushingRenderState = renderState;
      hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
      currentlyFlushingRenderState = null;
      hoistableState.stylesheets.forEach(hasStylesToHoist);
      currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = true);
      return destinationHasCapacity;
    }
    function flushResource(resource) {
      for (var i = 0; i < resource.length; i++) writeChunk(this, resource[i]);
      resource.length = 0;
    }
    var stylesheetFlushingQueue = [];
    function flushStyleInPreamble(stylesheet) {
      pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
      for (var i = 0; i < stylesheetFlushingQueue.length; i++)
        writeChunk(this, stylesheetFlushingQueue[i]);
      stylesheetFlushingQueue.length = 0;
      stylesheet.state = 2;
    }
    var styleTagResourceOpen1 = stringToPrecomputedChunk(' data-precedence="');
    var styleTagResourceOpen2 = stringToPrecomputedChunk('" data-href="');
    var spaceSeparator = stringToPrecomputedChunk(" ");
    var styleTagResourceOpen3 = stringToPrecomputedChunk('">');
    var styleTagResourceClose = stringToPrecomputedChunk("</style>");
    function flushStylesInPreamble(styleQueue) {
      var hasStylesheets = 0 < styleQueue.sheets.size;
      styleQueue.sheets.forEach(flushStyleInPreamble, this);
      styleQueue.sheets.clear();
      var rules = styleQueue.rules, hrefs = styleQueue.hrefs;
      if (!hasStylesheets || hrefs.length) {
        writeChunk(this, currentlyFlushingRenderState.startInlineStyle);
        writeChunk(this, styleTagResourceOpen1);
        writeChunk(this, styleQueue.precedence);
        styleQueue = 0;
        if (hrefs.length) {
          for (writeChunk(this, styleTagResourceOpen2); styleQueue < hrefs.length - 1; styleQueue++)
            writeChunk(this, hrefs[styleQueue]), writeChunk(this, spaceSeparator);
          writeChunk(this, hrefs[styleQueue]);
        }
        writeChunk(this, styleTagResourceOpen3);
        for (styleQueue = 0; styleQueue < rules.length; styleQueue++)
          writeChunk(this, rules[styleQueue]);
        writeChunk(this, styleTagResourceClose);
        rules.length = 0;
        hrefs.length = 0;
      }
    }
    function preloadLateStyle(stylesheet) {
      if (0 === stylesheet.state) {
        stylesheet.state = 1;
        var props = stylesheet.props;
        pushLinkImpl(stylesheetFlushingQueue, {
          rel: "preload",
          as: "style",
          href: stylesheet.props.href,
          crossOrigin: props.crossOrigin,
          fetchPriority: props.fetchPriority,
          integrity: props.integrity,
          media: props.media,
          hrefLang: props.hrefLang,
          referrerPolicy: props.referrerPolicy
        });
        for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++)
          writeChunk(this, stylesheetFlushingQueue[stylesheet]);
        stylesheetFlushingQueue.length = 0;
      }
    }
    function preloadLateStyles(styleQueue) {
      styleQueue.sheets.forEach(preloadLateStyle, this);
      styleQueue.sheets.clear();
    }
    stringToPrecomputedChunk('<link rel="expect" href="#');
    stringToPrecomputedChunk('" blocking="render"/>');
    var completedShellIdAttributeStart = stringToPrecomputedChunk(' id="');
    function pushCompletedShellIdAttribute(target, resumableState) {
      0 === (resumableState.instructions & 32) && (resumableState.instructions |= 32, target.push(
        completedShellIdAttributeStart,
        escapeTextForBrowser("_" + resumableState.idPrefix + "R_"),
        attributeEnd
      ));
    }
    var arrayFirstOpenBracket = stringToPrecomputedChunk("[");
    var arraySubsequentOpenBracket = stringToPrecomputedChunk(",[");
    var arrayInterstitial = stringToPrecomputedChunk(",");
    var arrayCloseBracket = stringToPrecomputedChunk("]");
    function writeStyleResourceDependenciesInJS(destination, hoistableState) {
      writeChunk(destination, arrayFirstOpenBracket);
      var nextArrayOpenBrackChunk = arrayFirstOpenBracket;
      hoistableState.stylesheets.forEach(function(resource) {
        if (2 !== resource.state)
          if (3 === resource.state)
            writeChunk(destination, nextArrayOpenBrackChunk), writeChunk(
              destination,
              escapeJSObjectForInstructionScripts("" + resource.props.href)
            ), writeChunk(destination, arrayCloseBracket), nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
          else {
            writeChunk(destination, nextArrayOpenBrackChunk);
            var precedence = resource.props["data-precedence"], props = resource.props, coercedHref = sanitizeURL("" + resource.props.href);
            writeChunk(
              destination,
              escapeJSObjectForInstructionScripts(coercedHref)
            );
            precedence = "" + precedence;
            writeChunk(destination, arrayInterstitial);
            writeChunk(
              destination,
              escapeJSObjectForInstructionScripts(precedence)
            );
            for (var propKey in props)
              if (hasOwnProperty.call(props, propKey) && (precedence = props[propKey], null != precedence))
                switch (propKey) {
                  case "href":
                  case "rel":
                  case "precedence":
                  case "data-precedence":
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  default:
                    writeStyleResourceAttributeInJS(
                      destination,
                      propKey,
                      precedence
                    );
                }
            writeChunk(destination, arrayCloseBracket);
            nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
            resource.state = 3;
          }
      });
      writeChunk(destination, arrayCloseBracket);
    }
    function writeStyleResourceAttributeInJS(destination, name, value) {
      var attributeName = name.toLowerCase();
      switch (typeof value) {
        case "function":
        case "symbol":
          return;
      }
      switch (name) {
        case "innerHTML":
        case "dangerouslySetInnerHTML":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "style":
        case "ref":
          return;
        case "className":
          attributeName = "class";
          name = "" + value;
          break;
        case "hidden":
          if (false === value) return;
          name = "";
          break;
        case "src":
        case "href":
          value = sanitizeURL(value);
          name = "" + value;
          break;
        default:
          if (2 < name.length && ("o" === name[0] || "O" === name[0]) && ("n" === name[1] || "N" === name[1]) || !isAttributeNameSafe(name))
            return;
          name = "" + value;
      }
      writeChunk(destination, arrayInterstitial);
      writeChunk(destination, escapeJSObjectForInstructionScripts(attributeName));
      writeChunk(destination, arrayInterstitial);
      writeChunk(destination, escapeJSObjectForInstructionScripts(name));
    }
    function createHoistableState() {
      return { styles: /* @__PURE__ */ new Set(), stylesheets: /* @__PURE__ */ new Set(), suspenseyImages: false };
    }
    function prefetchDNS(href) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if ("string" === typeof href && href) {
          if (!resumableState.dnsResources.hasOwnProperty(href)) {
            resumableState.dnsResources[href] = null;
            resumableState = renderState.headers;
            var header, JSCompiler_temp;
            if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity)
              JSCompiler_temp = (header = "<" + ("" + href).replace(
                regexForHrefInLinkHeaderURLContext,
                escapeHrefForLinkHeaderURLContextReplacer
              ) + ">; rel=dns-prefetch", 0 <= (resumableState.remainingCapacity -= header.length + 2));
            JSCompiler_temp ? (renderState.resets.dns[href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (header = [], pushLinkImpl(header, { href, rel: "dns-prefetch" }), renderState.preconnects.add(header));
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.D(href);
    }
    function preconnect(href, crossOrigin) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if ("string" === typeof href && href) {
          var bucket = "use-credentials" === crossOrigin ? "credentials" : "string" === typeof crossOrigin ? "anonymous" : "default";
          if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
            resumableState.connectResources[bucket][href] = null;
            resumableState = renderState.headers;
            var header, JSCompiler_temp;
            if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity) {
              JSCompiler_temp = "<" + ("" + href).replace(
                regexForHrefInLinkHeaderURLContext,
                escapeHrefForLinkHeaderURLContextReplacer
              ) + ">; rel=preconnect";
              if ("string" === typeof crossOrigin) {
                var escapedCrossOrigin = ("" + crossOrigin).replace(
                  regexForLinkHeaderQuotedParamValueContext,
                  escapeStringForLinkHeaderQuotedParamValueContextReplacer
                );
                JSCompiler_temp += '; crossorigin="' + escapedCrossOrigin + '"';
              }
              JSCompiler_temp = (header = JSCompiler_temp, 0 <= (resumableState.remainingCapacity -= header.length + 2));
            }
            JSCompiler_temp ? (renderState.resets.connect[bucket][href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (bucket = [], pushLinkImpl(bucket, {
              rel: "preconnect",
              href,
              crossOrigin
            }), renderState.preconnects.add(bucket));
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.C(href, crossOrigin);
    }
    function preload(href, as, options) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (as && href) {
          switch (as) {
            case "image":
              if (options) {
                var imageSrcSet = options.imageSrcSet;
                var imageSizes = options.imageSizes;
                var fetchPriority = options.fetchPriority;
              }
              var key = imageSrcSet ? imageSrcSet + "\n" + (imageSizes || "") : href;
              if (resumableState.imageResources.hasOwnProperty(key)) return;
              resumableState.imageResources[key] = PRELOAD_NO_CREDS;
              resumableState = renderState.headers;
              var header;
              resumableState && 0 < resumableState.remainingCapacity && "string" !== typeof imageSrcSet && "high" === fetchPriority && (header = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key] = PRELOAD_NO_CREDS, resumableState.highImagePreloads && (resumableState.highImagePreloads += ", "), resumableState.highImagePreloads += header) : (resumableState = [], pushLinkImpl(
                resumableState,
                assign(
                  { rel: "preload", href: imageSrcSet ? void 0 : href, as },
                  options
                )
              ), "high" === fetchPriority ? renderState.highImagePreloads.add(resumableState) : (renderState.bulkPreloads.add(resumableState), renderState.preloads.images.set(key, resumableState)));
              break;
            case "style":
              if (resumableState.styleResources.hasOwnProperty(href)) return;
              imageSrcSet = [];
              pushLinkImpl(
                imageSrcSet,
                assign({ rel: "preload", href, as }, options)
              );
              resumableState.styleResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              renderState.preloads.stylesheets.set(href, imageSrcSet);
              renderState.bulkPreloads.add(imageSrcSet);
              break;
            case "script":
              if (resumableState.scriptResources.hasOwnProperty(href)) return;
              imageSrcSet = [];
              renderState.preloads.scripts.set(href, imageSrcSet);
              renderState.bulkPreloads.add(imageSrcSet);
              pushLinkImpl(
                imageSrcSet,
                assign({ rel: "preload", href, as }, options)
              );
              resumableState.scriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              break;
            default:
              if (resumableState.unknownResources.hasOwnProperty(as)) {
                if (imageSrcSet = resumableState.unknownResources[as], imageSrcSet.hasOwnProperty(href))
                  return;
              } else
                imageSrcSet = {}, resumableState.unknownResources[as] = imageSrcSet;
              imageSrcSet[href] = PRELOAD_NO_CREDS;
              if ((resumableState = renderState.headers) && 0 < resumableState.remainingCapacity && "font" === as && (key = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= key.length + 2)))
                renderState.resets.font[href] = PRELOAD_NO_CREDS, resumableState.fontPreloads && (resumableState.fontPreloads += ", "), resumableState.fontPreloads += key;
              else
                switch (resumableState = [], href = assign({ rel: "preload", href, as }, options), pushLinkImpl(resumableState, href), as) {
                  case "font":
                    renderState.fontPreloads.add(resumableState);
                    break;
                  default:
                    renderState.bulkPreloads.add(resumableState);
                }
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.L(href, as, options);
    }
    function preloadModule(href, options) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (href) {
          var as = options && "string" === typeof options.as ? options.as : "script";
          switch (as) {
            case "script":
              if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
              as = [];
              resumableState.moduleScriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              renderState.preloads.moduleScripts.set(href, as);
              break;
            default:
              if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
                var resources = resumableState.moduleUnknownResources[as];
                if (resources.hasOwnProperty(href)) return;
              } else
                resources = {}, resumableState.moduleUnknownResources[as] = resources;
              as = [];
              resources[href] = PRELOAD_NO_CREDS;
          }
          pushLinkImpl(as, assign({ rel: "modulepreload", href }, options));
          renderState.bulkPreloads.add(as);
          enqueueFlush(request);
        }
      } else previousDispatcher.m(href, options);
    }
    function preinitStyle(href, precedence, options) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (href) {
          precedence = precedence || "default";
          var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
          null !== resourceState && (resumableState.styleResources[href] = null, styleQueue || (styleQueue = {
            precedence: escapeTextForBrowser(precedence),
            rules: [],
            hrefs: [],
            sheets: /* @__PURE__ */ new Map()
          }, renderState.styles.set(precedence, styleQueue)), precedence = {
            state: 0,
            props: assign(
              { rel: "stylesheet", href, "data-precedence": precedence },
              options
            )
          }, resourceState && (2 === resourceState.length && adoptPreloadCredentials(precedence.props, resourceState), (renderState = renderState.preloads.stylesheets.get(href)) && 0 < renderState.length ? renderState.length = 0 : precedence.state = 1), styleQueue.sheets.set(href, precedence), enqueueFlush(request));
        }
      } else previousDispatcher.S(href, precedence, options);
    }
    function preinitScript(src, options) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (src) {
          var resourceState = resumableState.scriptResources.hasOwnProperty(src) ? resumableState.scriptResources[src] : void 0;
          null !== resourceState && (resumableState.scriptResources[src] = null, options = assign({ src, async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.scripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
        }
      } else previousDispatcher.X(src, options);
    }
    function preinitModuleScript(src, options) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (src) {
          var resourceState = resumableState.moduleScriptResources.hasOwnProperty(
            src
          ) ? resumableState.moduleScriptResources[src] : void 0;
          null !== resourceState && (resumableState.moduleScriptResources[src] = null, options = assign({ src, type: "module", async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.moduleScripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
        }
      } else previousDispatcher.M(src, options);
    }
    function adoptPreloadCredentials(target, preloadState) {
      null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
      null == target.integrity && (target.integrity = preloadState[1]);
    }
    function getPreloadAsHeader(href, as, params) {
      href = ("" + href).replace(
        regexForHrefInLinkHeaderURLContext,
        escapeHrefForLinkHeaderURLContextReplacer
      );
      as = ("" + as).replace(
        regexForLinkHeaderQuotedParamValueContext,
        escapeStringForLinkHeaderQuotedParamValueContextReplacer
      );
      as = "<" + href + '>; rel=preload; as="' + as + '"';
      for (var paramName in params)
        hasOwnProperty.call(params, paramName) && (href = params[paramName], "string" === typeof href && (as += "; " + paramName.toLowerCase() + '="' + ("" + href).replace(
          regexForLinkHeaderQuotedParamValueContext,
          escapeStringForLinkHeaderQuotedParamValueContextReplacer
        ) + '"'));
      return as;
    }
    var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
    function escapeHrefForLinkHeaderURLContextReplacer(match) {
      switch (match) {
        case "<":
          return "%3C";
        case ">":
          return "%3E";
        case "\n":
          return "%0A";
        case "\r":
          return "%0D";
        default:
          throw Error(
            "escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
          );
      }
    }
    var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
    function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
      switch (match) {
        case '"':
          return "%22";
        case "'":
          return "%27";
        case ";":
          return "%3B";
        case ",":
          return "%2C";
        case "\n":
          return "%0A";
        case "\r":
          return "%0D";
        default:
          throw Error(
            "escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
          );
      }
    }
    function hoistStyleQueueDependency(styleQueue) {
      this.styles.add(styleQueue);
    }
    function hoistStylesheetDependency(stylesheet) {
      this.stylesheets.add(stylesheet);
    }
    function hoistHoistables(parentState, childState) {
      childState.styles.forEach(hoistStyleQueueDependency, parentState);
      childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
      childState.suspenseyImages && (parentState.suspenseyImages = true);
    }
    function hasSuspenseyContent(hoistableState, flushingInShell) {
      return flushingInShell ? hoistableState.suspenseyImages : 0 < hoistableState.stylesheets.size || hoistableState.suspenseyImages;
    }
    var bind = Function.prototype.bind;
    var requestStorage = new async_hooks.AsyncLocalStorage();
    var REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
    function getComponentNameFromType(type) {
      if (null == type) return null;
      if ("function" === typeof type)
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
        case REACT_VIEW_TRANSITION_TYPE:
          return "ViewTransition";
      }
      if ("object" === typeof type)
        switch (type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {
            }
        }
      return null;
    }
    var emptyContextObject = {};
    var currentActiveSnapshot = null;
    function popToNearestCommonAncestor(prev, next) {
      if (prev !== next) {
        prev.context._currentValue = prev.parentValue;
        prev = prev.parent;
        var parentNext = next.parent;
        if (null === prev) {
          if (null !== parentNext)
            throw Error(
              "The stacks must reach the root at the same time. This is a bug in React."
            );
        } else {
          if (null === parentNext)
            throw Error(
              "The stacks must reach the root at the same time. This is a bug in React."
            );
          popToNearestCommonAncestor(prev, parentNext);
        }
        next.context._currentValue = next.value;
      }
    }
    function popAllPrevious(prev) {
      prev.context._currentValue = prev.parentValue;
      prev = prev.parent;
      null !== prev && popAllPrevious(prev);
    }
    function pushAllNext(next) {
      var parentNext = next.parent;
      null !== parentNext && pushAllNext(parentNext);
      next.context._currentValue = next.value;
    }
    function popPreviousToCommonLevel(prev, next) {
      prev.context._currentValue = prev.parentValue;
      prev = prev.parent;
      if (null === prev)
        throw Error(
          "The depth must equal at least at zero before reaching the root. This is a bug in React."
        );
      prev.depth === next.depth ? popToNearestCommonAncestor(prev, next) : popPreviousToCommonLevel(prev, next);
    }
    function popNextToCommonLevel(prev, next) {
      var parentNext = next.parent;
      if (null === parentNext)
        throw Error(
          "The depth must equal at least at zero before reaching the root. This is a bug in React."
        );
      prev.depth === parentNext.depth ? popToNearestCommonAncestor(prev, parentNext) : popNextToCommonLevel(prev, parentNext);
      next.context._currentValue = next.value;
    }
    function switchContext(newSnapshot) {
      var prev = currentActiveSnapshot;
      prev !== newSnapshot && (null === prev ? pushAllNext(newSnapshot) : null === newSnapshot ? popAllPrevious(prev) : prev.depth === newSnapshot.depth ? popToNearestCommonAncestor(prev, newSnapshot) : prev.depth > newSnapshot.depth ? popPreviousToCommonLevel(prev, newSnapshot) : popNextToCommonLevel(prev, newSnapshot), currentActiveSnapshot = newSnapshot);
    }
    var classComponentUpdater = {
      enqueueSetState: function(inst, payload) {
        inst = inst._reactInternals;
        null !== inst.queue && inst.queue.push(payload);
      },
      enqueueReplaceState: function(inst, payload) {
        inst = inst._reactInternals;
        inst.replace = true;
        inst.queue = [payload];
      },
      enqueueForceUpdate: function() {
      }
    };
    var emptyTreeContext = { id: 1, overflow: "" };
    function getTreeId(context) {
      var overflow = context.overflow;
      context = context.id;
      return (context & ~(1 << 32 - clz32(context) - 1)).toString(32) + overflow;
    }
    function pushTreeContext(baseContext, totalChildren, index) {
      var baseIdWithLeadingBit = baseContext.id;
      baseContext = baseContext.overflow;
      var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
      baseIdWithLeadingBit &= ~(1 << baseLength);
      index += 1;
      var length = 32 - clz32(totalChildren) + baseLength;
      if (30 < length) {
        var numberOfOverflowBits = baseLength - baseLength % 5;
        length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
        baseIdWithLeadingBit >>= numberOfOverflowBits;
        baseLength -= numberOfOverflowBits;
        return {
          id: 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit,
          overflow: length + baseContext
        };
      }
      return {
        id: 1 << length | index << baseLength | baseIdWithLeadingBit,
        overflow: baseContext
      };
    }
    var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
    var log = Math.log;
    var LN2 = Math.LN2;
    function clz32Fallback(x) {
      x >>>= 0;
      return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
    }
    function noop() {
    }
    var SuspenseException = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
    );
    function trackUsedThenable(thenableState2, thenable, index) {
      index = thenableState2[index];
      void 0 === index ? thenableState2.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          thenableState2 = thenable.reason;
          if (void 0 === thenableState2 && !("reason" in thenable))
            throw Error(
              "A rejected Promise was passed to React without a `reason` property. React threw a generic error from where the Promise was used to assist in identifying the problematic Promise. Make sure that instrumented Promises correctly set the `reason` property when setting `status` to `'rejected'`."
            );
          throw thenableState2;
        default:
          "string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState2 = thenable, thenableState2.status = "pending", thenableState2.then(
            function(fulfilledValue) {
              if ("pending" === thenable.status) {
                var fulfilledThenable = thenable;
                fulfilledThenable.status = "fulfilled";
                fulfilledThenable.value = fulfilledValue;
              }
            },
            function(error) {
              if ("pending" === thenable.status) {
                var rejectedThenable = thenable;
                rejectedThenable.status = "rejected";
                rejectedThenable.reason = error;
              }
            }
          ));
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
          suspendedThenable = thenable;
          throw SuspenseException;
      }
    }
    var suspendedThenable = null;
    function getSuspendedThenable() {
      if (null === suspendedThenable)
        throw Error(
          "Expected a suspended thenable. This is a bug in React. Please file an issue."
        );
      var thenable = suspendedThenable;
      suspendedThenable = null;
      return thenable;
    }
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is;
    var currentlyRenderingComponent = null;
    var currentlyRenderingTask = null;
    var currentlyRenderingRequest = null;
    var currentlyRenderingKeyPath = null;
    var firstWorkInProgressHook = null;
    var workInProgressHook = null;
    var isReRender = false;
    var didScheduleRenderPhaseUpdate = false;
    var localIdCounter = 0;
    var actionStateCounter = 0;
    var actionStateMatchingIndex = -1;
    var thenableIndexCounter = 0;
    var thenableState = null;
    function createRecoverableError(recoverable) {
      recoverable = recoverable._reason;
      if ("function" === typeof recoverable)
        try {
          var initializedReason = recoverable();
        } catch ($jscomp$unused$catch) {
          initializedReason = "The reason for browser-only rendering could not be determined because its initializer threw.";
        }
      else initializedReason = recoverable;
      initializedReason = Error(
        "Browser-only rendering was requested by `browser()`.",
        void 0 === recoverable ? void 0 : { cause: initializedReason }
      );
      Object.defineProperty(initializedReason, REACT_RECOVERABLE_TYPE, {
        value: true
      });
      return initializedReason;
    }
    function isRecoverableError(error) {
      return "object" !== typeof error || null === error ? false : true === error[REACT_RECOVERABLE_TYPE];
    }
    function cloneRecoverableErrorAsFatal(recoverableError) {
      var fatalRecoverableError = Error(
        "The server render could not complete because client rendering was requested outside a Suspense boundary. See this error's cause for additional details.",
        hasOwnProperty.call(recoverableError, "cause") ? { cause: recoverableError.cause } : void 0
      );
      recoverableError = recoverableError.stack;
      if (void 0 !== recoverableError) {
        var frameStart = recoverableError.indexOf("\n");
        fatalRecoverableError.stack = fatalRecoverableError.name + ": " + fatalRecoverableError.message + (-1 === frameStart ? "" : recoverableError.slice(frameStart));
      } else fatalRecoverableError.stack = void 0;
      return fatalRecoverableError;
    }
    var renderPhaseUpdates = null;
    var numberOfReRenders = 0;
    function resolveCurrentlyRenderingComponent() {
      if (null === currentlyRenderingComponent)
        throw Error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
      return currentlyRenderingComponent;
    }
    function createHook() {
      if (0 < numberOfReRenders)
        throw Error("Rendered more hooks than during the previous render");
      return { memoizedState: null, queue: null, next: null };
    }
    function createWorkInProgressHook() {
      null === workInProgressHook ? null === firstWorkInProgressHook ? (isReRender = false, firstWorkInProgressHook = workInProgressHook = createHook()) : (isReRender = true, workInProgressHook = firstWorkInProgressHook) : null === workInProgressHook.next ? (isReRender = false, workInProgressHook = workInProgressHook.next = createHook()) : (isReRender = true, workInProgressHook = workInProgressHook.next);
      return workInProgressHook;
    }
    function getThenableStateAfterSuspending() {
      var state = thenableState;
      thenableState = null;
      return state;
    }
    function resetHooksState() {
      currentlyRenderingKeyPath = currentlyRenderingRequest = currentlyRenderingTask = currentlyRenderingComponent = null;
      didScheduleRenderPhaseUpdate = false;
      firstWorkInProgressHook = null;
      numberOfReRenders = 0;
      workInProgressHook = renderPhaseUpdates = null;
    }
    function basicStateReducer(state, action) {
      return "function" === typeof action ? action(state) : action;
    }
    function useReducer(reducer, initialArg, init) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      if (isReRender) {
        var queue = workInProgressHook.queue;
        initialArg = queue.dispatch;
        if (null !== renderPhaseUpdates && (init = renderPhaseUpdates.get(queue), void 0 !== init)) {
          renderPhaseUpdates.delete(queue);
          queue = workInProgressHook.memoizedState;
          do
            queue = reducer(queue, init.action), init = init.next;
          while (null !== init);
          workInProgressHook.memoizedState = queue;
          return [queue, initialArg];
        }
        return [workInProgressHook.memoizedState, initialArg];
      }
      reducer = reducer === basicStateReducer ? "function" === typeof initialArg ? initialArg() : initialArg : void 0 !== init ? init(initialArg) : initialArg;
      workInProgressHook.memoizedState = reducer;
      reducer = workInProgressHook.queue = { last: null, dispatch: null };
      reducer = reducer.dispatch = dispatchAction.bind(
        null,
        currentlyRenderingComponent,
        reducer
      );
      return [workInProgressHook.memoizedState, reducer];
    }
    function useMemo(nextCreate, deps) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      if (null !== workInProgressHook) {
        var prevState = workInProgressHook.memoizedState;
        if (null !== prevState && null !== deps) {
          var prevDeps = prevState[1];
          a: if (null === prevDeps) prevDeps = false;
          else {
            for (var i = 0; i < prevDeps.length && i < deps.length; i++)
              if (!objectIs(deps[i], prevDeps[i])) {
                prevDeps = false;
                break a;
              }
            prevDeps = true;
          }
          if (prevDeps) return prevState[0];
        }
      }
      nextCreate = nextCreate();
      workInProgressHook.memoizedState = [nextCreate, deps];
      return nextCreate;
    }
    function dispatchAction(componentIdentity, queue, action) {
      if (25 <= numberOfReRenders)
        throw Error(
          "Too many re-renders. React limits the number of renders to prevent an infinite loop."
        );
      if (componentIdentity === currentlyRenderingComponent)
        if (didScheduleRenderPhaseUpdate = true, componentIdentity = { action, next: null }, null === renderPhaseUpdates && (renderPhaseUpdates = /* @__PURE__ */ new Map()), action = renderPhaseUpdates.get(queue), void 0 === action)
          renderPhaseUpdates.set(queue, componentIdentity);
        else {
          for (queue = action; null !== queue.next; ) queue = queue.next;
          queue.next = componentIdentity;
        }
    }
    function throwOnUseEffectEventCall() {
      throw Error(
        "A function wrapped in useEffectEvent can't be called during rendering."
      );
    }
    function unsupportedStartTransition() {
      throw Error("startTransition cannot be called during server rendering.");
    }
    function unsupportedSetOptimisticState() {
      throw Error("Cannot update optimistic state while rendering.");
    }
    function createPostbackActionStateKey(permalink, componentKeyPath, hookIndex) {
      if (void 0 !== permalink) return "p" + permalink;
      permalink = JSON.stringify([componentKeyPath, null, hookIndex]);
      componentKeyPath = crypto.createHash("md5");
      componentKeyPath.update(permalink);
      return "k" + componentKeyPath.digest("hex");
    }
    function useActionState(action, initialState, permalink) {
      resolveCurrentlyRenderingComponent();
      var actionStateHookIndex = actionStateCounter++, request = currentlyRenderingRequest;
      if ("function" === typeof action.$$FORM_ACTION) {
        var nextPostbackStateKey = null, componentKeyPath = currentlyRenderingKeyPath;
        request = request.formState;
        var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
        if (null !== request && "function" === typeof isSignatureEqual) {
          var postbackKey = request[1];
          isSignatureEqual.call(action, request[2], request[3]) && (nextPostbackStateKey = createPostbackActionStateKey(
            permalink,
            componentKeyPath,
            actionStateHookIndex
          ), postbackKey === nextPostbackStateKey && (actionStateMatchingIndex = actionStateHookIndex, initialState = request[0]));
        }
        var boundAction = action.bind(null, initialState);
        action = function(payload) {
          boundAction(payload);
        };
        "function" === typeof boundAction.$$FORM_ACTION && (action.$$FORM_ACTION = function(prefix2) {
          prefix2 = boundAction.$$FORM_ACTION(prefix2);
          void 0 !== permalink && (permalink += "", prefix2.action = permalink);
          var formData = prefix2.data;
          formData && (null === nextPostbackStateKey && (nextPostbackStateKey = createPostbackActionStateKey(
            permalink,
            componentKeyPath,
            actionStateHookIndex
          )), formData.append("$ACTION_KEY", nextPostbackStateKey));
          return prefix2;
        });
        return [initialState, action, false];
      }
      var boundAction$22 = action.bind(null, initialState);
      return [
        initialState,
        function(payload) {
          boundAction$22(payload);
        },
        false
      ];
    }
    function unwrapThenable(thenable) {
      var index = thenableIndexCounter;
      thenableIndexCounter += 1;
      null === thenableState && (thenableState = []);
      return trackUsedThenable(thenableState, thenable, index);
    }
    function unsupportedRefresh() {
      throw Error("Cache cannot be refreshed during server rendering.");
    }
    var HooksDispatcher = {
      readContext: function(context) {
        return context._currentValue;
      },
      use: function(usable) {
        if (null !== usable && "object" === typeof usable) {
          if ("function" === typeof usable.then) return unwrapThenable(usable);
          if (usable.$$typeof === REACT_RECOVERABLE_TYPE)
            throw createRecoverableError(usable);
          if (usable.$$typeof === REACT_CONTEXT_TYPE) return usable._currentValue;
        }
        throw Error("An unsupported type was passed to use(): " + String(usable));
      },
      useContext: function(context) {
        resolveCurrentlyRenderingComponent();
        return context._currentValue;
      },
      useMemo,
      useReducer,
      useRef: function(initialValue) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        var previousRef = workInProgressHook.memoizedState;
        return null === previousRef ? (initialValue = { current: initialValue }, workInProgressHook.memoizedState = initialValue) : previousRef;
      },
      useState: function(initialState) {
        return useReducer(basicStateReducer, initialState);
      },
      useInsertionEffect: noop,
      useLayoutEffect: noop,
      useCallback: function(callback, deps) {
        return useMemo(function() {
          return callback;
        }, deps);
      },
      useImperativeHandle: noop,
      useEffect: noop,
      useDebugValue: noop,
      useDeferredValue: function(value, initialValue) {
        resolveCurrentlyRenderingComponent();
        return void 0 !== initialValue ? initialValue : value;
      },
      useTransition: function() {
        resolveCurrentlyRenderingComponent();
        return [false, unsupportedStartTransition];
      },
      useId: function() {
        var treeId = getTreeId(currentlyRenderingTask.treeContext), resumableState = currentResumableState;
        if (null === resumableState)
          throw Error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component."
          );
        var localId = localIdCounter++;
        return makeId(resumableState, treeId, localId);
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        if (void 0 === getServerSnapshot)
          throw Error(
            "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
          );
        return getServerSnapshot();
      },
      useOptimistic: function(passthrough) {
        resolveCurrentlyRenderingComponent();
        return [passthrough, unsupportedSetOptimisticState];
      },
      useActionState,
      useFormState: useActionState,
      useHostTransitionStatus: function() {
        resolveCurrentlyRenderingComponent();
        return sharedNotPendingObject;
      },
      useMemoCache: function(size) {
        for (var data = Array(size), i = 0; i < size; i++)
          data[i] = REACT_MEMO_CACHE_SENTINEL;
        return data;
      },
      useCacheRefresh: function() {
        return unsupportedRefresh;
      },
      useEffectEvent: function() {
        return throwOnUseEffectEventCall;
      }
    };
    var currentResumableState = null;
    var DefaultAsyncDispatcher = {
      getCacheForType: function() {
        throw Error("Not implemented.");
      },
      cacheSignal: function() {
        throw Error("Not implemented.");
      }
    };
    function prepareStackTrace(error, structuredStackTrace) {
      error = (error.name || "Error") + ": " + (error.message || "");
      for (var i = 0; i < structuredStackTrace.length; i++)
        error += "\n    at " + structuredStackTrace[i].toString();
      return error;
    }
    var prefix;
    var suffix;
    function describeBuiltInComponentFrame(name) {
      if (void 0 === prefix)
        try {
          throw Error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || "";
          suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return "\n" + prefix + name + suffix;
    }
    var reentry = false;
    function describeNativeComponentFrame(fn, construct) {
      if (!fn || reentry) return "";
      reentry = true;
      var previousPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = prepareStackTrace;
      try {
        var RunInRootFrame = {
          DetermineComponentFrameRoot: function() {
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if ("object" === typeof Reflect && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    var control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x$24) {
                    control = x$24;
                  }
                  Fake = false;
                  try {
                    var prevProps = Object.getOwnPropertyDescriptor(
                      fn.prototype,
                      "props"
                    );
                    Object.defineProperty(fn.prototype, "props", {
                      configurable: true,
                      set: function() {
                        throw Error();
                      }
                    });
                    Fake = true;
                    new fn();
                  } finally {
                    Fake && (void 0 !== prevProps ? Object.defineProperty(fn.prototype, "props", prevProps) : delete fn.prototype.props);
                  }
                }
              } else {
                try {
                  throw Error();
                } catch (x$25) {
                  control = x$25;
                }
                (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
                });
              }
            } catch (sample) {
              if (sample && control && "string" === typeof sample.stack)
                return [sample.stack, control.stack];
            }
            return [null, null];
          }
        };
        RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var namePropDescriptor = Object.getOwnPropertyDescriptor(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name"
        );
        namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
        if (sampleStack && controlStack) {
          var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
          for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
            RunInRootFrame++;
          for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
            "DetermineComponentFrameRoot"
          ); )
            namePropDescriptor++;
          if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
            for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
              namePropDescriptor--;
          for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
            if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
              if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
                do
                  if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                    var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                    fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                    return frame;
                  }
                while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
              }
              break;
            }
        }
      } finally {
        reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
      }
      return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
    }
    function describeComponentStackByType(type) {
      if ("string" === typeof type) return describeBuiltInComponentFrame(type);
      if ("function" === typeof type)
        return type.prototype && type.prototype.isReactComponent ? describeNativeComponentFrame(type, true) : describeNativeComponentFrame(type, false);
      if ("object" === typeof type && null !== type) {
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            return describeNativeComponentFrame(type.render, false);
          case REACT_MEMO_TYPE:
            return describeNativeComponentFrame(type.type, false);
          case REACT_LAZY_TYPE:
            var lazyComponent = type, payload = lazyComponent._payload;
            lazyComponent = lazyComponent._init;
            try {
              type = lazyComponent(payload);
            } catch (x) {
              return describeBuiltInComponentFrame("Lazy");
            }
            return describeComponentStackByType(type);
        }
        if ("string" === typeof type.name) {
          a: {
            payload = type.name;
            lazyComponent = type.env;
            var location = type.debugLocation;
            if (null != location && (type = Error.prepareStackTrace, Error.prepareStackTrace = prepareStackTrace, location = location.stack, Error.prepareStackTrace = type, location.startsWith("Error: react-stack-top-frame\n") && (location = location.slice(29)), type = location.indexOf("\n"), -1 !== type && (location = location.slice(type + 1)), type = location.indexOf("react_stack_bottom_frame"), -1 !== type && (type = location.lastIndexOf("\n", type)), type = -1 !== type ? location = location.slice(0, type) : "", location = type.lastIndexOf("\n"), type = -1 === location ? type : type.slice(location + 1), -1 !== type.indexOf(payload))) {
              payload = "\n" + type;
              break a;
            }
            payload = describeBuiltInComponentFrame(
              payload + (lazyComponent ? " [" + lazyComponent + "]" : "")
            );
          }
          return payload;
        }
      }
      switch (type) {
        case REACT_SUSPENSE_LIST_TYPE:
          return describeBuiltInComponentFrame("SuspenseList");
        case REACT_SUSPENSE_TYPE:
          return describeBuiltInComponentFrame("Suspense");
        case REACT_VIEW_TRANSITION_TYPE:
          return describeBuiltInComponentFrame("ViewTransition");
      }
      return "";
    }
    function getViewTransitionClassName(defaultClass, eventClass) {
      defaultClass = null == defaultClass || "string" === typeof defaultClass ? defaultClass : defaultClass.default;
      eventClass = null == eventClass || "string" === typeof eventClass ? eventClass : eventClass.default;
      return null == eventClass ? "auto" === defaultClass ? null : defaultClass : "auto" === eventClass ? null : eventClass;
    }
    function isEligibleForOutlining(request, boundary) {
      return (500 < boundary.byteSize || hasSuspenseyContent(boundary.contentState, false) || boundary.defer) && null === boundary.preamble;
    }
    function defaultErrorHandler(error) {
      if ("object" === typeof error && null !== error && "string" === typeof error.environmentName) {
        var JSCompiler_inline_result = error.environmentName;
        error = [error].slice(0);
        "string" === typeof error[0] ? error.splice(
          0,
          1,
          "\x1B[0m\x1B[7m%c%s\x1B[0m%c " + error[0],
          "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
          " " + JSCompiler_inline_result + " ",
          ""
        ) : error.splice(
          0,
          0,
          "\x1B[0m\x1B[7m%c%s\x1B[0m%c",
          "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
          " " + JSCompiler_inline_result + " ",
          ""
        );
        error.unshift(console);
        JSCompiler_inline_result = bind.apply(console.error, error);
        JSCompiler_inline_result();
      } else console.error(error);
      return null;
    }
    function RequestInstance(resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError, formState) {
      var abortSet = /* @__PURE__ */ new Set();
      this.destination = null;
      this.flushScheduled = false;
      this.resumableState = resumableState;
      this.renderState = renderState;
      this.rootFormatContext = rootFormatContext;
      this.progressiveChunkSize = void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
      this.status = 10;
      this.fatalError = null;
      this.aborted = false;
      this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
      this.completedPreambleSegments = this.completedRootSegment = null;
      this.byteSize = 0;
      this.abortableTasks = abortSet;
      this.pingedTasks = [];
      this.currentTask = null;
      this.clientRenderedBoundaries = [];
      this.completedBoundaries = [];
      this.partialBoundaries = [];
      this.postponedState = this.trackedPostpones = null;
      this.onError = void 0 === onError ? defaultErrorHandler : onError;
      this.onBrowserBailout = void 0 === onBrowserBailout ? noop : onBrowserBailout;
      this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
      this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
      this.onShellError = void 0 === onShellError ? noop : onShellError;
      this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
      this.renderLifetimeController = null;
      this.formState = void 0 === formState ? null : formState;
    }
    function createRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError, formState) {
      resumableState = new RequestInstance(
        resumableState,
        renderState,
        rootFormatContext,
        progressiveChunkSize,
        onError,
        onBrowserBailout,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        formState
      );
      renderState = createPendingSegment(
        resumableState,
        0,
        null,
        rootFormatContext,
        false,
        false
      );
      renderState.parentFlushed = true;
      children = createRenderTask(
        resumableState,
        null,
        children,
        -1,
        null,
        renderState,
        null,
        null,
        resumableState.abortableTasks,
        null,
        rootFormatContext,
        null,
        emptyTreeContext,
        null,
        null
      );
      pushComponentStack(children);
      resumableState.pingedTasks.push(children);
      return resumableState;
    }
    function createPrerenderRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError) {
      children = createRequest(
        children,
        resumableState,
        renderState,
        rootFormatContext,
        progressiveChunkSize,
        onError,
        onBrowserBailout,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        void 0
      );
      children.trackedPostpones = {
        workingMap: /* @__PURE__ */ new Map(),
        rootNodes: [],
        rootSlots: null
      };
      return children;
    }
    function resumeRequest(children, postponedState, renderState, onError, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError) {
      renderState = new RequestInstance(
        postponedState.resumableState,
        renderState,
        postponedState.rootFormatContext,
        postponedState.progressiveChunkSize,
        onError,
        onBrowserBailout,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        null
      );
      renderState.nextSegmentId = postponedState.nextSegmentId;
      if ("number" === typeof postponedState.replaySlots)
        return onError = createPendingSegment(
          renderState,
          0,
          null,
          postponedState.rootFormatContext,
          false,
          false
        ), onError.parentFlushed = true, children = createRenderTask(
          renderState,
          null,
          children,
          -1,
          null,
          onError,
          null,
          null,
          renderState.abortableTasks,
          null,
          postponedState.rootFormatContext,
          null,
          emptyTreeContext,
          null,
          null
        ), pushComponentStack(children), renderState.pingedTasks.push(children), renderState;
      children = createReplayTask(
        renderState,
        null,
        {
          nodes: postponedState.replayNodes,
          slots: postponedState.replaySlots,
          pendingTasks: 0
        },
        children,
        -1,
        null,
        null,
        renderState.abortableTasks,
        null,
        postponedState.rootFormatContext,
        null,
        emptyTreeContext,
        null,
        null
      );
      pushComponentStack(children);
      renderState.pingedTasks.push(children);
      return renderState;
    }
    function resumeAndPrerenderRequest(children, postponedState, renderState, onError, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError) {
      children = resumeRequest(
        children,
        postponedState,
        renderState,
        onError,
        onBrowserBailout,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError
      );
      children.trackedPostpones = {
        workingMap: /* @__PURE__ */ new Map(),
        rootNodes: [],
        rootSlots: null
      };
      return children;
    }
    var currentRequest = null;
    function resolveRequest() {
      if (currentRequest) return currentRequest;
      var store = requestStorage.getStore();
      return store ? store : null;
    }
    function pingTask(request, task) {
      request.pingedTasks.push(task);
      1 === request.pingedTasks.length && (request.flushScheduled = null !== request.destination, null !== request.trackedPostpones || 10 === request.status ? scheduleMicrotask(function() {
        return performWork(request);
      }) : setImmediate(function() {
        return performWork(request);
      }));
    }
    function createSuspenseBoundary(request, row, fallbackAbortableTasks, preamble, defer) {
      fallbackAbortableTasks = {
        status: 0,
        rootSegmentID: -1,
        parentFlushed: false,
        pendingTasks: 0,
        row,
        completedSegments: [],
        byteSize: 0,
        defer,
        fallbackAbortableTasks,
        errorDigest: null,
        contentState: createHoistableState(),
        fallbackState: createHoistableState(),
        preamble,
        tracked: null
      };
      null !== row && (row.pendingTasks++, preamble = row.boundaries, null !== preamble && (request.allPendingTasks++, fallbackAbortableTasks.pendingTasks++, preamble.push(fallbackAbortableTasks)), request = row.inheritedHoistables, null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
      return fallbackAbortableTasks;
    }
    function createRenderTask(request, thenableState2, node, childIndex, blockedBoundary, blockedSegment, blockedPreamble, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
      request.allPendingTasks++;
      null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
      null !== row && row.pendingTasks++;
      var task = {
        replay: null,
        node,
        childIndex,
        ping: {
          resolve: function() {
            return pingTask(request, task);
          },
          reject: function(error) {
            request.aborted ? task.abortSet.delete(task) && finishAbortedTask(task, request, error) : pingTask(request, task);
          }
        },
        blockedBoundary,
        blockedSegment,
        blockedPreamble,
        hoistableState,
        abortSet,
        keyPath,
        formatContext,
        context,
        treeContext,
        row,
        componentStack,
        thenableState: thenableState2
      };
      abortSet.add(task);
      return task;
    }
    function createReplayTask(request, thenableState2, replay, node, childIndex, blockedBoundary, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
      request.allPendingTasks++;
      null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
      null !== row && row.pendingTasks++;
      replay.pendingTasks++;
      var task = {
        replay,
        node,
        childIndex,
        ping: {
          resolve: function() {
            return pingTask(request, task);
          },
          reject: function(error) {
            request.aborted ? task.abortSet.delete(task) && finishAbortedTask(task, request, error) : pingTask(request, task);
          }
        },
        blockedBoundary,
        blockedSegment: null,
        blockedPreamble: null,
        hoistableState,
        abortSet,
        keyPath,
        formatContext,
        context,
        treeContext,
        row,
        componentStack,
        thenableState: thenableState2
      };
      abortSet.add(task);
      return task;
    }
    function createPendingSegment(request, index, boundary, parentFormatContext, lastPushedText, textEmbedded) {
      return {
        status: 0,
        parentFlushed: false,
        id: -1,
        index,
        chunks: [],
        children: [],
        preambleChildren: [],
        parentFormatContext,
        boundary,
        lastPushedText,
        textEmbedded
      };
    }
    function pushComponentStack(task) {
      var node = task.node;
      if ("object" === typeof node && null !== node)
        switch (node.$$typeof) {
          case REACT_ELEMENT_TYPE:
            task.componentStack = { parent: task.componentStack, type: node.type };
        }
    }
    function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
      return null === componentStack ? null : { parent: componentStack.parent, type: "Suspense Fallback" };
    }
    function getThrownInfo(node$jscomp$0) {
      var errorInfo = {};
      node$jscomp$0 && Object.defineProperty(errorInfo, "componentStack", {
        configurable: true,
        enumerable: true,
        get: function() {
          try {
            var info = "", node = node$jscomp$0;
            do
              info += describeComponentStackByType(node.type), node = node.parent;
            while (node);
            var JSCompiler_inline_result = info;
          } catch (x) {
            JSCompiler_inline_result = "\nError generating stack: " + x.message + "\n" + x.stack;
          }
          Object.defineProperty(errorInfo, "componentStack", {
            value: JSCompiler_inline_result
          });
          return JSCompiler_inline_result;
        }
      });
      return errorInfo;
    }
    function logRecoverableError(request, error, errorInfo) {
      if (isRecoverableError(error))
        return request = request.onBrowserBailout, request(error, errorInfo), "";
      request = request.onError;
      error = request(error, errorInfo);
      if (null == error || "string" === typeof error)
        return "" === error ? void 0 : error;
    }
    function fatalError(request, error) {
      var onShellError = request.onShellError, onFatalError = request.onFatalError;
      0 !== request.pendingRootTasks && onShellError(error);
      onFatalError(error);
      endRenderLifetime(request);
      null !== request.destination ? (request.status = 13, request.destination.destroy(error)) : (request.status = 12, request.aborted || (request.fatalError = error));
    }
    function finishSuspenseListRow(request, row) {
      unblockSuspenseListRow(request, row.next, row.hoistables);
    }
    function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
      for (; null !== unblockedRow; ) {
        null !== inheritedHoistables && (hoistHoistables(unblockedRow.hoistables, inheritedHoistables), unblockedRow.inheritedHoistables = inheritedHoistables);
        var unblockedBoundaries = unblockedRow.boundaries;
        if (null !== unblockedBoundaries) {
          unblockedRow.boundaries = null;
          for (var i = 0; i < unblockedBoundaries.length; i++) {
            var unblockedBoundary = unblockedBoundaries[i];
            null !== inheritedHoistables && hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
            finishedTask(request, unblockedBoundary, null, null);
          }
        }
        unblockedRow.pendingTasks--;
        if (0 < unblockedRow.pendingTasks) break;
        inheritedHoistables = unblockedRow.hoistables;
        unblockedRow = unblockedRow.next;
      }
    }
    function tryToResolveTogetherRow(request, togetherRow) {
      var boundaries = togetherRow.boundaries;
      if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
        for (var allCompleteAndInlinable = true, i = 0; i < boundaries.length; i++) {
          var rowBoundary = boundaries[i];
          if (1 !== rowBoundary.pendingTasks || rowBoundary.parentFlushed || isEligibleForOutlining(request, rowBoundary)) {
            allCompleteAndInlinable = false;
            break;
          }
        }
        allCompleteAndInlinable && unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
      }
    }
    function createSuspenseListRow(previousRow) {
      var newRow = {
        pendingTasks: 1,
        boundaries: null,
        hoistables: createHoistableState(),
        inheritedHoistables: null,
        together: false,
        next: null
      };
      null !== previousRow && 0 < previousRow.pendingTasks && (newRow.pendingTasks++, newRow.boundaries = [], previousRow.next = newRow);
      return newRow;
    }
    function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
      var prevKeyPath = task.keyPath, prevTreeContext = task.treeContext, prevRow = task.row;
      task.keyPath = keyPath;
      keyPath = rows.length;
      var previousSuspenseListRow = null;
      if (null !== task.replay) {
        var resumeSlots = task.replay.slots;
        if (null !== resumeSlots && "object" === typeof resumeSlots)
          for (var n = 0; n < keyPath; n++) {
            var i = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? n : keyPath - 1 - n, node = rows[i];
            task.row = previousSuspenseListRow = createSuspenseListRow(
              previousSuspenseListRow
            );
            task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
            var resumeSegmentID = resumeSlots[i];
            "number" === typeof resumeSegmentID ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i]) : renderNode(request, task, node, i);
            0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
          }
        else
          for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++)
            n = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? resumeSlots : keyPath - 1 - resumeSlots, i = rows[n], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, n), renderNode(request, task, i, n), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
      } else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder)
        for (revealOrder = 0; revealOrder < keyPath; revealOrder++)
          resumeSlots = rows[revealOrder], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(
            prevTreeContext,
            keyPath,
            revealOrder
          ), renderNode(request, task, resumeSlots, revealOrder), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
      else {
        resumeSlots = task.blockedSegment;
        n = resumeSlots.children.length;
        i = resumeSlots.chunks.length;
        for (node = 0; node < keyPath; node++) {
          resumeSegmentID = "unstable_legacy-backwards" === revealOrder ? keyPath - 1 - node : node;
          var node$40 = rows[resumeSegmentID];
          task.row = previousSuspenseListRow = createSuspenseListRow(
            previousSuspenseListRow
          );
          task.treeContext = pushTreeContext(
            prevTreeContext,
            keyPath,
            resumeSegmentID
          );
          var newSegment = createPendingSegment(
            request,
            i,
            null,
            task.formatContext,
            0 === resumeSegmentID ? resumeSlots.lastPushedText : true,
            true
          );
          resumeSlots.children.splice(n, 0, newSegment);
          task.blockedSegment = newSegment;
          try {
            renderNode(request, task, node$40, resumeSegmentID), newSegment.lastPushedText && newSegment.textEmbedded && newSegment.chunks.push(textSeparator), newSegment.status = 1, finishedSegment(request, task.blockedBoundary, newSegment), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
          } catch (thrownValue) {
            throw newSegment.status = request.aborted ? 3 : 4, thrownValue;
          }
        }
        task.blockedSegment = resumeSlots;
        resumeSlots.lastPushedText = false;
      }
      null !== prevRow && null !== previousSuspenseListRow && 0 < previousSuspenseListRow.pendingTasks && (prevRow.pendingTasks++, previousSuspenseListRow.next = prevRow);
      task.treeContext = prevTreeContext;
      task.row = prevRow;
      task.keyPath = prevKeyPath;
    }
    function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
      var prevThenableState = task.thenableState;
      task.thenableState = null;
      currentlyRenderingComponent = {};
      currentlyRenderingTask = task;
      currentlyRenderingRequest = request;
      currentlyRenderingKeyPath = keyPath;
      actionStateCounter = localIdCounter = 0;
      actionStateMatchingIndex = -1;
      thenableIndexCounter = 0;
      thenableState = prevThenableState;
      for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
        didScheduleRenderPhaseUpdate = false, actionStateCounter = localIdCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, numberOfReRenders += 1, workInProgressHook = null, request = Component(props, secondArg);
      resetHooksState();
      return request;
    }
    function finishFunctionComponent(request, task, keyPath, children, hasId, actionStateCount, actionStateMatchingIndex2) {
      var didEmitActionStateMarkers = false;
      if (0 !== actionStateCount && null !== request.formState) {
        var segment = task.blockedSegment;
        if (null !== segment) {
          didEmitActionStateMarkers = true;
          segment = segment.chunks;
          for (var i = 0; i < actionStateCount; i++)
            i === actionStateMatchingIndex2 ? segment.push(formStateMarkerIsMatching) : segment.push(formStateMarkerIsNotMatching);
        }
      }
      actionStateCount = task.keyPath;
      task.keyPath = keyPath;
      hasId ? (keyPath = task.treeContext, task.treeContext = pushTreeContext(keyPath, 1, 0), renderNode(request, task, children, -1), task.treeContext = keyPath) : didEmitActionStateMarkers ? renderNode(request, task, children, -1) : renderNodeDestructive(request, task, children, -1);
      task.keyPath = actionStateCount;
    }
    function renderElement(request, task, keyPath, type, props, ref) {
      if ("function" === typeof type)
        if (type.prototype && type.prototype.isReactComponent) {
          var newProps = props;
          if ("ref" in props) {
            newProps = {};
            for (var propName in props)
              "ref" !== propName && (newProps[propName] = props[propName]);
          }
          var defaultProps = type.defaultProps;
          if (defaultProps) {
            newProps === props && (newProps = assign({}, newProps, props));
            for (var propName$45 in defaultProps)
              void 0 === newProps[propName$45] && (newProps[propName$45] = defaultProps[propName$45]);
          }
          var JSCompiler_inline_result = newProps;
          var context = emptyContextObject, contextType = type.contextType;
          "object" === typeof contextType && null !== contextType && (context = contextType._currentValue);
          var JSCompiler_inline_result$jscomp$0 = new type(
            JSCompiler_inline_result,
            context
          );
          var initialState = void 0 !== JSCompiler_inline_result$jscomp$0.state ? JSCompiler_inline_result$jscomp$0.state : null;
          JSCompiler_inline_result$jscomp$0.updater = classComponentUpdater;
          JSCompiler_inline_result$jscomp$0.props = JSCompiler_inline_result;
          JSCompiler_inline_result$jscomp$0.state = initialState;
          var internalInstance = { queue: [], replace: false };
          JSCompiler_inline_result$jscomp$0._reactInternals = internalInstance;
          var contextType$jscomp$0 = type.contextType;
          JSCompiler_inline_result$jscomp$0.context = "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 ? contextType$jscomp$0._currentValue : emptyContextObject;
          var getDerivedStateFromProps = type.getDerivedStateFromProps;
          if ("function" === typeof getDerivedStateFromProps) {
            var partialState = getDerivedStateFromProps(
              JSCompiler_inline_result,
              initialState
            );
            var JSCompiler_inline_result$jscomp$1 = null === partialState || void 0 === partialState ? initialState : assign({}, initialState, partialState);
            JSCompiler_inline_result$jscomp$0.state = JSCompiler_inline_result$jscomp$1;
          }
          if ("function" !== typeof type.getDerivedStateFromProps && "function" !== typeof JSCompiler_inline_result$jscomp$0.getSnapshotBeforeUpdate && ("function" === typeof JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount || "function" === typeof JSCompiler_inline_result$jscomp$0.componentWillMount)) {
            var oldState = JSCompiler_inline_result$jscomp$0.state;
            "function" === typeof JSCompiler_inline_result$jscomp$0.componentWillMount && JSCompiler_inline_result$jscomp$0.componentWillMount();
            "function" === typeof JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount && JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount();
            oldState !== JSCompiler_inline_result$jscomp$0.state && classComponentUpdater.enqueueReplaceState(
              JSCompiler_inline_result$jscomp$0,
              JSCompiler_inline_result$jscomp$0.state,
              null
            );
            if (null !== internalInstance.queue && 0 < internalInstance.queue.length) {
              var oldQueue = internalInstance.queue, oldReplace = internalInstance.replace;
              internalInstance.queue = null;
              internalInstance.replace = false;
              if (oldReplace && 1 === oldQueue.length)
                JSCompiler_inline_result$jscomp$0.state = oldQueue[0];
              else {
                for (var nextState = oldReplace ? oldQueue[0] : JSCompiler_inline_result$jscomp$0.state, dontMutate = true, i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                  var partial = oldQueue[i], partialState$jscomp$0 = "function" === typeof partial ? partial.call(
                    JSCompiler_inline_result$jscomp$0,
                    nextState,
                    JSCompiler_inline_result,
                    void 0
                  ) : partial;
                  null != partialState$jscomp$0 && (dontMutate ? (dontMutate = false, nextState = assign({}, nextState, partialState$jscomp$0)) : assign(nextState, partialState$jscomp$0));
                }
                JSCompiler_inline_result$jscomp$0.state = nextState;
              }
            } else internalInstance.queue = null;
          }
          var nextChildren = JSCompiler_inline_result$jscomp$0.render();
          if (request.aborted) throw null;
          var prevKeyPath = task.keyPath;
          task.keyPath = keyPath;
          renderNodeDestructive(request, task, nextChildren, -1);
          task.keyPath = prevKeyPath;
        } else {
          var value = renderWithHooks(request, task, keyPath, type, props, void 0);
          if (request.aborted) throw null;
          finishFunctionComponent(
            request,
            task,
            keyPath,
            value,
            0 !== localIdCounter,
            actionStateCounter,
            actionStateMatchingIndex
          );
        }
      else if ("string" === typeof type) {
        var segment = task.blockedSegment;
        if (null === segment) {
          var children = props.children, prevContext = task.formatContext, prevKeyPath$jscomp$0 = task.keyPath;
          task.formatContext = getChildFormatContext(prevContext, type, props);
          task.keyPath = keyPath;
          renderNode(request, task, children, -1);
          task.formatContext = prevContext;
          task.keyPath = prevKeyPath$jscomp$0;
        } else {
          var children$42 = pushStartInstance(
            segment.chunks,
            type,
            props,
            request.resumableState,
            request.renderState,
            task.blockedPreamble,
            task.hoistableState,
            task.formatContext,
            segment.lastPushedText
          );
          segment.lastPushedText = false;
          var prevContext$43 = task.formatContext, prevKeyPath$44 = task.keyPath;
          task.keyPath = keyPath;
          if (3 === (task.formatContext = getChildFormatContext(
            prevContext$43,
            type,
            props
          )).insertionMode) {
            var preambleSegment = createPendingSegment(
              request,
              0,
              null,
              task.formatContext,
              false,
              false
            );
            segment.preambleChildren.push(preambleSegment);
            task.blockedSegment = preambleSegment;
            try {
              renderNode(request, task, children$42, -1), preambleSegment.lastPushedText && preambleSegment.textEmbedded && preambleSegment.chunks.push(textSeparator), preambleSegment.status = 1, finishedSegment(request, task.blockedBoundary, preambleSegment);
            } finally {
              task.blockedSegment = segment;
            }
          } else renderNode(request, task, children$42, -1);
          task.formatContext = prevContext$43;
          task.keyPath = prevKeyPath$44;
          a: {
            var target = segment.chunks, resumableState = request.resumableState;
            switch (type) {
              case "title":
              case "style":
              case "script":
              case "area":
              case "base":
              case "br":
              case "col":
              case "embed":
              case "hr":
              case "img":
              case "input":
              case "keygen":
              case "link":
              case "meta":
              case "param":
              case "source":
              case "track":
              case "wbr":
                break a;
              case "body":
                if (1 >= prevContext$43.insertionMode) {
                  resumableState.hasBody = true;
                  break a;
                }
                break;
              case "html":
                if (0 === prevContext$43.insertionMode) {
                  resumableState.hasHtml = true;
                  break a;
                }
                break;
              case "head":
                if (1 >= prevContext$43.insertionMode) break a;
            }
            target.push(endChunkForTag(type));
          }
          segment.lastPushedText = false;
        }
      } else {
        switch (type) {
          case REACT_LEGACY_HIDDEN_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_FRAGMENT_TYPE:
            var prevKeyPath$jscomp$1 = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, props.children, -1);
            task.keyPath = prevKeyPath$jscomp$1;
            return;
          case REACT_ACTIVITY_TYPE:
            var segment$jscomp$0 = task.blockedSegment;
            if (null === segment$jscomp$0) {
              if ("hidden" !== props.mode) {
                var prevKeyPath$jscomp$2 = task.keyPath;
                task.keyPath = keyPath;
                renderNode(request, task, props.children, -1);
                task.keyPath = prevKeyPath$jscomp$2;
              }
            } else if ("hidden" !== props.mode) {
              segment$jscomp$0.chunks.push(startActivityBoundary);
              segment$jscomp$0.lastPushedText = false;
              var prevKeyPath$47 = task.keyPath;
              task.keyPath = keyPath;
              renderNode(request, task, props.children, -1);
              task.keyPath = prevKeyPath$47;
              segment$jscomp$0.chunks.push(endActivityBoundary);
              segment$jscomp$0.lastPushedText = false;
            }
            return;
          case REACT_SUSPENSE_LIST_TYPE:
            a: {
              var children$jscomp$0 = props.children, revealOrder = props.revealOrder;
              if ("independent" !== revealOrder && "together" !== revealOrder) {
                if (isArrayImpl(children$jscomp$0)) {
                  renderSuspenseListRows(
                    request,
                    task,
                    keyPath,
                    children$jscomp$0,
                    revealOrder
                  );
                  break a;
                }
                var iteratorFn = getIteratorFn(children$jscomp$0);
                if (iteratorFn) {
                  var iterator = iteratorFn.call(children$jscomp$0);
                  if (iterator) {
                    var step = iterator.next();
                    if (!step.done) {
                      do
                        step = iterator.next();
                      while (!step.done);
                      renderSuspenseListRows(
                        request,
                        task,
                        keyPath,
                        children$jscomp$0,
                        revealOrder
                      );
                    }
                    break a;
                  }
                }
              }
              if ("together" === revealOrder) {
                var prevKeyPath$41 = task.keyPath, prevRow = task.row, newRow = task.row = createSuspenseListRow(null);
                newRow.boundaries = [];
                newRow.together = true;
                task.keyPath = keyPath;
                renderNodeDestructive(request, task, children$jscomp$0, -1);
                0 === --newRow.pendingTasks && finishSuspenseListRow(request, newRow);
                task.keyPath = prevKeyPath$41;
                task.row = prevRow;
                null !== prevRow && 0 < newRow.pendingTasks && (prevRow.pendingTasks++, newRow.next = prevRow);
              } else {
                var prevKeyPath$jscomp$3 = task.keyPath;
                task.keyPath = keyPath;
                renderNodeDestructive(request, task, children$jscomp$0, -1);
                task.keyPath = prevKeyPath$jscomp$3;
              }
            }
            return;
          case REACT_VIEW_TRANSITION_TYPE:
            var prevContext$jscomp$0 = task.formatContext, prevKeyPath$jscomp$4 = task.keyPath;
            var resumableState$jscomp$0 = request.resumableState;
            if (null != props.name && "auto" !== props.name)
              var JSCompiler_inline_result$jscomp$2 = props.name;
            else {
              var treeId = getTreeId(task.treeContext);
              JSCompiler_inline_result$jscomp$2 = makeId(
                resumableState$jscomp$0,
                treeId,
                0
              );
            }
            var autoName = JSCompiler_inline_result$jscomp$2, resumableState$jscomp$1 = request.resumableState, update = getViewTransitionClassName(props.default, props.update), enter = getViewTransitionClassName(props.default, props.enter), exit = getViewTransitionClassName(props.default, props.exit), share = getViewTransitionClassName(props.default, props.share), name = props.name;
            null == update && (update = "auto");
            null == enter && (enter = "auto");
            null == exit && (exit = "auto");
            if (null == name) {
              var parentViewTransition = prevContext$jscomp$0.viewTransition;
              null !== parentViewTransition ? (name = parentViewTransition.name, share = parentViewTransition.share) : (name = "auto", share = "none");
            } else
              null == share && (share = "auto"), prevContext$jscomp$0.tagScope & 4 && (resumableState$jscomp$1.instructions |= 128);
            prevContext$jscomp$0.tagScope & 8 ? resumableState$jscomp$1.instructions |= 128 : exit = "none";
            prevContext$jscomp$0.tagScope & 16 ? resumableState$jscomp$1.instructions |= 128 : enter = "none";
            var viewTransition = {
              update,
              enter,
              exit,
              share,
              parentEnter: "none",
              parentExit: "none",
              name,
              autoName,
              nameIdx: 0
            }, subtreeScope = prevContext$jscomp$0.tagScope & -25;
            subtreeScope = "none" !== update ? subtreeScope | 32 : subtreeScope & -33;
            "none" !== enter && (subtreeScope |= 64);
            var JSCompiler_inline_result$jscomp$3 = createFormatContext(
              prevContext$jscomp$0.insertionMode,
              prevContext$jscomp$0.selectedValue,
              subtreeScope,
              viewTransition
            );
            task.formatContext = JSCompiler_inline_result$jscomp$3;
            task.keyPath = keyPath;
            if (null != props.name && "auto" !== props.name)
              renderNodeDestructive(request, task, props.children, -1);
            else {
              var prevTreeContext = task.treeContext;
              task.treeContext = pushTreeContext(prevTreeContext, 1, 0);
              renderNode(request, task, props.children, -1);
              task.treeContext = prevTreeContext;
            }
            task.formatContext = prevContext$jscomp$0;
            task.keyPath = prevKeyPath$jscomp$4;
            return;
          case REACT_SCOPE_TYPE:
            throw Error("ReactDOMServer does not yet support scope components.");
          case REACT_SUSPENSE_TYPE:
            a: if (null !== task.replay) {
              var prevKeyPath$27 = task.keyPath, prevContext$28 = task.formatContext, prevRow$29 = task.row;
              task.keyPath = keyPath;
              task.formatContext = getSuspenseContentFormatContext(
                request.resumableState,
                prevContext$28
              );
              task.row = null;
              var content$30 = props.children;
              try {
                renderNode(request, task, content$30, -1);
              } finally {
                task.keyPath = prevKeyPath$27, task.formatContext = prevContext$28, task.row = prevRow$29;
              }
            } else {
              var prevKeyPath$jscomp$5 = task.keyPath, prevContext$jscomp$1 = task.formatContext, prevRow$jscomp$0 = task.row, parentBoundary = task.blockedBoundary, parentPreamble = task.blockedPreamble, parentHoistableState = task.hoistableState, parentSegment = task.blockedSegment, fallback = props.fallback, content = props.children, fallbackAbortSet = /* @__PURE__ */ new Set(), newBoundary = createSuspenseBoundary(
                request,
                task.row,
                fallbackAbortSet,
                2 > task.formatContext.insertionMode ? {
                  content: createPreambleState(),
                  fallback: createPreambleState()
                } : null,
                false
              ), boundarySegment = createPendingSegment(
                request,
                parentSegment.chunks.length,
                newBoundary,
                task.formatContext,
                false,
                false
              );
              parentSegment.children.push(boundarySegment);
              parentSegment.lastPushedText = false;
              var contentRootSegment = createPendingSegment(
                request,
                0,
                null,
                task.formatContext,
                false,
                false
              );
              contentRootSegment.parentFlushed = true;
              var trackedPostpones = request.trackedPostpones;
              if (null !== trackedPostpones) {
                var suspenseComponentStack = task.componentStack, fallbackKeyPath = [keyPath[0], "Suspense Fallback", keyPath[2]];
                if (null !== trackedPostpones) {
                  var fallbackReplayNode = [
                    fallbackKeyPath[1],
                    fallbackKeyPath[2],
                    [],
                    null
                  ];
                  trackedPostpones.workingMap.set(
                    fallbackKeyPath,
                    fallbackReplayNode
                  );
                  newBoundary.tracked = {
                    contentKeyPath: keyPath,
                    fallbackNode: fallbackReplayNode
                  };
                }
                task.blockedSegment = boundarySegment;
                task.blockedPreamble = null === newBoundary.preamble ? null : newBoundary.preamble.fallback;
                task.keyPath = fallbackKeyPath;
                task.formatContext = getSuspenseFallbackFormatContext(
                  request.resumableState,
                  prevContext$jscomp$1
                );
                task.componentStack = replaceSuspenseComponentStackWithSuspenseFallbackStack(
                  suspenseComponentStack
                );
                try {
                  renderNode(request, task, fallback, -1), boundarySegment.lastPushedText && boundarySegment.textEmbedded && boundarySegment.chunks.push(textSeparator), boundarySegment.status = 1, finishedSegment(request, parentBoundary, boundarySegment);
                } catch (thrownValue) {
                  throw boundarySegment.status = request.aborted ? 3 : 4, thrownValue;
                } finally {
                  task.blockedSegment = parentSegment, task.blockedPreamble = parentPreamble, task.keyPath = prevKeyPath$jscomp$5, task.formatContext = prevContext$jscomp$1;
                }
                var suspendedPrimaryTask = createRenderTask(
                  request,
                  null,
                  content,
                  -1,
                  newBoundary,
                  contentRootSegment,
                  null === newBoundary.preamble ? null : newBoundary.preamble.content,
                  newBoundary.contentState,
                  task.abortSet,
                  keyPath,
                  getSuspenseContentFormatContext(
                    request.resumableState,
                    task.formatContext
                  ),
                  task.context,
                  task.treeContext,
                  null,
                  suspenseComponentStack
                );
                pushComponentStack(suspendedPrimaryTask);
                request.pingedTasks.push(suspendedPrimaryTask);
              } else {
                task.blockedBoundary = newBoundary;
                task.blockedPreamble = null === newBoundary.preamble ? null : newBoundary.preamble.content;
                task.hoistableState = newBoundary.contentState;
                task.blockedSegment = contentRootSegment;
                task.keyPath = keyPath;
                task.formatContext = getSuspenseContentFormatContext(
                  request.resumableState,
                  prevContext$jscomp$1
                );
                task.row = null;
                try {
                  if (renderNode(request, task, content, -1), contentRootSegment.lastPushedText && contentRootSegment.textEmbedded && contentRootSegment.chunks.push(textSeparator), contentRootSegment.status = 1, finishedSegment(request, newBoundary, contentRootSegment), queueCompletedSegment(newBoundary, contentRootSegment), 0 === newBoundary.pendingTasks && 0 === newBoundary.status) {
                    if (newBoundary.status = 1, !isEligibleForOutlining(request, newBoundary)) {
                      null !== prevRow$jscomp$0 && 0 === --prevRow$jscomp$0.pendingTasks && finishSuspenseListRow(request, prevRow$jscomp$0);
                      0 === request.pendingRootTasks && task.blockedPreamble && preparePreamble(request);
                      break a;
                    }
                  } else
                    null !== prevRow$jscomp$0 && prevRow$jscomp$0.together && tryToResolveTogetherRow(request, prevRow$jscomp$0);
                } catch (thrownValue$31) {
                  newBoundary.status = 4;
                  if (request.aborted) {
                    contentRootSegment.status = 3;
                    var error = request.fatalError;
                  } else contentRootSegment.status = 4, error = thrownValue$31;
                  var thrownInfo = getThrownInfo(task.componentStack), errorDigest = logRecoverableError(request, error, thrownInfo);
                  newBoundary.errorDigest = errorDigest;
                  untrackBoundary(request, newBoundary);
                } finally {
                  task.blockedBoundary = parentBoundary, task.blockedPreamble = parentPreamble, task.hoistableState = parentHoistableState, task.blockedSegment = parentSegment, task.keyPath = prevKeyPath$jscomp$5, task.formatContext = prevContext$jscomp$1, task.row = prevRow$jscomp$0;
                }
                var suspendedFallbackTask = createRenderTask(
                  request,
                  null,
                  fallback,
                  -1,
                  parentBoundary,
                  boundarySegment,
                  null === newBoundary.preamble ? null : newBoundary.preamble.fallback,
                  newBoundary.fallbackState,
                  fallbackAbortSet,
                  [keyPath[0], "Suspense Fallback", keyPath[2]],
                  getSuspenseFallbackFormatContext(
                    request.resumableState,
                    task.formatContext
                  ),
                  task.context,
                  task.treeContext,
                  task.row,
                  replaceSuspenseComponentStackWithSuspenseFallbackStack(
                    task.componentStack
                  )
                );
                pushComponentStack(suspendedFallbackTask);
                request.pingedTasks.push(suspendedFallbackTask);
              }
            }
            return;
        }
        if ("object" === typeof type && null !== type)
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              if ("ref" in props) {
                var propsWithoutRef = {};
                for (var key in props)
                  "ref" !== key && (propsWithoutRef[key] = props[key]);
              } else propsWithoutRef = props;
              var children$jscomp$1 = renderWithHooks(
                request,
                task,
                keyPath,
                type.render,
                propsWithoutRef,
                ref
              );
              finishFunctionComponent(
                request,
                task,
                keyPath,
                children$jscomp$1,
                0 !== localIdCounter,
                actionStateCounter,
                actionStateMatchingIndex
              );
              return;
            case REACT_MEMO_TYPE:
              renderElement(request, task, keyPath, type.type, props, ref);
              return;
            case REACT_CONTEXT_TYPE:
              var children$jscomp$2 = props.children, prevKeyPath$jscomp$6 = task.keyPath, nextValue = props.value;
              var prevValue = type._currentValue;
              type._currentValue = nextValue;
              var prevNode = currentActiveSnapshot, newNode = {
                parent: prevNode,
                depth: null === prevNode ? 0 : prevNode.depth + 1,
                context: type,
                parentValue: prevValue,
                value: nextValue
              };
              currentActiveSnapshot = newNode;
              task.context = newNode;
              task.keyPath = keyPath;
              renderNodeDestructive(request, task, children$jscomp$2, -1);
              var prevSnapshot = currentActiveSnapshot;
              if (null === prevSnapshot)
                throw Error(
                  "Tried to pop a Context at the root of the app. This is a bug in React."
                );
              prevSnapshot.context._currentValue = prevSnapshot.parentValue;
              var JSCompiler_inline_result$jscomp$4 = currentActiveSnapshot = prevSnapshot.parent;
              task.context = JSCompiler_inline_result$jscomp$4;
              task.keyPath = prevKeyPath$jscomp$6;
              return;
            case REACT_CONSUMER_TYPE:
              var render = props.children, newChildren = render(type._context._currentValue), prevKeyPath$jscomp$7 = task.keyPath;
              task.keyPath = keyPath;
              renderNodeDestructive(request, task, newChildren, -1);
              task.keyPath = prevKeyPath$jscomp$7;
              return;
            case REACT_LAZY_TYPE:
              var init = type._init;
              var Component = init(type._payload);
              if (request.aborted) throw null;
              renderElement(request, task, keyPath, Component, props, ref);
              return;
          }
        throw Error(
          "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + ((null == type ? type : typeof type) + ".")
        );
      }
    }
    function resumeNode(request, task, segmentId, node, childIndex) {
      var prevReplay = task.replay, blockedBoundary = task.blockedBoundary, resumedSegment = createPendingSegment(
        request,
        0,
        null,
        task.formatContext,
        false,
        false
      );
      resumedSegment.id = segmentId;
      resumedSegment.parentFlushed = true;
      try {
        task.replay = null, task.blockedSegment = resumedSegment, renderNode(request, task, node, childIndex), resumedSegment.status = 1, finishedSegment(request, blockedBoundary, resumedSegment), null === blockedBoundary ? request.completedRootSegment = resumedSegment : (queueCompletedSegment(blockedBoundary, resumedSegment), blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary));
      } finally {
        task.replay = prevReplay, task.blockedSegment = null;
      }
    }
    function renderNodeDestructive(request, task, node, childIndex) {
      null !== task.replay && "number" === typeof task.replay.slots ? resumeNode(request, task, task.replay.slots, node, childIndex) : (task.node = node, task.childIndex = childIndex, node = task.componentStack, pushComponentStack(task), retryNode(request, task), task.componentStack = node);
    }
    function retryNode(request, task) {
      var node = task.node, childIndex = task.childIndex;
      if (null !== node) {
        if ("object" === typeof node) {
          switch (node.$$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = node.type, key = node.key, props = node.props;
              node = props.ref;
              var ref = void 0 !== node ? node : null, name = getComponentNameFromType(type), keyOrIndex = null == key || key === REACT_OPTIMISTIC_KEY ? -1 === childIndex ? 0 : childIndex : key;
              key = [task.keyPath, name, keyOrIndex];
              if (null !== task.replay)
                a: {
                  var replay = task.replay;
                  childIndex = replay.nodes;
                  for (node = 0; node < childIndex.length; node++) {
                    var node$jscomp$0 = childIndex[node];
                    if (keyOrIndex === node$jscomp$0[1]) {
                      if (4 === node$jscomp$0.length) {
                        if (null !== name && name !== node$jscomp$0[0])
                          throw Error(
                            "Expected the resume to render <" + node$jscomp$0[0] + "> in this slot but instead it rendered <" + name + ">. The tree doesn't match so React will fallback to client rendering."
                          );
                        var childNodes = node$jscomp$0[2], childSlots = node$jscomp$0[3], currentNode = task.node;
                        task.replay = {
                          nodes: childNodes,
                          slots: childSlots,
                          pendingTasks: 1
                        };
                        try {
                          renderElement(request, task, key, type, props, ref);
                          if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                            throw Error(
                              "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                            );
                          task.replay.pendingTasks--;
                        } catch (x) {
                          if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then || "Maximum call stack size exceeded" === x.message))
                            throw task.node === currentNode ? task.replay = replay : childIndex.splice(node, 1), x;
                          task.replay.pendingTasks--;
                          key = getThrownInfo(task.componentStack);
                          currentNode = request;
                          props = task.blockedBoundary;
                          request = request.aborted ? request.fatalError : x;
                          key = logRecoverableError(currentNode, request, key);
                          abortRemainingReplayNodes(
                            currentNode,
                            props,
                            childNodes,
                            childSlots,
                            request,
                            key
                          );
                        }
                        task.replay = replay;
                      } else {
                        if (type !== REACT_SUSPENSE_TYPE)
                          throw Error(
                            "Expected the resume to render <Suspense> in this slot but instead it rendered <" + (getComponentNameFromType(type) || "Unknown") + ">. The tree doesn't match so React will fallback to client rendering."
                          );
                        b: {
                          replay = node$jscomp$0[5];
                          type = node$jscomp$0[2];
                          ref = node$jscomp$0[3];
                          name = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
                          node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
                          keyOrIndex = task.keyPath;
                          var prevContext = task.formatContext, prevRow = task.row, previousReplaySet = task.replay, parentBoundary = task.blockedBoundary, parentHoistableState = task.hoistableState, content = props.children;
                          props = props.fallback;
                          var fallbackAbortSet = /* @__PURE__ */ new Set(), resumedBoundary = createSuspenseBoundary(
                            request,
                            task.row,
                            fallbackAbortSet,
                            2 > task.formatContext.insertionMode ? {
                              content: createPreambleState(),
                              fallback: createPreambleState()
                            } : null,
                            false
                          );
                          resumedBoundary.parentFlushed = true;
                          resumedBoundary.rootSegmentID = replay;
                          task.blockedBoundary = resumedBoundary;
                          task.hoistableState = resumedBoundary.contentState;
                          task.keyPath = key;
                          task.formatContext = getSuspenseContentFormatContext(
                            request.resumableState,
                            prevContext
                          );
                          task.row = null;
                          task.replay = {
                            nodes: type,
                            slots: ref,
                            pendingTasks: 1
                          };
                          try {
                            renderNode(request, task, content, -1);
                            if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                              throw Error(
                                "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                              );
                            task.replay.pendingTasks--;
                            if (0 === resumedBoundary.pendingTasks && 0 === resumedBoundary.status) {
                              resumedBoundary.status = 1;
                              request.completedBoundaries.push(resumedBoundary);
                              break b;
                            }
                          } catch (thrownValue) {
                            resumedBoundary.status = 4, childNodes = request.aborted ? request.fatalError : thrownValue, childSlots = getThrownInfo(task.componentStack), currentNode = logRecoverableError(
                              request,
                              childNodes,
                              childSlots
                            ), resumedBoundary.errorDigest = currentNode, task.replay.pendingTasks--, request.clientRenderedBoundaries.push(
                              resumedBoundary
                            );
                          } finally {
                            task.blockedBoundary = parentBoundary, task.hoistableState = parentHoistableState, task.replay = previousReplaySet, task.keyPath = keyOrIndex, task.formatContext = prevContext, task.row = prevRow;
                          }
                          childNodes = createReplayTask(
                            request,
                            null,
                            { nodes: name, slots: node$jscomp$0, pendingTasks: 0 },
                            props,
                            -1,
                            parentBoundary,
                            resumedBoundary.fallbackState,
                            fallbackAbortSet,
                            [key[0], "Suspense Fallback", key[2]],
                            getSuspenseFallbackFormatContext(
                              request.resumableState,
                              task.formatContext
                            ),
                            task.context,
                            task.treeContext,
                            task.row,
                            replaceSuspenseComponentStackWithSuspenseFallbackStack(
                              task.componentStack
                            )
                          );
                          pushComponentStack(childNodes);
                          request.pingedTasks.push(childNodes);
                        }
                      }
                      childIndex.splice(node, 1);
                      break a;
                    }
                  }
                }
              else renderElement(request, task, key, type, props, ref);
              return;
            case REACT_PORTAL_TYPE:
              throw Error(
                "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render."
              );
            case REACT_LAZY_TYPE:
              childNodes = node._init;
              node = childNodes(node._payload);
              if (request.aborted) throw null;
              renderNodeDestructive(request, task, node, childIndex);
              return;
          }
          if (isArrayImpl(node)) {
            renderChildrenArray(request, task, node, childIndex);
            return;
          }
          if (childNodes = getIteratorFn(node)) {
            if (childNodes = childNodes.call(node)) {
              node = childNodes.next();
              if (!node.done) {
                childSlots = [];
                do
                  childSlots.push(node.value), node = childNodes.next();
                while (!node.done);
                renderChildrenArray(request, task, childSlots, childIndex);
              }
              return;
            }
          }
          if ("function" === typeof node.then)
            return task.thenableState = null, renderNodeDestructive(request, task, unwrapThenable(node), childIndex);
          if (node.$$typeof === REACT_CONTEXT_TYPE)
            return renderNodeDestructive(
              request,
              task,
              node._currentValue,
              childIndex
            );
          childIndex = Object.prototype.toString.call(node);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === childIndex ? "object with keys {" + Object.keys(node).join(", ") + "}" : childIndex) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        if ("string" === typeof node)
          childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
            childIndex.chunks,
            node,
            request.renderState,
            childIndex.lastPushedText
          ));
        else if ("number" === typeof node || "bigint" === typeof node)
          childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
            childIndex.chunks,
            "" + node,
            request.renderState,
            childIndex.lastPushedText
          ));
      }
    }
    function renderChildrenArray(request, task, children, childIndex) {
      var prevKeyPath = task.keyPath;
      if (-1 !== childIndex && (task.keyPath = [task.keyPath, "Fragment", childIndex], null !== task.replay)) {
        for (var replay = task.replay, replayNodes = replay.nodes, j = 0; j < replayNodes.length; j++) {
          var node = replayNodes[j];
          if (node[1] === childIndex) {
            childIndex = node[2];
            node = node[3];
            task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
            try {
              renderChildrenArray(request, task, children, -1);
              if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                throw Error(
                  "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                );
              task.replay.pendingTasks--;
            } catch (x) {
              if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then))
                throw x;
              task.replay.pendingTasks--;
              var thrownInfo = getThrownInfo(task.componentStack);
              children = request;
              var boundary = task.blockedBoundary;
              request = request.aborted ? request.fatalError : x;
              thrownInfo = logRecoverableError(children, request, thrownInfo);
              abortRemainingReplayNodes(
                children,
                boundary,
                childIndex,
                node,
                request,
                thrownInfo
              );
            }
            task.replay = replay;
            replayNodes.splice(j, 1);
            break;
          }
        }
        task.keyPath = prevKeyPath;
        return;
      }
      replay = task.treeContext;
      replayNodes = children.length;
      if (null !== task.replay && (j = task.replay.slots, null !== j && "object" === typeof j)) {
        for (childIndex = 0; childIndex < replayNodes; childIndex++)
          node = children[childIndex], task.treeContext = pushTreeContext(replay, replayNodes, childIndex), boundary = j[childIndex], "number" === typeof boundary ? (resumeNode(request, task, boundary, node, childIndex), delete j[childIndex]) : renderNode(request, task, node, childIndex);
        task.treeContext = replay;
        task.keyPath = prevKeyPath;
        return;
      }
      for (j = 0; j < replayNodes; j++)
        childIndex = children[j], task.treeContext = pushTreeContext(replay, replayNodes, j), renderNode(request, task, childIndex, j);
      task.treeContext = replay;
      task.keyPath = prevKeyPath;
    }
    function trackPostponedBoundary(request, trackedPostpones, boundary) {
      boundary.status = 5;
      boundary.rootSegmentID = request.nextSegmentId++;
      var tracked = boundary.tracked;
      if (null === tracked)
        throw Error(
          "It should not be possible to postpone at the root. This is a bug in React."
        );
      request = tracked.contentKeyPath;
      if (null === request)
        throw Error(
          "It should not be possible to postpone at the root. This is a bug in React."
        );
      tracked = tracked.fallbackNode;
      var children = [], boundaryNode = trackedPostpones.workingMap.get(request);
      if (void 0 === boundaryNode)
        return boundary = [
          request[1],
          request[2],
          children,
          null,
          tracked,
          boundary.rootSegmentID
        ], trackedPostpones.workingMap.set(request, boundary), addToReplayParent(boundary, request[0], trackedPostpones), boundary;
      boundaryNode[4] = tracked;
      boundaryNode[5] = boundary.rootSegmentID;
      return boundaryNode;
    }
    function trackPostpone(request, trackedPostpones, task, segment) {
      segment.status = 5;
      var keyPath = task.keyPath, boundary = task.blockedBoundary;
      if (null === boundary)
        segment.id = request.nextSegmentId++, trackedPostpones.rootSlots = segment.id, null !== request.completedRootSegment && (request.completedRootSegment.status = 5);
      else {
        if (null !== boundary && 0 === boundary.status) {
          var boundaryNode = trackPostponedBoundary(
            request,
            trackedPostpones,
            boundary
          );
          if (null !== boundary.tracked && boundary.tracked.contentKeyPath === keyPath && -1 === task.childIndex) {
            -1 === segment.id && (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
            boundaryNode[3] = segment.id;
            return;
          }
        }
        -1 === segment.id && (segment.id = segment.parentFlushed && null !== boundary ? boundary.rootSegmentID : request.nextSegmentId++);
        if (-1 === task.childIndex)
          null === keyPath ? trackedPostpones.rootSlots = segment.id : (task = trackedPostpones.workingMap.get(keyPath), void 0 === task ? (task = [keyPath[1], keyPath[2], [], segment.id], addToReplayParent(task, keyPath[0], trackedPostpones)) : task[3] = segment.id);
        else {
          if (null === keyPath)
            if (request = trackedPostpones.rootSlots, null === request)
              request = trackedPostpones.rootSlots = {};
            else {
              if ("number" === typeof request)
                throw Error(
                  "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React."
                );
            }
          else if (boundary = trackedPostpones.workingMap, boundaryNode = boundary.get(keyPath), void 0 === boundaryNode)
            request = {}, boundaryNode = [keyPath[1], keyPath[2], [], request], boundary.set(keyPath, boundaryNode), addToReplayParent(boundaryNode, keyPath[0], trackedPostpones);
          else if (request = boundaryNode[3], null === request)
            request = boundaryNode[3] = {};
          else if ("number" === typeof request)
            throw Error(
              "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React."
            );
          request[task.childIndex] = segment.id;
        }
      }
    }
    function untrackBoundary(request, boundary) {
      request = request.trackedPostpones;
      null !== request && (boundary = boundary.tracked, null !== boundary && (boundary = boundary.contentKeyPath, null !== boundary && (request = request.workingMap.get(boundary), void 0 !== request && (request.length = 4, request[2] = [], request[3] = null))));
    }
    function spawnNewSuspendedReplayTask(request, task, thenableState2) {
      return createReplayTask(
        request,
        thenableState2,
        task.replay,
        task.node,
        task.childIndex,
        task.blockedBoundary,
        task.hoistableState,
        task.abortSet,
        task.keyPath,
        task.formatContext,
        task.context,
        task.treeContext,
        task.row,
        task.componentStack
      );
    }
    function spawnNewSuspendedRenderTask(request, task, thenableState2) {
      var segment = task.blockedSegment, newSegment = createPendingSegment(
        request,
        segment.chunks.length,
        null,
        task.formatContext,
        segment.lastPushedText,
        true
      );
      segment.children.push(newSegment);
      segment.lastPushedText = false;
      return createRenderTask(
        request,
        thenableState2,
        task.node,
        task.childIndex,
        task.blockedBoundary,
        newSegment,
        task.blockedPreamble,
        task.hoistableState,
        task.abortSet,
        task.keyPath,
        task.formatContext,
        task.context,
        task.treeContext,
        task.row,
        task.componentStack
      );
    }
    function renderNode(request, task, node, childIndex) {
      var previousFormatContext = task.formatContext, previousContext = task.context, previousKeyPath = task.keyPath, previousTreeContext = task.treeContext, previousComponentStack = task.componentStack, segment = task.blockedSegment;
      if (null === segment) {
        segment = task.replay;
        try {
          return renderNodeDestructive(request, task, node, childIndex);
        } catch (thrownValue) {
          if (resetHooksState(), node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, !request.aborted && "object" === typeof node && null !== node) {
            if ("function" === typeof node.then) {
              childIndex = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
              request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
              node.then(request.resolve, request.reject);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              task.replay = segment;
              switchContext(previousContext);
              return;
            }
            if ("Maximum call stack size exceeded" === node.message) {
              node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
              node = spawnNewSuspendedReplayTask(request, task, node);
              request.pingedTasks.push(node);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              task.replay = segment;
              switchContext(previousContext);
              return;
            }
          }
        }
      } else {
        var childrenLength = segment.children.length, chunkLength = segment.chunks.length;
        try {
          return renderNodeDestructive(request, task, node, childIndex);
        } catch (thrownValue$64) {
          if (resetHooksState(), segment.children.length = childrenLength, segment.chunks.length = chunkLength, node = thrownValue$64 === SuspenseException ? getSuspendedThenable() : thrownValue$64, !request.aborted && "object" === typeof node && null !== node) {
            if ("function" === typeof node.then) {
              segment = node;
              node = thrownValue$64 === SuspenseException ? getThenableStateAfterSuspending() : null;
              request = spawnNewSuspendedRenderTask(request, task, node).ping;
              segment.then(request.resolve, request.reject);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
            if ("Maximum call stack size exceeded" === node.message) {
              segment = thrownValue$64 === SuspenseException ? getThenableStateAfterSuspending() : null;
              segment = spawnNewSuspendedRenderTask(request, task, segment);
              request.pingedTasks.push(segment);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
          }
        }
      }
      task.formatContext = previousFormatContext;
      task.context = previousContext;
      task.keyPath = previousKeyPath;
      task.treeContext = previousTreeContext;
      switchContext(previousContext);
      throw node;
    }
    function abortTaskSoft(task) {
      var boundary = task.blockedBoundary, segment = task.blockedSegment;
      null !== segment && (segment.status = 3, finishedTask(this, boundary, task.row, segment));
    }
    function abortRemainingReplayNodes(request$jscomp$0, boundary, nodes, slots, error, errorDigest$jscomp$0) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (4 === node.length)
          abortRemainingReplayNodes(
            request$jscomp$0,
            boundary,
            node[2],
            node[3],
            error,
            errorDigest$jscomp$0
          );
        else {
          node = node[5];
          var request = request$jscomp$0, errorDigest = errorDigest$jscomp$0, resumedBoundary = createSuspenseBoundary(
            request,
            null,
            /* @__PURE__ */ new Set(),
            null,
            false
          );
          resumedBoundary.parentFlushed = true;
          resumedBoundary.rootSegmentID = node;
          resumedBoundary.status = 4;
          resumedBoundary.errorDigest = errorDigest;
          resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
        }
      }
      nodes.length = 0;
      if (null !== slots) {
        if (null === boundary)
          throw Error(
            "We should not have any resumable nodes in the shell. This is a bug in React."
          );
        4 !== boundary.status && (boundary.status = 4, boundary.errorDigest = errorDigest$jscomp$0, boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
        if ("object" === typeof slots) for (var index in slots) delete slots[index];
      }
    }
    function abortTask(task, request) {
      if (task !== request.currentTask) {
        var boundary = task.blockedBoundary;
        task = task.blockedSegment;
        null !== task && (task.status = 3);
        null !== boundary && boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
          return abortTask(fallbackTask, request);
        });
      }
    }
    function finishAbortedTask(task, request, error) {
      if (task !== request.currentTask) {
        var boundary = task.blockedBoundary, segment = task.blockedSegment;
        if (null === segment || 3 === segment.status) {
          var errorInfo = getThrownInfo(task.componentStack), isRecoverableReason = isRecoverableError(error);
          if (null === boundary) {
            boundary = task.replay;
            if (null === boundary) {
              isRecoverableReason || null === request.trackedPostpones || null === segment ? isRecoverableReason ? (task = cloneRecoverableErrorAsFatal(error), logRecoverableError(request, task, errorInfo), 12 !== request.status && 13 !== request.status && fatalError(request, task)) : (logRecoverableError(request, error, errorInfo), 12 !== request.status && 13 !== request.status && fatalError(request, error)) : (boundary = request.trackedPostpones, logRecoverableError(request, error, errorInfo), trackPostpone(request, boundary, task, segment), finishedTask(request, null, task.row, segment));
              return;
            }
            12 !== request.status && 13 !== request.status && (boundary.pendingTasks--, 0 === boundary.pendingTasks && 0 < boundary.nodes.length && (errorInfo = logRecoverableError(request, error, errorInfo), abortRemainingReplayNodes(
              request,
              null,
              boundary.nodes,
              boundary.slots,
              error,
              errorInfo
            )), request.pendingRootTasks--, 0 === request.pendingRootTasks && completeShell(request));
          } else {
            var trackedPostpones$65 = request.trackedPostpones;
            if (4 !== boundary.status) {
              if (!isRecoverableReason && null !== trackedPostpones$65 && null !== segment)
                return logRecoverableError(request, error, errorInfo), trackPostpone(request, trackedPostpones$65, task, segment), boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
                  return finishAbortedTask(fallbackTask, request, error);
                }), boundary.fallbackAbortableTasks.clear(), finishedTask(request, boundary, task.row, segment);
              boundary.status = 4;
              errorInfo = logRecoverableError(request, error, errorInfo);
              boundary.errorDigest = errorInfo;
              untrackBoundary(request, boundary);
              boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
            }
            boundary.pendingTasks--;
            errorInfo = boundary.row;
            null !== errorInfo && 0 === --errorInfo.pendingTasks && finishSuspenseListRow(request, errorInfo);
            boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
              return finishAbortedTask(fallbackTask, request, error);
            });
            boundary.fallbackAbortableTasks.clear();
          }
          task = task.row;
          null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
          request.allPendingTasks--;
          0 === request.allPendingTasks && completeAll(request);
        }
      }
    }
    function safelyEmitEarlyPreloads(request, shellComplete) {
      try {
        var renderState = request.renderState, onHeaders = renderState.onHeaders;
        if (onHeaders) {
          var headers = renderState.headers;
          if (headers) {
            renderState.headers = null;
            var linkHeader = headers.preconnects;
            headers.fontPreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.fontPreloads);
            headers.highImagePreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.highImagePreloads);
            if (!shellComplete) {
              var queueIter = renderState.styles.values(), queueStep = queueIter.next();
              b: for (; 0 < headers.remainingCapacity && !queueStep.done; queueStep = queueIter.next())
                for (var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next(); 0 < headers.remainingCapacity && !sheetStep.done; sheetStep = sheetIter.next()) {
                  var sheet = sheetStep.value, props = sheet.props, key = props.href, props$jscomp$0 = sheet.props, header = getPreloadAsHeader(props$jscomp$0.href, "style", {
                    crossOrigin: props$jscomp$0.crossOrigin,
                    integrity: props$jscomp$0.integrity,
                    nonce: props$jscomp$0.nonce,
                    type: props$jscomp$0.type,
                    fetchPriority: props$jscomp$0.fetchPriority,
                    referrerPolicy: props$jscomp$0.referrerPolicy,
                    media: props$jscomp$0.media
                  });
                  if (0 <= (headers.remainingCapacity -= header.length + 2))
                    renderState.resets.style[key] = PRELOAD_NO_CREDS, linkHeader && (linkHeader += ", "), linkHeader += header, renderState.resets.style[key] = "string" === typeof props.crossOrigin || "string" === typeof props.integrity ? [props.crossOrigin, props.integrity] : PRELOAD_NO_CREDS;
                  else break b;
                }
            }
            linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
          }
        }
      } catch (error) {
        logRecoverableError(request, error, {});
      }
    }
    function completeShell(request) {
      null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
      null === request.trackedPostpones && preparePreamble(request);
      request = request.onShellReady;
      request();
    }
    function completeAll(request) {
      safelyEmitEarlyPreloads(
        request,
        null === request.trackedPostpones ? true : null === request.completedRootSegment || 5 !== request.completedRootSegment.status
      );
      preparePreamble(request);
      request = request.onAllReady;
      request();
    }
    function queueCompletedSegment(boundary, segment) {
      if (0 === segment.chunks.length && 1 === segment.children.length && null === segment.children[0].boundary && -1 === segment.children[0].id) {
        var childSegment = segment.children[0];
        childSegment.id = segment.id;
        childSegment.parentFlushed = true;
        1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status || queueCompletedSegment(boundary, childSegment);
      } else boundary.completedSegments.push(segment);
    }
    function finishedSegment(request, boundary, segment) {
      if (null !== byteLengthOfChunk) {
        segment = segment.chunks;
        for (var segmentByteSize = 0, i = 0; i < segment.length; i++)
          segmentByteSize += byteLengthOfChunk(segment[i]);
        null === boundary ? request.byteSize += segmentByteSize : boundary.byteSize += segmentByteSize;
      }
    }
    function finishedTask(request, boundary, row, segment) {
      null !== row && (0 === --row.pendingTasks ? finishSuspenseListRow(request, row) : row.together && tryToResolveTogetherRow(request, row));
      request.allPendingTasks--;
      if (null === boundary) {
        if (null !== segment && segment.parentFlushed) {
          if (null !== request.completedRootSegment)
            throw Error(
              "There can only be one root segment. This is a bug in React."
            );
          request.completedRootSegment = segment;
        }
        request.pendingRootTasks--;
        0 === request.pendingRootTasks && completeShell(request);
      } else if (boundary.pendingTasks--, 4 !== boundary.status)
        if (0 === boundary.pendingTasks)
          if (0 === boundary.status && (boundary.status = 1), null !== segment && segment.parentFlushed && (1 === segment.status || 3 === segment.status) && queueCompletedSegment(boundary, segment), boundary.parentFlushed && request.completedBoundaries.push(boundary), 1 === boundary.status)
            row = boundary.row, null !== row && hoistHoistables(row.hoistables, boundary.contentState), isEligibleForOutlining(request, boundary) || (request.allPendingTasks++, boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request), boundary.fallbackAbortableTasks.clear(), null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row), request.allPendingTasks--), 0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary.preamble && preparePreamble(request);
          else {
            if (5 === boundary.status && (boundary = boundary.row, null !== boundary)) {
              if (null !== request.trackedPostpones) {
                row = request.trackedPostpones;
                var postponedRow = boundary.next;
                if (null !== postponedRow && (segment = postponedRow.boundaries, null !== segment))
                  for (postponedRow.boundaries = null, postponedRow = 0; postponedRow < segment.length; postponedRow++) {
                    var postponedBoundary = segment[postponedRow];
                    trackPostponedBoundary(request, row, postponedBoundary);
                    finishedTask(request, postponedBoundary, null, null);
                  }
              }
              request.allPendingTasks++;
              0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
              request.allPendingTasks--;
            }
          }
        else
          null === segment || !segment.parentFlushed || 1 !== segment.status && 3 !== segment.status || (queueCompletedSegment(boundary, segment), 1 === boundary.completedSegments.length && boundary.parentFlushed && request.partialBoundaries.push(boundary)), boundary = boundary.row, null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary);
      0 === request.allPendingTasks && completeAll(request);
    }
    function performWork(request$jscomp$1) {
      if (!(request$jscomp$1.aborted || 11 < request$jscomp$1.status)) {
        var prevContext = currentActiveSnapshot, prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = HooksDispatcher;
        var prevAsyncDispatcher = ReactSharedInternals.A;
        ReactSharedInternals.A = DefaultAsyncDispatcher;
        var prevRequest = currentRequest;
        currentRequest = request$jscomp$1;
        var prevResumableState = currentResumableState;
        currentResumableState = request$jscomp$1.resumableState;
        try {
          var pingedTasks = request$jscomp$1.pingedTasks, i;
          for (i = 0; i < pingedTasks.length; i++) {
            var task = pingedTasks[i], request = request$jscomp$1, segment = task.blockedSegment;
            if (null === segment)
              a: {
                if (0 !== task.replay.pendingTasks) {
                  var prevTask = request.currentTask;
                  request.currentTask = task;
                  switchContext(task.context);
                  var startNode = task.node;
                  try {
                    "number" === typeof task.replay.slots ? resumeNode(
                      request,
                      task,
                      task.replay.slots,
                      task.node,
                      task.childIndex
                    ) : retryNode(request, task);
                    if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                      throw Error(
                        "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                      );
                    task.replay.pendingTasks--;
                    task.abortSet.delete(task);
                    finishedTask(request, task.blockedBoundary, task.row, null);
                  } catch (thrownValue) {
                    resetHooksState();
                    var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                    if (request.aborted) {
                      thrownValue === SuspenseException && (task.thenableState = getThenableStateAfterSuspending());
                      request.currentTask = prevTask;
                      var request$jscomp$0 = request;
                      abortTask(task, request$jscomp$0);
                      task.abortSet.delete(task);
                      finishAbortedTask(
                        task,
                        request$jscomp$0,
                        request$jscomp$0.fatalError
                      );
                    } else {
                      if ("object" === typeof x && null !== x) {
                        if ("function" === typeof x.then) {
                          var ping = task.ping;
                          x.then(ping.resolve, ping.reject);
                          task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                          break a;
                        }
                        if ("Maximum call stack size exceeded" === x.message && task.node !== startNode) {
                          task.thenableState = null;
                          request.pingedTasks.push(task);
                          break a;
                        }
                      }
                      task.replay.pendingTasks--;
                      task.abortSet.delete(task);
                      var errorInfo = getThrownInfo(task.componentStack);
                      request$jscomp$0 = request;
                      var boundary = task.blockedBoundary, error$jscomp$0 = request.aborted ? request.fatalError : x, replayNodes = task.replay.nodes, resumeSlots = task.replay.slots, errorDigest = logRecoverableError(
                        request$jscomp$0,
                        error$jscomp$0,
                        errorInfo
                      );
                      abortRemainingReplayNodes(
                        request$jscomp$0,
                        boundary,
                        replayNodes,
                        resumeSlots,
                        error$jscomp$0,
                        errorDigest
                      );
                      request.pendingRootTasks--;
                      0 === request.pendingRootTasks && completeShell(request);
                      request.allPendingTasks--;
                      0 === request.allPendingTasks && completeAll(request);
                    }
                  } finally {
                    request.currentTask = prevTask;
                  }
                }
              }
            else
              a: if (request$jscomp$0 = segment, 0 === request$jscomp$0.status) {
                var prevTask$jscomp$0 = request.currentTask;
                request.currentTask = task;
                switchContext(task.context);
                var childrenLength = request$jscomp$0.children.length, chunkLength = request$jscomp$0.chunks.length, startNode$jscomp$0 = task.node;
                try {
                  retryNode(request, task), request$jscomp$0.lastPushedText && request$jscomp$0.textEmbedded && request$jscomp$0.chunks.push(textSeparator), task.abortSet.delete(task), request$jscomp$0.status = 1, finishedSegment(
                    request,
                    task.blockedBoundary,
                    request$jscomp$0
                  ), finishedTask(
                    request,
                    task.blockedBoundary,
                    task.row,
                    request$jscomp$0
                  );
                } catch (thrownValue) {
                  resetHooksState();
                  request$jscomp$0.children.length = childrenLength;
                  request$jscomp$0.chunks.length = chunkLength;
                  var x$jscomp$0 = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                  if (request.aborted)
                    thrownValue === SuspenseException && (task.thenableState = getThenableStateAfterSuspending()), request.currentTask = prevTask$jscomp$0, request$jscomp$0 = request, abortTask(task, request$jscomp$0), task.abortSet.delete(task), finishAbortedTask(
                      task,
                      request$jscomp$0,
                      request$jscomp$0.fatalError
                    );
                  else {
                    if ("object" === typeof x$jscomp$0 && null !== x$jscomp$0) {
                      if ("function" === typeof x$jscomp$0.then) {
                        request$jscomp$0.status = 0;
                        task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                        var ping$jscomp$0 = task.ping;
                        x$jscomp$0.then(
                          ping$jscomp$0.resolve,
                          ping$jscomp$0.reject
                        );
                        break a;
                      }
                      if ("Maximum call stack size exceeded" === x$jscomp$0.message && task.node !== startNode$jscomp$0) {
                        request$jscomp$0.status = 0;
                        task.thenableState = null;
                        request.pingedTasks.push(task);
                        break a;
                      }
                    }
                    var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
                    task.abortSet.delete(task);
                    request$jscomp$0.status = 4;
                    var boundary$jscomp$0 = task.blockedBoundary, row = task.row;
                    null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
                    request.allPendingTasks--;
                    if (null === boundary$jscomp$0)
                      if (isRecoverableError(x$jscomp$0)) {
                        var fatalRecoverableError = cloneRecoverableErrorAsFatal(x$jscomp$0);
                        logRecoverableError(
                          request,
                          fatalRecoverableError,
                          errorInfo$jscomp$0
                        );
                        fatalError(request, fatalRecoverableError);
                      } else
                        logRecoverableError(
                          request,
                          x$jscomp$0,
                          errorInfo$jscomp$0
                        ), fatalError(request, x$jscomp$0);
                    else {
                      var errorDigest$jscomp$0 = logRecoverableError(
                        request,
                        x$jscomp$0,
                        errorInfo$jscomp$0
                      );
                      boundary$jscomp$0.pendingTasks--;
                      if (4 !== boundary$jscomp$0.status) {
                        boundary$jscomp$0.status = 4;
                        boundary$jscomp$0.errorDigest = errorDigest$jscomp$0;
                        untrackBoundary(request, boundary$jscomp$0);
                        var boundaryRow = boundary$jscomp$0.row;
                        null !== boundaryRow && (request.allPendingTasks++, 0 === --boundaryRow.pendingTasks && finishSuspenseListRow(request, boundaryRow), request.allPendingTasks--);
                        boundary$jscomp$0.parentFlushed && request.clientRenderedBoundaries.push(boundary$jscomp$0);
                        0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary$jscomp$0.preamble && preparePreamble(request);
                      }
                      0 === request.allPendingTasks && completeAll(request);
                    }
                  }
                } finally {
                  request.currentTask = prevTask$jscomp$0;
                }
              }
          }
          pingedTasks.splice(0, i);
          null !== request$jscomp$1.destination && flushCompletedQueues(request$jscomp$1, request$jscomp$1.destination);
        } catch (error) {
          logRecoverableError(request$jscomp$1, error, {}), fatalError(request$jscomp$1, error);
        } finally {
          currentResumableState = prevResumableState, ReactSharedInternals.H = prevDispatcher, ReactSharedInternals.A = prevAsyncDispatcher, prevDispatcher === HooksDispatcher && switchContext(prevContext), currentRequest = prevRequest;
        }
      }
    }
    function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
      segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
      for (var pendingPreambles = false, i = 0; i < segment.children.length; i++)
        pendingPreambles = preparePreambleFromSegment(
          request,
          segment.children[i],
          collectedPreambleSegments
        ) || pendingPreambles;
      return pendingPreambles;
    }
    function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
      var boundary = segment.boundary;
      if (null === boundary)
        return preparePreambleFromSubtree(
          request,
          segment,
          collectedPreambleSegments
        );
      var preamble = boundary.preamble;
      if (null === preamble) return false;
      switch (boundary.status) {
        case 1:
          hoistPreambleState(request.renderState, preamble.content);
          request.byteSize += boundary.byteSize;
          segment = boundary.completedSegments[0];
          if (!segment)
            throw Error(
              "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
            );
          return preparePreambleFromSubtree(
            request,
            segment,
            collectedPreambleSegments
          );
        case 5:
          if (null !== request.trackedPostpones) return true;
        case 4:
          if (1 === segment.status)
            return hoistPreambleState(request.renderState, preamble.fallback), preparePreambleFromSubtree(
              request,
              segment,
              collectedPreambleSegments
            );
        default:
          return true;
      }
    }
    function preparePreamble(request) {
      if (request.completedRootSegment && null === request.completedPreambleSegments) {
        var collectedPreambleSegments = [], originalRequestByteSize = request.byteSize, hasPendingPreambles = preparePreambleFromSegment(
          request,
          request.completedRootSegment,
          collectedPreambleSegments
        ), preamble = request.renderState.preamble;
        false === hasPendingPreambles || preamble.headChunks && preamble.bodyChunks ? request.completedPreambleSegments = collectedPreambleSegments : request.byteSize = originalRequestByteSize;
      }
    }
    function flushSubtree(request, destination, segment, hoistableState) {
      segment.parentFlushed = true;
      switch (segment.status) {
        case 0:
          segment.id = request.nextSegmentId++;
        case 5:
          return hoistableState = segment.id, segment.lastPushedText = false, segment.textEmbedded = false, request = request.renderState, writeChunk(destination, placeholder1), writeChunk(destination, request.placeholderPrefix), request = hoistableState.toString(16), writeChunk(destination, request), writeChunkAndReturn(destination, placeholder2);
        case 1:
          segment.status = 2;
          var r = true, chunks = segment.chunks, chunkIdx = 0;
          segment = segment.children;
          for (var childIdx = 0; childIdx < segment.length; childIdx++) {
            for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
              writeChunk(destination, chunks[chunkIdx]);
            r = flushSegment(request, destination, r, hoistableState);
          }
          for (; chunkIdx < chunks.length - 1; chunkIdx++)
            writeChunk(destination, chunks[chunkIdx]);
          chunkIdx < chunks.length && (r = writeChunkAndReturn(destination, chunks[chunkIdx]));
          return r;
        case 3:
          return true;
        default:
          throw Error(
            "Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React."
          );
      }
    }
    var flushedByteSize = 0;
    function flushSegment(request, destination, segment, hoistableState) {
      var boundary = segment.boundary;
      if (null === boundary)
        return flushSubtree(request, destination, segment, hoistableState);
      segment.boundary = null;
      boundary.parentFlushed = true;
      if (4 === boundary.status) {
        var row = boundary.row;
        null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
        boundary = boundary.errorDigest;
        writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
        writeChunk(destination, clientRenderedSuspenseBoundaryError1);
        null != boundary && (writeChunk(destination, clientRenderedSuspenseBoundaryError1A), writeChunk(destination, escapeTextForBrowser(boundary)), writeChunk(
          destination,
          clientRenderedSuspenseBoundaryErrorAttrInterstitial
        ));
        writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
        flushSubtree(request, destination, segment, hoistableState);
      } else if (1 !== boundary.status)
        0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++), 0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
          destination,
          request.renderState,
          boundary.rootSegmentID
        ), hoistableState && hoistHoistables(hoistableState, boundary.fallbackState), flushSubtree(request, destination, segment, hoistableState);
      else if (!flushingPartialBoundaries && isEligibleForOutlining(request, boundary) && (flushedByteSize + boundary.byteSize > request.progressiveChunkSize || hasSuspenseyContent(boundary.contentState, flushingShell) || boundary.defer))
        boundary.rootSegmentID = request.nextSegmentId++, request.completedBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
          destination,
          request.renderState,
          boundary.rootSegmentID
        ), flushSubtree(request, destination, segment, hoistableState);
      else {
        flushedByteSize += boundary.byteSize;
        hoistableState && hoistHoistables(hoistableState, boundary.contentState);
        segment = boundary.row;
        null !== segment && isEligibleForOutlining(request, boundary) && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
        writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
        segment = boundary.completedSegments;
        if (1 !== segment.length)
          throw Error(
            "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
          );
        flushSegment(request, destination, segment[0], hoistableState);
      }
      return writeChunkAndReturn(destination, endSuspenseBoundary);
    }
    function flushSegmentContainer(request, destination, segment, hoistableState) {
      writeStartSegment(
        destination,
        request.renderState,
        segment.parentFormatContext,
        segment.id
      );
      flushSegment(request, destination, segment, hoistableState);
      return writeEndSegment(destination, segment.parentFormatContext);
    }
    function flushCompletedBoundary(request, destination, boundary) {
      flushedByteSize = boundary.byteSize;
      for (var completedSegments = boundary.completedSegments, i = 0; i < completedSegments.length; i++)
        flushPartiallyCompletedSegment(
          request,
          destination,
          boundary,
          completedSegments[i]
        );
      completedSegments.length = 0;
      completedSegments = boundary.row;
      null !== completedSegments && isEligibleForOutlining(request, boundary) && 0 === --completedSegments.pendingTasks && finishSuspenseListRow(request, completedSegments);
      writeHoistablesForBoundary(
        destination,
        boundary.contentState,
        request.renderState
      );
      completedSegments = request.resumableState;
      request = request.renderState;
      i = boundary.rootSegmentID;
      boundary = boundary.contentState;
      var requiresStyleInsertion = request.stylesToHoist, requiresViewTransitions = 0 !== (completedSegments.instructions & 128);
      request.stylesToHoist = false;
      writeChunk(destination, request.startInlineScript);
      writeChunk(destination, endOfStartTag);
      requiresStyleInsertion ? (0 === (completedSegments.instructions & 4) && (completedSegments.instructions |= 4, writeChunk(destination, clientRenderScriptFunctionOnly)), 0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, writeChunk(destination, completeBoundaryScriptFunctionOnly)), requiresViewTransitions && 0 === (completedSegments.instructions & 256) && (completedSegments.instructions |= 256, writeChunk(
        destination,
        `$RV=function(B,g){function h(a,c){var e=a.getAttribute(c);e&&(c=a.style,l.push(a,c.viewTransitionName,c.viewTransitionClass),"auto"!==e&&(c.viewTransitionClass=e),(a=a.getAttribute("vt-name"))||(a="_T_"+N++ +"_"),a=CSS.escape(a)!==a?"r-"+btoa(a).replace(/=/g,""):a,c.viewTransitionName=a,C=!0)}var C=!1,N=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var k=g[f].querySelectorAll("[vt-share]"),d=0;d<k.length;d++){var b=k[d];m.set(b.getAttribute("vt-name"),b)}var u=[];for(k=0;k<g.length;k+=2){var D=g[k],x=D.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){b=D;for(f=0;b;){if(8===b.nodeType){var t=b.data;if("/$"===t)if(0===f)break;else f--;else"$"!==t&&"$?"!==t&&"$~"!==t&&"$!"!==t||f++}else if(1===b.nodeType){d=b;var E=d.getAttribute("vt-name"),y=m.get(E);h(d,y?"vt-share":"vt-exit");y&&(h(y,"vt-share"),m.set(E,null));for(var F=d.querySelectorAll("[vt-share]"),
z=0;z<F.length;z++){var G=F[z],H=G.getAttribute("vt-name"),I=m.get(H);I&&(h(G,"vt-share"),h(I,"vt-share"),m.set(H,null))}var J=d.querySelectorAll("[vt-parent-exit]");for(d=0;d<J.length;d++)h(J[d],"vt-parent-exit")}b=b.nextSibling}for(var K=g[k+1],n=K.firstElementChild;n;){null!==m.get(n.getAttribute("vt-name"))&&h(n,"vt-enter");var L=n.querySelectorAll("[vt-parent-enter]");for(b=0;b<L.length;b++)h(L[b],"vt-parent-enter");n=n.nextElementSibling}b=x;do for(var p=b.firstElementChild;p;){var M=p.getAttribute("vt-update");
M&&"none"!==M&&!l.includes(p)&&h(p,"vt-update");p=p.nextElementSibling}while((b=b.parentNode)&&1===b.nodeType&&"none"!==b.getAttribute("vt-update"));u.push.apply(u,K.querySelectorAll('img[src]:not([loading="lazy"])'))}}}if(C){var A=document.__reactViewTransition=document.startViewTransition({update:function(){B(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],c={},e=0;e<u.length;c={g:c.g},e++)if(c.g=u[e],!c.g.complete){var q=c.g.getBoundingClientRect();0<q.bottom&&0<q.right&&
q.top<window.innerHeight&&q.left<window.innerWidth&&(q=new Promise(function(w){return function(r){w.g.addEventListener("load",r);w.g.addEventListener("error",r)}}(c)),a.push(q))}return Promise.race([Promise.all(a),new Promise(function(w){var r=performance.now();setTimeout(w,2300>r&&2E3<r?2300-r:500)})])},types:[]});A.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var c=l[a],e=c.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];""===c.getAttribute("style")&&c.removeAttribute("style")}});
A.finished.finally(function(){document.__reactViewTransition===A&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}B(g)}.bind(null,$RV);`
      )), 0 === (completedSegments.instructions & 8) ? (completedSegments.instructions |= 8, writeChunk(destination, completeBoundaryWithStylesScript1FullPartial)) : writeChunk(destination, completeBoundaryWithStylesScript1Partial)) : (0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, writeChunk(destination, completeBoundaryScriptFunctionOnly)), requiresViewTransitions && 0 === (completedSegments.instructions & 256) && (completedSegments.instructions |= 256, writeChunk(
        destination,
        `$RV=function(B,g){function h(a,c){var e=a.getAttribute(c);e&&(c=a.style,l.push(a,c.viewTransitionName,c.viewTransitionClass),"auto"!==e&&(c.viewTransitionClass=e),(a=a.getAttribute("vt-name"))||(a="_T_"+N++ +"_"),a=CSS.escape(a)!==a?"r-"+btoa(a).replace(/=/g,""):a,c.viewTransitionName=a,C=!0)}var C=!1,N=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var k=g[f].querySelectorAll("[vt-share]"),d=0;d<k.length;d++){var b=k[d];m.set(b.getAttribute("vt-name"),b)}var u=[];for(k=0;k<g.length;k+=2){var D=g[k],x=D.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){b=D;for(f=0;b;){if(8===b.nodeType){var t=b.data;if("/$"===t)if(0===f)break;else f--;else"$"!==t&&"$?"!==t&&"$~"!==t&&"$!"!==t||f++}else if(1===b.nodeType){d=b;var E=d.getAttribute("vt-name"),y=m.get(E);h(d,y?"vt-share":"vt-exit");y&&(h(y,"vt-share"),m.set(E,null));for(var F=d.querySelectorAll("[vt-share]"),
z=0;z<F.length;z++){var G=F[z],H=G.getAttribute("vt-name"),I=m.get(H);I&&(h(G,"vt-share"),h(I,"vt-share"),m.set(H,null))}var J=d.querySelectorAll("[vt-parent-exit]");for(d=0;d<J.length;d++)h(J[d],"vt-parent-exit")}b=b.nextSibling}for(var K=g[k+1],n=K.firstElementChild;n;){null!==m.get(n.getAttribute("vt-name"))&&h(n,"vt-enter");var L=n.querySelectorAll("[vt-parent-enter]");for(b=0;b<L.length;b++)h(L[b],"vt-parent-enter");n=n.nextElementSibling}b=x;do for(var p=b.firstElementChild;p;){var M=p.getAttribute("vt-update");
M&&"none"!==M&&!l.includes(p)&&h(p,"vt-update");p=p.nextElementSibling}while((b=b.parentNode)&&1===b.nodeType&&"none"!==b.getAttribute("vt-update"));u.push.apply(u,K.querySelectorAll('img[src]:not([loading="lazy"])'))}}}if(C){var A=document.__reactViewTransition=document.startViewTransition({update:function(){B(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],c={},e=0;e<u.length;c={g:c.g},e++)if(c.g=u[e],!c.g.complete){var q=c.g.getBoundingClientRect();0<q.bottom&&0<q.right&&
q.top<window.innerHeight&&q.left<window.innerWidth&&(q=new Promise(function(w){return function(r){w.g.addEventListener("load",r);w.g.addEventListener("error",r)}}(c)),a.push(q))}return Promise.race([Promise.all(a),new Promise(function(w){var r=performance.now();setTimeout(w,2300>r&&2E3<r?2300-r:500)})])},types:[]});A.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var c=l[a],e=c.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];""===c.getAttribute("style")&&c.removeAttribute("style")}});
A.finished.finally(function(){document.__reactViewTransition===A&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}B(g)}.bind(null,$RV);`
      )), writeChunk(destination, completeBoundaryScript1Partial));
      completedSegments = i.toString(16);
      writeChunk(destination, request.boundaryPrefix);
      writeChunk(destination, completedSegments);
      writeChunk(destination, completeBoundaryScript2);
      writeChunk(destination, request.segmentPrefix);
      writeChunk(destination, completedSegments);
      requiresStyleInsertion ? (writeChunk(destination, completeBoundaryScript3a), writeStyleResourceDependenciesInJS(destination, boundary)) : writeChunk(destination, completeBoundaryScript3b);
      boundary = writeChunkAndReturn(destination, completeBoundaryScriptEnd);
      return writeBootstrap(destination, request) && boundary;
    }
    function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
      if (2 === segment.status) return true;
      var hoistableState = boundary.contentState, segmentID = segment.id;
      if (-1 === segmentID) {
        if (-1 === (segment.id = boundary.rootSegmentID))
          throw Error(
            "A root segment ID must have been assigned by now. This is a bug in React."
          );
        return flushSegmentContainer(request, destination, segment, hoistableState);
      }
      if (segmentID === boundary.rootSegmentID)
        return flushSegmentContainer(request, destination, segment, hoistableState);
      flushSegmentContainer(request, destination, segment, hoistableState);
      boundary = request.resumableState;
      request = request.renderState;
      writeChunk(destination, request.startInlineScript);
      writeChunk(destination, endOfStartTag);
      0 === (boundary.instructions & 1) ? (boundary.instructions |= 1, writeChunk(destination, completeSegmentScript1Full)) : writeChunk(destination, completeSegmentScript1Partial);
      writeChunk(destination, request.segmentPrefix);
      segmentID = segmentID.toString(16);
      writeChunk(destination, segmentID);
      writeChunk(destination, completeSegmentScript2);
      writeChunk(destination, request.placeholderPrefix);
      writeChunk(destination, segmentID);
      destination = writeChunkAndReturn(destination, completeSegmentScriptEnd);
      return destination;
    }
    var flushingPartialBoundaries = false;
    var flushingShell = false;
    function flushCompletedQueues(request, destination) {
      currentView = new Uint8Array(4096);
      writtenBytes = 0;
      destinationHasCapacity$1 = true;
      try {
        if (!(0 < request.pendingRootTasks)) {
          var i, completedRootSegment = request.completedRootSegment;
          if (null !== completedRootSegment) {
            if (5 === completedRootSegment.status) return;
            var completedPreambleSegments = request.completedPreambleSegments;
            if (null === completedPreambleSegments) return;
            flushedByteSize = request.byteSize;
            var resumableState = request.resumableState, renderState = request.renderState, preamble = renderState.preamble, htmlChunks = preamble.htmlChunks, headChunks = preamble.headChunks, i$jscomp$0;
            if (htmlChunks) {
              for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++)
                writeChunk(destination, htmlChunks[i$jscomp$0]);
              if (headChunks)
                for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                  writeChunk(destination, headChunks[i$jscomp$0]);
              else
                writeChunk(destination, startChunkForTag("head")), writeChunk(destination, endOfStartTag);
            } else if (headChunks)
              for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                writeChunk(destination, headChunks[i$jscomp$0]);
            var charsetChunks = renderState.charsetChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++)
              writeChunk(destination, charsetChunks[i$jscomp$0]);
            charsetChunks.length = 0;
            renderState.preconnects.forEach(flushResource, destination);
            renderState.preconnects.clear();
            var viewportChunks = renderState.viewportChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++)
              writeChunk(destination, viewportChunks[i$jscomp$0]);
            viewportChunks.length = 0;
            renderState.fontPreloads.forEach(flushResource, destination);
            renderState.fontPreloads.clear();
            renderState.highImagePreloads.forEach(flushResource, destination);
            renderState.highImagePreloads.clear();
            currentlyFlushingRenderState = renderState;
            renderState.styles.forEach(flushStylesInPreamble, destination);
            currentlyFlushingRenderState = null;
            var importMapChunks = renderState.importMapChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++)
              writeChunk(destination, importMapChunks[i$jscomp$0]);
            importMapChunks.length = 0;
            renderState.bootstrapScripts.forEach(flushResource, destination);
            renderState.scripts.forEach(flushResource, destination);
            renderState.scripts.clear();
            renderState.bulkPreloads.forEach(flushResource, destination);
            renderState.bulkPreloads.clear();
            htmlChunks || headChunks || (resumableState.instructions |= 32);
            var hoistableChunks = renderState.hoistableChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++)
              writeChunk(destination, hoistableChunks[i$jscomp$0]);
            for (resumableState = hoistableChunks.length = 0; resumableState < completedPreambleSegments.length; resumableState++) {
              var segments = completedPreambleSegments[resumableState];
              for (renderState = 0; renderState < segments.length; renderState++)
                flushSegment(request, destination, segments[renderState], null);
            }
            var preamble$jscomp$0 = request.renderState.preamble, headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
            (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) && writeChunk(destination, endChunkForTag("head"));
            var bodyChunks = preamble$jscomp$0.bodyChunks;
            if (bodyChunks)
              for (completedPreambleSegments = 0; completedPreambleSegments < bodyChunks.length; completedPreambleSegments++)
                writeChunk(destination, bodyChunks[completedPreambleSegments]);
            flushingShell = true;
            flushSegment(request, destination, completedRootSegment, null);
            flushingShell = false;
            request.completedRootSegment = null;
            var renderState$jscomp$0 = request.renderState;
            if (0 !== request.allPendingTasks || 0 !== request.clientRenderedBoundaries.length || 0 !== request.completedBoundaries.length || null !== request.trackedPostpones && (0 !== request.trackedPostpones.rootNodes.length || null !== request.trackedPostpones.rootSlots)) {
              var resumableState$jscomp$0 = request.resumableState;
              if (0 === (resumableState$jscomp$0.instructions & 64)) {
                resumableState$jscomp$0.instructions |= 64;
                writeChunk(destination, renderState$jscomp$0.startInlineScript);
                if (0 === (resumableState$jscomp$0.instructions & 32)) {
                  resumableState$jscomp$0.instructions |= 32;
                  var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
                  writeChunk(destination, completedShellIdAttributeStart);
                  writeChunk(destination, escapeTextForBrowser(shellId));
                  writeChunk(destination, attributeEnd);
                }
                writeChunk(destination, endOfStartTag);
                writeChunk(destination, shellTimeRuntimeScript);
                writeChunkAndReturn(destination, endInlineScript);
              }
            }
            writeBootstrap(destination, renderState$jscomp$0);
          }
          var renderState$jscomp$1 = request.renderState;
          completedRootSegment = 0;
          var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
          for (completedRootSegment = 0; completedRootSegment < viewportChunks$jscomp$0.length; completedRootSegment++)
            writeChunk(destination, viewportChunks$jscomp$0[completedRootSegment]);
          viewportChunks$jscomp$0.length = 0;
          renderState$jscomp$1.preconnects.forEach(flushResource, destination);
          renderState$jscomp$1.preconnects.clear();
          renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
          renderState$jscomp$1.fontPreloads.clear();
          renderState$jscomp$1.highImagePreloads.forEach(
            flushResource,
            destination
          );
          renderState$jscomp$1.highImagePreloads.clear();
          renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
          renderState$jscomp$1.scripts.forEach(flushResource, destination);
          renderState$jscomp$1.scripts.clear();
          renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
          renderState$jscomp$1.bulkPreloads.clear();
          var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
          for (completedRootSegment = 0; completedRootSegment < hoistableChunks$jscomp$0.length; completedRootSegment++)
            writeChunk(destination, hoistableChunks$jscomp$0[completedRootSegment]);
          hoistableChunks$jscomp$0.length = 0;
          var clientRenderedBoundaries = request.clientRenderedBoundaries;
          for (i = 0; i < clientRenderedBoundaries.length; i++) {
            var boundary = clientRenderedBoundaries[i];
            renderState$jscomp$1 = destination;
            var resumableState$jscomp$1 = request.resumableState, renderState$jscomp$2 = request.renderState, id = boundary.rootSegmentID, errorDigest = boundary.errorDigest;
            writeChunk(
              renderState$jscomp$1,
              renderState$jscomp$2.startInlineScript
            );
            writeChunk(renderState$jscomp$1, endOfStartTag);
            0 === (resumableState$jscomp$1.instructions & 4) ? (resumableState$jscomp$1.instructions |= 4, writeChunk(renderState$jscomp$1, clientRenderScript1Full)) : writeChunk(renderState$jscomp$1, clientRenderScript1Partial);
            writeChunk(renderState$jscomp$1, renderState$jscomp$2.boundaryPrefix);
            writeChunk(renderState$jscomp$1, id.toString(16));
            writeChunk(renderState$jscomp$1, clientRenderScript1A);
            null != errorDigest && (writeChunk(
              renderState$jscomp$1,
              clientRenderErrorScriptArgInterstitial
            ), null == errorDigest ? writeChunk(renderState$jscomp$1, clientRenderErrorScriptNull) : writeChunk(
              renderState$jscomp$1,
              escapeJSStringsForInstructionScripts(errorDigest)
            ));
            var JSCompiler_inline_result = writeChunkAndReturn(
              renderState$jscomp$1,
              clientRenderScriptEnd
            );
            if (!JSCompiler_inline_result) {
              request.destination = null;
              i++;
              clientRenderedBoundaries.splice(0, i);
              return;
            }
          }
          clientRenderedBoundaries.splice(0, i);
          var completedBoundaries = request.completedBoundaries;
          for (i = 0; i < completedBoundaries.length; i++)
            if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
              request.destination = null;
              i++;
              completedBoundaries.splice(0, i);
              return;
            }
          completedBoundaries.splice(0, i);
          completeWriting(destination);
          currentView = new Uint8Array(4096);
          writtenBytes = 0;
          flushingPartialBoundaries = destinationHasCapacity$1 = true;
          var partialBoundaries = request.partialBoundaries;
          for (i = 0; i < partialBoundaries.length; i++) {
            var boundary$71 = partialBoundaries[i];
            a: {
              clientRenderedBoundaries = request;
              boundary = destination;
              flushedByteSize = boundary$71.byteSize;
              var completedSegments = boundary$71.completedSegments;
              for (JSCompiler_inline_result = 0; JSCompiler_inline_result < completedSegments.length; JSCompiler_inline_result++)
                if (!flushPartiallyCompletedSegment(
                  clientRenderedBoundaries,
                  boundary,
                  boundary$71,
                  completedSegments[JSCompiler_inline_result]
                )) {
                  JSCompiler_inline_result++;
                  completedSegments.splice(0, JSCompiler_inline_result);
                  var JSCompiler_inline_result$jscomp$0 = false;
                  break a;
                }
              completedSegments.splice(0, JSCompiler_inline_result);
              var row = boundary$71.row;
              null !== row && row.together && 1 === boundary$71.pendingTasks && (1 === row.pendingTasks ? unblockSuspenseListRow(
                clientRenderedBoundaries,
                row,
                row.hoistables
              ) : row.pendingTasks--);
              JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
                boundary,
                boundary$71.contentState,
                clientRenderedBoundaries.renderState
              );
            }
            if (!JSCompiler_inline_result$jscomp$0) {
              request.destination = null;
              i++;
              partialBoundaries.splice(0, i);
              return;
            }
          }
          partialBoundaries.splice(0, i);
          flushingPartialBoundaries = false;
          var largeBoundaries = request.completedBoundaries;
          for (i = 0; i < largeBoundaries.length; i++)
            if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
              request.destination = null;
              i++;
              largeBoundaries.splice(0, i);
              return;
            }
          largeBoundaries.splice(0, i);
        }
      } finally {
        flushingPartialBoundaries = false, i = request.postponedState, null !== i && (i.nextSegmentId = request.nextSegmentId), 0 === request.allPendingTasks && 0 === request.clientRenderedBoundaries.length && 0 === request.completedBoundaries.length ? (request.flushScheduled = false, i = request.resumableState, i.hasBody && writeChunk(destination, endChunkForTag("body")), i.hasHtml && writeChunk(destination, endChunkForTag("html")), completeWriting(destination), flushBuffered(destination), endRenderLifetime(request), request.status = 13, destination.end(), request.destination = null) : (completeWriting(destination), flushBuffered(destination));
      }
    }
    function startWork(request) {
      request.flushScheduled = null !== request.destination;
      scheduleMicrotask(function() {
        return requestStorage.run(request, performWork, request);
      });
      setImmediate(function() {
        10 === request.status && (request.status = 11);
        null === request.trackedPostpones && requestStorage.run(
          request,
          enqueueEarlyPreloadsAfterInitialWork,
          request
        );
      });
    }
    function enqueueEarlyPreloadsAfterInitialWork(request) {
      safelyEmitEarlyPreloads(request, 0 === request.pendingRootTasks);
    }
    function enqueueFlush(request) {
      false === request.flushScheduled && 0 === request.pingedTasks.length && null !== request.destination && (request.flushScheduled = true, setImmediate(function() {
        var destination = request.destination;
        destination ? flushCompletedQueues(request, destination) : request.flushScheduled = false;
      }));
    }
    function startFlowing(request, destination) {
      if (12 === request.status)
        request.status = 13, request = request.fatalError, isRecoverableError(request) && (request = cloneRecoverableErrorAsFatal(request)), destination.destroy(request);
      else if (13 !== request.status && null === request.destination) {
        request.destination = destination;
        try {
          flushCompletedQueues(request, destination);
        } catch (error$73) {
          logRecoverableError(request, error$73, {}), fatalError(request, error$73);
        }
      }
    }
    function finishAbort(request, abortableTasks) {
      try {
        if (0 < abortableTasks.size) {
          var error = request.fatalError;
          abortableTasks.forEach(function(task) {
            return finishAbortedTask(task, request, error);
          });
          abortableTasks.clear();
        }
        null !== request.destination && flushCompletedQueues(request, request.destination);
      } catch (error$74) {
        logRecoverableError(request, error$74, {}), fatalError(request, error$74);
      }
    }
    function endRenderLifetime(request) {
      request = request.renderLifetimeController;
      null !== request && request.abort("The render ended.");
    }
    function attachAbortSignal(request, signal) {
      if (signal.aborted) abort(request, signal.reason);
      else {
        var renderLifetimeController = new AbortController();
        request.renderLifetimeController = renderLifetimeController;
        signal.addEventListener(
          "abort",
          function() {
            abort(request, signal.reason);
          },
          { signal: renderLifetimeController.signal }
        );
      }
    }
    function abort(request, reason) {
      if (!(request.aborted || 11 !== request.status && 10 !== request.status)) {
        endRenderLifetime(request);
        var isRecoverableReason = "object" === typeof reason && null !== reason && reason.$$typeof === REACT_RECOVERABLE_TYPE;
        request.aborted = true;
        reason = isRecoverableReason ? createRecoverableError(reason) : void 0 === reason ? Error("The render was aborted by the server without a reason.") : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error("The render was aborted by the server with a promise.") : reason;
        request.fatalError = reason;
        var abortableTasks = request.abortableTasks;
        abortableTasks.forEach(function(task) {
          return abortTask(task, request);
        });
        setImmediate(function() {
          return finishAbort(request, abortableTasks);
        });
      }
    }
    function addToReplayParent(node, parentKeyPath, trackedPostpones) {
      if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
      else {
        var workingMap = trackedPostpones.workingMap, parentNode = workingMap.get(parentKeyPath);
        void 0 === parentNode && (parentNode = [parentKeyPath[1], parentKeyPath[2], [], null], workingMap.set(parentKeyPath, parentNode), addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
        parentNode[2].push(node);
      }
    }
    function getPostponedState(request) {
      var trackedPostpones = request.trackedPostpones;
      if (null === trackedPostpones || 0 === trackedPostpones.rootNodes.length && null === trackedPostpones.rootSlots)
        return request.trackedPostpones = null;
      var hasFlushableShell = null === request.completedRootSegment || 5 !== request.completedRootSegment.status && null !== request.completedPreambleSegments;
      if (hasFlushableShell) {
        var nextSegmentId = request.nextSegmentId;
        var replaySlots = trackedPostpones.rootSlots;
        var resumableState = request.resumableState;
        resumableState.bootstrapScriptContent = void 0;
        resumableState.bootstrapScripts = void 0;
        resumableState.bootstrapModules = void 0;
      } else {
        nextSegmentId = 0;
        replaySlots = -1;
        resumableState = request.resumableState;
        var renderState = request.renderState;
        resumableState.nextFormID = 0;
        resumableState.hasBody = false;
        resumableState.hasHtml = false;
        resumableState.unknownResources = { font: renderState.resets.font };
        resumableState.dnsResources = renderState.resets.dns;
        resumableState.connectResources = renderState.resets.connect;
        resumableState.imageResources = renderState.resets.image;
        resumableState.styleResources = renderState.resets.style;
        resumableState.scriptResources = {};
        resumableState.moduleUnknownResources = {};
        resumableState.moduleScriptResources = {};
        resumableState.instructions = 0;
      }
      trackedPostpones = {
        nextSegmentId,
        rootFormatContext: request.rootFormatContext,
        progressiveChunkSize: request.progressiveChunkSize,
        resumableState: request.resumableState,
        replayNodes: trackedPostpones.rootNodes,
        replaySlots
      };
      hasFlushableShell && (request.postponedState = trackedPostpones);
      return trackedPostpones;
    }
    function ensureCorrectIsomorphicReactVersion() {
      var isomorphicReactPackageVersion = React.version;
      if ("19.3.1" !== isomorphicReactPackageVersion)
        throw Error(
          'Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:\n  - react:      ' + (isomorphicReactPackageVersion + "\n  - react-dom:  19.3.1\nLearn more: https://react.dev/warnings/version-mismatch")
        );
    }
    ensureCorrectIsomorphicReactVersion();
    function createDrainHandler(destination, request) {
      return function() {
        return startFlowing(request, destination);
      };
    }
    function createCancelHandler(request, reason) {
      return function() {
        request.destination = null;
        abort(request, Error(reason));
      };
    }
    function createRequestImpl(children, options) {
      var resumableState = createResumableState(
        options ? options.identifierPrefix : void 0,
        options ? options.unstable_externalRuntimeSrc : void 0,
        options ? options.bootstrapScriptContent : void 0,
        options ? options.bootstrapScripts : void 0,
        options ? options.bootstrapModules : void 0
      );
      return createRequest(
        children,
        resumableState,
        createRenderState(
          resumableState,
          options ? options.nonce : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.importMap : void 0,
          options ? options.onHeaders : void 0,
          options ? options.maxHeadersLength : void 0
        ),
        createRootFormatContext(options ? options.namespaceURI : void 0),
        options ? options.progressiveChunkSize : void 0,
        options ? options.onError : void 0,
        options ? options.onBrowserBailout : void 0,
        options ? options.onAllReady : void 0,
        options ? options.onShellReady : void 0,
        options ? options.onShellError : void 0,
        void 0,
        options ? options.formState : void 0
      );
    }
    function createFakeWritableFromReadableStreamController$1(controller) {
      return {
        write: function(chunk) {
          "string" === typeof chunk && (chunk = textEncoder.encode(chunk));
          controller.enqueue(chunk);
          return true;
        },
        end: function() {
          controller.close();
        },
        destroy: function(error) {
          "function" === typeof controller.error ? controller.error(error) : controller.close();
        }
      };
    }
    function resumeRequestImpl(children, postponedState, options) {
      return resumeRequest(
        children,
        postponedState,
        createRenderState(
          postponedState.resumableState,
          options ? options.nonce : void 0,
          void 0,
          void 0,
          void 0,
          void 0
        ),
        options ? options.onError : void 0,
        options ? options.onBrowserBailout : void 0,
        options ? options.onAllReady : void 0,
        options ? options.onShellReady : void 0,
        options ? options.onShellError : void 0,
        void 0
      );
    }
    ensureCorrectIsomorphicReactVersion();
    function createFakeWritableFromReadableStreamController(controller) {
      return {
        write: function(chunk) {
          "string" === typeof chunk && (chunk = textEncoder.encode(chunk));
          controller.enqueue(chunk);
          return true;
        },
        end: function() {
          controller.close();
        },
        destroy: function(error) {
          "function" === typeof controller.error ? controller.error(error) : controller.close();
        }
      };
    }
    function createFakeWritableFromReadable(readable) {
      return {
        write: function(chunk) {
          return readable.push(chunk);
        },
        end: function() {
          readable.push(null);
        },
        destroy: function(error) {
          readable.destroy(error);
        }
      };
    }
    exports2.prerender = function(children, options) {
      return new Promise(function(resolve, reject) {
        var onHeaders = options ? options.onHeaders : void 0, onHeadersImpl;
        onHeaders && (onHeadersImpl = function(headersDescriptor) {
          onHeaders(new Headers(headersDescriptor));
        });
        var resources = createResumableState(
          options ? options.identifierPrefix : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.bootstrapScriptContent : void 0,
          options ? options.bootstrapScripts : void 0,
          options ? options.bootstrapModules : void 0
        ), request = createPrerenderRequest(
          children,
          resources,
          createRenderState(
            resources,
            void 0,
            options ? options.unstable_externalRuntimeSrc : void 0,
            options ? options.importMap : void 0,
            onHeadersImpl,
            options ? options.maxHeadersLength : void 0
          ),
          createRootFormatContext(options ? options.namespaceURI : void 0),
          options ? options.progressiveChunkSize : void 0,
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          function() {
            var writable, stream2 = new ReadableStream(
              {
                type: "bytes",
                start: function(controller) {
                  writable = createFakeWritableFromReadableStreamController(controller);
                },
                pull: function() {
                  startFlowing(request, writable);
                },
                cancel: function(reason) {
                  request.destination = null;
                  abort(request, reason);
                }
              },
              { highWaterMark: 0 }
            );
            stream2 = { postponed: getPostponedState(request), prelude: stream2 };
            resolve(stream2);
          },
          void 0,
          void 0,
          reject
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.prerenderToNodeStream = function(children, options) {
      return new Promise(function(resolve, reject) {
        var resumableState = createResumableState(
          options ? options.identifierPrefix : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.bootstrapScriptContent : void 0,
          options ? options.bootstrapScripts : void 0,
          options ? options.bootstrapModules : void 0
        ), request = createPrerenderRequest(
          children,
          resumableState,
          createRenderState(
            resumableState,
            void 0,
            options ? options.unstable_externalRuntimeSrc : void 0,
            options ? options.importMap : void 0,
            options ? options.onHeaders : void 0,
            options ? options.maxHeadersLength : void 0
          ),
          createRootFormatContext(options ? options.namespaceURI : void 0),
          options ? options.progressiveChunkSize : void 0,
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          function() {
            var readable = new stream.Readable({
              read: function() {
                startFlowing(request, writable);
              }
            }), writable = createFakeWritableFromReadable(readable);
            readable = {
              postponed: getPostponedState(request),
              prelude: readable
            };
            resolve(readable);
          },
          void 0,
          void 0,
          reject
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.renderToPipeableStream = function(children, options) {
      var request = createRequestImpl(children, options), hasStartedFlowing = false;
      startWork(request);
      return {
        pipe: function(destination) {
          if (hasStartedFlowing)
            throw Error(
              "React currently only supports piping to one writable stream."
            );
          hasStartedFlowing = true;
          safelyEmitEarlyPreloads(
            request,
            null === request.trackedPostpones ? 0 === request.pendingRootTasks : null === request.completedRootSegment ? 0 === request.pendingRootTasks : 5 !== request.completedRootSegment.status
          );
          startFlowing(request, destination);
          destination.on("drain", createDrainHandler(destination, request));
          destination.on(
            "error",
            createCancelHandler(
              request,
              "The destination stream errored while writing data."
            )
          );
          destination.on(
            "close",
            createCancelHandler(request, "The destination stream closed early.")
          );
          return destination;
        },
        abort: function(reason) {
          abort(request, reason);
        }
      };
    };
    exports2.renderToReadableStream = function(children, options) {
      return new Promise(function(resolve, reject) {
        var onFatalError, onAllReady, allReady = new Promise(function(res, rej) {
          onAllReady = res;
          onFatalError = rej;
        }), onHeaders = options ? options.onHeaders : void 0, onHeadersImpl;
        onHeaders && (onHeadersImpl = function(headersDescriptor) {
          onHeaders(new Headers(headersDescriptor));
        });
        var resumableState = createResumableState(
          options ? options.identifierPrefix : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.bootstrapScriptContent : void 0,
          options ? options.bootstrapScripts : void 0,
          options ? options.bootstrapModules : void 0
        ), request = createRequest(
          children,
          resumableState,
          createRenderState(
            resumableState,
            options ? options.nonce : void 0,
            options ? options.unstable_externalRuntimeSrc : void 0,
            options ? options.importMap : void 0,
            onHeadersImpl,
            options ? options.maxHeadersLength : void 0
          ),
          createRootFormatContext(options ? options.namespaceURI : void 0),
          options ? options.progressiveChunkSize : void 0,
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          onAllReady,
          function() {
            var writable, stream2 = new ReadableStream(
              {
                type: "bytes",
                start: function(controller) {
                  writable = createFakeWritableFromReadableStreamController$1(
                    controller
                  );
                },
                pull: function() {
                  startFlowing(request, writable);
                },
                cancel: function(reason) {
                  request.destination = null;
                  abort(request, reason);
                }
              },
              { highWaterMark: 0 }
            );
            stream2.allReady = allReady;
            resolve(stream2);
          },
          function(error) {
            allReady.catch(function() {
            });
            reject(error);
          },
          onFatalError,
          options ? options.formState : void 0
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.resume = function(children, postponedState, options) {
      return new Promise(function(resolve, reject) {
        var onFatalError, onAllReady, allReady = new Promise(function(res, rej) {
          onAllReady = res;
          onFatalError = rej;
        }), request = resumeRequest(
          children,
          postponedState,
          createRenderState(
            postponedState.resumableState,
            options ? options.nonce : void 0,
            void 0,
            void 0,
            void 0,
            void 0
          ),
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          onAllReady,
          function() {
            var writable, stream2 = new ReadableStream(
              {
                type: "bytes",
                start: function(controller) {
                  writable = createFakeWritableFromReadableStreamController$1(
                    controller
                  );
                },
                pull: function() {
                  startFlowing(request, writable);
                },
                cancel: function(reason) {
                  request.destination = null;
                  abort(request, reason);
                }
              },
              { highWaterMark: 0 }
            );
            stream2.allReady = allReady;
            resolve(stream2);
          },
          function(error) {
            allReady.catch(function() {
            });
            reject(error);
          },
          onFatalError
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.resumeAndPrerender = function(children, postponedState, options) {
      return new Promise(function(resolve, reject) {
        var request = resumeAndPrerenderRequest(
          children,
          postponedState,
          createRenderState(
            postponedState.resumableState,
            void 0,
            void 0,
            void 0,
            void 0,
            void 0
          ),
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          function() {
            var writable, stream2 = new ReadableStream(
              {
                type: "bytes",
                start: function(controller) {
                  writable = createFakeWritableFromReadableStreamController(controller);
                },
                pull: function() {
                  startFlowing(request, writable);
                },
                cancel: function(reason) {
                  request.destination = null;
                  abort(request, reason);
                }
              },
              { highWaterMark: 0 }
            );
            stream2 = { postponed: getPostponedState(request), prelude: stream2 };
            resolve(stream2);
          },
          void 0,
          void 0,
          reject
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.resumeAndPrerenderToNodeStream = function(children, postponedState, options) {
      return new Promise(function(resolve, reject) {
        var request = resumeAndPrerenderRequest(
          children,
          postponedState,
          createRenderState(
            postponedState.resumableState,
            void 0,
            void 0,
            void 0,
            void 0,
            void 0
          ),
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          function() {
            var readable = new stream.Readable({
              read: function() {
                startFlowing(request, writable);
              }
            }), writable = createFakeWritableFromReadable(readable);
            readable = { postponed: getPostponedState(request), prelude: readable };
            resolve(readable);
          },
          void 0,
          void 0,
          reject
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.resumeToPipeableStream = function(children, postponedState, options) {
      var request = resumeRequestImpl(children, postponedState, options), hasStartedFlowing = false;
      startWork(request);
      return {
        pipe: function(destination) {
          if (hasStartedFlowing)
            throw Error(
              "React currently only supports piping to one writable stream."
            );
          hasStartedFlowing = true;
          startFlowing(request, destination);
          destination.on("drain", createDrainHandler(destination, request));
          destination.on(
            "error",
            createCancelHandler(
              request,
              "The destination stream errored while writing data."
            )
          );
          destination.on(
            "close",
            createCancelHandler(request, "The destination stream closed early.")
          );
          return destination;
        },
        abort: function(reason) {
          abort(request, reason);
        }
      };
    };
    exports2.version = "19.3.1";
  }
});

// node_modules/react-dom/server.node.js
var require_server_node = __commonJS({
  "node_modules/react-dom/server.node.js"(exports2) {
    "use strict";
    var l;
    var s;
    if (true) {
      l = require_react_dom_server_legacy_node_production();
      s = require_react_dom_server_node_production();
    } else {
      l = null;
      s = null;
    }
    exports2.version = l.version;
    exports2.renderToString = l.renderToString;
    exports2.renderToStaticMarkup = l.renderToStaticMarkup;
    exports2.renderToPipeableStream = s.renderToPipeableStream;
    exports2.renderToReadableStream = s.renderToReadableStream;
    exports2.resumeToPipeableStream = s.resumeToPipeableStream;
    exports2.resume = s.resume;
  }
});

// node_modules/react/cjs/react-jsx-runtime.production.js
var require_react_jsx_runtime_production = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.production.js"(exports2) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    function jsxProd(type, config, maybeKey) {
      var key = null;
      void 0 !== maybeKey && (key = "" + maybeKey);
      void 0 !== config.key && (key = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          "key" !== propName && (maybeKey[propName] = config[propName]);
      } else maybeKey = config;
      config = maybeKey.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== config ? config : null,
        props: maybeKey
      };
    }
    exports2.Fragment = REACT_FRAGMENT_TYPE;
    exports2.jsx = jsxProd;
    exports2.jsxs = jsxProd;
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports2, module2) {
    "use strict";
    if (true) {
      module2.exports = require_react_jsx_runtime_production();
    } else {
      module2.exports = null;
    }
  }
});

// src/app/ssr/render.tsx
var render_exports = {};
__export(render_exports, {
  isAppSsrPath: () => isAppSsrPath,
  renderAppRoute: () => renderAppRoute,
  spaShell: () => spaShell
});
module.exports = __toCommonJS(render_exports);
var import_server = __toESM(require_server_node());

// src/app/routes.ts
var ROUTES = {
  "/": {
    page: "home",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/features/home/01-landing-header.css", "styles/features/home/02-landing-hero-footer.css", "styles/features/home/03-home-dashboard.css", "styles/components/game-history.css", "styles/features/home/index-auth.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: ["shared/api-client.js", "shared/site-nav.js", "shared/game-history.js", "shared/image-resize.js", "shared/countries.js", "shared/piece-set.js", "features/play/piece-svg-and-sound.js?v=stage-c-2", { concatScript: [
      "features/home/00-shell-header.js",
      "features/home/01-level-select.js",
      "features/home/02-landing-home-summary.js",
      "features/home/03-auth-modal-session.js",
      "features/home/04-register-guest-login.js",
      "features/home/05-hero-avatar-footer.js"
    ] }],
    title: "NusantaraChess \u2014 Bermain, berlatih, dan belajar catur",
    description: "NusantaraChess: bermain online dengan rating Elo, berlatih melawan karakter bot, kerjakan puzzle personal, dan bedah partaimu dengan Game Review bertenaga Stockfish."
  },
  "/play": {
    page: "play",
    css: [
      "styles/tokens.css",
      "styles/site-nav/01-topbar.css",
      "styles/site-nav/02-sidebar.css",
      "styles/site-nav/03-bottombar-drawer.css",
      "styles/features/play/01-reset-base.css",
      "styles/features/play/02-page-switching.css",
      "styles/features/play/03-buttons.css",
      "styles/features/play/04-auth-page.css",
      "styles/features/play/05-dashboard-page.css",
      "styles/features/play/06-matchmaking-page.css",
      "styles/features/play/07-game-page.css",
      "styles/features/play/08-move-nav.css",
      "styles/features/play/09-options-menu.css",
      "styles/features/play/10-saved-games.css",
      "styles/features/play/11-elo-indicator.css",
      "styles/features/play/12-responsive.css",
      "styles/features/play/13-desktop-game-layout.css",
      "styles/features/play/14-game-redesign.css",
      "styles/auth-gate-overlay.css",
      "styles/premium.css",
      "styles/neu-buttons.css"
    ],
    scripts: ["shared/api-client.js", "shared/auth-gate.js", "shared/site-nav.js", "shared/chess-rules.js", "shared/countries.js", "shared/image-resize.js", "shared/piece-set.js", "features/play/piece-svg-and-sound.js", "vendor/chess-engines/stockfish-wrapper.js", { isolate: [
      "features/play/00-shell-header.js",
      "features/play/01-init-header.js",
      "features/play/02-dashboard-admin.js",
      "features/play/03-enter-dashboard-resume.js",
      "features/play/04-matchmaking-setup.js",
      "features/play/05-board-render-nav.js",
      "features/play/06-move-execution-premove.js",
      "features/play/07-clock-history-options.js",
      "features/play/08-endgame-saved-replay.js"
    ] }],
    title: "Chess Online - vs Bot"
  },
  "/bot": {
    page: "bot",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/features/bot/01-base-header.css", "styles/features/bot/02-board-controls.css", "styles/features/bot/03-opponent-select-modal.css", "styles/features/bot/04-gameover-utility.css", "styles/features/bot/bot-desktop-layout.css", "styles/auth-gate-overlay.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: [
      "shared/api-client.js",
      "shared/auth-gate.js",
      "shared/site-nav.js",
      "shared/piece-set.js",
      "vendor/jquery/jquery.min.js",
      "vendor/jquery/jquery-ui-custom.min.js",
      "vendor/chess-engines/fahriengine.js",
      { isolate: [
        "features/bot/01-state-config.js",
        "features/bot/02-character-settings-ui.js",
        "features/bot/03-game-lifecycle-ui.js",
        "features/bot/04-eval-engine.js",
        "features/bot/05-assets-sound.js",
        "features/bot/06-move-rules.js",
        "features/bot/07-premove.js",
        "features/bot/08-board-interaction-render.js"
      ] },
      { inlineInit: "bot" }
    ],
    title: "Nusantara Chess | Bermain dan belajar catur"
  },
  "/puzzles": {
    page: "puzzles",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/features/puzzles/01-base-board-controls.css", "styles/features/puzzles/02-settings-panel.css", "styles/features/puzzles/03-theme-move-gameover.css", "styles/features/puzzles/04-responsive.css", "styles/features/puzzles/05-touch-animation-overlays.css", "styles/features/puzzles/06-review.css", "styles/features/puzzles/07-analysis-misc.css", "styles/features/puzzles/08-settings-colors.css", "styles/auth-gate-overlay.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: [
      "shared/api-client.js",
      "shared/auth-gate.js",
      "shared/site-nav.js",
      "vendor/chess-engines/chess.min.js",
      "shared/piece-set.js",
      { inlineInit: "puzzles" },
      { isolate: [
        "features/puzzles/01-assets-i18n.js",
        "features/puzzles/01b-i18n-extra.js",
        "features/puzzles/02-theme-mapping.js",
        "features/puzzles/03-state-sound-setup.js",
        "features/puzzles/04-sound-playback.js",
        "features/puzzles/05-animation-drag.js",
        "features/puzzles/06-board-input.js",
        "features/puzzles/07-move-input-server.js",
        "features/puzzles/08-puzzle-flow.js",
        "features/puzzles/09-daily-puzzle.js",
        "features/puzzles/10-review-list-detail.js",
        "features/puzzles/11-review-board-nav.js",
        "features/puzzles/12-highscore-hints.js",
        "features/puzzles/13-settings-scoring.js",
        "features/puzzles/14-analysis-stockfish.js"
      ] }
    ],
    title: "Puzzle | Chess Training",
    themeColor: "#1a1a1a"
  },
  "/gamereview": {
    page: "gamereview",
    css: [
      "styles/tokens.css",
      "styles/site-nav/01-topbar.css",
      "styles/site-nav/02-sidebar.css",
      "styles/site-nav/03-bottombar-drawer.css",
      "styles/features/gamereview/brilliant-review.css",
      "styles/auth-gate-overlay.css",
      "styles/premium.css",
      "styles/neu-buttons.css"
    ],
    scripts: ["shared/api-client.js", "shared/auth-gate.js", "shared/site-nav.js", "vendor/chess-engines/chess.min.js", "shared/piece-set.js", "features/gamereview/piece-svg.js", "features/gamereview/sound.js", "features/gamereview/engine-wrapper.js", { concatScript: [
      "features/gamereview/00-shell-header.js",
      "features/gamereview/01-state-render.js",
      "features/gamereview/02-animation-interaction.js",
      "features/gamereview/03-analysis-eval-arrows.js",
      "features/gamereview/04-movelist-tabs.js",
      "features/gamereview/05-pgn-import.js",
      "features/gamereview/06-fen-opening-detect.js",
      "features/gamereview/07-review-report-boot.js"
    ] }],
    title: "Nusantara Chess | Game review gratis secara tak terbatas",
    description: "Ulasan permainan catur gratis \u2014 akurasi, blunder, grafik evaluasi, dan laporan permainan. Impor dari Chess.com atau tempel PGN apa saja.",
    ogTitle: "Nusantara Chess game review",
    ogDescription: "Berapa banyak blunder yang kamu mainkan? Analisis permainan catur apa pun secara gratis \u2014 akurasi, perkiraan Elo, momen kunci.",
    themeColor: "#262626"
  },
  "/lessons": {
    page: "lessons",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/auth-gate-overlay.css", "styles/features/lessons/01-lessons-list.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: ["shared/api-client.js", "shared/site-nav.js", "features/lessons/lessons-list.js"],
    title: "Lesson \u2014 NusantaraChess",
    description: "Lesson NusantaraChess: Opening Trainer, Middlegame Plan Trainer, dan Endgame Trainer \u2014 belajar lewat posisi nyata, format Learn \u2192 Position \u2192 Choose Move \u2192 Explanation."
  },
  "/library": {
    page: "library",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/auth-gate-overlay.css", "styles/features/library/01-base-controls-list.css", "styles/features/library/02-status-pagination.css", "styles/components/game-history.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: ["shared/api-client.js", "shared/auth-gate.js", "shared/site-nav.js", "shared/game-history.js", "features/library/library.js"],
    title: "Game Library \u2014 NusantaraChess",
    description: "Semua partai online NusantaraChess-mu di satu tempat: filter berdasar kategori dan hasil, cari lawan, buka Game Review, atau unduh PGN."
  },
  "/leaderboard": {
    page: "leaderboard",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/auth-gate-overlay.css", "styles/features/leaderboard/01-base-list.css", "styles/features/leaderboard/02-search-ssr.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: ["shared/api-client.js", "shared/site-nav.js", "features/leaderboard/leaderboard.js"],
    title: "Leaderboard \u2014 NusantaraChess",
    description: "Papan peringkat NusantaraChess: ranking rating Bullet, Blitz, Rapid, dan Puzzle. Cari dan lihat profil pemain lain."
  },
  "/profile": {
    page: "profile",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/auth-gate-overlay.css", "styles/features/profile/01-base-hero-rating.css", "styles/features/profile/02-stats-recent-games.css", "styles/components/game-history.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: ["shared/api-client.js", "shared/auth-gate.js", "shared/site-nav.js", "shared/game-history.js", "shared/countries.js", "features/profile/profile.js"],
    title: "Profil \u2014 NusantaraChess",
    description: "Profil NusantaraChess: rating Bullet/Blitz/Rapid/Puzzle, rekor menang-kalah-remi, dan grafik perkembangan rating."
  }
};
var LESSON_DETAIL_ROUTE = {
  page: "lesson-detail",
  css: ["/styles/tokens.css", "/styles/site-nav/01-topbar.css", "/styles/site-nav/02-sidebar.css", "/styles/site-nav/03-bottombar-drawer.css", "/styles/auth-gate-overlay.css", "/styles/features/lessons/01-lessons-list.css", "/styles/features/lessons/02-lesson-detail.css", "/styles/premium.css", "/styles/neu-buttons.css"],
  scripts: ["/shared/api-client.js", "/shared/site-nav.js", "/shared/chess-rules.js", "/shared/piece-set.js", "/features/play/piece-svg-and-sound.js", "/features/lessons/lesson-detail.js"],
  title: "Lesson \u2014 NusantaraChess"
};
var PUBLIC_PROFILE_ROUTE = {
  page: "public-profile",
  css: ["/styles/tokens.css", "/styles/site-nav/01-topbar.css", "/styles/site-nav/02-sidebar.css", "/styles/site-nav/03-bottombar-drawer.css", "/styles/features/profile/01-base-hero-rating.css", "/styles/features/profile/02-stats-recent-games.css", "/styles/components/game-history.css", "/styles/premium.css", "/styles/neu-buttons.css"],
  scripts: ["/shared/api-client.js", "/shared/site-nav.js", "/shared/game-history.js", "/features/profile/public-profile.js"],
  title: "Profil \u2014 NusantaraChess"
};
function matchDynamicRoute(path) {
  if (/^\/lessons\/([^/]+)\/?$/.test(path)) return LESSON_DETAIL_ROUTE;
  if (/^\/profile\/([^/]+)\/?$/.test(path)) return PUBLIC_PROFILE_ROUTE;
  return null;
}
function resolveRoute(path) {
  if (Object.prototype.hasOwnProperty.call(ROUTES, path)) return ROUTES[path];
  return matchDynamicRoute(path);
}

// src/app/components/dom-handlers.ts
function callGlobal(name, ...args) {
  const fn = window[name];
  if (typeof fn === "function") return fn(...args);
  console.error("[app] fungsi global tidak ditemukan untuk handler markup: " + name + "()");
  return void 0;
}
function hideImg(e) {
  e.currentTarget.style.display = "none";
}
function hideImgInvisible(e) {
  e.currentTarget.style.visibility = "hidden";
}
function swapOpponentAvatar(e) {
  e.currentTarget.classList.add("hidden");
  const fallback = document.getElementById("game-opponent-avatar-default");
  if (fallback) fallback.classList.remove("hidden");
}
function markWordmarkLogo(e) {
  const img = e.currentTarget;
  if (img.naturalHeight && img.naturalWidth / img.naturalHeight > 2.2) {
    img.classList.add("brand-logo-wordmark");
    const next = img.nextElementSibling;
    if (next) next.style.display = "none";
  }
}
function onNativeChange(name, ...args) {
  return (el) => {
    if (!el) return;
    const listener = () => {
      callGlobal(name, ...args);
    };
    el.addEventListener("change", listener);
    return () => el.removeEventListener("change", listener);
  };
}

// src/app/pages/home/LandingHeader.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime());
function LandingHeader() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "landing-header", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "brand-wrapper", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "img",
        {
          src: "/favicon.svg",
          alt: "",
          className: "brand-logo",
          onLoad: markWordmarkLogo,
          onError: hideImg
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "brand", children: "NusantaraChess" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "landing-header-actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lang-picker", "data-lang-picker": "", "data-no-i18n": "", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "lang-btn",
            "data-lang-btn": "",
            "aria-haspopup": "menu",
            "aria-expanded": "false",
            "aria-label": "Bahasa / Language",
            title: "Bahasa / Language",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "img",
              {
                className: "lang-btn-icon",
                src: "/images/ui-globe.svg",
                width: "22",
                height: "22",
                alt: "",
                "aria-hidden": "true",
                onError: hideImgInvisible
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lang-menu", "data-lang-menu": "", role: "menu", "aria-label": "Bahasa / Language", hidden: true })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "landing-header-cta", id: "landingHeaderCta", children: "Masuk" })
    ] })
  ] });
}

// src/app/pages/home/HeroSection.tsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
function HeroSection() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: "hero", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "hero-copy", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h1", { children: "Catur Indonesia, dari latihan sampai rating." }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "Main online dengan sistem Elo, latihan bebas melawan karakter bot, ribuan puzzle personal, dan bedah setiap partaimu dengan analisis Stockfish \u2014 semua di satu tempat." }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "btn hero-cta", id: "heroCta", children: "Mulai Bermain" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "hero-board", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "hero-board-grid", id: "heroBoardGrid" }) })
  ] });
}

// src/app/components/LineIcon.tsx
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
function LineIcon({ className, children, "aria-hidden": ariaHidden }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className,
      "aria-hidden": ariaHidden,
      children
    }
  );
}

// src/app/pages/home/FeatureStrip.tsx
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
function FeatureCard({ title, description, icon }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "feature-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "feature-icon", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(LineIcon, { children: icon }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: description })
  ] });
}
function FeatureStrip() {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "feature-strip", id: "fitur", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      FeatureCard,
      {
        title: "Bermain",
        description: "Matchmaking otomatis berdasarkan rating Bullet/Blitz/Rapid, jam sungguhan, validasi langkah di server.",
        icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      FeatureCard,
      {
        title: "Lawan Bot",
        description: "Fahri, Adit, Dimas, dan Udin \u2014 tiap karakter punya gaya bermain sendiri untuk latihan tanpa tekanan rating.",
        icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M12 3v4" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M9 21h6" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M8 21c0-4 1-5 1-8a5 5 0 0 1 10 0c0 3 1 4 1 8" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M5 21h4" })
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      FeatureCard,
      {
        title: "Puzzle",
        description: "Puzzle diambil dari basis data 49.796 posisi Lichess, disesuaikan dengan rating puzzle pribadimu.",
        icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M6 8h4.5a2 2 0 1 1 3 0H18a1 1 0 0 1 1 1v3.5a2 2 0 1 0 0 3V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" }) })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      FeatureCard,
      {
        title: "Game Review",
        description: "Analisis Stockfish per langkah: akurasi, klasifikasi Brilliant sampai Blunder, estimasi rating performa.",
        icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("circle", { cx: "10.5", cy: "10.5", r: "7" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m15.7 15.7 4.8 4.8" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M10.5 7.3v6.4M7.3 10.5h6.4" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M10.5 10.5V7.3a3.2 3.2 0 0 1 3.2 3.2zM10.5 10.5v3.2a3.2 3.2 0 0 1-3.2-3.2z", fill: "currentColor" })
        ] })
      }
    )
  ] });
}

// src/app/pages/home/TopPlayersSection.tsx
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
function TopPlayersSection({ players }) {
  if (!players || players.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("section", { className: "top-players", id: "pemain-teratas", "aria-labelledby": "topPlayersHeading", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "top-players-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { id: "topPlayersHeading", children: "Pemain Teratas" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "top-players-sub", children: "Peringkat rating Bullet" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("a", { className: "top-players-all", href: "/leaderboard", "data-route-link": "", children: "Lihat leaderboard lengkap" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("ol", { className: "top-players-list", children: players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("a", { className: "top-player", href: "/profile/" + encodeURIComponent(p.username), "data-route-link": "", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "top-player-rank" + (p.rank <= 3 ? " top3" : ""), children: "#" + p.rank }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "top-player-name", children: p.username }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "top-player-rating", children: p.rating })
    ] }) }, p.rank + ":" + p.username)) })
  ] });
}

// src/app/pages/home/PrivacyDialog.tsx
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
function PrivacyDialog() {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("dialog", { className: "legal-dialog", id: "legal-privacy", "aria-labelledby": "legal-privacy-title", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "legal-dialog-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h2", { id: "legal-privacy-title", children: "Privacy Policy" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "legal-close", "data-legal-close": "", "aria-label": "Tutup", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ui-ico ui-ico-close", "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "legal-dialog-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "legal-updated", children: "Terakhir diperbarui: Oktober 2026" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { children: "Data yang kami simpan" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: "Saat mendaftar kami menyimpan username dan password (disimpan sebagai hash, bukan teks asli). Selama bermain kami menyimpan rating Elo, hasil dan riwayat partai (PGN), progres puzzle dan lesson, serta foto profil jika kamu memilih mengunggahnya." }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { children: "Sesi login" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: "Token sesi disimpan di penyimpanan lokal (localStorage) peramban agar kamu tetap masuk saat menutup dan membuka kembali situs. Token berlaku sekitar 30 hari dan dihapus saat kamu keluar atau saat server menyatakannya tidak berlaku." }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { children: "Layanan pihak ketiga" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: "Fitur Game Review dapat mengirim posisi papan (FEN) ke layanan analisis cloud Lichess, dan fitur impor membaca partai publik dari Chess.com atau Lichess atas permintaanmu. Analisis Stockfish berjalan di peramban kamu sendiri." }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { children: "Akun tamu" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: "Akun tamu bersifat sementara dan dengan fitur terbatas; datanya tidak dimaksudkan untuk disimpan jangka panjang." }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { children: "Pertanyaan" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: "Untuk permintaan terkait data akunmu, hubungi kami lewat kontak di footer." })
    ] })
  ] });
}

// src/app/pages/home/TermsDialog.tsx
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
function TermsDialog() {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("dialog", { className: "legal-dialog", id: "legal-terms", "aria-labelledby": "legal-terms-title", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "legal-dialog-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h2", { id: "legal-terms-title", children: "Terms & Conditions" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", className: "legal-close", "data-legal-close": "", "aria-label": "Tutup", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "ui-ico ui-ico-close", "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "legal-dialog-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "legal-updated", children: "Terakhir diperbarui: Oktober 2026" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { children: "Penggunaan layanan" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { children: "Dengan memakai NusantaraChess kamu setuju menggunakannya secara wajar dan sesuai hukum yang berlaku. Kamu bertanggung jawab atas keamanan username dan password akunmu." }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { children: "Permainan yang adil" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { children: "Dilarang memakai mesin catur atau bantuan eksternal, mengakali sistem rating, atau mengganggu layanan. Kami dapat menyesuaikan atau menonaktifkan akun yang melanggar." }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { children: "Rating dan data" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { children: "Rating Elo, statistik, dan riwayat partai dihitung oleh server dan dapat berubah seiring pembaruan sistem. Kami tidak menjamin data tersimpan selamanya." }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { children: "Tanpa jaminan" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { children: "Layanan disediakan apa adanya, tanpa jaminan selalu tersedia atau bebas gangguan. Dalam batas yang diizinkan hukum, pengembang tidak bertanggung jawab atas kerugian dari penggunaan layanan." }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { children: "Perubahan" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { children: "Ketentuan ini dapat diperbarui sewaktu-waktu; penggunaan berkelanjutan berarti kamu menerima versi terbaru." })
    ] })
  ] });
}

// src/app/pages/home/FaqDialog.tsx
var import_jsx_runtime8 = __toESM(require_jsx_runtime());
function FaqDialog() {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("dialog", { className: "legal-dialog", id: "legal-faq", "aria-labelledby": "legal-faq-title", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "legal-dialog-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h2", { id: "legal-faq-title", children: "FAQ" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { type: "button", className: "legal-close", "data-legal-close": "", "aria-label": "Tutup", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "ui-ico ui-ico-close", "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "legal-dialog-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { children: "Apa bedanya Bermain dan Lawan Bot?" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { children: "Bermain memakai jam dan rating Elo (Bullet, Blitz, Rapid) dengan validasi langkah di server. Lawan Bot adalah latihan bebas melawan karakter Fahri, Adit, Dimas, dan Udin tanpa tekanan rating." }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { children: "Siapa lawan di mode Bermain?" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { children: "Saat ini lawan adalah bot yang dicocokkan dengan ratingmu oleh server; permainan antar-pemain belum tersedia." }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { children: "Bagaimana cara memakai Game Review?" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { children: "Setelah partai selesai, pilih Ulasan Permainan dan pindai partainya. Kamu juga bisa menempelkan PGN atau mengimpor partai dari Chess.com dan Lichess." }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { children: "Apakah saya harus login ulang setiap kali?" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { children: "Tidak. Sesimu tetap tersimpan di peramban (sekitar 30 hari) selama tokennya masih berlaku; kamu hanya diminta masuk lagi jika sesi berakhir atau kamu keluar." }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { children: "Bisa mencoba tanpa mendaftar?" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { children: "Bisa, lewat mode tamu dengan fitur terbatas. Profil, Library, dan Leaderboard membutuhkan akun." })
    ] })
  ] });
}

// src/app/pages/home/LandingFooter.tsx
var import_jsx_runtime9 = __toESM(require_jsx_runtime());
function LandingFooter() {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("footer", { className: "landing-footer", id: "landing-footer", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "footer-grid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "footer-col footer-about", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { className: "footer-heading", children: "Tentang" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: "Platform catur berbahasa Indonesia: main dengan rating Elo, latihan melawan karakter bot, puzzle personal, dan bedah partai dengan analisis Stockfish." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("nav", { className: "footer-col", "aria-label": "Navigasi footer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { className: "footer-heading", children: "Navigasi" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("ul", { className: "footer-links", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("a", { href: "#fitur", id: "footerFeatureLink", children: "Fitur" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("a", { href: "/play", "data-route-link": "", children: "Bermain" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("a", { href: "/bot", "data-route-link": "", children: "Lawan Bot" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("a", { href: "/puzzles", "data-route-link": "", children: "Puzzle" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("a", { href: "/leaderboard", "data-route-link": "", children: "Leaderboard" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            "a",
            {
              href: "https://nusantarachess.vercel.app",
              id: "footerCommunityLink",
              target: "_blank",
              rel: "noopener noreferrer",
              children: "Community"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "footer-col", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { className: "footer-heading", children: "Kontak" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("ul", { className: "footer-links footer-contact", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: "Pengembang: Marcell Wang" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("a", { href: "mailto:kontak@nusantara-chess.vercel.app", id: "footerEmail", children: "kontak@nusantara-chess.vercel.app" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: "Indonesia" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "footer-bottom", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { className: "footer-copy", children: [
        "\xA9",
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { id: "footerYear", children: "2026" }),
        " ",
        "NusantaraChess. Semua hak dilindungi."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("ul", { className: "footer-legal", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: "footer-link-btn", "data-legal": "legal-privacy", children: "Privacy Policy" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: "footer-link-btn", "data-legal": "legal-terms", children: "Terms & Conditions" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: "footer-link-btn", "data-legal": "legal-faq", children: "FAQ" }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { className: "footer-credit", id: "footerTikTok", children: [
      "TikTok:",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "footer-credit-handle", "data-no-i18n": "", children: "@marcxzchessofcheckers" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PrivacyDialog, {}),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TermsDialog, {}),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(FaqDialog, {})
  ] });
}

// src/app/pages/home/LandingView.tsx
var import_jsx_runtime10 = __toESM(require_jsx_runtime());
function LandingView({ topPlayers }) {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { id: "landing-view", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(LandingHeader, {}),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(HeroSection, {}),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(FeatureStrip, {}),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(TopPlayersSection, { players: topPlayers }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(LandingFooter, {})
  ] });
}

// src/app/pages/home/LoginForm.tsx
var import_jsx_runtime11 = __toESM(require_jsx_runtime());
function LoginForm() {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("form", { id: "login-form", className: "auth-form active", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("input", { type: "text", id: "login-username", placeholder: "Username", autoComplete: "username", required: true }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "input",
      {
        type: "password",
        id: "login-password",
        placeholder: "Password",
        autoComplete: "current-password",
        required: true
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { type: "submit", className: "btn", children: "Masuk" }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "error-msg", id: "login-error" })
  ] });
}

// src/app/pages/home/RegisterForm.tsx
var import_jsx_runtime12 = __toESM(require_jsx_runtime());
function RegisterForm() {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("form", { id: "register-form", className: "auth-form", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("input", { type: "text", id: "register-username", placeholder: "Username", autoComplete: "username", required: true }),
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "input",
      {
        type: "password",
        id: "register-password",
        placeholder: "Password",
        autoComplete: "new-password",
        required: true
      }
    ),
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "input",
      {
        type: "password",
        id: "register-password2",
        placeholder: "Ulangi Password",
        autoComplete: "new-password",
        required: true
      }
    ),
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "select",
      {
        id: "register-country",
        className: "auth-select",
        "aria-label": "Negara",
        autoComplete: "country",
        required: true,
        defaultValue: "",
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("option", { value: "", disabled: true, children: "Pilih negara" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "submit", className: "btn", children: "Buat Akun" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "error-msg", id: "register-error" })
  ] });
}

// src/app/pages/home/AuthModal.tsx
var import_jsx_runtime13 = __toESM(require_jsx_runtime());
function AuthModal() {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "auth-modal-overlay hidden", id: "auth-container", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "auth-box", role: "dialog", "aria-modal": "true", "aria-labelledby": "authModalHeading", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("button", { type: "button", className: "auth-modal-close", id: "authModalCloseBtn", "aria-label": "Tutup", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(LineIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h2", { id: "authModalHeading", className: "sr-only", children: "Masuk atau daftar akun" }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "tabs", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("button", { className: "tab-btn active", "data-tab": "login-form", type: "button", children: "Masuk" }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("button", { className: "tab-btn", "data-tab": "register-form", type: "button", children: "Daftar" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(LoginForm, {}),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RegisterForm, {}),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "auth-guest-divider", role: "separator", "aria-label": "atau", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { children: "atau" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("button", { type: "button", className: "btn-guest", id: "guestModeBtn", children: "Main sebagai Tamu" }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "auth-guest-hint", children: "Tanpa daftar - progres tidak tersimpan permanen. Profil, Game Library, dan Leaderboard tetap butuh akun." }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "error-msg", id: "guest-error" })
  ] }) });
}

// src/app/pages/home/LevelSelectModal.tsx
var import_jsx_runtime14 = __toESM(require_jsx_runtime());
function LevelSelectModal() {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "auth-modal-overlay hidden", id: "level-select-view", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
    "div",
    {
      className: "auth-box level-select-box",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "levelSelectHeading",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h2", { id: "levelSelectHeading", children: "Pilih Level Permainan Anda" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "level-select-hint", children: "Level ini menentukan rating awal permainan DAN puzzle Anda - bisa naik/turun lewat permainan sungguhan setelah ini, tapi hanya bisa dipilih sekali di sini." }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "difficulty-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("button", { className: "difficulty-card", "data-tier": "Menengah", "data-base": "1400", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-name", children: "Menengah" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-elo", children: "Rating 1400" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("button", { className: "difficulty-card", "data-tier": "Tingkat Lanjut", "data-base": "1800", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-name", children: "Tingkat Lanjut" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-elo", children: "Rating 1800" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("button", { className: "difficulty-card", "data-tier": "Ahli", "data-base": "2200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-name", children: "Ahli" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-elo", children: "Rating 2200" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("button", { className: "difficulty-card", "data-tier": "Calon Master", "data-base": "2500", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-name", children: "Calon Master" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-elo", children: "Rating 2500" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("button", { className: "difficulty-card", "data-tier": "Master", "data-base": "2700", "data-protected": "1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: "tier-name", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "ui-ico ui-ico-lock", "aria-hidden": "true" }),
              " Master"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-elo", children: "Rating 2700" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("button", { className: "difficulty-card", "data-tier": "Grandmaster", "data-base": "3000", "data-protected": "1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: "tier-name", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "ui-ico ui-ico-lock", "aria-hidden": "true" }),
              " Grandmaster"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-elo", children: "Rating 3000" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
            "button",
            {
              className: "difficulty-card",
              "data-tier": "Super Grandmaster",
              "data-base": "3100",
              "data-protected": "1",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: "tier-name", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "ui-ico ui-ico-lock", "aria-hidden": "true" }),
                  " Super Grandmaster"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tier-elo", children: "Rating 3100" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "level-password-prompt hidden", id: "level-password-prompt", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { htmlFor: "level-password-input", id: "level-password-label", children: "Level ini butuh password." }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "level-password-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "input",
              {
                type: "password",
                id: "level-password-input",
                autoComplete: "off",
                autoCapitalize: "characters",
                spellCheck: "false",
                placeholder: "Masukkan password level"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("button", { type: "button", className: "btn-verify", id: "verify-level-btn", disabled: true, children: "Verifikasi" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "error-msg", id: "level-password-error", role: "alert" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "level-password-ok", id: "level-password-ok", role: "status" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("button", { className: "btn-primary", id: "confirm-level-btn", disabled: true, children: "Pilih level dulu" })
      ]
    }
  ) });
}

// src/app/pages/home/HomeDashboard.tsx
var import_react = __toESM(require_react());
var import_react_dom = __toESM(require_react_dom());

// src/app/pages/home/HomeSummaryCard.tsx
var import_jsx_runtime15 = __toESM(require_jsx_runtime());
function HomeSummaryCard() {
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("section", { className: "home-summary-card", "aria-labelledby": "menu-username", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "home-summary-top", children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "home-summary-avatar-wrap", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          "button",
          {
            type: "button",
            className: "home-summary-avatar",
            id: "home-avatar",
            "aria-label": "Ganti foto profil",
            title: "Ganti foto profil",
            children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
              "svg",
              {
                className: "avatar-default-icon",
                viewBox: "0 0 24 24",
                fill: "currentColor",
                "aria-hidden": "true",
                focusable: "false",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("circle", { cx: "12", cy: "8", r: "4.2" }),
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("path", { d: "M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "home-summary-avatar-edit", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
          "svg",
          {
            width: "12",
            height: "12",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("path", { d: "M12 20h9" }),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" })
            ]
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          "input",
          {
            type: "file",
            id: "home-avatar-input",
            accept: "image/png,image/jpeg,image/webp",
            className: "visually-hidden",
            "aria-hidden": "true"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h1", { id: "menu-username" }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("button", { type: "button", className: "home-edit-name-btn", id: "home-edit-name", children: "Edit Nama" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "home-rating-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "home-rating-box", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("span", { className: "home-rating-label", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("img", { className: "home-cat-icon", src: "/images/bullet.svg", alt: "", width: "16", height: "16" }),
          "Bullet"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "home-rating-value", id: "home-elo-bullet", children: "\u2014" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "home-rating-box", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("span", { className: "home-rating-label", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("img", { className: "home-cat-icon", src: "/images/blitz.svg", alt: "", width: "16", height: "16" }),
          "Blitz"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "home-rating-value", id: "home-elo-blitz", children: "\u2014" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "home-rating-box", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("span", { className: "home-rating-label", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("img", { className: "home-cat-icon", src: "/images/rapid.svg", alt: "", width: "16", height: "16" }),
          "Rapid"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "home-rating-value", id: "home-elo-rapid", children: "\u2014" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "home-record-line", id: "home-record-line" })
  ] });
}

// src/app/pages/home/HomeWidgetsSection.tsx
var import_jsx_runtime16 = __toESM(require_jsx_runtime());
function HomeWidgetsSection() {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("section", { "aria-labelledby": "home-widgets-heading", className: "home-widgets-section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("h2", { id: "home-widgets-heading", className: "home-section-heading", children: "Ringkasan progres" }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "home-widget-grid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("article", { className: "home-widget-card", "aria-labelledby": "home-widget-recent-heading", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "home-widget-card-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("h3", { id: "home-widget-recent-heading", children: "Partai" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("a", { href: "/library", "data-route-link": "", className: "home-widget-link", children: "Lihat semua" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { id: "homeRecentGamesList", className: "gh-list" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { id: "homeRecentGamesEmpty", className: "home-widget-empty", hidden: true, children: "Belum ada partai online tercatat." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("article", { className: "home-widget-card", "aria-labelledby": "home-widget-puzzle-heading", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "home-widget-card-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("h3", { id: "home-widget-puzzle-heading", children: "Puzzle" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("a", { href: "/puzzles", "data-route-link": "", className: "home-widget-link", children: "Latihan" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "home-widget-big-stat", id: "homePuzzleRating", children: "\u2014" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "home-widget-sub-stat", id: "homePuzzleRecord", children: "Rating puzzle" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("article", { className: "home-widget-card", "aria-labelledby": "home-widget-lessons-heading", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "home-widget-card-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("h3", { id: "home-widget-lessons-heading", children: "Lesson" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("a", { href: "/lessons", "data-route-link": "", className: "home-widget-link", children: "Lanjutkan" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "home-widget-big-stat", id: "homeLessonsCount", children: "\u2014" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "home-progress-track", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "home-progress-fill", id: "homeLessonsProgressFill" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "home-widget-sub-stat", id: "homeLessonsSub", children: "pelajaran selesai" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("article", { className: "home-widget-card home-widget-card-stats", "aria-labelledby": "home-widget-stats-heading", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "home-widget-card-head", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("h3", { id: "home-widget-stats-heading", children: "Statistik Partai" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "home-stats-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "home-stats-cell", children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("span", { className: "home-stats-cell-label", children: [
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("img", { className: "home-cat-icon", src: "/images/bullet.svg", alt: "", width: "16", height: "16" }),
              "Bullet"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "home-stats-cell-value", id: "homeStatsBullet", children: "0" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "home-stats-cell", children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("span", { className: "home-stats-cell-label", children: [
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("img", { className: "home-cat-icon", src: "/images/blitz.svg", alt: "", width: "16", height: "16" }),
              "Blitz"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "home-stats-cell-value", id: "homeStatsBlitz", children: "0" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "home-stats-cell", children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("span", { className: "home-stats-cell-label", children: [
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("img", { className: "home-cat-icon", src: "/images/rapid.svg", alt: "", width: "16", height: "16" }),
              "Rapid"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "home-stats-cell-value", id: "homeStatsRapid", children: "0" })
          ] })
        ] })
      ] })
    ] })
  ] });
}

// src/app/pages/home/HomeDashboard.tsx
var import_jsx_runtime17 = __toESM(require_jsx_runtime());
function TopbarLangPicker() {
  const [host, setHost] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    let el = null;
    let waitObserver = null;
    let visibilityObserver = null;
    const container = document.getElementById("menu-container");
    const syncVisibility = () => {
      if (el && container) el.hidden = container.classList.contains("hidden");
    };
    const mount = () => {
      if (el) return true;
      const actions = document.querySelector(".site-topbar-actions");
      if (!actions) return false;
      el = document.createElement("div");
      el.className = "site-topbar-lang";
      actions.insertBefore(el, actions.firstChild);
      syncVisibility();
      if (container) {
        visibilityObserver = new MutationObserver(syncVisibility);
        visibilityObserver.observe(container, { attributes: true, attributeFilter: ["class"] });
      }
      setHost(el);
      return true;
    };
    if (!mount()) {
      waitObserver = new MutationObserver(() => {
        if (mount() && waitObserver) {
          waitObserver.disconnect();
          waitObserver = null;
        }
      });
      waitObserver.observe(document.body, { childList: true, subtree: true });
    }
    return () => {
      if (waitObserver) waitObserver.disconnect();
      if (visibilityObserver) visibilityObserver.disconnect();
      if (el) el.remove();
    };
  }, []);
  (0, import_react.useEffect)(() => {
    if (!host) return;
    const picker = host.querySelector("[data-lang-picker]");
    const lang = window.NusantaraChess && window.NusantaraChess.language;
    if (picker && lang && typeof lang.bindMenu === "function") lang.bindMenu(picker);
  }, [host]);
  if (!host) return null;
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "lang-picker", "data-lang-picker": "", "data-no-i18n": "", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
        "button",
        {
          type: "button",
          className: "lang-btn",
          "data-lang-btn": "",
          "aria-haspopup": "menu",
          "aria-expanded": "false",
          "aria-label": "Bahasa / Language",
          title: "Bahasa / Language",
          children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            "img",
            {
              className: "lang-btn-icon",
              src: "/images/ui-globe.svg",
              width: "22",
              height: "22",
              alt: "",
              "aria-hidden": "true",
              onError: hideImgInvisible
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "lang-menu", "data-lang-menu": "", role: "menu", "aria-label": "Bahasa / Language", hidden: true })
    ] }),
    host
  );
}
function HomeDashboard() {
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "container hidden", id: "menu-container", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "home-dashboard", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TopbarLangPicker, {}),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(HomeSummaryCard, {}),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(HomeWidgetsSection, {}),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("a", { href: "/play", "data-route-link": "", className: "home-play-btn", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { children: "Bermain" }) })
  ] }) });
}

// src/app/pages/home/HomePage.tsx
var import_jsx_runtime18 = __toESM(require_jsx_runtime());
function HomePage({ ssr }) {
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(LandingView, { topPlayers: ssr && ssr.kind === "home" ? ssr.topPlayers : void 0 }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(AuthModal, {}),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(LevelSelectModal, {}),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(HomeDashboard, {})
  ] });
}

// src/app/components/AuthGateOverlay.tsx
var import_jsx_runtime19 = __toESM(require_jsx_runtime());
function AuthGateOverlay({ hidden }) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { id: "authGateOverlay", className: "auth-gate-overlay", hidden, children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "auth-gate-spinner" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "auth-gate-text", children: "Memeriksa sesi masuk\u2026" })
  ] });
}

// src/app/components/ActionIcons.tsx
var import_jsx_runtime20 = __toESM(require_jsx_runtime());
function ResignIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("svg", { className: "act-ico act-ico-resign" + (className ? " " + className : ""), viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M5 3.25C5 2.56 5.56 2 6.25 2S7.5 2.56 7.5 3.25v17.5c0 .69-.56 1.25-1.25 1.25S5 21.44 5 20.75z" }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M7.5 3.5h11.7a.9.9 0 0 1 .74 1.41L17.3 8.5l2.64 3.59a.9.9 0 0 1-.74 1.41H7.5z" })
  ] });
}
function UndoIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("svg", { className: "act-ico act-ico-undo" + (className ? " " + className : ""), viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M3.4 9.5 10 4.2a.9.9 0 0 1 1.46.7v9.2a.9.9 0 0 1-1.46.7z" }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M10 9.5h5.5a4.5 4.5 0 0 1 0 9H8.5", fill: "none", stroke: "currentColor", strokeWidth: "2.8", strokeLinecap: "round", strokeLinejoin: "round" })
  ] });
}
function ReviewIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("svg", { className: "act-ico act-ico-review" + (className ? " " + className : ""), viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("rect", { x: "1.5", y: "1.5", width: "21", height: "21", rx: "5.5", style: { fill: "var(--brand, #81B64C)" } }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("circle", { cx: "12", cy: "12", r: "6.3", fill: "#fff" }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M12.00 8.40L12.96 10.97L15.71 11.09L13.56 12.81L14.29 15.46L12.00 13.94L9.71 15.46L10.44 12.81L8.29 11.09L11.04 10.97z", strokeWidth: "0.9", strokeLinejoin: "round", style: { fill: "var(--brand, #81B64C)", stroke: "var(--brand, #81B64C)" } })
  ] });
}
function OptionsIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("svg", { className: "act-ico act-ico-options" + (className ? " " + className : ""), viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("circle", { cx: "5", cy: "6.5", r: "1.7" }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("rect", { x: "9", y: "5.2", width: "11", height: "2.6", rx: "1.3" }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("circle", { cx: "5", cy: "12", r: "1.7" }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("rect", { x: "9", y: "10.7", width: "11", height: "2.6", rx: "1.3" }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("circle", { cx: "5", cy: "17.5", r: "1.7" }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("rect", { x: "9", y: "16.2", width: "11", height: "2.6", rx: "1.3" })
  ] });
}
function SettingsIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("svg", { className: "act-ico act-ico-settings" + (className ? " " + className : ""), viewBox: "0 0 512 512", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M502.325,307.303l-39.006-30.805c-6.215-4.908-9.665-12.429-9.668-20.348c0-0.084,0-0.168,0-0.252c-0.014-7.936,3.44-15.478,9.667-20.396l39.007-30.806c8.933-7.055,12.093-19.185,7.737-29.701l-17.134-41.366c-4.356-10.516-15.167-16.86-26.472-15.532l-49.366,5.8c-7.881,0.926-15.656-1.966-21.258-7.586c-0.059-0.06-0.118-0.119-0.177-0.178c-5.597-5.602-8.476-13.36-7.552-21.225l5.799-49.363c1.328-11.305-5.015-22.116-15.531-26.472L337.004,1.939c-10.516-4.356-22.646-1.196-29.701,7.736l-30.805,39.005c-4.908,6.215-12.43,9.665-20.349,9.668c-0.084,0-0.168,0-0.252,0c-7.935,0.014-15.477-3.44-20.395-9.667L204.697,9.675c-7.055-8.933-19.185-12.092-29.702-7.736L133.63,19.072c-10.516,4.356-16.86,15.167-15.532,26.473l5.799,49.366c0.926,7.881-1.964,15.656-7.585,21.257c-0.059,0.059-0.118,0.118-0.178,0.178c-5.602,5.598-13.36,8.477-21.226,7.552l-49.363-5.799c-11.305-1.328-22.116,5.015-26.472,15.531L1.939,174.996c-4.356,10.516-1.196,22.646,7.736,29.701l39.006,30.805c6.215,4.908,9.665,12.429,9.668,20.348c0,0.084,0,0.167,0,0.251c0.014,7.935-3.44,15.477-9.667,20.395L9.675,307.303c-8.933,7.055-12.092,19.185-7.736,29.701l17.134,41.365c4.356,10.516,15.168,16.86,26.472,15.532l49.366-5.799c7.882-0.926,15.656,1.965,21.258,7.586c0.059,0.059,0.118,0.119,0.178,0.178c5.597,5.603,8.476,13.36,7.552,21.226l-5.799,49.364c-1.328,11.305,5.015,22.116,15.532,26.472l41.366,17.134c10.516,4.356,22.646,1.196,29.701-7.736l30.804-39.005c4.908-6.215,12.43-9.665,20.348-9.669c0.084,0,0.168,0,0.251,0c7.936-0.014,15.478,3.44,20.396,9.667l30.806,39.007c7.055,8.933,19.185,12.093,29.701,7.736l41.366-17.134c10.516-4.356,16.86-15.168,15.532-26.472l-5.8-49.366c-0.926-7.881,1.965-15.656,7.586-21.257c0.059-0.059,0.119-0.119,0.178-0.178c5.602-5.597,13.36-8.476,21.225-7.552l49.364,5.799c11.305,1.328,22.117-5.015,26.472-15.531l17.134-41.365C514.418,326.488,511.258,314.358,502.325,307.303zM281.292,329.698c-39.68,16.436-85.172-2.407-101.607-42.087c-16.436-39.68,2.407-85.171,42.087-101.608c39.68-16.436,85.172,2.407,101.608,42.088C339.815,267.771,320.972,313.262,281.292,329.698z" }) });
}

// src/app/pages/play/ResumeBanner.tsx
var import_jsx_runtime21 = __toESM(require_jsx_runtime());
function ResumeBanner() {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "resume-banner hidden", id: "resume-banner", children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "resume-banner-text", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "resume-banner-title", children: "Permainan Sedang Berlangsung" }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "resume-banner-subtitle", id: "resume-banner-subtitle" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("button", { type: "button", className: "btn-primary resume-banner-btn", id: "resume-game-btn", children: "Lanjutkan Permainan" })
  ] });
}

// src/app/pages/play/TimeControlDropdown.tsx
var import_jsx_runtime22 = __toESM(require_jsx_runtime());
function TimeControlDropdown() {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "time-dropdown", id: "time-dropdown", children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
      "button",
      {
        type: "button",
        className: "time-dropdown-trigger",
        id: "time-dropdown-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": "false",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "time-dropdown-trigger-icon", id: "time-dropdown-trigger-icon", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
            "svg",
            {
              className: "time-trigger-default",
              viewBox: "0 0 24 24",
              width: "18",
              height: "18",
              "aria-hidden": "true",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("circle", { cx: "12", cy: "13", r: "8" }),
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("path", { d: "M12 9v4l2.5 2.5M9 2h6" })
              ]
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "time-dropdown-trigger-label", id: "time-dropdown-trigger-label", children: "Pilih kontrol waktu" }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "time-dropdown-caret", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "ui-ico ui-ico-caret-down", "aria-hidden": "true" }) })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
      "div",
      {
        className: "time-dropdown-panel",
        id: "time-dropdown-panel",
        role: "listbox",
        "aria-label": "Pilih kontrol waktu",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("p", { className: "time-category", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("img", { className: "time-category-icon", src: "images/bullet.svg", alt: "", onError: hideImgInvisible }),
            "Bullet"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "time-option-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "button",
              {
                type: "button",
                className: "time-option",
                role: "option",
                "data-time": "60",
                "data-inc": "0",
                "data-category": "bullet",
                children: "1+0"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "button",
              {
                type: "button",
                className: "time-option",
                role: "option",
                "data-time": "60",
                "data-inc": "1",
                "data-category": "bullet",
                children: "1+1"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "button",
              {
                type: "button",
                className: "time-option",
                role: "option",
                "data-time": "120",
                "data-inc": "1",
                "data-category": "bullet",
                children: "2+1"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("p", { className: "time-category", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("img", { className: "time-category-icon", src: "images/blitz.svg", alt: "", onError: hideImgInvisible }),
            "Blitz"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "time-option-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "button",
              {
                type: "button",
                className: "time-option",
                role: "option",
                "data-time": "180",
                "data-inc": "0",
                "data-category": "blitz",
                children: "3+0"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "button",
              {
                type: "button",
                className: "time-option",
                role: "option",
                "data-time": "180",
                "data-inc": "2",
                "data-category": "blitz",
                children: "3+2"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "button",
              {
                type: "button",
                className: "time-option",
                role: "option",
                "data-time": "300",
                "data-inc": "0",
                "data-category": "blitz",
                children: "5+0"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("p", { className: "time-category", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("img", { className: "time-category-icon", src: "images/rapid.svg", alt: "", onError: hideImgInvisible }),
            "Rapid"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "time-option-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "button",
              {
                type: "button",
                className: "time-option",
                role: "option",
                "data-time": "600",
                "data-inc": "0",
                "data-category": "rapid",
                children: "10+0"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "button",
              {
                type: "button",
                className: "time-option",
                role: "option",
                "data-time": "900",
                "data-inc": "10",
                "data-category": "rapid",
                children: "15+10"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "button",
              {
                type: "button",
                className: "time-option",
                role: "option",
                "data-time": "1800",
                "data-inc": "0",
                "data-category": "rapid",
                children: "30+0"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "time-custom", id: "time-custom", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
              "button",
              {
                type: "button",
                className: "time-custom-toggle",
                id: "time-custom-toggle",
                "aria-expanded": "false",
                "aria-controls": "time-custom-panel",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "time-custom-toggle-label", children: "Kendali Waktu Kustom" }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
                    "svg",
                    {
                      className: "time-custom-chevron time-custom-chevron-down",
                      viewBox: "0 0 24 24",
                      width: "18",
                      height: "18",
                      "aria-hidden": "true",
                      focusable: "false",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("path", { d: "m6 9 6 6 6-6" })
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
                    "svg",
                    {
                      className: "time-custom-chevron time-custom-chevron-up",
                      viewBox: "0 0 24 24",
                      width: "18",
                      height: "18",
                      "aria-hidden": "true",
                      focusable: "false",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("path", { d: "m18 15-6-6-6 6" })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "time-custom-panel", id: "time-custom-panel", role: "group", "aria-label": "Kendali Waktu Kustom", children: [
              /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "time-custom-field", children: [
                /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("label", { className: "time-custom-label", htmlFor: "time-custom-minutes", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { children: "Waktu Awal" }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("output", { id: "time-custom-minutes-out", htmlFor: "time-custom-minutes", children: "10 menit" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("input", { type: "range", id: "time-custom-minutes", min: "0", max: "120", step: "1", defaultValue: "10" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "time-custom-field", children: [
                /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("label", { className: "time-custom-label", htmlFor: "time-custom-bonus", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { children: "Bonus Waktu" }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("output", { id: "time-custom-bonus-out", htmlFor: "time-custom-bonus", children: "0 detik" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("input", { type: "range", id: "time-custom-bonus", min: "0", max: "60", step: "1", defaultValue: "0" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("button", { type: "button", className: "btn-primary time-custom-apply", id: "time-custom-apply", children: "Pilih" })
            ] })
          ] })
        ]
      }
    )
  ] });
}

// src/app/pages/play/DashboardPage.tsx
var import_jsx_runtime23 = __toESM(require_jsx_runtime());
function DashboardPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { id: "dashboard-page", className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "topbar", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("button", { className: "btn-icon", id: "dashboard-settings-btn", title: "Enter Code", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(SettingsIcon, {}) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "dashboard-content", children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(ResumeBanner, {}),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("h2", { className: "section-title", children: "Kontrol Waktu" }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(TimeControlDropdown, {}),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("button", { className: "btn-primary btn-find-match", id: "find-match-btn", disabled: true, children: "Pilih kontrol waktu dulu" })
    ] })
  ] });
}

// src/app/pages/play/MatchmakingPage.tsx
var import_jsx_runtime24 = __toESM(require_jsx_runtime());
function MatchmakingPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { id: "matchmaking-page", className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "matchmaking-box", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { id: "searching-view", children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "spinner" }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("h2", { children: "Mencari lawan..." }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("button", { className: "btn-secondary", id: "cancel-matchmaking-btn", children: "Batalkan Pencarian" })
  ] }) }) });
}

// src/app/pages/play/SavedGamesPage.tsx
var import_jsx_runtime25 = __toESM(require_jsx_runtime());
function SavedGamesPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { id: "saved-games-page", className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "topbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("button", { className: "btn-icon", id: "saved-games-back-btn", title: "Kembali", "aria-label": "Kembali", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "ui-ico ui-ico-arrow-left", "aria-hidden": "true" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "brand-row", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "brand-text", children: "Riwayat Permainan" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { style: { width: "32px" } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "dashboard-content", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("ul", { id: "saved-games-list", className: "saved-games-list" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { id: "saved-games-empty", className: "saved-games-empty hidden", children: "Belum ada permainan yang tersimpan." })
    ] })
  ] });
}

// src/app/pages/gamereview/svg/nextMove.tsx
var import_jsx_runtime26 = __toESM(require_jsx_runtime());
function NextMove(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
    "svg",
    {
      className: props.class,
      onClick: props.click,
      version: "1.1",
      id: "Layer_1",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 493.796 493.796",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("path", { d: "M355.938,200.956L81.414,12.128c-11.28-7.776-23.012-11.88-33.056-11.88c-22.052,0-36.672,18.496-36.672,48.26v397.036\n			c0,14.54,4.228,26.688,10.496,35.144c6.364,8.572,16.32,13.108,27.076,13.108c10.04,0,21.308-4.112,32.584-11.876l274.276-188.828\n			c17.632-12.152,27.3-28.508,27.296-46.076C383.414,229.456,373.594,213.1,355.938,200.956z" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("g", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("path", { d: "M456.446,493.672l-0.293-0.004c-0.048,0-0.095,0.004-0.143,0.004H456.446z" }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("path", { d: "M455.638,0L444.29,0.032c-14.86,0-27.724,12.112-27.724,26.992v439.368c0,14.896,12.652,27.124,27.532,27.124\n				l12.055,0.152c14.805-0.079,25.957-12.412,25.957-27.252V26.996C482.11,12.116,470.51,0,455.638,0z" })
        ] }) }) })
      ]
    }
  );
}

// src/app/pages/gamereview/svg/skipGame.tsx
var import_jsx_runtime27 = __toESM(require_jsx_runtime());
function SkipGame(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
    "svg",
    {
      onClick: props.click,
      className: props.class,
      version: "1.1",
      id: "Layer_1",
      viewBox: "0 0 493.796 493.796",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
          "defs",
          {
            id: "defs173"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
          "g",
          {
            id: "g158",
            transform: "matrix(0.56151542,0,0,0.56151542,214.66028,108.26107)",
            children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              "g",
              {
                id: "g156",
                children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                  "path",
                  {
                    d: "M 355.938,200.956 81.414,12.128 C 70.134,4.352 58.402,0.248 48.358,0.248 c -22.052,0 -36.672,18.496 -36.672,48.26 v 397.036 c 0,14.54 4.228,26.688 10.496,35.144 6.364,8.572 16.32,13.108 27.076,13.108 10.04,0 21.308,-4.112 32.584,-11.876 L 356.118,293.092 c 17.632,-12.152 27.3,-28.508 27.296,-46.076 0,-17.56 -9.82,-33.916 -27.476,-46.06 z",
                    id: "path154"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
          "g",
          {
            id: "g158-5",
            transform: "matrix(0.56151542,0,0,0.56151542,1.8613647,108.12211)",
            children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              "g",
              {
                id: "g156-3",
                children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                  "path",
                  {
                    d: "M 355.938,200.956 81.414,12.128 C 70.134,4.352 58.402,0.248 48.358,0.248 c -22.052,0 -36.672,18.496 -36.672,48.26 v 397.036 c 0,14.54 4.228,26.688 10.496,35.144 6.364,8.572 16.32,13.108 27.076,13.108 10.04,0 21.308,-4.112 32.584,-11.876 L 356.118,293.092 c 17.632,-12.152 27.3,-28.508 27.296,-46.076 0,-17.56 -9.82,-33.916 -27.476,-46.06 z",
                    id: "path154-5"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
          "g",
          {
            id: "g168",
            transform: "matrix(0.56151542,0,0,0.56151542,214.66028,108.26107)",
            children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              "g",
              {
                id: "g166",
                children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
                  "g",
                  {
                    id: "g164",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                        "path",
                        {
                          d: "m 456.446,493.672 -0.293,-0.004 c -0.048,0 -0.095,0.004 -0.143,0.004 z",
                          id: "path160"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                        "path",
                        {
                          d: "M 455.638,0 444.29,0.032 c -14.86,0 -27.724,12.112 -27.724,26.992 v 439.368 c 0,14.896 12.652,27.124 27.532,27.124 l 12.055,0.152 c 14.805,-0.079 25.957,-12.412 25.957,-27.252 V 26.996 C 482.11,12.116 470.51,0 455.638,0 Z",
                          id: "path162"
                        }
                      )
                    ]
                  }
                )
              }
            )
          }
        )
      ]
    }
  );
}

// src/app/pages/gamereview/svg/play.tsx
var import_jsx_runtime28 = __toESM(require_jsx_runtime());
function Play(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
    "svg",
    {
      onClick: props.click,
      className: props.class,
      version: "1.1",
      id: "Layer_1",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 493.796 493.796",
      children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("path", { d: "M355.938,200.956L81.414,12.128c-11.28-7.776-23.012-11.88-33.056-11.88c-22.052,0-36.672,18.496-36.672,48.26v397.036\n			c0,14.54,4.228,26.688,10.496,35.144c6.364,8.572,16.32,13.108,27.076,13.108c10.04,0,21.308-4.112,32.584-11.876l274.276-188.828\n			c17.632-12.152,27.3-28.508,27.296-46.076C383.414,229.456,373.594,213.1,355.938,200.956z" }) }) })
    }
  );
}

// src/app/pages/gamereview/svg/pause.tsx
var import_jsx_runtime29 = __toESM(require_jsx_runtime());
function Pause(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
    "svg",
    {
      className: props.class,
      onClick: props.click,
      version: "1.1",
      id: "Layer_1",
      viewBox: "0 0 493.796 493.796",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
          "defs",
          {
            id: "defs21"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
          "g",
          {
            id: "g16",
            transform: "matrix(1.5827895,0,0,1,-579.3935,0)",
            children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
              "g",
              {
                id: "g14",
                children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
                  "g",
                  {
                    id: "g12",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
                        "path",
                        {
                          d: "m 456.446,493.672 -0.293,-0.004 c -0.048,0 -0.095,0.004 -0.143,0.004 z",
                          id: "path8"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
                        "path",
                        {
                          d: "M 455.638,0 444.29,0.032 c -14.86,0 -27.724,12.112 -27.724,26.992 v 439.368 c 0,14.896 12.652,27.124 27.532,27.124 l 12.055,0.152 c 14.805,-0.079 25.957,-12.412 25.957,-27.252 V 26.996 C 482.11,12.116 470.51,0 455.638,0 Z",
                          id: "path10"
                        }
                      )
                    ]
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
          "g",
          {
            id: "g16-3",
            transform: "matrix(1.5827895,0,0,1,-349.22519,0)",
            children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
              "g",
              {
                id: "g14-6",
                children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
                  "g",
                  {
                    id: "g12-7",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
                        "path",
                        {
                          d: "m 456.446,493.672 -0.293,-0.004 c -0.048,0 -0.095,0.004 -0.143,0.004 z",
                          id: "path8-5"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
                        "path",
                        {
                          d: "M 455.638,0 444.29,0.032 c -14.86,0 -27.724,12.112 -27.724,26.992 v 439.368 c 0,14.896 12.652,27.124 27.532,27.124 l 12.055,0.152 c 14.805,-0.079 25.957,-12.412 25.957,-27.252 V 26.996 C 482.11,12.116 470.51,0 455.638,0 Z",
                          id: "path10-3"
                        }
                      )
                    ]
                  }
                )
              }
            )
          }
        )
      ]
    }
  );
}

// src/app/components/NavIcons.tsx
var import_jsx_runtime30 = __toESM(require_jsx_runtime());
function NavIcon({ name, className }) {
  const cls = "nav-ico nav-ico-" + name + (className ? " " + className : "");
  switch (name) {
    case "first":
    case "last":
      return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(SkipGame, { class: cls });
    case "prev":
    case "next":
      return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(NextMove, { class: cls });
    case "play":
      return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(Play, { class: cls });
    case "pause":
      return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(Pause, { class: cls });
  }
}

// src/app/pages/play/ReplayPage.tsx
var import_jsx_runtime31 = __toESM(require_jsx_runtime());
function ReplayPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { id: "replay-page", className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "main-content", children: [
    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "app-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("button", { type: "button", className: "quit-btn-corner", id: "replay-back-btn", title: "Kembali", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: "20px" }, children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "ui-ico ui-ico-arrow-left", "aria-hidden": "true" }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "app-header-row", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "brand-row brand-row-center", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "brand-text", id: "replay-title", children: "Riwayat Permainan" }) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "game-area", children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "board-wrapper replay-board-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { id: "replay-chessboard", className: "chessboard" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "move-nav-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("button", { type: "button", className: "nav-btn", id: "replay-nav-first-btn", title: "Ke Awal", "aria-label": "Ke Awal", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(NavIcon, { name: "first" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("button", { type: "button", className: "nav-btn", id: "replay-nav-back-btn", title: "Mundur", "aria-label": "Mundur", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(NavIcon, { name: "prev" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("button", { type: "button", className: "nav-btn", id: "replay-nav-forward-btn", title: "Maju", "aria-label": "Maju", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(NavIcon, { name: "next" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("button", { type: "button", className: "nav-btn", id: "replay-nav-last-btn", title: "Ke Terbaru", "aria-label": "Ke Terbaru", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(NavIcon, { name: "last" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "replay-autoplay", children: [
          /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("button", { type: "button", className: "replay-autoplay-btn", id: "replay-autoplay-btn", "aria-pressed": "false", title: "Putar otomatis", children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(NavIcon, { name: "play", className: "replay-ap-icon replay-ap-play" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(NavIcon, { name: "pause", className: "replay-ap-icon replay-ap-pause" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { id: "replay-autoplay-label", children: "Putar otomatis" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("label", { className: "replay-autoplay-speed", children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "replay-autoplay-speed-text", children: "Kecepatan" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("select", { id: "replay-autoplay-speed", defaultValue: "1200", "aria-label": "Kecepatan putar otomatis", children: [
              /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("option", { value: "2000", children: "Lambat" }),
              /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("option", { value: "1200", children: "Normal" }),
              /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("option", { value: "700", children: "Cepat" }),
              /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("option", { value: "350", children: "Sangat cepat" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("button", { type: "button", className: "btn-secondary", id: "replay-copy-pgn-btn", children: "Salin PGN" }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "move-history-wrap", children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("h3", { children: "Riwayat Langkah" }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("ol", { id: "replay-move-history", className: "move-history" })
      ] })
    ] })
  ] }) });
}

// src/app/pages/play/OptionsMenuOverlay.tsx
var import_jsx_runtime32 = __toESM(require_jsx_runtime());
function OptionsMenuOverlay() {
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "options-menu-overlay hidden", id: "options-menu-overlay", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "options-menu-box", children: [
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h3", { children: "Pilihan" }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("button", { type: "button", className: "option-item", id: "option-cancel-btn", children: "Batalkan" }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("button", { type: "button", className: "option-item", id: "option-draw-btn", children: "Tawarkan Remis" }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("button", { type: "button", className: "option-item", id: "option-copy-pgn-btn", children: "Salin PGN" }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("button", { type: "button", className: "option-item", id: "option-share-pgn-btn", children: "Bagikan PGN" }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("button", { type: "button", className: "option-item option-item-close", id: "option-close-btn", children: "Tutup" })
  ] }) });
}

// src/app/pages/play/GameResultOverlay.tsx
var import_jsx_runtime33 = __toESM(require_jsx_runtime());
function GameResultOverlay() {
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "game-result-overlay hidden", id: "game-result-overlay", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "game-result-box", children: [
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "game-result-title", id: "game-result-title", children: "Menang" }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "game-result-subtitle", id: "game-result-subtitle" }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "game-result-elo", id: "game-result-elo" }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("button", { type: "button", className: "btn-primary game-result-full-btn", id: "game-result-again-btn", children: "Main Lagi" }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("button", { type: "button", className: "btn-secondary game-result-full-btn", id: "game-result-review-btn", children: "Ulasan Permainan" }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("button", { type: "button", className: "btn-secondary game-result-full-btn", id: "game-result-close-btn", children: "Tutup" })
  ] }) });
}

// src/app/pages/play/GamePage.tsx
var import_jsx_runtime34 = __toESM(require_jsx_runtime());
function GamePage() {
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { id: "game-page", className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "main-content", children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "app-header", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "app-header-row" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "game-area", children: [
      /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "opponent-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "player-avatar", id: "game-opponent-avatar", children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
            "img",
            {
              id: "game-opponent-avatar-img",
              className: "opponent-avatar-img hidden",
              alt: "",
              onError: swapOpponentAvatar
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { id: "game-opponent-avatar-default", className: "avatar-default-wrap" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "player-info", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "player-name", children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { id: "game-opponent-title", className: "opponent-title hidden" }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { id: "game-opponent-name", children: "Bot" }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("span", { className: "elo-muted", children: [
            "(",
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { id: "game-opponent-elo", children: "1500" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { id: "game-opponent-elo-change", className: "elo-change-inline hidden" }),
            ")"
          ] }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { id: "game-opponent-flag", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("img", { src: "/images/ui-flag.svg", width: "14", height: "14", alt: "", draggable: false }) })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "player-clock", id: "opponent-clock", children: "05:00" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "board-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { id: "chessboard", className: "chessboard" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "player-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "player-avatar", id: "player-panel-avatar-wrap" }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "player-info", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "player-name", children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { id: "game-player-flag", className: "player-flag" }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { id: "game-player-name", children: "Anda" }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("span", { className: "elo-muted", children: [
            "(",
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { id: "game-player-elo", children: "1500" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { id: "game-player-elo-change", className: "elo-change-inline hidden" }),
            ")"
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "player-clock", id: "player-clock", children: "05:00" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "move-nav-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("button", { type: "button", className: "nav-btn", id: "nav-back-btn", title: "Mundur", "aria-label": "Mundur", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(NavIcon, { name: "prev" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("button", { type: "button", className: "nav-btn", id: "nav-forward-btn", title: "Maju", "aria-label": "Maju", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(NavIcon, { name: "next" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "controls-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("button", { type: "button", className: "ctrl-btn", id: "resign-btn", title: "Menyerah", "aria-label": "Menyerah", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(ResignIcon, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("button", { type: "button", className: "ctrl-btn", id: "options-btn", title: "Pilihan", "aria-label": "Pilihan", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(OptionsIcon, {}) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(OptionsMenuOverlay, {}),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(GameResultOverlay, {}),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "move-history-wrap", children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("h3", { children: "Riwayat Langkah" }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("ol", { id: "move-history", className: "move-history" })
      ] })
    ] })
  ] }) });
}

// src/app/pages/play/AdminPanelSection.tsx
var import_jsx_runtime35 = __toESM(require_jsx_runtime());
function AdminPanelSection() {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { id: "admin-panel-section", className: "hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("p", { className: "admin-unlocked-badge", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "ui-ico ui-ico-check", "aria-hidden": "true" }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { children: "Fitur admin aktif" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "admin-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "admin-group-title", children: "Elo Akun" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("label", { className: "admin-toggle-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("input", { type: "checkbox", id: "admin-elo-protection-toggle" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { children: "Elo tidak turun saat kalah" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "admin-hint-text", children: "Proteksi langsung tersimpan saat dicentang. Angka Elo di bawah tersimpan lewat tombol Simpan Elo." }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("label", { className: "admin-field-label", htmlFor: "admin-elo-bullet", children: "Bullet" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
        "input",
        {
          type: "number",
          id: "admin-elo-bullet",
          className: "admin-text-input",
          inputMode: "numeric",
          min: "1300",
          max: "3200",
          step: "1"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("label", { className: "admin-field-label", htmlFor: "admin-elo-blitz", children: "Blitz" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
        "input",
        {
          type: "number",
          id: "admin-elo-blitz",
          className: "admin-text-input",
          inputMode: "numeric",
          min: "1300",
          max: "3200",
          step: "1"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("label", { className: "admin-field-label", htmlFor: "admin-elo-rapid", children: "Rapid" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
        "input",
        {
          type: "number",
          id: "admin-elo-rapid",
          className: "admin-text-input",
          inputMode: "numeric",
          min: "1300",
          max: "3200",
          step: "1"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "admin-hint-text", children: "Rentang Elo akun pemain: 1300\u20133200." }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "admin-error-text hidden", id: "admin-elo-error" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: "btn-primary admin-full-btn", id: "admin-elo-save-btn", children: "Simpan Elo" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "admin-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "admin-group-title", children: "Lawan Custom" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("label", { className: "admin-field-label", htmlFor: "admin-custom-name", children: "Nama" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
        "input",
        {
          type: "text",
          id: "admin-custom-name",
          className: "admin-text-input",
          maxLength: "40",
          placeholder: "Nama lawan"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("label", { className: "admin-field-label", htmlFor: "admin-custom-photo", children: "Foto Profil" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "admin-photo-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          "img",
          {
            id: "admin-custom-photo-preview",
            className: "admin-photo-preview hidden",
            alt: "Foto lawan custom"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          "input",
          {
            type: "file",
            id: "admin-custom-photo",
            className: "admin-text-input",
            accept: "image/png,image/jpeg,image/webp"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("label", { className: "admin-field-label", htmlFor: "admin-custom-country", children: "Negara" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("select", { id: "admin-custom-country", className: "admin-text-input" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("label", { className: "admin-field-label", htmlFor: "admin-custom-title", children: "Gelar Catur Resmi" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("select", { id: "admin-custom-title", className: "admin-text-input", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "", children: "Tanpa gelar" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "CM", children: "CM \u2013 Candidate Master" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "NM", children: "NM \u2013 National Master" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "FM", children: "FM \u2013 FIDE Master" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "IM", children: "IM \u2013 International Master" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "GM", children: "GM \u2013 Grandmaster" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "WCM", children: "WCM \u2013 Woman Candidate Master" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "WFM", children: "WFM \u2013 Woman FIDE Master" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "WIM", children: "WIM \u2013 Woman International Master" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "WGM", children: "WGM \u2013 Woman Grandmaster" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("label", { className: "admin-field-label", htmlFor: "admin-custom-elo", children: "Elo Lawan (1320\u20133190)" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "admin-elo-pick", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          "input",
          {
            type: "range",
            id: "admin-custom-elo-range",
            min: "1320",
            max: "3190",
            step: "1",
            defaultValue: "1320",
            "aria-label": "Geser untuk memilih Elo lawan"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          "input",
          {
            type: "number",
            id: "admin-custom-elo",
            className: "admin-text-input",
            inputMode: "numeric",
            min: "1320",
            max: "3190",
            step: "1",
            placeholder: "Contoh: 2500"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "admin-hint-text", children: "Elo lawan custom (1320\u20133190) otomatis dipakai sebagai Elo UCI Stockfish lawan. Foto dipilih dari galeri/berkas perangkat. Negara menentukan bendera lawan di papan." }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "admin-error-text hidden", id: "admin-custom-error" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "admin-btn-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: "btn-primary admin-full-btn", id: "admin-custom-save-btn", children: "Simpan Lawan Custom" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: "btn-secondary admin-full-btn", id: "admin-custom-clear-btn", children: "Hapus Lawan Custom" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "admin-status-text hidden", id: "admin-custom-status" })
    ] })
  ] });
}

// src/app/pages/play/DashboardSettingsModal.tsx
var import_jsx_runtime36 = __toESM(require_jsx_runtime());
function DashboardSettingsModal() {
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "dashboard-settings-overlay hidden", id: "dashboard-settings-modal", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "dashboard-settings-box", role: "dialog", "aria-modal": "true", "aria-labelledby": "dashboard-settings-title-gate", tabIndex: -1, children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { id: "dashboard-settings-title-gate", children: "Enter Code" }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { id: "dashboard-settings-title-admin", className: "hidden", children: "Pengaturan Admin" }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { id: "admin-unlock-section", children: [
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "admin-field-label", htmlFor: "admin-code-input", children: "Kode" }),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
        "input",
        {
          type: "password",
          id: "admin-code-input",
          className: "admin-text-input",
          placeholder: "Masukkan kode akses",
          autoComplete: "off"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "admin-error-text hidden", id: "admin-unlock-error" }),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("button", { type: "button", className: "btn-primary admin-full-btn", id: "admin-unlock-btn", children: "Gunakan Kode" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(AdminPanelSection, {}),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("button", { type: "button", className: "option-item option-item-close", id: "dashboard-settings-close-btn", children: "Tutup" })
  ] }) });
}

// src/app/pages/play/PlayPage.tsx
var import_jsx_runtime37 = __toESM(require_jsx_runtime());
function PlayPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(import_jsx_runtime37.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(AuthGateOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DashboardPage, {}),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(MatchmakingPage, {}),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(SavedGamesPage, {}),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(ReplayPage, {}),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(GamePage, {}),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(DashboardSettingsModal, {})
  ] });
}

// src/app/pages/bot/CharacterCard.tsx
var import_jsx_runtime38 = __toESM(require_jsx_runtime());
function CharacterCard({ id, name, elo, image, selected = false }) {
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(
    "button",
    {
      type: "button",
      className: selected ? "character-card is-selected" : "character-card",
      "data-character": id,
      role: "radio",
      "aria-checked": selected ? "true" : "false",
      onClick: () => callGlobal("UISelectCharacterCard", id),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "character-card-avatar", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("img", { src: "images/" + (image || id) + ".svg", alt: "", onError: hideImgInvisible }) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "character-card-name", children: name }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "character-card-elo", children: elo != null ? elo + " Elo" : "Elo segera" }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "character-card-check", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "ui-ico ui-ico-check", "aria-hidden": "true" }) })
      ]
    }
  );
}

// src/app/pages/bot/bot-roster.ts
var BOTS = [
  { id: "udin", name: "Udin", elo: 1250 },
  { id: "adit", name: "Adit", elo: 1e3 },
  { id: "dimas", name: "Dimas", elo: 1650 },
  { id: "agus", name: "Agus", elo: 1600 },
  { id: "ilham", name: "Ilham", elo: 2450 },
  { id: "josep", name: "Josep", elo: 2200 },
  { id: "asep", name: "Asep", elo: 1850 },
  { id: "fahri", name: "Fahri", elo: 2300 }
];
var SORTED_BOTS = BOTS.map((bot, index) => ({ bot, index })).sort((a, b) => a.bot.elo - b.bot.elo || a.index - b.index).map(({ bot }) => bot);
var FIRST_ROW_SIZE = 4;

// src/app/pages/bot/CharacterDashboard.tsx
var import_jsx_runtime39 = __toESM(require_jsx_runtime());
function CharacterDashboard() {
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { className: "character-dashboard", id: "characterDashboard", role: "radiogroup", "aria-label": "Pilih karakter lawan", children: SORTED_BOTS.slice(0, FIRST_ROW_SIZE).map((c) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(CharacterCard, { id: c.id, name: c.name, elo: c.elo, image: c.image }, c.id)) });
}

// src/app/pages/bot/PlaceholderBotRow.tsx
var import_jsx_runtime40 = __toESM(require_jsx_runtime());
var PLACEHOLDER_SLOTS = [];
function PlaceholderBotRow() {
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(import_jsx_runtime40.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "character-dashboard character-dashboard-extra", id: "characterDashboardExtra", role: "radiogroup", "aria-label": "Bot lain", children: [
      SORTED_BOTS.slice(FIRST_ROW_SIZE).map((c) => /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(CharacterCard, { id: c.id, name: c.name, elo: c.elo, image: c.image }, c.id)),
      PLACEHOLDER_SLOTS.map(({ slot, label }) => /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(
        "button",
        {
          type: "button",
          className: "character-card character-card-placeholder",
          "data-placeholder": slot,
          role: "radio",
          "aria-checked": "false",
          onClick: () => callGlobal("UISelectPlaceholderBot", slot),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "character-card-avatar", children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "character-card-avatar-fallback", "aria-hidden": "true", children: "?" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "character-card-name", children: label }),
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "character-card-elo", children: "Segera hadir" }),
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "character-card-check", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("span", { className: "ui-ico ui-ico-check", "aria-hidden": "true" }) })
          ]
        },
        slot
      ))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("p", { className: "opponent-select-hint hidden", id: "placeholderBotHint", role: "status", children: "Bot ini belum tersedia. Pilih bot lain untuk mulai bermain." })
  ] });
}

// src/app/pages/bot/OpponentSelectScreen.tsx
var import_jsx_runtime41 = __toESM(require_jsx_runtime());
function OpponentSelectScreen() {
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { id: "opponent-select-screen", className: "opponent-select-screen", children: /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "opponent-select-box", children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("h1", { className: "opponent-select-title", children: "Pilih Lawan" }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("p", { className: "opponent-select-subtitle", children: "Pilih karakter yang ingin kamu lawan sebelum mulai bermain." }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(CharacterDashboard, {}),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(PlaceholderBotRow, {}),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("label", { className: "mode-toggle", htmlFor: "opponent-tools-toggle", children: [
      /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("span", { className: "mode-toggle-text", children: [
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "mode-toggle-title", children: "Dengan Alat" }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "mode-toggle-desc", children: "Batalkan langkah, analisis, dan posisi kustom" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
        "input",
        {
          type: "checkbox",
          id: "opponent-tools-toggle",
          className: "mode-toggle-input",
          role: "switch",
          onChange: () => callGlobal("UIToggleToolsMode")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "mode-toggle-switch", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "mode-toggle-thumb" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("button", { type: "button", className: "btn-start-match", id: "opponent-select-start-btn", disabled: true, "aria-disabled": "true", children: "Mulai Bermain" }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("button", { type: "button", className: "btn-resume-match hidden", id: "opponent-resume-btn", onClick: () => callGlobal("UIResumePractice"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { children: "Lanjutkan Permainan" }),
      " (",
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { id: "opponent-resume-name" }),
      ")"
    ] })
  ] }) });
}

// src/app/pages/bot/BotControlsPanel.tsx
var import_jsx_runtime42 = __toESM(require_jsx_runtime());
function BotControlsPanel() {
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "controls-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
      "button",
      {
        type: "button",
        className: "ctrl-btn",
        id: "btnReview",
        onClick: () => callGlobal("UIOpenGameReview"),
        title: "Ulasan Permainan",
        "aria-label": "Ulasan Permainan",
        style: { display: "none" },
        children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ReviewIcon, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
      "button",
      {
        type: "button",
        className: "ctrl-btn",
        id: "btnResign",
        onClick: () => callGlobal("UIResetOrSurrender"),
        title: "Menyerah",
        "aria-label": "Menyerah",
        children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ResignIcon, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
      "button",
      {
        type: "button",
        className: "ctrl-btn",
        id: "btnUndo",
        onClick: () => callGlobal("UIUndoMove"),
        title: "Batalkan",
        "aria-label": "Batalkan",
        children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(UndoIcon, {})
      }
    )
  ] });
}

// src/app/pages/bot/BotGameArea.tsx
var import_jsx_runtime43 = __toESM(require_jsx_runtime());
function BotGameArea() {
  return /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "main-content hidden", id: "mainContent", children: [
    /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "app-header", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "app-header-row" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "game-area", children: [
      /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "opponent-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "player-avatar", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
          "img",
          {
            id: "opponentAvatar",
            src: "images/fahri.svg",
            alt: "",
            style: { width: "34px", height: "34px", borderRadius: "0", objectFit: "cover" }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "player-info", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "player-name", children: [
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("span", { id: "botOpponentTitle", className: "opponent-title hidden" }),
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("span", { id: "engineName" }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("span", { id: "botOpponentFlag" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
          "button",
          {
            type: "button",
            className: "icon-btn",
            onClick: () => callGlobal("UIOpenSettings"),
            title: "Pengaturan",
            children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(SettingsIcon, {})
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "board-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { id: "board" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "player-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "player-avatar", id: "botPlayerAvatar", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)(
          "svg",
          {
            className: "avatar-default-icon",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            "aria-hidden": "true",
            focusable: "false",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("circle", { cx: "12", cy: "8", r: "4.2" }),
              /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("path", { d: "M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z" })
            ]
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "player-info", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "player-name", children: "Anda" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "history-nav-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
          "button",
          {
            type: "button",
            className: "nav-btn",
            id: "navPrev",
            onClick: () => callGlobal("UIHistoryPrev"),
            title: "Mundur",
            "aria-label": "Mundur",
            children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(NavIcon, { name: "prev" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
          "button",
          {
            type: "button",
            className: "nav-btn",
            id: "navNext",
            onClick: () => callGlobal("UIHistoryNext"),
            title: "Maju",
            "aria-label": "Maju",
            children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(NavIcon, { name: "next" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(BotControlsPanel, {})
    ] })
  ] });
}

// src/app/pages/bot/BotSettingsModal.tsx
var import_jsx_runtime44 = __toESM(require_jsx_runtime());
function CloseIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("path", { d: "M6 6l12 12M18 6 6 18" }) });
}
function BotSettingsModal() {
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
    "div",
    {
      className: "modal-overlay",
      id: "settingsModal",
      onClick: (e) => {
        if (e.target === e.currentTarget) callGlobal("UICloseSettings");
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "modal-panel bs-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "botSettingsTitle", children: [
        /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "modal-header bs-header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("span", { className: "modal-title bs-title", id: "botSettingsTitle", children: [
            /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(SettingsIcon, {}),
            /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("span", { children: "Pengaturan" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("button", { type: "button", className: "modal-close", onClick: () => callGlobal("UICloseSettings"), "aria-label": "Tutup", children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(CloseIcon, {}) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("section", { className: "bs-group", children: [
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("h1", { className: "bs-sec-title", children: "Permainan" }),
          /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "bs-field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("label", { className: "bs-label", htmlFor: "StartPlayerSelect", children: "Warna Bermain" }),
            /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("select", { id: "StartPlayerSelect", className: "level-select bs-select", onChange: () => callGlobal("UIChangeStartPlayer"), children: [
              /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("option", { value: "white", children: "Main Putih" }),
              /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("option", { value: "black", children: "Main Hitam" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "bs-field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("label", { className: "bs-label", htmlFor: "ModeSelect", children: "Mode Permainan" }),
            /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)(
              "select",
              {
                id: "ModeSelect",
                className: "level-select bs-select",
                onChange: () => callGlobal("UISetModeFromSelect"),
                defaultValue: "challenge",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("option", { value: "friendly", children: "Dengan alat" }),
                  /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("option", { value: "challenge", children: "Tanpa alat" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("section", { className: "bs-group", children: [
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("h1", { className: "bs-sec-title", children: "Lawan" }),
          /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "bs-field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("label", { className: "bs-label", htmlFor: "CharacterSelect", children: "Pilih Karakter" }),
            /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)(
              "select",
              {
                id: "CharacterSelect",
                className: "level-select bs-select",
                onChange: () => callGlobal("UIChangeCharacter"),
                defaultValue: "",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("option", { value: "", disabled: true, hidden: true }),
                  SORTED_BOTS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("option", { value: b.id, children: [
                    b.name,
                    " (",
                    b.elo,
                    " Elo)"
                  ] }, b.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "bs-field bs-time-row input-row", id: "timeRow", children: [
            /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("label", { className: "bs-label input-label", htmlFor: "TimePerMove", children: "Waktu per gerakan" }),
            /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "bs-time-input", children: [
              /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
                "input",
                {
                  id: "TimePerMove",
                  type: "number",
                  defaultValue: "2000",
                  ref: onNativeChange("UIChangeTimePerMove")
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("span", { className: "bs-unit", children: "milidetik" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "bs-group bs-field", id: "fenSection", children: [
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("h1", { className: "bs-sec-title", children: "Lanjutan" }),
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("label", { className: "bs-label bs-sr", htmlFor: "FenTextBox", children: "Posisi Papan (FEN)" }),
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("input", { id: "FenTextBox", type: "text", ref: onNativeChange("UIChangeFEN") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "bs-group bs-field", id: "statusSection", children: [
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("h1", { className: "bs-sec-title", children: "Status Mesin" }),
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { id: "output", children: "Selamat bermain\u2026" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("section", { className: "bs-group", children: [
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("h1", { className: "bs-sec-title", children: "Riwayat Gerakan (PGN)" }),
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("label", { className: "bs-label bs-sr", htmlFor: "PgnTextBox", children: "Riwayat Gerakan (PGN)" }),
          /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("textarea", { id: "PgnTextBox", readOnly: true })
        ] })
      ] })
    }
  );
}

// src/app/pages/bot/BotGameOverModal.tsx
var import_jsx_runtime45 = __toESM(require_jsx_runtime());
function BotGameOverModal() {
  return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "modal-overlay-bottom", id: "gameOverModal", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "gameover-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "gameover-message", id: "gameOverMessage", children: "Permainan selesai" }),
    /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "gameover-buttons", children: [
      /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
        "button",
        {
          type: "button",
          className: "gameover-btn gameover-btn-primary",
          onClick: () => callGlobal("UIGameOverNewGame"),
          children: "Permainan Baru"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
        "button",
        {
          type: "button",
          className: "gameover-btn gameover-btn-secondary",
          onClick: () => callGlobal("UIOpenGameReview"),
          children: "Ulasan Permainan"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
        "button",
        {
          type: "button",
          className: "gameover-btn gameover-btn-secondary",
          onClick: () => callGlobal("UIGameOverWait"),
          children: "Tunggu"
        }
      )
    ] })
  ] }) });
}

// src/app/pages/bot/BotPage.tsx
var import_jsx_runtime46 = __toESM(require_jsx_runtime());
function BotPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)(import_jsx_runtime46.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(AuthGateOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(OpponentSelectScreen, {}),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(BotGameArea, {}),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(BotSettingsModal, {}),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(BotGameOverModal, {})
  ] });
}

// src/app/pages/puzzles/SettingsGrid.tsx
var import_jsx_runtime47 = __toESM(require_jsx_runtime());
function SettingsGrid() {
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "settings-grid", children: [
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "setting-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("label", { htmlFor: "time-limit", "data-i18n": "timeLimit", children: "Time Limit" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("select", { id: "time-limit", onChange: () => callGlobal("toggleCustomInput", "time"), defaultValue: "300", children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "60", "data-i18n": "minute1", children: "1 Minute" }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "180", "data-i18n": "minutes3", children: "3 Minutes" }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "300", "data-i18n": "minutes5", children: "5 Minutes" }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "600", "data-i18n": "minutes10", children: "10 Minutes" }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "0", "data-i18n": "unlimited", children: "Unlimited" }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "custom", children: "kustom..." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { id: "time-custom", className: "custom-input", style: { display: "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
          "input",
          {
            type: "number",
            id: "time-custom-value",
            min: "1",
            max: "999",
            defaultValue: "5",
            placeholder: "1-999"
          }
        ),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "custom-unit", "data-i18n": "minutesUnit", children: "Minutes" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "setting-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("label", { htmlFor: "start-rating", "data-i18n": "startRating", children: "Start Rating" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(
        "select",
        {
          id: "start-rating",
          onChange: () => callGlobal("toggleCustomInput", "rating"),
          defaultValue: "1400",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "600", "data-i18n": "veryEasy", children: "Very Easy (~600)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "1000", "data-i18n": "easy", children: "Easy (~1000)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "1400", "data-i18n": "medium", children: "Medium (~1400)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "1800", "data-i18n": "advanced", children: "Advanced (~1800)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "2200", "data-i18n": "hard", children: "Hard (~2200)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "2600", "data-i18n": "veryHard", children: "Very Hard (~2600)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "3000", "data-i18n": "insane", children: "Insane (~3000)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "custom", children: "kustom..." })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { id: "rating-custom", className: "custom-input", style: { display: "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
          "input",
          {
            type: "number",
            id: "rating-custom-value",
            min: "0",
            max: "3200",
            defaultValue: "1400",
            placeholder: "0-3200"
          }
        ),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "custom-unit", children: "Rating" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "setting-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("label", { htmlFor: "max-errors", "data-i18n": "mistakes", children: "Mistakes" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("select", { id: "max-errors", onChange: () => callGlobal("toggleCustomInput", "errors"), defaultValue: "3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "1", "data-i18n": "mistake1", children: "1 Mistake" }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "3", "data-i18n": "mistakes3", children: "3 Mistakes" }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "5", "data-i18n": "mistakes5", children: "5 Mistakes" }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "0", "data-i18n": "unlimited", children: "Unlimited" }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "custom", children: "kustom..." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { id: "errors-custom", className: "custom-input", style: { display: "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
          "input",
          {
            type: "number",
            id: "errors-custom-value",
            min: "1",
            max: "99",
            defaultValue: "3",
            placeholder: "1-99"
          }
        ),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "custom-unit", "data-i18n": "mistakesUnit", children: "Mistakes" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "setting-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("label", { htmlFor: "rating-increase", "data-i18n": "increasePerPuzzle", children: "Increase per Puzzle" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(
        "select",
        {
          id: "rating-increase",
          onChange: () => callGlobal("toggleCustomInput", "increase"),
          defaultValue: "15",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "0", "data-i18n": "none", children: "None" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "10", "data-i18n": "slow", children: "Slow (+10)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "15", "data-i18n": "normal", children: "Normal (+15)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "25", "data-i18n": "fast", children: "Fast (+25)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "50", "data-i18n": "veryFast", children: "Very Fast (+50)" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("option", { value: "custom", children: "kustom..." })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { id: "increase-custom", className: "custom-input", style: { display: "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
          "input",
          {
            type: "number",
            id: "increase-custom-value",
            min: "0",
            max: "1000",
            defaultValue: "15",
            placeholder: "0-1000"
          }
        ),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "custom-unit", "data-i18n": "perPuzzle", children: "per Puzzle" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "setting-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("label", { htmlFor: "theme-filter-toggle", "data-i18n": "themeFilter", children: "Theme Filter" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "theme-dropdown-wrapper", children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "theme-dropdown-toggle", id: "theme-filter-toggle", children: [
          /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { id: "theme-filter-display", "data-i18n": "allThemes", children: "All Themes" }),
          /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "theme-dropdown-arrow", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "ui-ico ui-ico-caret-down", "aria-hidden": "true" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "theme-dropdown-panel", id: "theme-dropdown-panel", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "theme-dropdown-scroll", children: [
          /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "theme-item theme-item-all", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("button", { type: "button", id: "theme-reset-btn", className: "theme-reset-btn", "data-i18n": "reset", children: "Reset" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "theme-match-mode", children: [
            /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("label", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("input", { type: "radio", name: "theme-match", value: "any", defaultChecked: true }),
              /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { "data-i18n": "atLeastOneTheme", children: "At least one theme" }),
              /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
                "span",
                {
                  className: "info-icon",
                  "data-i18n-title": "atLeastOneThemeTooltip",
                  title: "Puzzle must contain at least one selected theme",
                  children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "ui-ico ui-ico-info", "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("label", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("input", { type: "radio", name: "theme-match", value: "all" }),
              /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { "data-i18n": "allThemesMatch", children: "All themes" }),
              /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
                "span",
                {
                  className: "info-icon",
                  "data-i18n-title": "allThemesMatchTooltip",
                  title: "Puzzle must contain all selected themes",
                  children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "ui-ico ui-ico-info", "aria-hidden": "true" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { id: "theme-filter-container" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "setting-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("label", { "data-i18n": "sound", children: "Sound" }),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "toggle-dropdown-wrapper", children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "toggle-dropdown-toggle", id: "sound-toggle", children: [
          /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { id: "sound-display", "data-i18n": "soundAllOn", children: "All On" }),
          /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "toggle-dropdown-arrow", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "ui-ico ui-ico-caret-down", "aria-hidden": "true" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "toggle-dropdown-panel", id: "sound-panel", children: [
          /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("label", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("input", { type: "checkbox", id: "sound-moves-cb", defaultChecked: true }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { "data-i18n": "soundMoves", children: "Moves" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("label", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("input", { type: "checkbox", id: "sound-effects-cb", defaultChecked: true }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { "data-i18n": "soundEffects", children: "Effects" })
          ] })
        ] })
      ] })
    ] })
  ] });
}

// src/app/pages/puzzles/ExtendedSettings.tsx
var import_jsx_runtime48 = __toESM(require_jsx_runtime());
function ExtendedSettings() {
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "extended-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("button", { type: "button", className: "extended-toggle", onClick: () => callGlobal("toggleExtendedSettings"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { className: "arrow", children: /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { className: "ui-ico ui-ico-caret-right", "aria-hidden": "true" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { "data-i18n": "advancedSettings", children: "Advanced Settings" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "extended-content", id: "extended-content", children: /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "extended-grid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "setting-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("label", { htmlFor: "bonus-time", "data-i18n": "bonusTimePerMove", children: "Bonus Time per Move" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)(
          "select",
          {
            id: "bonus-time",
            onChange: () => callGlobal("toggleCustomInput", "bonus"),
            defaultValue: "0",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "0", "data-i18n": "none", children: "None" }),
              /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "1", "data-i18n": "second1", children: "1 Second" }),
              /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "2", "data-i18n": "seconds2", children: "2 Seconds" }),
              /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "3", "data-i18n": "seconds3", children: "3 Seconds" }),
              /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "5", "data-i18n": "seconds5", children: "5 Seconds" }),
              /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "custom", children: "kustom..." })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { id: "bonus-custom", className: "custom-input", style: { display: "none" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(
            "input",
            {
              type: "number",
              id: "bonus-custom-value",
              min: "0",
              max: "60",
              defaultValue: "0",
              placeholder: "0-60"
            }
          ),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { className: "custom-unit", "data-i18n": "secondsUnit", children: "Seconds" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "setting-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("label", { htmlFor: "error-behavior", "data-i18n": "onMistake", children: "On Mistake" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("select", { id: "error-behavior", defaultValue: "retry", children: [
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "retry", "data-i18n": "tryAgain", children: "Try Again" }),
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "next", "data-i18n": "nextPuzzle", children: "Next Puzzle" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "setting-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("label", { "data-i18n": "showHints", children: "Show Hints" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "toggle-dropdown-wrapper", children: [
          /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "toggle-dropdown-toggle", id: "tips-toggle", children: [
            /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { id: "tips-display", "data-i18n": "hintsAll", children: "All" }),
            /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { className: "toggle-dropdown-arrow", children: /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { className: "ui-ico ui-ico-caret-down", "aria-hidden": "true" }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "toggle-dropdown-panel", id: "tips-panel", children: [
            /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("label", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("input", { type: "checkbox", id: "tips-temas-cb", defaultChecked: true }),
              /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { "data-i18n": "hintsThemes", children: "Themes" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("label", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("input", { type: "checkbox", id: "tips-piece-cb", defaultChecked: true }),
              /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { "data-i18n": "hintsPiece", children: "Piece" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "setting-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("label", { htmlFor: "color-choice", "data-i18n": "colorChoice", children: "Color" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("select", { id: "color-choice", defaultValue: "mixed", children: [
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "mixed", "data-i18n": "colorMixed", children: "Mixed" }),
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "white", "data-i18n": "colorWhite", children: "White" }),
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "black", "data-i18n": "colorBlack", children: "Black" }),
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "random", "data-i18n": "colorRandom", children: "Random" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "setting-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("label", { htmlFor: "show-rating", "data-i18n": "showRating", children: "Show Rating" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("select", { id: "show-rating", defaultValue: "1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "1", "data-i18n": "on", children: "On" }),
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("option", { value: "0", "data-i18n": "off", children: "Off" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "setting-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("label", { "data-i18n": "pieceCount", children: "Piece Count" }),
        /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "range-slider-container", children: [
          /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { className: "range-value", id: "piece-count-display", children: "3 \\u2013 32" }),
          /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "range-inputs", children: [
            /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "range-track" }),
            /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "range-track-active", id: "piece-count-track" }),
            /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("input", { type: "range", id: "piece-count-min", min: "3", max: "32", defaultValue: "3" }),
            /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("input", { type: "range", id: "piece-count-max", min: "3", max: "32", defaultValue: "32" })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}

// src/app/pages/puzzles/SetupScreen.tsx
var import_jsx_runtime49 = __toESM(require_jsx_runtime());
function SetupScreen() {
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("div", { id: "setup-screen", className: "screen active", children: /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)("div", { className: "settings-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("h2", { style: { margin: "0" }, "data-i18n": "settings", children: "Settings" }),
      /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)("div", { style: { display: "flex", gap: "12px", alignItems: "baseline" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)(
          "a",
          {
            href: "#",
            id: "daily-link",
            onClick: (e) => {
              e.preventDefault();
              callGlobal("startDailyPuzzle");
            },
            className: "daily-link",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("span", { "data-i18n": "dailyPuzzle", children: "Daily Puzzle" }),
              /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("span", { id: "daily-link-text" }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("span", { className: "ui-ico ui-ico-arrow-right", "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("span", { className: "lang-toggle", id: "lang-toggle", children: "\u200E" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(SettingsGrid, {}),
    /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(ExtendedSettings, {}),
    /* @__PURE__ */ (0, import_jsx_runtime49.jsxs)("div", { className: "settings-actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("button", { className: "btn btn-primary", onClick: () => callGlobal("startGame"), "data-i18n": "startGame", children: "Start Game" }),
      /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("button", { className: "btn btn-secondary", onClick: () => callGlobal("resetSettings"), "data-i18n": "reset", children: "Reset" })
    ] })
  ] }) });
}

// src/app/pages/puzzles/PuzzleGameScreen.tsx
var import_jsx_runtime50 = __toESM(require_jsx_runtime());
function PuzzleGameScreen() {
  return /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { id: "game-screen", className: "screen", children: /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "game-container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "board-section", children: [
      /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "board-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "board", id: "board" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "turn-indicator", id: "turn-indicator" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "side-panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "stats-grid", children: [
        /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "stat-box", children: [
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "stat-label", "data-i18n": "time", children: "Time" }),
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "stat-value time", id: "timer", children: "5:00" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "stat-box", children: [
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "stat-label", "data-i18n": "solved", children: "Solved" }),
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "stat-value solved", id: "solved", children: "0" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "stat-box", children: [
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "stat-label", "data-i18n": "mistakesLabel", children: "Mistakes" }),
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "stat-value errors", id: "errors", children: "0/3" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "stat-box", children: [
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "stat-label", "data-i18n": "rating", children: "Rating" }),
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "stat-value rating", id: "current-rating", children: "1200" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "progress-section", style: { display: "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "progress-label", "data-i18n": "puzzleProgress", children: "Puzzle Progress" }),
        /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "progress-bar", children: /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "progress-fill", id: "progress-fill", style: { width: "0%" } }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "feedback neutral", id: "feedback", "data-i18n": "findBestMove", children: "Find the best move!" }),
      /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "move-input-container", children: [
        /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(
          "input",
          {
            type: "text",
            id: "move-input",
            "data-i18n-placeholder": "moveInputPlaceholder",
            placeholder: "Enter move (e.g. Nf3)",
            autoComplete: "off",
            autoCapitalize: "off",
            spellCheck: "false"
          }
        ),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("button", { className: "btn-move-submit", onClick: () => callGlobal("submitMoveInput"), "aria-label": "Enter", children: /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("span", { className: "ui-ico ui-ico-enter", "aria-hidden": "true" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(
        "button",
        {
          className: "btn btn-skip",
          id: "skip-btn",
          onClick: () => callGlobal("skipPuzzle"),
          style: { display: "none" },
          "data-i18n": "continue_",
          children: "Continue"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "help-buttons", children: [
        /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("button", { className: "help-btn", id: "help-themes-btn", onClick: () => callGlobal("showThemeHint"), children: /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("span", { "data-i18n": "themesHintBtn", children: "Themes" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("button", { className: "help-btn", id: "help-piece-btn", onClick: () => callGlobal("showPieceHint"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("span", { className: "help-icon", children: /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("span", { className: "ui-ico ui-ico-pawn", "aria-hidden": "true" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("span", { "data-i18n": "showPieceBtn", children: "Show Piece" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(
        "button",
        {
          className: "btn btn-secondary btn-end-game",
          onClick: () => callGlobal("endGame"),
          "data-i18n": "endGame",
          children: "End Game"
        }
      )
    ] })
  ] }) });
}

// src/app/pages/puzzles/GameOverOverlay.tsx
var import_jsx_runtime51 = __toESM(require_jsx_runtime());
function GameOverOverlay() {
  return /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("div", { className: "game-over-overlay", id: "game-over", children: /* @__PURE__ */ (0, import_jsx_runtime51.jsxs)("div", { className: "game-over-content", children: [
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("h2", { "data-i18n": "gameOver", children: "Game Over!" }),
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("div", { className: "final-score", id: "final-score", children: "0" }),
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("div", { className: "stats-summary", id: "stats-summary", children: "puzzle gel\xF6st" }),
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(
      "button",
      {
        className: "btn btn-primary",
        onClick: () => callGlobal("showReviewScreen"),
        "data-i18n": "reviewpuzzle",
        children: "Review puzzle"
      }
    ),
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("button", { className: "btn btn-secondary", onClick: () => callGlobal("resetGame"), "data-i18n": "playAgain", children: "Play Again" }),
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(
      "button",
      {
        className: "btn btn-secondary",
        onClick: () => callGlobal("backToSettings"),
        "data-i18n": "settings",
        children: "Settings"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("div", { className: "highscore-section", id: "highscore-section", style: { display: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("div", { id: "highscore-comparison" }) })
  ] }) });
}

// src/app/pages/puzzles/DailyResultOverlay.tsx
var import_jsx_runtime52 = __toESM(require_jsx_runtime());
function DailyResultOverlay() {
  return /* @__PURE__ */ (0, import_jsx_runtime52.jsx)("div", { className: "game-over-overlay", id: "daily-result", children: /* @__PURE__ */ (0, import_jsx_runtime52.jsxs)("div", { className: "game-over-content", children: [
    /* @__PURE__ */ (0, import_jsx_runtime52.jsx)(
      "div",
      {
        style: { fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px" },
        "data-i18n": "dailyPuzzle",
        children: "Daily Puzzle"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime52.jsx)("div", { id: "daily-result-content" }),
    /* @__PURE__ */ (0, import_jsx_runtime52.jsx)(
      "button",
      {
        className: "btn btn-secondary",
        onClick: () => callGlobal("showReviewScreen"),
        "data-i18n": "viewSolution",
        children: "View Solution"
      }
    ),
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime52.jsx)(
      "button",
      {
        className: "btn btn-primary",
        onClick: () => callGlobal("backToSettings"),
        "data-i18n": "morepuzzle",
        children: "More puzzle!"
      }
    )
  ] }) });
}

// src/app/pages/puzzles/PromotionDialog.tsx
var import_jsx_runtime53 = __toESM(require_jsx_runtime());
var PROMOTION_PIECES = ["q", "r", "b", "n"];
function PromotionDialog() {
  return /* @__PURE__ */ (0, import_jsx_runtime53.jsx)("div", { className: "promotion-dialog", id: "promotion-dialog", children: PROMOTION_PIECES.map((piece) => /* @__PURE__ */ (0, import_jsx_runtime53.jsx)("div", { className: "promotion-option", "data-piece": piece }, piece)) });
}

// src/app/pages/puzzles/ReviewScreen.tsx
var import_jsx_runtime54 = __toESM(require_jsx_runtime());
function ReviewScreen() {
  return /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("div", { id: "review-screen", className: "screen", children: /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("h2", { "data-i18n": "puzzleOverview", children: "Puzzle Overview" }),
      /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-stats", children: [
        /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-stat", children: [
          /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "review-stat-label", "data-i18n": "total", children: "Total:" }),
          /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "review-stat-value", id: "review-total", children: "0" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-stat", children: [
          /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "review-stat-label", "data-i18n": "reviewSolved", children: "Solved:" }),
          /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "review-stat-value solved", id: "review-solved", children: "0" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-stat", children: [
          /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "review-stat-label", "data-i18n": "reviewUnsolved", children: "Unsolved:" }),
          /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "review-stat-value failed", id: "review-failed", children: "0" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-controls", children: [
      /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-filters", children: [
        /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(
          "button",
          {
            className: "review-filter-btn active",
            "data-filter": "all",
            onClick: () => callGlobal("setReviewFilter", "all"),
            "data-i18n": "filterAll",
            children: "All"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(
          "button",
          {
            className: "review-filter-btn",
            "data-filter": "solved",
            onClick: () => callGlobal("setReviewFilter", "solved"),
            children: /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "ui-ico ui-ico-check", "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(
          "button",
          {
            className: "review-filter-btn",
            "data-filter": "failed",
            onClick: () => callGlobal("setReviewFilter", "failed"),
            children: /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "ui-ico ui-ico-close", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-sort", children: [
        /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(
          "button",
          {
            className: "review-sort-btn active",
            "data-sort": "number",
            onClick: () => callGlobal("setReviewSort", "number"),
            "data-i18n-title": "byNumber",
            title: "By Number",
            children: "#"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(
          "button",
          {
            className: "review-sort-btn",
            "data-sort": "rating",
            onClick: () => callGlobal("setReviewSort", "rating"),
            "data-i18n-title": "byRating",
            title: "By Rating",
            children: /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "ui-ico ui-ico-star", "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(
          "button",
          {
            className: "review-sort-btn",
            "data-sort": "time",
            onClick: () => callGlobal("setReviewSort", "time"),
            "data-i18n-title": "byTime",
            title: "By Time",
            children: /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "ui-ico ui-ico-timer", "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(
          "button",
          {
            className: "review-sort-btn",
            "data-sort": "attempts",
            onClick: () => callGlobal("setReviewSort", "attempts"),
            "data-i18n-title": "byAttempts",
            title: "By Attempts",
            children: /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "ui-ico ui-ico-retry", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-views", children: [
        /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(
          "button",
          {
            className: "review-view-btn active",
            "data-view": "grid",
            onClick: () => callGlobal("setReviewView", "grid"),
            "data-i18n-title": "gridView",
            title: "Grid",
            children: /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "ui-ico ui-ico-grid", "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(
          "button",
          {
            className: "review-view-btn",
            "data-view": "list",
            onClick: () => callGlobal("setReviewView", "list"),
            "data-i18n-title": "listView",
            title: "List",
            children: /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "ui-ico ui-ico-menu", "aria-hidden": "true" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("div", { className: "review-content", id: "review-content" }),
    /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "review-back-section", children: [
      /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("button", { className: "btn btn-secondary", onClick: () => callGlobal("resetGame"), "data-i18n": "playAgain", children: "Play Again" }),
      /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(
        "button",
        {
          className: "btn btn-secondary",
          onClick: () => callGlobal("backToSettings"),
          "data-i18n": "settings",
          children: "Settings"
        }
      )
    ] })
  ] }) });
}

// src/app/pages/puzzles/ReviewDetailBody.tsx
var import_jsx_runtime55 = __toESM(require_jsx_runtime());
function ReviewDetailBody() {
  return /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "review-detail-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "review-detail-board-section", id: "review-detail-board-section", children: [
      /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "eval-bar hidden", id: "eval-bar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "eval-bar-fill", id: "eval-bar-fill", style: { height: "50%" } }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "eval-bar-text", id: "eval-bar-text", children: "0.0" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "review-board-col", children: [
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { id: "review-board" }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "review-turn-indicator", id: "review-turn-indicator" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "review-detail-info", children: [
      /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "stockfish-panel hidden", id: "stockfish-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "stockfish-status", id: "sf-status" }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "stockfish-variants", id: "sf-variants" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "analysis-controls hidden", id: "analysis-controls", children: /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "analysis-playback", children: [
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(
          "button",
          {
            onClick: () => callGlobal("analysisGoToStart"),
            "data-i18n-title": "goToStart",
            title: "Go to Start",
            children: /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(NavIcon, { name: "first" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("button", { onClick: () => callGlobal("analysisGoBack"), "data-i18n-title": "back", title: "Back", children: /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(NavIcon, { name: "prev" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("button", { onClick: () => callGlobal("analysisGoForward"), "data-i18n-title": "forward", title: "Forward", children: /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(NavIcon, { name: "next" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("button", { onClick: () => callGlobal("analysisGoToEnd"), "data-i18n-title": "goToEnd", title: "Go to End", children: /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(NavIcon, { name: "last" }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "review-mode-buttons", id: "review-mode-buttons", children: [
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(
          "button",
          {
            className: "review-mode-btn active",
            id: "mode-btn-solution",
            onClick: () => callGlobal("reviewNeuerVersuch"),
            "data-i18n": "retry",
            children: "Retry"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(
          "button",
          {
            className: "review-mode-btn",
            id: "mode-btn-loesung",
            onClick: () => callGlobal("switchReviewMode", "loesung"),
            "data-i18n": "solution",
            children: "Solution"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(
          "button",
          {
            className: "review-mode-btn",
            id: "mode-btn-analysis",
            onClick: () => callGlobal("switchReviewMode", "analysis"),
            "data-i18n": "analysis",
            children: "Analysis"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(
          "button",
          {
            className: "review-mode-btn",
            id: "mode-btn-stockfish",
            onClick: () => callGlobal("switchReviewMode", "stockfish"),
            children: "Stockfish"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "review-puzzle-info", children: [
        /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("p", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "label", "data-i18n": "attemptsLabel", children: "Attempts:" }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { id: "review-detail-attempts", children: "1" })
        ] }),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("p", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "label", "data-i18n": "timeLabel", children: "Time:" }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { id: "review-detail-time", children: "0:00" })
        ] }),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("p", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "label", "data-i18n": "ratingLabel", children: "Rating:" }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { id: "review-detail-rating", children: "1200" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("p", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "label", "data-i18n": "themesLabel", children: "Themes:" }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { id: "review-detail-themes", children: "-" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)(
          "a",
          {
            id: "review-lichess-link",
            href: "#",
            target: "_blank",
            className: "review-lichess-link",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { "data-i18n": "puzzleOnLichess", children: "Puzzle on Lichess" }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "ui-ico ui-ico-external", "aria-hidden": "true" })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "review-feedback neutral", id: "review-feedback", "data-i18n": "findBestMove", children: "Find the best move!" }),
      /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "review-solution hidden", id: "review-solution", children: /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "review-solution-content", children: [
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "review-solution-moves", id: "review-solution-moves" }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "review-playback", children: [
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(
            "button",
            {
              onClick: () => callGlobal("reviewGoToStart"),
              "data-i18n-title": "goToStart",
              title: "Go to Start",
              children: /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(NavIcon, { name: "first" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("button", { onClick: () => callGlobal("reviewPrevMove"), "data-i18n-title": "back", title: "Back", children: /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(NavIcon, { name: "prev" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("button", { onClick: () => callGlobal("reviewNextMove"), "data-i18n-title": "forward", title: "Forward", children: /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(NavIcon, { name: "next" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("button", { onClick: () => callGlobal("reviewGoToEnd"), "data-i18n-title": "goToEnd", title: "Go to End", children: /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(NavIcon, { name: "last" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(
            "button",
            {
              onClick: () => callGlobal("reviewPlaySolution"),
              "data-i18n-title": "play",
              title: "Play",
              id: "review-play-btn",
              children: /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(NavIcon, { name: "play" })
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}

// src/app/pages/puzzles/ReviewDetailOverlay.tsx
var import_jsx_runtime56 = __toESM(require_jsx_runtime());
function ReviewDetailOverlay() {
  return /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("div", { className: "review-detail-overlay", id: "review-detail", children: /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "review-detail-content", children: [
    /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "review-detail-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "review-detail-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("h3", { id: "review-detail-title", children: "Puzzle #1" }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("span", { className: "review-detail-status", id: "review-detail-status", "data-i18n": "reviewSolvedStatus", children: "Solved" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("button", { className: "review-detail-close", onClick: () => callGlobal("closeReviewDetail"), "aria-label": "Tutup", children: /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("span", { className: "ui-ico ui-ico-close", "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(ReviewDetailBody, {}),
    /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "review-detail-nav", children: [
      /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)(
        "button",
        {
          className: "review-nav-btn",
          id: "review-prev-btn",
          onClick: () => callGlobal("reviewPrevPuzzle"),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("span", { className: "ui-ico ui-ico-arrow-left", "aria-hidden": "true" }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("span", { "data-i18n": "previous", children: "Previous" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)(
        "button",
        {
          className: "review-nav-btn",
          id: "review-next-btn",
          onClick: () => callGlobal("reviewNextPuzzle"),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("span", { "data-i18n": "next", children: "Next" }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("span", { className: "ui-ico ui-ico-arrow-right", "aria-hidden": "true" })
          ]
        }
      )
    ] })
  ] }) });
}

// src/app/pages/puzzles/PuzzlesPage.tsx
var import_jsx_runtime57 = __toESM(require_jsx_runtime());
function PuzzlesPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)(import_jsx_runtime57.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(AuthGateOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(SetupScreen, {}),
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(PuzzleGameScreen, {}),
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(GameOverOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(DailyResultOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(PromotionDialog, {}),
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(ReviewScreen, {}),
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(ReviewDetailOverlay, {})
  ] });
}

// src/app/pages/gamereview/Evaluation.tsx
var import_jsx_runtime58 = __toESM(require_jsx_runtime());
function Evaluation() {
  return /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { className: "bc-eval", id: "evalbar", "data-bottom": "w", role: "img", "aria-label": "Batang evaluasi", children: [
    /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("div", { className: "bc-eval-fill", id: "evalfill" }),
    /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { className: "bc-eval-labels", children: [
      /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("div", { className: "bc-eval-label", id: "evalLabelA", children: "0.0" }),
      /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("div", { className: "bc-eval-label", id: "evalLabelB", children: "0.0" })
    ] })
  ] });
}

// src/app/pages/gamereview/Name.tsx
var import_jsx_runtime59 = __toESM(require_jsx_runtime());
function Name({ id, side }) {
  return /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("div", { className: "bc-name", id, "data-side": side, children: [
    /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("div", { className: "pb-avatar", children: /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("svg", { className: "avatar-default-icon", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", focusable: "false", children: [
      /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("circle", { cx: "12", cy: "8", r: "4.2" }),
      /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("path", { d: "M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("div", { className: "pb-text", children: [
      /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("span", { className: "pb-name", children: side === "w" ? "Putih" : "Hitam" }),
      /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("span", { className: "pb-meta" })
    ] })
  ] });
}

// src/app/pages/gamereview/Board.tsx
var import_jsx_runtime60 = __toESM(require_jsx_runtime());
function Board() {
  return /* @__PURE__ */ (0, import_jsx_runtime60.jsxs)("div", { className: "bc-boardbox", id: "boardBox", children: [
    /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("div", { id: "board", onContextMenu: (e) => e.preventDefault() }),
    /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("svg", { id: "arrowsvg", viewBox: "0 0 8 8", preserveAspectRatio: "none", "aria-hidden": "true" }),
    /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("div", { className: "bc-promo", id: "promoPicker", hidden: true })
  ] });
}

// src/app/pages/gamereview/Game.tsx
var import_jsx_runtime61 = __toESM(require_jsx_runtime());
function Game() {
  return /* @__PURE__ */ (0, import_jsx_runtime61.jsxs)("div", { className: "bc-game", id: "boardArea", children: [
    /* @__PURE__ */ (0, import_jsx_runtime61.jsx)("div", { className: "bc-evalcol", children: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Evaluation, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime61.jsxs)("div", { className: "bc-boardcol", children: [
      /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Name, { id: "playerTop", side: "b" }),
      /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Board, {}),
      /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Name, { id: "playerBottom", side: "w" })
    ] })
  ] });
}

// src/app/pages/gamereview/BoardMenu.tsx
var import_jsx_runtime62 = __toESM(require_jsx_runtime());
function BoardMenu() {
  return /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("div", { className: "bc-boardmenu", children: /* @__PURE__ */ (0, import_jsx_runtime62.jsxs)("div", { className: "bc-bm-icons", children: [
    /* @__PURE__ */ (0, import_jsx_runtime62.jsx)(
      "button",
      {
        type: "button",
        className: "bc-bm-btn",
        id: "settingsBtn",
        title: "Pengaturan",
        "aria-label": "Pengaturan",
        "aria-haspopup": "true",
        "aria-expanded": "false",
        "aria-controls": "reviewSettingsMenu",
        children: /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("img", { src: "/images/bc-settings.svg", alt: "", width: 17, height: 17, draggable: false })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("button", { type: "button", className: "bc-bm-btn", id: "navShare", title: "Bagikan PGN", "aria-label": "Bagikan PGN", children: /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("img", { src: "/images/bc-share.svg", alt: "", width: 17, height: 17, draggable: false }) }),
    /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("button", { type: "button", className: "bc-bm-btn", id: "navFlip", title: "Balik papan", "aria-label": "Balik papan", children: /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("img", { src: "/images/bc-flip.svg", alt: "", width: 17, height: 17, draggable: false }) })
  ] }) });
}

// src/app/pages/gamereview/svg/lens.tsx
var import_jsx_runtime63 = __toESM(require_jsx_runtime());
function Lens(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime63.jsx)("svg", { className: props.class, width: `${props.size ?? 28}px`, height: `${props.size ?? 28}px`, viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime63.jsx)("path", { d: "M602.829 712.369l230.358 233.067c22.423 22.687 58.944 22.853 81.572.373s22.795-59.096.372-81.783l-222.148-224.76c53.94-61.34 86.688-142.107 86.688-230.556 0-191.674-153.786-347.268-343.755-347.268S92.161 217.037 92.161 408.71c0 191.674 153.786 347.268 343.755 347.268 60.591 0 117.501-15.829 166.914-43.608zm-166.914-72.052c-126.02 0-228.394-103.577-228.394-231.608s102.374-231.608 228.394-231.608c126.02 0 228.394 103.577 228.394 231.608S561.935 640.317 435.915 640.317z" }) });
}

// src/app/pages/gamereview/Settings.tsx
var import_jsx_runtime64 = __toESM(require_jsx_runtime());
function MiniBoard({ children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime64.jsxs)("span", { className: "bc-mini", "aria-hidden": "true", children: [
    [0, 1, 2, 3].map((i) => /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("span", { className: "bc-mini-sq " + ((i % 2 + Math.floor(i / 2)) % 2 === 0 ? "l" : "d"), children: i === 2 ? /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("img", { src: "/images/bc/pieces/wQ.svg", alt: "", width: 20, height: 20, draggable: false }) : null }, i)),
    children
  ] });
}
function Settings() {
  return /* @__PURE__ */ (0, import_jsx_runtime64.jsxs)("div", { className: "bc-settings", id: "reviewSettingsMenu", role: "group", "aria-label": "Pengaturan", hidden: true, children: [
    /* @__PURE__ */ (0, import_jsx_runtime64.jsxs)("section", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("h1", { className: "bc-st-title", children: "Analisis" }),
      /* @__PURE__ */ (0, import_jsx_runtime64.jsxs)("label", { className: "bc-st", htmlFor: "autoAnalyze", children: [
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("span", { className: "bc-st-ico", children: /* @__PURE__ */ (0, import_jsx_runtime64.jsx)(Lens, { class: "bc-st-lens", size: 32 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("span", { className: "bc-st-text", children: "Analisis otomatis" }),
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("input", { type: "checkbox", id: "autoAnalyze", className: "bc-st-input", defaultChecked: true }),
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("span", { className: "bc-st-dot" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime64.jsxs)("section", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("h1", { className: "bc-st-title", children: "Langkah Terbaik" }),
      /* @__PURE__ */ (0, import_jsx_runtime64.jsxs)("label", { className: "bc-st", htmlFor: "showArrow", children: [
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)(MiniBoard, { children: /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("svg", { className: "bc-mini-arrow", viewBox: "0 0 40 40", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("polygon", { points: "4,29 22,29 22,24 34,30 22,36 22,31 4,31", fill: "var(--arrow-best)", opacity: "0.8" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("span", { className: "bc-st-text", children: "Tampilkan panah" }),
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("input", { type: "checkbox", id: "showArrow", className: "bc-st-input", defaultChecked: true }),
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("span", { className: "bc-st-dot" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime64.jsxs)("label", { className: "bc-st bc-st-select", htmlFor: "arrowCount", children: [
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("span", { className: "bc-st-text", children: "Jumlah panah" }),
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("select", { id: "arrowCount", defaultValue: "3", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("option", { value: String(n), children: n }, n)) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime64.jsxs)("section", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("h1", { className: "bc-st-title", children: "Putar Otomatis" }),
      /* @__PURE__ */ (0, import_jsx_runtime64.jsxs)("label", { className: "bc-st bc-st-select", htmlFor: "autoPlaySpeed", children: [
        /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("span", { className: "bc-st-text", children: "Kecepatan putar" }),
        /* @__PURE__ */ (0, import_jsx_runtime64.jsxs)("select", { id: "autoPlaySpeed", defaultValue: "1200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("option", { value: "2000", children: "Lambat" }),
          /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("option", { value: "1200", children: "Normal" }),
          /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("option", { value: "700", children: "Cepat" }),
          /* @__PURE__ */ (0, import_jsx_runtime64.jsx)("option", { value: "350", children: "Sangat cepat" })
        ] })
      ] })
    ] })
  ] });
}

// src/app/pages/gamereview/svg/pawn.tsx
var import_jsx_runtime65 = __toESM(require_jsx_runtime());
function Pawn(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime65.jsx)("svg", { className: props.class, height: `${props.size}px`, width: `${props.size}px`, version: "1.1", id: "Capa_1", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 297 297", children: /* @__PURE__ */ (0, import_jsx_runtime65.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime65.jsx)("path", { d: "M223.333,247h-5.926c2.607-3.811,10.798-18.024-0.727-32.248c-13.334-16.46-39.863-65.748-27.324-98.752h0.977\n                c4.418,0,7.667-3.582,7.667-8v-1c0-4.418-3.249-8-7.667-8h-1.225c10.917-10.466,17.725-25.184,17.725-41.5\n                c0-31.756-25.744-57.5-57.5-57.5s-57.5,25.744-57.5,57.5c0,16.316,6.808,31.034,17.725,41.5h-2.225c-4.418,0-8.333,3.582-8.333,8v1\n                c0,4.418,3.915,8,8.333,8h1.979c12.539,33.004-13.99,82.292-27.324,98.752c-11.524,14.224-3.334,28.437-0.727,32.248h-6.928\n                c-4.418,0-8.333,3.582-8.333,8v18c0,4.418,3.915,8,8.333,8H75v16h148v-16c5,0,8-3.582,8-8v-18C231,250.582,227.751,247,223.333,247\n                z" }) }) });
}

// src/app/pages/gamereview/svg/star.tsx
var import_jsx_runtime66 = __toESM(require_jsx_runtime());
function Star(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime66.jsx)("svg", { className: props.class, height: props.size, width: props.size, version: "1.1", id: "_x32_", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", children: /* @__PURE__ */ (0, import_jsx_runtime66.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime66.jsx)("path", { d: "M510.698,196.593c-3.61-11.2-14.034-18.795-25.794-18.795H329.21L281.791,30.155\n		c-3.599-11.2-14.018-18.808-25.791-18.808c-11.772,0-22.192,7.608-25.791,18.808l-47.418,147.642H27.097\n		c-11.761,0-22.185,7.594-25.795,18.795c-3.599,11.2,0.436,23.449,9.999,30.302l126.246,90.643l-48.598,147.54\n		c-3.694,11.193,0.278,23.47,9.801,30.398c9.529,6.926,22.44,6.897,31.94-0.058L256,403.594l125.312,91.824\n		c9.5,6.956,22.411,6.985,31.941,0.058c9.522-6.927,13.494-19.205,9.811-30.398l-48.61-147.54L500.7,226.895\n		C510.262,220.042,514.298,207.792,510.698,196.593z" }) }) });
}

// src/app/pages/gamereview/svg/boardIcon.tsx
var import_jsx_runtime67 = __toESM(require_jsx_runtime());
function BoardIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime67.jsxs)("svg", { className: props.class, width: props.size + "px", height: props.size + "px", viewBox: "0 0 20 20", version: "1.1", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ (0, import_jsx_runtime67.jsx)("title", { children: "chess [#1218]" }),
    /* @__PURE__ */ (0, import_jsx_runtime67.jsx)("desc", { children: "Created with Sketch." }),
    /* @__PURE__ */ (0, import_jsx_runtime67.jsx)("defs", {}),
    /* @__PURE__ */ (0, import_jsx_runtime67.jsx)("g", { id: "Page-1", stroke: "none", strokeWidth: "1", fillRule: "evenodd", children: /* @__PURE__ */ (0, import_jsx_runtime67.jsx)("g", { id: "Dribbble-Light-Preview", transform: "translate(-220.000000, -2719.000000)", children: /* @__PURE__ */ (0, import_jsx_runtime67.jsx)("g", { id: "icons", transform: "translate(56.000000, 160.000000)", children: /* @__PURE__ */ (0, import_jsx_runtime67.jsx)("path", { d: "M174,2573 L178,2573 L178,2569 L174,2569 L174,2573 Z M170,2569 L174,2569 L174,2565 L170,2565 L170,2569 Z M182,2565 L178,2565 L178,2569 L182,2569 L182,2573 L178,2573 L178,2577 L174,2577 L174,2573 L170,2573 L170,2577 L167,2577 C166.448,2577 166,2576.657 166,2576.105 L166,2573 L170,2573 L170,2569 L166,2569 L166,2565 L170,2565 L170,2561 L174,2561 L174,2565 L178,2565 L178,2561 L181,2561 C181.552,2561 182,2561.552 182,2562.105 L182,2565 Z M182,2559 L166,2559 C164.895,2559 164,2559.895 164,2561 L164,2577 C164,2578.104 164.895,2579 166,2579 L182,2579 C183.105,2579 184,2578.104 184,2577 L184,2561 C184,2559.895 183.105,2559 182,2559 L182,2559 Z", id: "chess-[#1218]" }) }) }) })
  ] });
}

// src/app/pages/gamereview/svg/arrow.tsx
var import_jsx_runtime68 = __toESM(require_jsx_runtime());
function Arrow(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime68.jsxs)("svg", { width: "20px", height: "20px", viewBox: "0 -4.5 20 20", version: "1.1", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ (0, import_jsx_runtime68.jsx)("title", { children: "arrow_up [#337]" }),
    /* @__PURE__ */ (0, import_jsx_runtime68.jsx)("desc", { children: "Created with Sketch." }),
    /* @__PURE__ */ (0, import_jsx_runtime68.jsx)("defs", {}),
    /* @__PURE__ */ (0, import_jsx_runtime68.jsx)("g", { id: "Page-1", stroke: "none", strokeWidth: "1", fill: "none", fillRule: "evenodd", children: /* @__PURE__ */ (0, import_jsx_runtime68.jsx)("g", { id: "Dribbble-Light-Preview", transform: "translate(-260.000000, -6684.000000)", className: props.class, children: /* @__PURE__ */ (0, import_jsx_runtime68.jsx)("g", { id: "icons", transform: "translate(56.000000, 160.000000)", children: /* @__PURE__ */ (0, import_jsx_runtime68.jsx)("path", { d: "M223.707692,6534.63378 L223.707692,6534.63378 C224.097436,6534.22888 224.097436,6533.57338 223.707692,6533.16951 L215.444127,6524.60657 C214.66364,6523.79781 213.397472,6523.79781 212.616986,6524.60657 L204.29246,6533.23165 C203.906714,6533.6324 203.901717,6534.27962 204.282467,6534.68555 C204.671211,6535.10081 205.31179,6535.10495 205.70653,6534.69695 L213.323521,6526.80297 C213.714264,6526.39807 214.346848,6526.39807 214.737591,6526.80297 L222.294621,6534.63378 C222.684365,6535.03868 223.317949,6535.03868 223.707692,6534.63378", id: "arrow_up-[#337]" }) }) }) })
  ] });
}

// src/app/pages/gamereview/Form.tsx
var import_jsx_runtime69 = __toESM(require_jsx_runtime());
var FORMATS = [
  ["chesscom", "Chess.com", "/images/bc-chesscom.svg", "platform"],
  ["lichess", "Lichess.org", "/images/bc-lichess.svg", "platform"],
  ["pgn", "PGN", "/images/bc-pgn.svg", "format"],
  ["fen", "FEN", "/images/bc-json.svg", "format"]
];
var TYPES = [
  ["Cepat", "/images/bc-quick.svg", "14"],
  ["Dasar", "/images/bc-standard.svg", "16"],
  ["Kustom", "/images/bc-deep.svg", "custom"]
];
var CUSTOM_DEPTHS = [
  [12, "kilat"],
  [13, ""],
  [14, "cepat"],
  [15, "disarankan"],
  [16, "seimbang"],
  [17, ""],
  [18, "akurat"],
  [20, "dalam"],
  [22, "maksimal"]
];
function Form() {
  return /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("form", { className: "bc-form", id: "importForm", autoComplete: "off", children: [
    /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("div", { className: "bc-error", id: "importError", role: "alert", hidden: true }),
    /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("label", { className: "sr-only", htmlFor: "importInput", children: "Isian impor" }),
    /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("textarea", { id: "importInput", rows: 1, spellCheck: false, placeholder: "Masukkan pengguna Chess.com di sini" }),
    /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("div", { className: "fmt-select", id: "importChoices", children: [
      /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("button", { type: "button", className: "fmt-current", id: "fmtToggle", "aria-expanded": "false", "aria-controls": "fmtOptions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("img", { id: "fmtIcon", src: "/images/bc-chesscom.svg", alt: "", width: 28, height: 28, draggable: false }),
        /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("span", { id: "fmtLabel", children: "Chess.com" }),
        /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("span", { className: "bc-chevron", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime69.jsx)(Arrow, { class: "bc-arrow-fill" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("div", { className: "fmt-options", id: "fmtOptions", hidden: true, children: [
        /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("h6", { className: "fmt-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("img", { src: "/images/bc-formats.svg", alt: "", width: 18, height: 18, draggable: false }),
          "Format Game"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("ul", { className: "fmt-grid", children: FORMATS.map(([key, label, icon]) => /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("button", { type: "button", className: "import-choice fmt-opt", "data-import": key, "data-label": label, children: [
          /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("img", { src: icon, alt: "", draggable: false }),
          label
        ] }) }, key)) }),
        /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("h6", { className: "fmt-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("img", { src: "/images/bc-type.svg", alt: "", width: 20, height: 20, draggable: false }),
          "Tipe Analisis"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("ul", { className: "depth-grid", id: "depthOptions", children: TYPES.map(([label, icon, d]) => /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("button", { type: "button", className: "depth-opt", "data-depth": String(d), title: d === "custom" ? "Pilih kedalaman sendiri" : `Kedalaman: ${d}`, "aria-pressed": "false", children: [
          /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("img", { src: icon, alt: "", draggable: false }),
          label
        ] }) }, d)) }),
        /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("div", { className: "bc-custom-depth", id: "customDepthBox", hidden: true, children: [
          /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("h6", { className: "fmt-head", children: "Kedalaman (Depth)" }),
          /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("ul", { className: "depth-grid", id: "customDepthOptions", children: CUSTOM_DEPTHS.map(([d, note]) => /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("button", { type: "button", className: "depth-opt depth-num", "data-cdepth": String(d), "aria-pressed": "false", title: `Kedalaman ${d}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("b", { children: d }),
            note ? /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("small", { children: note }) : null
          ] }) }, d)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("select", { id: "reviewDepth", defaultValue: "16", hidden: true, "aria-hidden": "true", tabIndex: -1, children: [12, 13, 14, 15, 16, 17, 18, 20, 22].map((d) => /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("option", { value: String(d), children: d }, d)) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("button", { type: "submit", className: "bc-primary", id: "importSubmit", children: "Daftar permainan" }),
    /* @__PURE__ */ (0, import_jsx_runtime69.jsxs)("div", { className: "bc-fen-extra", id: "fenExtra", hidden: true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("button", { type: "button", className: "bc-secondary", id: "copyFen", children: "Salin FEN saat ini" }),
      /* @__PURE__ */ (0, import_jsx_runtime69.jsx)("div", { className: "bc-small", id: "fenOut", style: { wordBreak: "break-all" } })
    ] })
  ] });
}

// src/app/pages/gamereview/svg/files.tsx
var import_jsx_runtime70 = __toESM(require_jsx_runtime());
function Files({ className, size }) {
  return /* @__PURE__ */ (0, import_jsx_runtime70.jsxs)("svg", { width: size, height: size, viewBox: "0 0 1024 1024", className: "icon " + className, version: "1.1", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ (0, import_jsx_runtime70.jsx)("path", { d: "M242.3 743.4h603.4c27.8 0 50.3-22.5 50.3-50.3V192H192v501.1c0 27.8 22.5 50.3 50.3 50.3z", fill: "#FFEA00" }),
    /* @__PURE__ */ (0, import_jsx_runtime70.jsx)("path", { d: "M178.3 807.4h603.4c27.8 0 50.3-22.5 50.3-50.3V256H128v501.1c0 27.8 22.5 50.3 50.3 50.3z", fill: "#FFFF8D" }),
    /* @__PURE__ */ (0, import_jsx_runtime70.jsx)("path", { d: "M960 515v384c0 35.3-28.7 64-64 64H128c-35.3 0-64-28.7-64-64V383.8c0-35.3 28.7-64 64-64h344.1c24.5 0 46.8 13.9 57.5 35.9l46.5 95.3H896c35.3 0 64 28.7 64 64z", fill: "#3D5AFE" }),
    /* @__PURE__ */ (0, import_jsx_runtime70.jsx)("path", { d: "M704 512c0-20.7-1.4-41.1-4.1-61H576.1l-46.5-95.3c-10.7-22-33.1-35.9-57.5-35.9H128c-35.3 0-64 28.7-64 64V899c0 6.7 1 13.2 3 19.3C124.4 945 188.5 960 256 960c247.4 0 448-200.6 448-448z", fill: "#536DFE" })
  ] });
}

// src/app/pages/gamereview/SelectGame.tsx
var import_jsx_runtime71 = __toESM(require_jsx_runtime());
function SelectGame() {
  return /* @__PURE__ */ (0, import_jsx_runtime71.jsxs)("div", { className: "bc-select", id: "selectRoot", children: [
    /* @__PURE__ */ (0, import_jsx_runtime71.jsx)("div", { className: "bc-sel-loading", id: "selLoading", hidden: true, children: /* @__PURE__ */ (0, import_jsx_runtime71.jsxs)("div", { className: "bc-sel-loadbox", children: [
      /* @__PURE__ */ (0, import_jsx_runtime71.jsxs)("div", { className: "bc-sel-loadinner", children: [
        /* @__PURE__ */ (0, import_jsx_runtime71.jsx)(Files, { className: "bc-sel-files", size: 60 }),
        /* @__PURE__ */ (0, import_jsx_runtime71.jsx)("span", { className: "bc-sel-what", id: "selWhat", children: "Arsip" }),
        /* @__PURE__ */ (0, import_jsx_runtime71.jsxs)("span", { className: "bc-sel-api", children: [
          "Mengambil API",
          /* @__PURE__ */ (0, import_jsx_runtime71.jsx)("span", { id: "selDots" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime71.jsx)("button", { type: "button", className: "bc-sel-cancel", id: "selCancel", children: "Batal" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime71.jsxs)("div", { className: "bc-sel-content", id: "selContent", hidden: true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime71.jsxs)("h1", { className: "bc-sel-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime71.jsx)("a", { id: "selUser", target: "_blank", rel: "noopener noreferrer" }),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime71.jsx)("span", { id: "selTitleSuffix" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime71.jsx)("hr", { className: "bc-hr-full" }),
      /* @__PURE__ */ (0, import_jsx_runtime71.jsx)("div", { className: "bc-sel-months", id: "selMonths" })
    ] })
  ] });
}

// src/app/pages/gamereview/Loading.tsx
var import_jsx_runtime72 = __toESM(require_jsx_runtime());
function Loading() {
  return /* @__PURE__ */ (0, import_jsx_runtime72.jsxs)("div", { className: "bc-loading", children: [
    /* @__PURE__ */ (0, import_jsx_runtime72.jsxs)("div", { className: "bc-loading-title", children: [
      "Menganalisis",
      /* @__PURE__ */ (0, import_jsx_runtime72.jsx)("span", { id: "loadingDots" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime72.jsx)("hr", { className: "bc-hr-full" }),
    /* @__PURE__ */ (0, import_jsx_runtime72.jsx)("div", { className: "bc-loading-center", children: /* @__PURE__ */ (0, import_jsx_runtime72.jsxs)("div", { className: "bc-loading-box", id: "progress", children: [
      /* @__PURE__ */ (0, import_jsx_runtime72.jsxs)("div", { className: "bc-loading-inner", children: [
        /* @__PURE__ */ (0, import_jsx_runtime72.jsx)(Lens, { class: "bc-loading-lens", size: 60 }),
        /* @__PURE__ */ (0, import_jsx_runtime72.jsx)("span", { className: "bc-loading-fmt", id: "loadingFmt", children: "PGN" }),
        /* @__PURE__ */ (0, import_jsx_runtime72.jsxs)("span", { className: "bc-loading-text", children: [
          "Menganalisis Permainan",
          /* @__PURE__ */ (0, import_jsx_runtime72.jsx)("span", { id: "loadingDots2" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime72.jsx)("button", { type: "button", className: "bc-loading-cancel", id: "scanCancel", children: "Batal" }),
      /* @__PURE__ */ (0, import_jsx_runtime72.jsx)("div", { className: "bc-loading-bar", id: "progressbar" })
    ] }) })
  ] });
}

// src/app/pages/gamereview/Summary.tsx
var import_jsx_runtime73 = __toESM(require_jsx_runtime());
function Summary() {
  return /* @__PURE__ */ (0, import_jsx_runtime73.jsxs)("div", { className: "bc-summary-pane", children: [
    /* @__PURE__ */ (0, import_jsx_runtime73.jsx)("div", { className: "bc-empty", id: "summaryEmpty", children: "Belum ada ringkasan. Muat permainan lewat tab Analisis Game, atau pindai langkah di tab Langkah." }),
    /* @__PURE__ */ (0, import_jsx_runtime73.jsx)("div", { className: "bc-summary", id: "reviewList" })
  ] });
}

// src/app/pages/gamereview/Moves.tsx
var import_jsx_runtime74 = __toESM(require_jsx_runtime());
function Moves() {
  return /* @__PURE__ */ (0, import_jsx_runtime74.jsxs)("div", { className: "bc-moves", children: [
    /* @__PURE__ */ (0, import_jsx_runtime74.jsxs)("div", { className: "bc-comments", id: "analysisBox", hidden: true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime74.jsxs)("div", { hidden: true, children: [
        "Mesin: ",
        /* @__PURE__ */ (0, import_jsx_runtime74.jsx)("b", { id: "bestText", children: "\u2014" }),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime74.jsx)("span", { id: "depthText", className: "small" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime74.jsx)("div", { id: "pvText", className: "small", hidden: true }),
      /* @__PURE__ */ (0, import_jsx_runtime74.jsx)("div", { id: "judgeText" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime74.jsx)("ul", { className: "bc-movelist", id: "moveList", "aria-label": "Riwayat langkah" }),
    /* @__PURE__ */ (0, import_jsx_runtime74.jsxs)("div", { className: "bc-moves-foot", children: [
      /* @__PURE__ */ (0, import_jsx_runtime74.jsx)("div", { className: "variation-bar", id: "variationBar", hidden: true }),
      /* @__PURE__ */ (0, import_jsx_runtime74.jsx)("button", { type: "button", className: "ms-chip bc-copy-pgn", id: "copyPgnBtn", disabled: true, children: "Salin PGN" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime74.jsx)("div", { className: "bc-chart-slot", id: "movesChartSlot", hidden: true, children: /* @__PURE__ */ (0, import_jsx_runtime74.jsx)("div", { className: "bc-chart", "data-chart": "moves" }) })
  ] });
}

// src/app/pages/gamereview/Menu.tsx
var import_jsx_runtime75 = __toESM(require_jsx_runtime());
function Menu() {
  return /* @__PURE__ */ (0, import_jsx_runtime75.jsxs)("section", { className: "bc-menu", id: "reviewMenu", "aria-label": "Analisis permainan", children: [
    /* @__PURE__ */ (0, import_jsx_runtime75.jsxs)("menu", { className: "bc-tabs tabs", role: "tablist", children: [
      /* @__PURE__ */ (0, import_jsx_runtime75.jsxs)("button", { type: "button", role: "tab", "data-tab": "import", className: "active", children: [
        /* @__PURE__ */ (0, import_jsx_runtime75.jsx)(Lens, { class: "bc-tab-ico", size: 20 }),
        /* @__PURE__ */ (0, import_jsx_runtime75.jsx)("span", { "data-tab-label": "import", children: "Analisis Game" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime75.jsxs)("button", { type: "button", role: "tab", "data-tab": "select", hidden: true, children: [
        /* @__PURE__ */ (0, import_jsx_runtime75.jsx)(Pawn, { class: "bc-tab-ico", size: 20 }),
        /* @__PURE__ */ (0, import_jsx_runtime75.jsx)("span", { children: "Pilih Game" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime75.jsxs)("button", { type: "button", role: "tab", "data-tab": "review", hidden: true, children: [
        /* @__PURE__ */ (0, import_jsx_runtime75.jsx)(Star, { class: "bc-tab-ico", size: 20 }),
        /* @__PURE__ */ (0, import_jsx_runtime75.jsx)("span", { children: "Ringkasan" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime75.jsxs)("button", { type: "button", role: "tab", "data-tab": "moves", children: [
        /* @__PURE__ */ (0, import_jsx_runtime75.jsx)(BoardIcon, { class: "bc-tab-ico", size: 20 }),
        /* @__PURE__ */ (0, import_jsx_runtime75.jsx)("span", { children: "Langkah" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime75.jsxs)("div", { className: "bc-menu-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime75.jsx)("div", { id: "gameInfoPanel", className: "game-info-panel", style: { display: "none" } }),
      /* @__PURE__ */ (0, import_jsx_runtime75.jsx)("div", { className: "tabpane active", id: "tab-import", children: /* @__PURE__ */ (0, import_jsx_runtime75.jsx)(Form, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime75.jsx)("div", { className: "tabpane", id: "tab-select", children: /* @__PURE__ */ (0, import_jsx_runtime75.jsx)(SelectGame, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime75.jsx)("div", { className: "tabpane", id: "tab-loading", children: /* @__PURE__ */ (0, import_jsx_runtime75.jsx)(Loading, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime75.jsx)("div", { className: "tabpane", id: "tab-review", children: /* @__PURE__ */ (0, import_jsx_runtime75.jsx)(Summary, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime75.jsx)("div", { className: "tabpane", id: "tab-moves", children: /* @__PURE__ */ (0, import_jsx_runtime75.jsx)(Moves, {}) })
    ] })
  ] });
}

// src/app/pages/gamereview/GameButtons.tsx
var import_jsx_runtime76 = __toESM(require_jsx_runtime());
function GameButtons({ variant }) {
  return /* @__PURE__ */ (0, import_jsx_runtime76.jsxs)("div", { className: "bc-gbtns bc-gbtns-" + variant, role: "group", "aria-label": "Navigasi langkah", children: [
    /* @__PURE__ */ (0, import_jsx_runtime76.jsx)("button", { type: "button", "data-nav": "first", title: "Langkah pertama", "aria-label": "Langkah pertama", children: /* @__PURE__ */ (0, import_jsx_runtime76.jsx)(SkipGame, { class: "bc-gi bc-gi-skip bc-rot" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime76.jsx)("button", { type: "button", "data-nav": "prev", title: "Sebelumnya", "aria-label": "Sebelumnya", children: /* @__PURE__ */ (0, import_jsx_runtime76.jsx)(NextMove, { class: "bc-gi bc-gi-step bc-rot" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime76.jsxs)("button", { type: "button", "data-nav": "play", "aria-pressed": "false", title: "Putar otomatis", "aria-label": "Putar otomatis", children: [
      /* @__PURE__ */ (0, import_jsx_runtime76.jsx)(Play, { class: "bc-gi bc-gi-step bc-gi-play" }),
      /* @__PURE__ */ (0, import_jsx_runtime76.jsx)(Pause, { class: "bc-gi bc-gi-step bc-gi-pause" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime76.jsx)("button", { type: "button", "data-nav": "next", title: "Berikutnya", "aria-label": "Berikutnya", children: /* @__PURE__ */ (0, import_jsx_runtime76.jsx)(NextMove, { class: "bc-gi bc-gi-step" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime76.jsx)("button", { type: "button", "data-nav": "last", title: "Langkah terakhir", "aria-label": "Langkah terakhir", children: /* @__PURE__ */ (0, import_jsx_runtime76.jsx)(SkipGame, { class: "bc-gi bc-gi-skip" }) })
  ] });
}

// src/app/pages/gamereview/GameReviewPage.tsx
var import_jsx_runtime77 = __toESM(require_jsx_runtime());
function GameReviewPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime77.jsxs)(import_jsx_runtime77.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime77.jsx)(AuthGateOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime77.jsx)("h1", { className: "sr-only", children: "Game Review" }),
    /* @__PURE__ */ (0, import_jsx_runtime77.jsx)("div", { className: "bc-root", id: "bcRoot", children: /* @__PURE__ */ (0, import_jsx_runtime77.jsxs)("main", { className: "bc-main", id: "bcMain", children: [
      /* @__PURE__ */ (0, import_jsx_runtime77.jsx)(Settings, {}),
      /* @__PURE__ */ (0, import_jsx_runtime77.jsxs)("div", { className: "bc-left", children: [
        /* @__PURE__ */ (0, import_jsx_runtime77.jsx)(Game, {}),
        /* @__PURE__ */ (0, import_jsx_runtime77.jsx)(BoardMenu, {}),
        /* @__PURE__ */ (0, import_jsx_runtime77.jsx)("div", { className: "bc-below", children: /* @__PURE__ */ (0, import_jsx_runtime77.jsx)(GameButtons, { variant: "below" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime77.jsx)(Menu, {})
    ] }) })
  ] });
}

// src/app/pages/lessons/LessonsMain.tsx
var import_jsx_runtime78 = __toESM(require_jsx_runtime());
function LessonsMain({ data }) {
  return /* @__PURE__ */ (0, import_jsx_runtime78.jsxs)("main", { className: "lessons-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("h1", { className: "lessons-title", children: "Lesson" }),
    /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("div", { id: "lessonCategories", className: "lessons-categories", children: data && data.categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime78.jsxs)("section", { className: "lesson-category-block", "aria-labelledby": "cat-" + cat.id, children: [
      /* @__PURE__ */ (0, import_jsx_runtime78.jsxs)("div", { className: "lesson-category-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("span", { className: "lesson-category-icon", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime78.jsx)(
          "svg",
          {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            dangerouslySetInnerHTML: { __html: cat.icon }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("h2", { id: "cat-" + cat.id, children: cat.title }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("div", { className: "lesson-card-grid", children: data.lessons.filter((lesson) => lesson.category === cat.id).map((lesson) => /* @__PURE__ */ (0, import_jsx_runtime78.jsxs)("a", { className: "lesson-card", href: "/lessons/" + encodeURIComponent(lesson.id), "data-route-link": "", children: [
        /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("span", { className: "lesson-card-status", "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("span", { className: "lesson-card-body", children: /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("span", { className: "lesson-card-title", children: lesson.title }) }),
        /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("span", { className: "lesson-card-chevron", children: /* @__PURE__ */ (0, import_jsx_runtime78.jsx)(LineIcon, { "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime78.jsx)("path", { d: "m9 18 6-6-6-6" }) }) })
      ] }, lesson.id)) })
    ] }, cat.id)) })
  ] });
}

// src/app/pages/lessons/LessonsPage.tsx
var import_jsx_runtime79 = __toESM(require_jsx_runtime());
function LessonsPage({ ssr }) {
  return /* @__PURE__ */ (0, import_jsx_runtime79.jsx)(LessonsMain, { data: ssr && ssr.kind === "lessons" ? ssr : void 0 });
}

// src/app/pages/lessons/LessonDetailMain.tsx
var import_jsx_runtime80 = __toESM(require_jsx_runtime());
function navLinks(data) {
  if (!data) return { prevHref: "#", prevText: "Sebelumnya", prevArrow: true, nextHref: "#", nextText: "Berikutnya", nextArrow: true };
  return {
    prevHref: data.prevId ? "/lessons/" + encodeURIComponent(data.prevId) : "/lessons",
    prevText: data.prevId ? "Sebelumnya" : "Semua Lesson",
    prevArrow: true,
    nextHref: data.nextId ? "/lessons/" + encodeURIComponent(data.nextId) : "/lessons",
    nextText: data.nextId ? "Berikutnya" : "Selesai \u2014 Semua Lesson",
    nextArrow: !!data.nextId
  };
}
function LessonNotFoundMain({ id }) {
  return /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("main", { className: "lesson-detail-page", children: /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("div", { style: { padding: "24px", textAlign: "center" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("p", { style: { color: "var(--text-primary)", fontWeight: 700, marginBottom: "8px" }, children: 'Lesson "' + id + '" tidak ditemukan' }),
    /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("p", { style: { color: "var(--text-muted)", fontSize: "0.8125rem", marginBottom: "16px" }, children: "Pilih salah satu lesson dari daftar." }),
    /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("a", { href: "/lessons", "data-route-link": "", style: { color: "var(--accent)", fontWeight: 600, textDecoration: "none" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("span", { className: "ui-ico ui-ico-arrow-left", "aria-hidden": "true" }),
      " Kembali ke Lesson"
    ] })
  ] }) });
}
function LessonDetailMain({ data }) {
  const nav = navLinks(data);
  return /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("main", { className: "lesson-detail-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("a", { href: "/lessons", "data-route-link": "", className: "lesson-detail-back", children: [
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)(LineIcon, { "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("path", { d: "m15 18-6-6 6-6" }) }),
      "Kembali ke Lesson"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("h1", { className: "lesson-detail-title", id: "lessonTitle", children: data ? data.lesson.title : null }),
    /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("section", { className: "lesson-step-learn", "aria-labelledby": "learnLabel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("p", { className: "lesson-step-label", id: "learnLabel", children: "Learn" }),
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("p", { id: "lessonLearnText", children: data ? data.lesson.learn : null })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("section", { className: "lesson-board-wrap", "aria-labelledby": "positionLabel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("p", { className: "lesson-step-label", id: "positionLabel", children: "Position" }),
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)(
        "div",
        {
          className: "lesson-board",
          id: "lessonBoard",
          role: "group",
          "aria-label": "Papan catur interaktif untuk lesson ini"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("p", { className: "lesson-board-caption", id: "lessonFenCaption", children: data ? data.lesson.fenCaption : null })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("section", { className: "lesson-step-choose", "aria-labelledby": "chooseLabel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("p", { className: "lesson-step-label", id: "chooseLabel", children: "Choose Move" }),
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("p", { className: "lesson-move-hint", id: "lessonMoveHint", children: data ? "Giliran " + data.lesson.side + " \u2014 gerakkan bidak di papan untuk menjawab." : null })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("section", { className: "lesson-step-explain", id: "lessonExplainBox", "aria-live": "polite", children: [
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("p", { className: "lesson-explain-heading", id: "lessonExplainHeading" }),
      /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("p", { id: "lessonExplainText" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("div", { className: "lesson-detail-nav-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("a", { className: "lesson-nav-btn secondary", id: "lessonPrevBtn", href: nav.prevHref, "data-route-link": "", children: [
        nav.prevArrow ? /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("span", { className: "ui-ico ui-ico-arrow-left", "aria-hidden": "true" }) : null,
        nav.prevArrow ? " " : "",
        nav.prevText
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime80.jsxs)("a", { className: "lesson-nav-btn primary", id: "lessonNextBtn", href: nav.nextHref, "data-route-link": "", children: [
        nav.nextText,
        nav.nextArrow ? " " : "",
        nav.nextArrow ? /* @__PURE__ */ (0, import_jsx_runtime80.jsx)("span", { className: "ui-ico ui-ico-arrow-right", "aria-hidden": "true" }) : null
      ] })
    ] })
  ] });
}

// src/app/pages/lessons/LessonDetailPage.tsx
var import_jsx_runtime81 = __toESM(require_jsx_runtime());
function LessonDetailPage({ ssr }) {
  if (ssr && ssr.kind === "lesson-not-found") return /* @__PURE__ */ (0, import_jsx_runtime81.jsx)(LessonNotFoundMain, { id: ssr.id });
  return /* @__PURE__ */ (0, import_jsx_runtime81.jsx)(LessonDetailMain, { data: ssr && ssr.kind === "lesson" ? ssr : void 0 });
}

// src/app/pages/library/LibraryMain.tsx
var import_jsx_runtime82 = __toESM(require_jsx_runtime());
function LibraryMain() {
  return /* @__PURE__ */ (0, import_jsx_runtime82.jsxs)("main", { className: "library-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("h1", { className: "library-title", children: "Game Library" }),
    /* @__PURE__ */ (0, import_jsx_runtime82.jsxs)("div", { className: "library-controls", children: [
      /* @__PURE__ */ (0, import_jsx_runtime82.jsxs)("div", { className: "library-search-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime82.jsxs)(LineIcon, { className: "library-search-icon", "aria-hidden": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("circle", { cx: "11", cy: "11", r: "7" }),
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("path", { d: "m21 21-4.3-4.3" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime82.jsx)(
          "input",
          {
            type: "search",
            id: "librarySearch",
            className: "library-search-input",
            placeholder: "Cari nama lawan\u2026",
            "aria-label": "Cari nama lawan"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime82.jsxs)("div", { className: "library-filter-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime82.jsxs)("select", { id: "libraryCategoryFilter", className: "library-select", "aria-label": "Filter kategori", children: [
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("option", { value: "all", children: "Semua kategori" }),
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("option", { value: "bullet", children: "Bullet" }),
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("option", { value: "blitz", children: "Blitz" }),
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("option", { value: "rapid", children: "Rapid" }),
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("option", { value: "bot", children: "Bot" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime82.jsxs)("select", { id: "libraryResultFilter", className: "library-select", "aria-label": "Filter hasil", children: [
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("option", { value: "all", children: "Semua hasil" }),
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("option", { value: "win", children: "Menang" }),
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("option", { value: "loss", children: "Kalah" }),
          /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("option", { value: "draw", children: "Remi" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("div", { id: "libraryList", className: "gh-list", "aria-live": "polite" }),
    /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("p", { className: "library-empty-msg", id: "libraryEmptyMsg", hidden: true, children: "Tidak ada game yang cocok dengan filter ini." }),
    /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("p", { className: "library-loading-msg", id: "libraryLoadingMsg", children: "Memuat game\u2026" }),
    /* @__PURE__ */ (0, import_jsx_runtime82.jsxs)("nav", { className: "library-pagination", id: "libraryPagination", "aria-label": "Navigasi halaman", hidden: true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("button", { type: "button", className: "library-page-btn", id: "libraryPrevBtn", children: "Sebelumnya" }),
      /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("span", { className: "library-page-status", id: "libraryPageStatus" }),
      /* @__PURE__ */ (0, import_jsx_runtime82.jsx)("button", { type: "button", className: "library-page-btn", id: "libraryNextBtn", children: "Berikutnya" })
    ] })
  ] });
}

// src/app/pages/library/LibraryPage.tsx
var import_jsx_runtime83 = __toESM(require_jsx_runtime());
function LibraryPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime83.jsxs)(import_jsx_runtime83.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime83.jsx)(AuthGateOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime83.jsx)(LibraryMain, {})
  ] });
}

// src/app/pages/leaderboard/LeaderboardMain.tsx
var import_jsx_runtime84 = __toESM(require_jsx_runtime());
var CATEGORIES = [["bullet", "Bullet"], ["blitz", "Blitz"], ["rapid", "Rapid"], ["puzzle", "Puzzle"]];
function LeaderboardMain({ data }) {
  const active = data ? data.category : "bullet";
  const rows = data ? data.rows : [];
  const searchResults = data ? data.searchResults : null;
  return /* @__PURE__ */ (0, import_jsx_runtime84.jsxs)("main", { className: "leaderboard-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("h1", { className: "leaderboard-title", children: "Leaderboard" }),
    /* @__PURE__ */ (0, import_jsx_runtime84.jsxs)("form", { className: "leaderboard-search", id: "leaderboardSearchForm", action: "/leaderboard", method: "get", role: "search", children: [
      /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("input", { type: "hidden", name: "category", value: active }),
      /* @__PURE__ */ (0, import_jsx_runtime84.jsx)(
        "input",
        {
          type: "search",
          name: "search",
          id: "leaderboardSearchInput",
          className: "leaderboard-search-input",
          placeholder: "Cari pemain berdasarkan username\u2026",
          defaultValue: data ? data.searchQuery : "",
          minLength: 2,
          maxLength: 20,
          autoComplete: "off"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("button", { type: "submit", className: "leaderboard-search-btn", children: "Cari" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("div", { id: "leaderboardSearchResults", className: "leaderboard-list", hidden: !searchResults, children: searchResults && searchResults.map((r) => /* @__PURE__ */ (0, import_jsx_runtime84.jsxs)("a", { className: "leaderboard-row", href: "/profile/" + encodeURIComponent(r.username), "data-route-link": "", children: [
      /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("span", { className: "leaderboard-username", children: r.username }),
      /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("span", { className: "leaderboard-rating", children: r.eloBlitz })
    ] }, r.username)) }),
    searchResults && searchResults.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("p", { className: "leaderboard-empty-msg", children: "Tidak ada pemain dengan nama itu." }),
    /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("div", { className: "leaderboard-tabs", role: "tablist", "aria-label": "Pilih kategori leaderboard", children: CATEGORIES.map(([cat, label]) => /* @__PURE__ */ (0, import_jsx_runtime84.jsx)(
      "a",
      {
        className: "leaderboard-tab" + (cat === active ? " is-active" : ""),
        "data-cat": cat,
        href: "/leaderboard?category=" + cat,
        role: "tab",
        "aria-selected": cat === active ? "true" : "false",
        children: label
      },
      cat
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("div", { id: "leaderboardList", className: "leaderboard-list", "aria-live": "polite", children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime84.jsxs)("a", { className: "leaderboard-row", href: "/profile/" + encodeURIComponent(row.username), "data-route-link": "", children: [
      /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("span", { className: "leaderboard-rank " + (row.rank <= 3 ? "top3" : ""), children: "#" + row.rank }),
      /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("span", { className: "leaderboard-username", children: row.username }),
      /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("span", { className: "leaderboard-games-played", children: row.gamesPlayed != null ? row.gamesPlayed + " partai" : "" }),
      /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("span", { className: "leaderboard-rating", children: row.rating })
    ] }, row.rank + ":" + row.username)) }),
    /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("p", { className: "leaderboard-loading-msg", id: "leaderboardLoadingMsg", hidden: !!data, children: "Memuat peringkat\u2026" }),
    /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("p", { className: "leaderboard-empty-msg", id: "leaderboardEmptyMsg", hidden: !data || rows.length > 0, children: "Belum ada pemain aktif di kategori ini." }),
    /* @__PURE__ */ (0, import_jsx_runtime84.jsx)("div", { className: "leaderboard-my-rank", id: "leaderboardMyRank", hidden: true })
  ] });
}

// src/app/pages/leaderboard/LeaderboardPage.tsx
var import_jsx_runtime85 = __toESM(require_jsx_runtime());
function LeaderboardPage({ ssr }) {
  return /* @__PURE__ */ (0, import_jsx_runtime85.jsxs)(import_jsx_runtime85.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime85.jsx)(AuthGateOverlay, { hidden: true }),
    /* @__PURE__ */ (0, import_jsx_runtime85.jsx)(LeaderboardMain, { data: ssr && ssr.kind === "leaderboard" ? ssr : void 0 })
  ] });
}

// src/app/pages/profile/ProfileHero.tsx
var import_jsx_runtime86 = __toESM(require_jsx_runtime());
function ProfileHero() {
  return /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("section", { className: "profile-hero", "aria-labelledby": "profileNameHeading", children: [
    /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-hero-top", children: [
      /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("div", { className: "profile-avatar", id: "profileAvatar", children: /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)(
        "svg",
        {
          className: "avatar-default-icon",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          "aria-hidden": "true",
          focusable: "false",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("circle", { cx: "12", cy: "8", r: "4.2" }),
            /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("path", { d: "M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z" })
          ]
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-hero-info", children: [
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("h1", { id: "profileNameHeading" }),
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("p", { className: "profile-joined", id: "profileJoined" }),
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("p", { className: "profile-joined", id: "profileCountry", hidden: true })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-rating-grid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-rating-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-rating-label", children: "Bullet" }),
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-rating-value", id: "ratingBullet", children: "\u2014" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-rating-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-rating-label", children: "Blitz" }),
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-rating-value", id: "ratingBlitz", children: "\u2014" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-rating-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-rating-label", children: "Rapid" }),
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-rating-value", id: "ratingRapid", children: "\u2014" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-rating-card profile-rating-card-puzzle", children: [
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-rating-label", children: "Puzzle" }),
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-rating-value", id: "ratingPuzzle", children: "\u2014" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-record-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-record-item", children: [
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-record-value profile-record-win", id: "recordWins", children: "0" }),
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-record-label", children: "Menang" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-record-item", children: [
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-record-value profile-record-draw", id: "recordDraws", children: "0" }),
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-record-label", children: "Remi" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-record-item", children: [
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-record-value profile-record-loss", id: "recordLosses", children: "0" }),
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-record-label", children: "Kalah" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime86.jsxs)("div", { className: "profile-record-item", children: [
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-record-value", id: "recordPuzzleSolved", children: "0" }),
        /* @__PURE__ */ (0, import_jsx_runtime86.jsx)("span", { className: "profile-record-label", children: "Puzzle terpecahkan" })
      ] })
    ] })
  ] });
}

// src/app/pages/profile/ProfileMain.tsx
var import_jsx_runtime87 = __toESM(require_jsx_runtime());
function ProfileMain() {
  return /* @__PURE__ */ (0, import_jsx_runtime87.jsxs)("main", { className: "profile-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime87.jsx)(ProfileHero, {}),
    /* @__PURE__ */ (0, import_jsx_runtime87.jsxs)("section", { className: "profile-section", "aria-labelledby": "statsHeading", children: [
      /* @__PURE__ */ (0, import_jsx_runtime87.jsxs)("div", { className: "profile-section-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime87.jsx)("h2", { id: "statsHeading", children: "Statistik rating" }),
        /* @__PURE__ */ (0, import_jsx_runtime87.jsxs)("div", { className: "profile-chart-tabs", role: "tablist", "aria-label": "Pilih kategori grafik rating", children: [
          /* @__PURE__ */ (0, import_jsx_runtime87.jsx)(
            "button",
            {
              className: "profile-chart-tab is-active",
              "data-cat": "bullet",
              role: "tab",
              "aria-selected": "true",
              type: "button",
              children: "Bullet"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime87.jsx)(
            "button",
            {
              className: "profile-chart-tab",
              "data-cat": "blitz",
              role: "tab",
              "aria-selected": "false",
              type: "button",
              children: "Blitz"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime87.jsx)(
            "button",
            {
              className: "profile-chart-tab",
              "data-cat": "rapid",
              role: "tab",
              "aria-selected": "false",
              type: "button",
              children: "Rapid"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime87.jsx)(
            "button",
            {
              className: "profile-chart-tab",
              "data-cat": "puzzle",
              role: "tab",
              "aria-selected": "false",
              type: "button",
              children: "Puzzle"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime87.jsxs)("div", { className: "profile-chart-wrap", children: [
        /* @__PURE__ */ (0, import_jsx_runtime87.jsx)(
          "svg",
          {
            id: "ratingChart",
            className: "profile-chart-svg",
            viewBox: "0 0 600 220",
            preserveAspectRatio: "none",
            role: "img",
            "aria-labelledby": "chartTitleDesc"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime87.jsx)("p", { id: "chartTitleDesc", className: "sr-only", children: "Grafik garis menunjukkan perkembangan rating dari waktu ke waktu." }),
        /* @__PURE__ */ (0, import_jsx_runtime87.jsx)("p", { className: "profile-chart-empty", id: "chartEmptyMsg", hidden: true, children: "Belum ada riwayat rating untuk kategori ini \u2014 mainkan beberapa partai atau puzzle dulu." })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime87.jsxs)("section", { className: "profile-section", "aria-labelledby": "recentHeading", children: [
      /* @__PURE__ */ (0, import_jsx_runtime87.jsxs)("div", { className: "profile-section-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime87.jsx)("h2", { id: "recentHeading", children: "Game terbaru" }),
        /* @__PURE__ */ (0, import_jsx_runtime87.jsx)("a", { href: "/library", "data-route-link": "", className: "profile-see-all", children: "Lihat semua di Game Library" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime87.jsx)("div", { id: "recentGamesList", className: "gh-list" }),
      /* @__PURE__ */ (0, import_jsx_runtime87.jsxs)("p", { className: "profile-empty-msg", id: "recentGamesEmpty", hidden: true, children: [
        "Belum ada partai online tercatat.",
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime87.jsx)("a", { href: "/play", "data-route-link": "", children: "Mulai bermain" }),
        " ",
        "untuk mengisi riwayat di sini."
      ] })
    ] })
  ] });
}

// src/app/pages/profile/ProfilePage.tsx
var import_jsx_runtime88 = __toESM(require_jsx_runtime());
function ProfilePage() {
  return /* @__PURE__ */ (0, import_jsx_runtime88.jsxs)(import_jsx_runtime88.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime88.jsx)(AuthGateOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime88.jsx)(ProfileMain, {})
  ] });
}

// src/app/pages/profile/public-profile-format.ts
var PUBLIC_PROFILE_TZ = "Asia/Jakarta";
var CATEGORY_LABEL = { bullet: "Bullet", blitz: "Blitz", rapid: "Rapid", puzzle: "Puzzle", bot: "Bot" };
var RESULT_LABEL = { win: "Menang", loss: "Kalah", draw: "Remi" };
function formatJoinedLabel(createdAt) {
  let ms = Number(createdAt);
  if (!Number.isFinite(ms) || ms <= 0) return "";
  if (ms < 1e11) ms *= 1e3;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return "";
  let text = "";
  try {
    text = d.toLocaleDateString("id-ID", { year: "numeric", month: "long", timeZone: PUBLIC_PROFILE_TZ });
  } catch {
    text = "";
  }
  if (!text || /invalid/i.test(text)) return "";
  return "Bergabung " + text;
}

// src/app/components/GameHistoryRow.tsx
var import_jsx_runtime89 = __toESM(require_jsx_runtime());
var RESULT_MARK = { win: "plus", loss: "minus", draw: "equal" };
function BotModeIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime89.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("rect", { x: "4", y: "8", width: "16", height: "12", rx: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("path", { d: "M12 8V4" }),
    /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("circle", { cx: "12", cy: "3.2", r: "1", fill: "currentColor" }),
    /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("path", { d: "M2 13v3M22 13v3" }),
    /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("circle", { cx: "9", cy: "13", r: "1.3", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("circle", { cx: "15", cy: "13", r: "1.3", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("path", { d: "M9 17h6" })
  ] });
}
function GameHistoryRow({ game, reviewHref }) {
  const result = game.result === "win" ? "win" : game.result === "loss" ? "loss" : "draw";
  const change = Number(game.eloChange) || 0;
  const changeClass = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
  const changeText = change > 0 ? "+" + change : String(change);
  const catLabel = CATEGORY_LABEL[game.category] || game.category;
  const resultLabel = RESULT_LABEL[result];
  const known = game.category === "bullet" || game.category === "blitz" || game.category === "rapid";
  return /* @__PURE__ */ (0, import_jsx_runtime89.jsxs)("div", { className: "gh-row" + (reviewHref ? " is-linked" : ""), children: [
    reviewHref ? /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("a", { className: "gh-row-link", href: reviewHref, "data-route-link": "", "aria-label": "Buka di Game Review: " + game.opponentName, title: "Buka di Game Review" }) : null,
    game.category === "bot" ? /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("span", { className: "gh-mode gh-mode-bot", title: "Bot", children: /* @__PURE__ */ (0, import_jsx_runtime89.jsx)(BotModeIcon, {}) }) : /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("span", { className: "gh-mode", title: catLabel, children: known ? /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("img", { src: "/images/" + game.category + ".svg", alt: "", width: 22, height: 22, draggable: false }) : null }),
    /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("span", { className: "gh-avatar", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime89.jsxs)("svg", { className: "avatar-default-icon", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", focusable: "false", children: [
      /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("circle", { cx: "12", cy: "8", r: "4.2" }),
      /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("path", { d: "M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("span", { className: "gh-main", children: /* @__PURE__ */ (0, import_jsx_runtime89.jsxs)("span", { className: "gh-name", children: [
      /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("span", { className: "gh-name-text", children: game.opponentName }),
      /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("span", { className: "gh-elo", children: "(" + game.opponentElo + ")" }),
      /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("span", { className: "gh-badge " + changeClass, title: "Perubahan Elo", children: changeText })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("span", { className: "gh-result " + result, role: "img", "aria-label": resultLabel, title: resultLabel, children: /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("span", { className: "ui-ico ui-ico-" + RESULT_MARK[result], "aria-hidden": "true" }) }),
    reviewHref ? /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("a", { className: "gh-action", href: reviewHref + (reviewHref.includes("?") ? "&" : "?") + "scan=1", "data-route-link": "", "aria-label": "Ulasan Permainan (pindai otomatis)", title: "Ulasan Permainan", children: /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ (0, import_jsx_runtime89.jsx)("path", { fill: "#fff", fillRule: "evenodd", d: "M12 1.6a10.4 10.4 0 1 1 0 20.8a10.4 10.4 0 1 1 0-20.8ZM12.00 5.90 L13.70 10.15 L18.28 10.46 L14.76 13.40 L15.88 17.84 L12.00 15.40 L8.12 17.84 L9.24 13.40 L5.72 10.46 L10.30 10.15Z" }) }) }) : null
  ] });
}

// src/app/pages/profile/PublicProfileMain.tsx
var import_jsx_runtime90 = __toESM(require_jsx_runtime());
function DefaultAvatar() {
  return /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("svg", { className: "avatar-default-icon", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("circle", { cx: "12", cy: "8", r: "4.2" }),
    /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("path", { d: "M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z" })
  ] });
}
function PublicProfileNotFoundMain({ username }) {
  return /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("main", { className: "profile-page", children: /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("section", { className: "profile-hero", children: [
    /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("h1", { children: "Pemain tidak ditemukan" }),
    /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("p", { className: "profile-joined", children: 'Tidak ada pemain dengan username "' + username + '".' }),
    /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("a", { href: "/leaderboard", "data-route-link": "", children: "Kembali ke Leaderboard" })
  ] }) });
}
function PublicProfileMain({ data }) {
  const user = data ? data.user : null;
  const games = data ? data.recentGames : [];
  return /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("main", { className: "profile-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("section", { className: "profile-hero", "aria-labelledby": "profileNameHeading", children: [
      /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-hero-top", children: [
        /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("div", { className: "profile-avatar", id: "profileAvatar", children: user && user.profilePhoto ? /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("img", { src: user.profilePhoto, alt: "" }) : /* @__PURE__ */ (0, import_jsx_runtime90.jsx)(DefaultAvatar, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-hero-info", children: [
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("h1", { id: "profileNameHeading", children: user ? user.username : null }),
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("p", { className: "profile-joined", id: "profileJoined", children: user ? formatJoinedLabel(user.createdAt) : null })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-rating-grid", children: [
        /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-rating-card", children: [
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-rating-label", children: "Bullet" }),
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-rating-value", id: "ratingBullet", children: user ? user.eloBullet : "\u2014" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-rating-card", children: [
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-rating-label", children: "Blitz" }),
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-rating-value", id: "ratingBlitz", children: user ? user.eloBlitz : "\u2014" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-rating-card", children: [
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-rating-label", children: "Rapid" }),
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-rating-value", id: "ratingRapid", children: user ? user.eloRapid : "\u2014" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-rating-card profile-rating-card-puzzle", children: [
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-rating-label", children: "Puzzle" }),
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-rating-value", id: "ratingPuzzle", children: user ? user.puzzleRating : "\u2014" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-record-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-record-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-record-value profile-record-win", id: "recordWins", children: user ? user.wins : 0 }),
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-record-label", children: "Menang" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-record-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-record-value profile-record-draw", id: "recordDraws", children: user ? user.draws : 0 }),
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-record-label", children: "Remi" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-record-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-record-value profile-record-loss", id: "recordLosses", children: user ? user.losses : 0 }),
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-record-label", children: "Kalah" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("div", { className: "profile-record-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-record-value", id: "recordPuzzleSolved", children: user ? user.puzzleSolved : 0 }),
          /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("span", { className: "profile-record-label", children: "Puzzle terpecahkan" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime90.jsxs)("section", { className: "profile-section", "aria-labelledby": "recentHeading", children: [
      /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("div", { className: "profile-section-header", children: /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("h2", { id: "recentHeading", children: "Partai" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("div", { id: "recentGamesList", className: "gh-list", children: games.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime90.jsx)(GameHistoryRow, { game: g, reviewHref: g.id != null ? "/gamereview?publicGameId=" + encodeURIComponent(String(g.id)) : void 0 }, i)) }),
      /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("div", { className: "gh-more", id: "recentGamesMore", hidden: !data || data.totalGames <= games.length, children: /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("button", { type: "button", className: "gh-more-btn", id: "recentViewAllBtn", children: "Lihat Semua" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("p", { className: "profile-empty-msg", id: "recentGamesEmpty", hidden: !data || games.length > 0, children: "Belum ada partai online tercatat." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime90.jsx)("p", { className: "profile-not-found", id: "profileNotFound", hidden: true, children: "Pemain tidak ditemukan." })
  ] });
}

// src/app/pages/profile/PublicProfilePage.tsx
var import_jsx_runtime91 = __toESM(require_jsx_runtime());
function PublicProfilePage({ ssr }) {
  if (ssr && ssr.kind === "profile-not-found") return /* @__PURE__ */ (0, import_jsx_runtime91.jsx)(PublicProfileNotFoundMain, { username: ssr.username });
  return /* @__PURE__ */ (0, import_jsx_runtime91.jsx)(PublicProfileMain, { data: ssr && ssr.kind === "public-profile" ? ssr : void 0 });
}

// src/app/pages/index.ts
var PAGES = {
  home: HomePage,
  play: PlayPage,
  bot: BotPage,
  puzzles: PuzzlesPage,
  gamereview: GameReviewPage,
  lessons: LessonsPage,
  "lesson-detail": LessonDetailPage,
  library: LibraryPage,
  leaderboard: LeaderboardPage,
  profile: ProfilePage,
  "public-profile": PublicProfilePage
};

// public/index.html
var public_default = '<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n\n  <title>NusantaraChess \u2014 Bermain, berlatih, dan belajar catur</title>\n  <meta name="description" content="NusantaraChess: bermain online dengan rating Elo, berlatih melawan karakter bot, kerjakan puzzle personal, dan bedah partaimu dengan Game Review bertenaga Stockfish.">\n\n  <!-- SEO:BEGIN (dihasilkan oleh tools/build-seo.js - lihat README) -->\n  <link rel="canonical" href="https://nusantara-chess.vercel.app/">\n  <meta name="robots" content="index, follow, max-image-preview:large">\n  <meta name="application-name" content="NusantaraChess">\n  <meta name="apple-mobile-web-app-title" content="NusantaraChess">\n  <meta property="og:type" content="website">\n  <meta property="og:site_name" content="NusantaraChess">\n  <meta property="og:locale" content="id_ID">\n  <meta property="og:url" content="https://nusantara-chess.vercel.app/">\n  <meta property="og:title" content="NusantaraChess \u2014 Bermain, berlatih, dan belajar catur">\n  <meta property="og:description" content="NusantaraChess: bermain online dengan rating Elo, berlatih melawan karakter bot, kerjakan puzzle personal, dan bedah partaimu dengan Game Review bertenaga Stockfish.">\n  <meta property="og:image" content="https://nusantara-chess.vercel.app/og-image.png">\n  <meta property="og:image:type" content="image/png">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="Ikon kuda catur NusantaraChess">\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="NusantaraChess \u2014 Bermain, berlatih, dan belajar catur">\n  <meta name="twitter:description" content="NusantaraChess: bermain online dengan rating Elo, berlatih melawan karakter bot, kerjakan puzzle personal, dan bedah partaimu dengan Game Review bertenaga Stockfish.">\n  <meta name="twitter:image" content="https://nusantara-chess.vercel.app/og-image.png">\n  <meta name="twitter:image:alt" content="Ikon kuda catur NusantaraChess">\n  <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@graph": [\n      {\n        "@type": "WebSite",\n        "@id": "https://nusantara-chess.vercel.app/#website",\n        "url": "https://nusantara-chess.vercel.app/",\n        "name": "NusantaraChess",\n        "alternateName": [\n          "Nusantara Chess",\n          "Nusantara Chess Indonesia"\n        ],\n        "description": "NusantaraChess: bermain online dengan rating Elo, berlatih melawan karakter bot, kerjakan puzzle personal, dan bedah partaimu dengan Game Review bertenaga Stockfish.",\n        "inLanguage": "id"\n      },\n      {\n        "@type": "WebApplication",\n        "@id": "https://nusantara-chess.vercel.app/#app",\n        "url": "https://nusantara-chess.vercel.app/",\n        "name": "NusantaraChess",\n        "alternateName": [\n          "Nusantara Chess",\n          "Nusantara Chess Indonesia"\n        ],\n        "description": "NusantaraChess: bermain online dengan rating Elo, berlatih melawan karakter bot, kerjakan puzzle personal, dan bedah partaimu dengan Game Review bertenaga Stockfish.",\n        "applicationCategory": "GameApplication",\n        "operatingSystem": "Web",\n        "inLanguage": "id",\n        "isPartOf": {\n          "@id": "https://nusantara-chess.vercel.app/#website"\n        }\n      }\n    ]\n  }\n  </script>\n  <!-- SEO:END -->\n\n  <link rel="manifest" href="manifest.json">\n  <link rel="icon" type="image/svg+xml" href="/favicon.svg">\n  <link rel="apple-touch-icon" href="/apple-touch-icon.png">\n\n</head>\n<body>\n  <!-- NOSCRIPT:BEGIN (dihasilkan oleh tools/build-seo.js - lihat README) -->\n  <noscript>\n    <main>\n      <h1>NusantaraChess \u2014 Catur Indonesia, dari latihan sampai rating</h1>\n      <p>NusantaraChess: bermain online dengan rating Elo, berlatih melawan karakter bot, kerjakan puzzle personal, dan bedah partaimu dengan Game Review bertenaga Stockfish.</p>\n      <ul>\n        <li>Bermain online dengan sistem rating Elo (Bullet, Blitz, Rapid) dan validasi langkah di server.</li>\n        <li>Latihan melawan karakter bot Fahri, Adit, Dimas, dan Udin.</li>\n        <li>Puzzle personal dari basis data posisi Lichess.</li>\n        <li>Game Review dengan analisis Stockfish: akurasi, klasifikasi langkah, dan estimasi rating performa.</li>\n      </ul>\n      <p>NusantaraChess membutuhkan JavaScript untuk dimainkan. Aktifkan JavaScript di peramban Anda untuk masuk atau mendaftar.</p>\n    </main>\n  </noscript>\n  <!-- NOSCRIPT:END -->\n  <div id="route-outlet"></div>\n\n  <script>\n    /* AKAR MASALAH YANG DIPERBAIKI: baris ini sebelumnya berbunyi\n       "kalau hostname BUKAN localhost/127.0.0.1, pakai backend produksi\n       Vercel" - logika terbalik yang menganggap SEMUA cara akses selain\n       localhost pasti "produksi". Itu salah: mengakses situs dev lewat\n       IP jaringan lokal (mis. http://192.168.x.x:8080, workflow normal\n       Termux saat frontend dibuka dari HP/perangkat lain di LAN yang\n       sama) JUGA bukan "localhost", jadi kondisi lama ini ikut memaksa\n       window.NUSANTARA_API_BASE ke domain backend PRODUKSI Vercel -\n       menimpa server lokal yang baru saja dijalankan lewat\n       `cd server && npm start`, walau server itu sendiri sehat dan\n       tidak mencatat galat apa pun. Akibatnya SETIAP panggilan API\n       (termasuk POST /api/auth/register) dikirim ke server produksi,\n       bukan ke server dev lokal, dan gagal sebagai network error murni\n       di fetch() - persis pesan "Tidak bisa menghubungi server" dari\n       shared/api-client.js, TANPA ada apa pun yang salah pada server\n       lokal, database Neon, atau endpoint register itu sendiri.\n\n       PERBAIKAN: cek secara EKSPLISIT apakah halaman ini sedang disajikan\n       dari domain frontend produksi Vercel-nya sendiri (bukan "asal\n       bukan localhost"). Domain dev (localhost, 127.0.0.1, IP LAN\n       seperti 192.168.x.x/10.x.x.x, atau *.trycloudflare.com/*.ngrok-*.\n       kalau dipakai untuk tunneling) semuanya jatuh ke fallback\n       location.hostname di shared/api-client.js, yang sudah otomatis\n       benar untuk dev lokal MAUPUN akses lewat IP jaringan. */\n    var PRODUCTION_FRONTEND_HOSTS = ["nusantara-chess.vercel.app"];\n    if (PRODUCTION_FRONTEND_HOSTS.indexOf(location.hostname) !== -1) {\n      window.NUSANTARA_API_BASE = "https://nusantarachess-api.vercel.app/api";\n    }\n  </script>\n  <!-- Bahasa situs (Indonesia/English): dimuat SEKALI di sini untuk semua\n       rute SPA, sebelum router, supaya teks yang disisipkan router/JS\n       langsung ikut diterjemahkan saat English dipilih. -->\n  <script src="/shared/language.js"></script>\n  <!-- Kamus i18n (dipecah): exact + patterns dimuat sebelum i18n-en.js\n       yang menggabungkannya - urutan WAJIB. -->\n  <script src="/shared/i18n-en-exact.js"></script>\n  <script src="/shared/i18n-en-patterns.js"></script>\n  <script src="/shared/i18n-en.js"></script>\n  <script src="/shared/i18n.js"></script>\n  <!-- Aplikasi React/TSX (src/app -> dist/app/main.js, dibangun esbuild lewat `npm run build`):\n       router SPA + semua halaman. Dimuat SETELAH language/i18n di atas supaya teks yang\n       dirender React langsung ikut diterjemahkan saat English dipilih. Skrip fitur\n       (shared/*.js, src/features/**) dimuat per rute oleh router setelah markup ter-commit. -->\n  <script src="/app/main.js"></script>\n</body>\n</html>\n';

// src/app/ssr/render.tsx
var import_jsx_runtime92 = __toESM(require_jsx_runtime());
var HOME_CACHE_CONTROL = "public, s-maxage=600, stale-while-revalidate=300";
function isAppSsrPath(pathname) {
  return pathname === "/" || pathname === "/lessons" || /^\/lessons\/[^/]+$/.test(pathname) || pathname === "/leaderboard" || /^\/profile\/[^/]+$/.test(pathname);
}
function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function jsonForScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
function isProtectedRoute(route) {
  return route.scripts.some((step) => typeof step === "string" && /(^|\/)shared\/auth-gate\.js(\?|$)/.test(step));
}
function metaFromTemplate(pattern, fallback) {
  const m = public_default.match(pattern);
  return m ? m[1] : fallback;
}
function siteOrigin() {
  return metaFromTemplate(/<link rel="canonical" href="([^"]*)"/, "").replace(/\/$/, "");
}
function routeHead(route, isProtected, o) {
  const siteName = metaFromTemplate(/<meta property="og:site_name" content="([^"]*)"/, "NusantaraChess");
  const locale = metaFromTemplate(/<meta property="og:locale" content="([^"]*)"/, "id_ID");
  const title = o.title || route.title;
  const description = o.description !== void 0 ? o.description : route.description || "";
  const ogTitle = o.title || route.ogTitle || title;
  const ogDescription = o.description !== void 0 ? o.description : route.ogDescription || description;
  const robots = isProtected ? "noindex, nofollow" : o.robots || "index, follow, max-image-preview:large";
  const indexable = !/^noindex/.test(robots);
  const canonical = !isProtected && o.canonicalPath ? siteOrigin() + o.canonicalPath : "";
  const ogImage = siteOrigin() ? siteOrigin() + "/og-image.png" : "";
  const lines = [
    ...canonical ? [`<link rel="canonical" href="${escapeHtml(canonical)}">`] : [],
    `<meta name="robots" content="${robots}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${siteName}">`,
    `<meta property="og:locale" content="${locale}">`,
    ...canonical ? [`<meta property="og:url" content="${escapeHtml(canonical)}">`] : [],
    `<meta property="og:title" content="${escapeHtml(ogTitle)}">`,
    `<meta property="og:description" content="${escapeHtml(ogDescription)}">`,
    ...ogImage ? [
      `<meta property="og:image" content="${escapeHtml(ogImage)}">`,
      `<meta property="og:image:type" content="image/png">`,
      `<meta property="og:image:width" content="1200">`,
      `<meta property="og:image:height" content="630">`
    ] : [],
    `<meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${escapeHtml(ogTitle)}">`,
    `<meta name="twitter:description" content="${escapeHtml(ogDescription)}">`,
    ...ogImage ? [`<meta name="twitter:image" content="${escapeHtml(ogImage)}">`] : []
  ];
  if (route.themeColor) lines.push(`<meta name="theme-color" content="${escapeHtml(route.themeColor)}">`);
  if (indexable && o.jsonLd) lines.push(`<script type="application/ld+json">${jsonForScript(o.jsonLd)}</script>`);
  return lines.join("\n  ");
}
function cssLinks(route) {
  return route.css.map((href) => `<link rel="stylesheet" href="${escapeHtml(href.startsWith("/") ? href : "/" + href)}" data-route-css="0">`).join("\n  ");
}
function composeDocument(route, pathname, markup, head, ssrData) {
  const isHome = pathname === "/";
  const isProtected = isProtectedRoute(route);
  let html = public_default;
  if (!isHome) {
    const title = head.title || route.title;
    const description = head.description !== void 0 ? head.description : route.description;
    html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(title)}</title>`);
    html = description ? html.replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${escapeHtml(description)}">`) : html.replace(/<meta name="description" content="[^"]*">\s*/, "");
    html = html.replace(/<!-- SEO:BEGIN[\s\S]*?<!-- SEO:END -->/, () => routeHead(route, isProtected, head));
    html = html.replace(/<!-- NOSCRIPT:BEGIN[\s\S]*?<!-- NOSCRIPT:END -->\s*/, "");
  }
  html = html.replace('<link rel="manifest" href="manifest.json">', '<link rel="manifest" href="/manifest.json">');
  html = html.replace("</head>", () => `  ${cssLinks(route)}
</head>`);
  const dataScript = ssrData ? `
  <script id="__SSR_DATA__" type="application/json">${jsonForScript(ssrData)}</script>` : "";
  html = html.replace('<div id="route-outlet"></div>', () => `<div id="route-outlet" data-ssr="1">${markup}</div>${dataScript}`);
  return html;
}
var isRec = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
var nonEmpty = (v) => typeof v === "string" && v.length > 0;
var SAFE_ICON = /^(?:<(?:path|circle|rect|line|polyline|polygon|ellipse)(?:\s+[a-zA-Z-]+="[^"<>]*")*\s*\/>)+$/;
function parseDefinitions(raw) {
  if (!isRec(raw) || !Array.isArray(raw.categories) || !Array.isArray(raw.lessons)) return null;
  if (raw.categories.length === 0 || raw.lessons.length === 0) return null;
  const categories = [];
  for (const c of raw.categories) {
    if (!isRec(c) || !nonEmpty(c.id) || !nonEmpty(c.title) || typeof c.description !== "string") return null;
    categories.push({ id: c.id, title: c.title, description: c.description, icon: typeof c.icon === "string" && SAFE_ICON.test(c.icon) ? c.icon : "" });
  }
  const lessons = [];
  for (const l of raw.lessons) {
    if (!isRec(l) || !nonEmpty(l.id) || !nonEmpty(l.category) || !nonEmpty(l.title) || typeof l.summary !== "string") return null;
    if (!nonEmpty(l.learn) || !nonEmpty(l.fen) || !nonEmpty(l.correctSan) || !nonEmpty(l.explanation)) return null;
    lessons.push({
      id: l.id,
      category: l.category,
      title: l.title,
      summary: l.summary,
      learn: l.learn,
      fen: l.fen,
      fenCaption: typeof l.fenCaption === "string" ? l.fenCaption : "",
      correctSan: l.correctSan,
      explanation: l.explanation
    });
  }
  return { categories, lessons };
}
function lessonsRender(pathname, rawLessons) {
  const defs = parseDefinitions(rawLessons);
  if (!defs) return null;
  const origin = siteOrigin();
  if (pathname === "/lessons") {
    return {
      status: 200,
      ssr: { kind: "lessons", categories: defs.categories, lessons: defs.lessons.map(({ id: id2, category: category2, title, summary }) => ({ id: id2, category: category2, title, summary })) },
      head: {
        canonicalPath: "/lessons",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Lesson NusantaraChess",
          numberOfItems: defs.lessons.length,
          itemListElement: defs.lessons.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: l.title, url: origin + "/lessons/" + encodeURIComponent(l.id) }))
        }
      }
    };
  }
  const m = pathname.match(/^\/lessons\/([^/]+)$/);
  if (!m) return null;
  let id = m[1];
  try {
    id = decodeURIComponent(m[1]).trim();
  } catch {
  }
  const idx = defs.lessons.findIndex((l) => l.id === id);
  if (idx < 0) {
    return {
      status: 404,
      ssr: { kind: "lesson-not-found", id },
      head: { title: "Lesson tidak ditemukan \u2014 NusantaraChess", description: "Lesson yang diminta tidak ditemukan di NusantaraChess.", robots: "noindex, nofollow" }
    };
  }
  const lesson = defs.lessons[idx];
  const url = origin + "/lessons/" + encodeURIComponent(lesson.id);
  const category = defs.categories.find((c) => c.id === lesson.category);
  return {
    status: 200,
    ssr: {
      kind: "lesson",
      lesson: { id: lesson.id, title: lesson.title, learn: lesson.learn, fenCaption: lesson.fenCaption, side: lesson.fen.split(" ")[1] === "b" ? "Hitam" : "Putih" },
      prevId: idx > 0 ? defs.lessons[idx - 1].id : null,
      nextId: idx < defs.lessons.length - 1 ? defs.lessons[idx + 1].id : null
    },
    head: {
      title: lesson.title + " \u2014 NusantaraChess",
      description: lesson.summary || lesson.learn.slice(0, 160),
      canonicalPath: "/lessons/" + encodeURIComponent(lesson.id),
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LearningResource",
            "@id": url + "#lesson",
            name: lesson.title,
            description: lesson.summary || lesson.learn.slice(0, 160),
            url,
            inLanguage: "id",
            ...category ? { isPartOf: { "@type": "CollectionPage", name: category.title, url: origin + "/lessons" } } : {}
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Lesson", item: origin + "/lessons" },
              { "@type": "ListItem", position: 2, name: lesson.title, item: url }
            ]
          }
        ]
      }
    }
  };
}
function num(v) {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}
var LEADERBOARD_CATEGORIES = ["bullet", "blitz", "rapid", "puzzle"];
function parseLeaderboardRows(payload) {
  if (!isRec(payload) || !Array.isArray(payload.leaderboard)) return null;
  const rows = [];
  for (const r of payload.leaderboard) {
    if (!isRec(r) || !nonEmpty(r.username)) return null;
    const rank = num(r.rank), rating = num(r.rating);
    const games = r.gamesPlayed == null ? null : num(r.gamesPlayed);
    if (rank === null || rating === null || r.gamesPlayed != null && games === null) return null;
    rows.push({ rank, username: r.username, rating, gamesPlayed: games });
  }
  return rows;
}
function parseSearchResults(payload) {
  if (!isRec(payload) || !Array.isArray(payload.results)) return null;
  const out = [];
  for (const r of payload.results) {
    if (!isRec(r) || !nonEmpty(r.username)) return null;
    const elo = num(r.eloBlitz);
    if (elo === null) return null;
    out.push({ username: r.username, eloBlitz: elo });
  }
  return out;
}
function leaderboardRender(ctx) {
  if (!ctx || !LEADERBOARD_CATEGORIES.includes(ctx.category)) return null;
  const category = ctx.category;
  const rows = parseLeaderboardRows(ctx.payload);
  if (!rows) return null;
  const searchQuery = ctx.searchQuery || "";
  let searchResults = null;
  if (searchQuery) {
    searchResults = parseSearchResults(ctx.searchPayload);
    if (!searchResults) return null;
  }
  const origin = siteOrigin();
  const ssr = { kind: "leaderboard", category, rows, searchQuery, searchResults };
  if (searchQuery) return { status: 200, ssr, head: { robots: "noindex, follow", canonicalPath: "/leaderboard" } };
  return {
    status: 200,
    ssr,
    head: {
      canonicalPath: category === "bullet" ? "/leaderboard" : "/leaderboard?category=" + category,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Leaderboard NusantaraChess \u2014 " + category.charAt(0).toUpperCase() + category.slice(1),
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: rows.length,
        itemListElement: rows.map((r) => ({ "@type": "ListItem", position: r.rank, name: r.username, url: origin + "/profile/" + encodeURIComponent(r.username) }))
      }
    }
  };
}
var SAFE_PHOTO = /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
function parsePublicProfile(payload) {
  if (!isRec(payload) || !isRec(payload.user) || !Array.isArray(payload.recentGames)) return null;
  const u = payload.user;
  if (!nonEmpty(u.username)) return null;
  const n = {
    eloBullet: num(u.eloBullet),
    eloBlitz: num(u.eloBlitz),
    eloRapid: num(u.eloRapid),
    puzzleRating: num(u.puzzleRating),
    wins: num(u.wins),
    draws: num(u.draws),
    losses: num(u.losses),
    puzzleSolved: num(u.puzzleSolved)
  };
  if (Object.values(n).some((v) => v === null)) return null;
  const createdAt = u.createdAt == null ? null : typeof u.createdAt === "number" || typeof u.createdAt === "string" ? u.createdAt : null;
  const photo = typeof u.profilePhoto === "string" && u.profilePhoto.length <= 1e5 && SAFE_PHOTO.test(u.profilePhoto) ? u.profilePhoto : "";
  const recentGames = [];
  for (const g of payload.recentGames) {
    if (!isRec(g) || typeof g.opponentName !== "string" || typeof g.category !== "string" || typeof g.result !== "string") return null;
    const opponentElo = num(g.opponentElo), eloChange = num(g.eloChange), playedAt = num(g.playedAt);
    if (opponentElo === null || eloChange === null || playedAt === null) return null;
    recentGames.push({ ...num(g.id) !== null ? { id: num(g.id) } : {}, opponentName: g.opponentName, opponentElo, category: g.category, result: g.result, eloChange, playedAt });
  }
  return {
    user: { username: u.username, createdAt, profilePhoto: photo, ...n },
    recentGames,
    totalGames: Math.max(num(payload.totalGames) ?? 0, recentGames.length)
  };
}
function profileRender(ctx) {
  if (!ctx || !ctx.username) return null;
  if (ctx.notFound) {
    return {
      status: 404,
      ssr: { kind: "profile-not-found", username: ctx.username },
      head: { title: "Pemain tidak ditemukan \u2014 NusantaraChess", description: "Pemain dengan username tersebut tidak ditemukan di NusantaraChess.", robots: "noindex, nofollow" }
    };
  }
  const parsed = parsePublicProfile(ctx.payload);
  if (!parsed) return null;
  const { user } = parsed;
  const origin = siteOrigin();
  const path = "/profile/" + encodeURIComponent(user.username);
  const description = "Profil " + user.username + " di NusantaraChess: rating Bullet " + user.eloBullet + ", Blitz " + user.eloBlitz + ", Rapid " + user.eloRapid + ", Puzzle " + user.puzzleRating + ".";
  let created = Number(user.createdAt);
  if (Number.isFinite(created) && created > 0 && created < 1e11) created *= 1e3;
  const createdDate = Number.isFinite(created) && created > 0 ? new Date(created) : null;
  return {
    status: 200,
    ssr: { kind: "public-profile", user, recentGames: parsed.recentGames, totalGames: parsed.totalGames },
    head: {
      title: user.username + " \u2014 Profil NusantaraChess",
      description,
      canonicalPath: path,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": origin + path,
        url: origin + path,
        inLanguage: "id",
        ...createdDate && !isNaN(createdDate.getTime()) ? { dateCreated: createdDate.toISOString() } : {},
        mainEntity: { "@type": "Person", "@id": origin + path + "#person", name: user.username, url: origin + path, description }
      }
    }
  };
}
function renderAppRoute(pathname, ctx = {}) {
  if (!isAppSsrPath(pathname)) return null;
  const route = resolveRoute(pathname);
  if (!route) return null;
  const Page = PAGES[route.page];
  if (pathname === "/") {
    const rows = ctx.home && !ctx.home.failed ? parseLeaderboardRows(ctx.home.payload) : null;
    const top = rows ? rows.slice(0, 5) : [];
    const ssr = top.length > 0 ? { kind: "home", topPlayers: top } : void 0;
    return {
      status: 200,
      cacheControl: rows ? HOME_CACHE_CONTROL : "no-store",
      html: composeDocument(route, pathname, (0, import_server.renderToString)(/* @__PURE__ */ (0, import_jsx_runtime92.jsx)(Page, { ssr })), {}, ssr)
    };
  }
  const data = pathname === "/leaderboard" ? leaderboardRender(ctx.leaderboard) : pathname.startsWith("/profile/") ? profileRender(ctx.profile) : lessonsRender(pathname, ctx.lessons);
  if (!data) return null;
  const clientData = data.ssr.kind === "public-profile" && data.ssr.user.profilePhoto ? { ...data.ssr, user: { ...data.ssr.user, profilePhoto: "", photoInDom: true } } : data.ssr;
  return { status: data.status, html: composeDocument(route, pathname, (0, import_server.renderToString)(/* @__PURE__ */ (0, import_jsx_runtime92.jsx)(Page, { ssr: data.ssr })), data.head, clientData) };
}
function spaShell() {
  return public_default;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isAppSsrPath,
  renderAppRoute,
  spaShell
});
