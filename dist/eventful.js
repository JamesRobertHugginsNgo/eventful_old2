"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* global eventful */
var eventfulCollectionPropertyDescriptors = {
  definedByEventfulCollectionPropertyDescriptors: {
    value: true
  },
  eventfulCollectionData: {
    writable: true
  },
  adjustEventfulCollection: {
    value: function value(startingLength) {
      var _this = this;

      while (startingLength !== this.length) {
        if (startingLength < this.length) {
          (function () {
            var key = String(startingLength);
            Object.defineProperty(_this, key, {
              configurable: true,
              enumerable: true,
              set: function set(value) {
                if (this.eventfulCollectionData[key] !== value) {
                  var oldValue = this.eventfulCollectionData[key];
                  this.eventfulCollectionData[key] = value;

                  if (this.definedByEventfulEmitterPropertyDescriptors && value !== oldValue) {
                    this.trigger('change', key, value, oldValue);
                    this.trigger("change:".concat(key), value, oldValue);
                  }
                }
              },
              get: function get() {
                return this.eventfulCollectionData[key];
              }
            });
            startingLength++;
          })();
        } else {
          delete this[String(startingLength - 1)];
          startingLength--;
        }
      }
    }
  },
  length: {
    get: function get() {
      if (this.eventfulCollectionData) {
        return this.eventfulCollectionData.length;
      }

      return 0;
    }
  },
  toArray: {
    value: function value() {
      if (!this.eventfulCollectionData) {
        return [];
      }

      var array = this.eventfulCollectionData.slice();
      array.forEach(function (value, index) {
        if (value.definedByEventfulDictionaryPropertyDescriptors) {
          array[index] = value.toJSON();
        } else if (value.definedByEventfulCollectionPropertyDescriptors) {
          array[index] = value.toArray();
        }
      });
      return array;
    }
  }
};
['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function (method) {
  eventfulCollectionPropertyDescriptors[method] = {
    value: function value() {
      var _Array$prototype$meth;

      var startingLength = this.length;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var returnValue = (_Array$prototype$meth = Array.prototype[method]).call.apply(_Array$prototype$meth, [this.eventfulCollectionData].concat(args));

      this.adjustEventfulCollection(startingLength);

      if (this.definedByEventfulEmitterPropertyDescriptors) {
        this.trigger('change');
      }

      return returnValue;
    }
  };
});
['concat', 'includes', 'indexOf', 'join', 'lastIndexOf', 'slice', 'toSource', 'toString', 'toLocaleString', 'entries', 'every', 'filter', 'find', 'findIndex', 'forEach', 'keys', 'map', 'reduce', 'reduceRight', 'some', 'values'].forEach(function (method) {
  eventfulCollectionPropertyDescriptors[method] = {
    value: function value() {
      var _Array$prototype$meth2;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (_Array$prototype$meth2 = Array.prototype[method]).call.apply(_Array$prototype$meth2, [this.eventfulCollectionData].concat(args));
    }
  };
});
/* exported eventfulCollection */

function eventfulCollection() {
  var _obj;

  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (Array.isArray(obj)) {
    value = obj;
    obj = {};
  }

  obj = obj = eventful(obj);

  if (!obj.definedByEventfulCollectionPropertyDescriptors) {
    obj = Object.defineProperties(obj, eventfulCollectionPropertyDescriptors);
  }

  (_obj = obj).push.apply(_obj, _toConsumableArray(value));

  return obj;
}
/* global eventful */


var eventfulDictionaryPropertyDescriptors = {
  definedByEventfulDictionaryPropertyDescriptors: {
    value: true
  },
  eventfulDictionaryData: {
    writable: true
  },
  observeProperty: {
    value: function value(name) {
      var _value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[name];

      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref$setter = _ref.setter,
          setter = _ref$setter === void 0 ? function (value, setterCbk) {
        return setterCbk();
      } : _ref$setter,
          _ref$getter = _ref.getter,
          getter = _ref$getter === void 0 ? function (getterCbk) {
        return getterCbk();
      } : _ref$getter;

      if (!this.eventfulDictionaryData) {
        this.eventfulDictionaryData = {};
      }

      var propertyDescriptor = Object.getOwnPropertyDescriptor(this, name);

      if (!propertyDescriptor || !propertyDescriptor.get && !propertyDescriptor.set) {
        if (_value !== undefined) {
          this.eventfulDictionaryData[name] = _value;
        }

        delete this[name];
        Object.defineProperty(this, name, {
          configurable: true,
          enumerable: true,
          set: function set(value) {
            var _this2 = this;

            if (this.eventfulDictionaryData[name] !== value) {
              var oldValue = this.eventfulDictionaryData[name];
              setter.call(this, value, function () {
                _this2.eventfulDictionaryData[name] = value;

                if (_this2.definedByEventfulEmitterPropertyDescriptors && value !== oldValue) {
                  _this2.trigger('change', name, value, oldValue);

                  _this2.trigger("change:".concat(name), value, oldValue);
                }
              });
            }
          },
          get: function get() {
            var _this3 = this;

            return getter.call(this, function () {
              return _this3.eventfulDictionaryData[name];
            });
          }
        });
      }

      return this;
    }
  },
  unobserveProperty: {
    value: function value(name) {
      if (this.eventfulDictionaryData) {
        return this;
      }

      var propertyDescriptor = Object.getOwnPropertyDescriptor(this, name);

      if (propertyDescriptor && (propertyDescriptor.get || propertyDescriptor.set)) {
        var value = this.eventfulDictionaryData[name];
        delete this.eventfulDictionaryData[name];
        delete this[name];

        if (value !== undefined) {
          this[name] = value;
        }
      }

      return this;
    }
  },
  toJSON: {
    value: function value() {
      var json = Object.assign({}, this.eventfulDictionaryData);

      for (var key in json) {
        if (json[key].definedByEventfulDictionaryPropertyDescriptors) {
          json[key] = json[key].toJSON();
        } else if (json[key].definedByEventfulCollectionPropertyDescriptors) {
          json[key] = json[key].toArray();
        }
      }

      return json;
    }
  }
};
/* exported eventfulDictionary */

function eventfulDictionary() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  obj = eventful(obj);

  if (!obj.definedByEventfulDictionaryPropertyDescriptors) {
    obj = Object.defineProperties(obj, eventfulDictionaryPropertyDescriptors);
  }

  Object.keys(obj).forEach(function (property) {
    obj.observeProperty(property);
  });
  return obj;
}
/* global eventfulEmitterPropertyDescriptors eventful */


var eventfulDomPropertyDescriptors = {
  definedByEventfulDomPropertyDescriptors: {
    value: true
  },
  eventfulDomData: {
    writable: true
  },
  on: {
    value: function value(event, handler, once, observer) {
      var _this4 = this;

      var _ref2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
          _ref2$fromObserver = _ref2.fromObserver,
          fromObserver = _ref2$fromObserver === void 0 ? false : _ref2$fromObserver;

      if (!this.eventfulDomData) {
        this.eventfulDomData = {};
      }

      var listener = function listener() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        handler.call.apply(handler, [_this4].concat(args));

        if (once) {
          _this4.off(event, handler, once, observer);
        }
      };

      this.addEventListener(name, listener);
      this.eventfulDomData.push({
        event: event,
        handler: handler,
        once: once,
        observer: observer,
        listener: listener
      });

      if (this.definedByEventfulEmitterPropertyDescriptors) {
        return eventfulEmitterPropertyDescriptors.on.value.call(this, event, handler, once, observer, {
          fromObserver: fromObserver
        });
      }

      return this;
    }
  },
  off: {
    value: function value(event, handler, once, observer) {
      var _ref3 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
          _ref3$fromObserver = _ref3.fromObserver,
          fromObserver = _ref3$fromObserver === void 0 ? false : _ref3$fromObserver;

      if (this.eventfulDomData) {
        return this;
      }

      var index = 0;

      while (index < this.eventfulDomData.length) {
        var _this$eventfulDomData = this.eventfulDomData[index],
            dataEvent = _this$eventfulDomData.event,
            dataHandler = _this$eventfulDomData.handler,
            dataOnce = _this$eventfulDomData.once,
            dataObserver = _this$eventfulDomData.observer,
            dataListener = _this$eventfulDomData.listener;

        if ((!event || event === dataEvent) && (!handler || handler === dataHandler) && (once == null || once === dataOnce) && (!observer || observer === dataObserver)) {
          this.eventfulDomData.splice(index, 1);
          this.removeEventListener(name, dataListener);
          continue;
        }

        index++;
      }

      if (this.definedByEventfulEmitterPropertyDescriptors) {
        return eventfulEmitterPropertyDescriptors.off.value.call(this, event, handler, once, observer, {
          fromObserver: fromObserver
        });
      }

      return this;
    }
  }
};
/* exported eventfulDom */

function eventfulDom() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  obj = eventful(obj);

  if (!obj.definedByEventfulDomPropertyDescriptors) {
    obj = Object.defineProperties(obj, eventfulDomPropertyDescriptors);
  }

  return obj;
}
/* exported eventfulEmitterPropertyDescriptors */


var eventfulEmitterPropertyDescriptors = {
  definedByEventfulEmitterPropertyDescriptors: {
    value: true
  },
  eventfulEmitterEnabled: {
    writable: true,
    value: true
  },
  eventfulEmitterData: {
    writable: true
  },
  on: {
    value: function value(event, handler, once, observer) {
      var _ref4 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
          _ref4$fromObserver = _ref4.fromObserver,
          fromObserver = _ref4$fromObserver === void 0 ? false : _ref4$fromObserver;

      if (!this.eventfulEmitterData) {
        this.eventfulEmitterData = [];
      }

      this.eventfulEmitterData.push({
        event: event,
        handler: handler,
        once: once,
        observer: observer
      });

      if (!fromObserver && observer) {
        observer.listenTo(this, event, handler, once, {
          fromEmitter: true
        });
      }

      return this;
    }
  },
  off: {
    value: function value(event, handler, once, observer) {
      var _this5 = this;

      var _ref5 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
          _ref5$fromObserver = _ref5.fromObserver,
          fromObserver = _ref5$fromObserver === void 0 ? false : _ref5$fromObserver;

      if (!this.eventfulEmitterData) {
        return this;
      }

      var observers = [];
      var index = 0;

      while (index < this.eventfulEmitterData.length) {
        var _this$eventfulEmitter = this.eventfulEmitterData[index],
            dataEvent = _this$eventfulEmitter.event,
            dataHandler = _this$eventfulEmitter.handler,
            dataOnce = _this$eventfulEmitter.once,
            dataObserver = _this$eventfulEmitter.observer;

        if ((!event || event === dataEvent) && (!handler || handler === dataHandler) && (once == null || once === dataOnce) && (!observer || observer === dataObserver)) {
          this.eventfulEmitterData.splice(index, 1);

          if (dataObserver && observers.indexOf(dataObserver) === -1) {
            observers.push(dataObserver);
          }

          continue;
        }

        index++;
      }

      if (!fromObserver) {
        observers.forEach(function (dataObserver) {
          dataObserver.stopListening(_this5, event, handler, once, {
            fromEmitter: true
          });
        });
      }

      return this;
    }
  },
  trigger: {
    value: function value(event) {
      var _this6 = this;

      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      if (!this.eventfulEmitterData || !this.eventfulEmitterEnabled) {
        return this;
      }

      this.eventfulEmitterData.forEach(function (_ref6) {
        var dataEvent = _ref6.event,
            handler = _ref6.handler,
            observer = _ref6.observer;

        if (event === dataEvent) {
          var context = observer || _this6;
          handler.call.apply(handler, [context].concat(args));
        }
      });
      this.off(event, null, true);
      return this;
    }
  }
};
/* exported eventfulEmitter */

function eventfulEmitter() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!obj.definedByEventfulEmitterPropertyDescriptors) {
    obj = Object.defineProperties(obj, eventfulEmitterPropertyDescriptors);
  }

  return obj;
}
/* global eventfulObserver eventfulEmitter */

/* exported eventful */


function eventful(obj) {
  return eventfulObserver(eventfulEmitter(obj));
}

var eventfulObserverPropertyDescriptors = {
  definedByEventfulObserverPropertyDescriptors: {
    value: true
  },
  eventfulObserverData: {
    writable: true
  },
  listenTo: {
    value: function value(emitter, event, handler, once) {
      var _ref7 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
          _ref7$fromEmitter = _ref7.fromEmitter,
          fromEmitter = _ref7$fromEmitter === void 0 ? false : _ref7$fromEmitter;

      if (!fromEmitter && emitter) {
        emitter.on(event, handler, once, this, {
          fromObserver: true
        });
      }

      if (!this.eventfulObserverData) {
        this.eventfulObserverData = [];
      }

      this.eventfulObserverData.push({
        emitter: emitter,
        event: event,
        handler: handler,
        once: once
      });
      return this;
    }
  },
  stopListening: {
    value: function value(emitter, event, handler, once) {
      var _this7 = this;

      var _ref8 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
          _ref8$fromEmitter = _ref8.fromEmitter,
          fromEmitter = _ref8$fromEmitter === void 0 ? false : _ref8$fromEmitter;

      if (!this.eventfulObserverData) {
        return this;
      }

      var emitters = [];
      var index = 0;

      while (index < this.eventfulObserverData.length) {
        var _this$eventfulObserve = this.eventfulObserverData[index],
            dataEmitter = _this$eventfulObserve.emitter,
            dataEvent = _this$eventfulObserve.event,
            dataHandler = _this$eventfulObserve.handler,
            dataOnce = _this$eventfulObserve.once;

        if ((!emitter || emitter === dataEmitter) && (!event || event === dataEvent) && (!handler || handler === dataHandler) && (once == null || once === dataOnce)) {
          this.eventfulObserverData.splice(index, 1);

          if (dataEmitter && emitters.indexOf(dataEmitter) === -1) {
            emitters.push(dataEmitter);
          }

          continue;
        }

        index++;
      }

      if (!fromEmitter) {
        emitters.forEach(function (emitter) {
          emitter.off(event, handler, once, _this7, {
            fromEmitter: true
          });
        });
      }

      return this;
    }
  }
};
/* exported eventfulObserver */

function eventfulObserver() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!obj.definedByEventfulObserverPropertyDescriptors) {
    obj = Object.defineProperties(obj, eventfulObserverPropertyDescriptors);
  }

  return obj;
}