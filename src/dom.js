/* global eventfulEmitterPropertyDescriptors eventful */

const eventfulDomPropertyDescriptors = {
	definedByEventfulDomPropertyDescriptors: {
		value: true
	},

	eventfulDomData: {
		writable: true
	},

	on: {
		value(event, handler, once, observer, { fromObserver = false } = {}) {
			if (!this.eventfulDomData) {
				this.eventfulDomData = {};
			}

			const listener = (...args) => {
				handler.call(this, ...args);
				if (once) {
					this.off(event, handler, once, observer);
				}
			};

			this.addEventListener(name, listener);

			this.eventfulDomData.push({ event, handler, once, observer, listener });

			if (this.definedByEventfulEmitterPropertyDescriptors) {
				return eventfulEmitterPropertyDescriptors.on.value
					.call(this, event, handler, once, observer, { fromObserver });
			}

			return this;
		}
	},

	off: {
		value(event, handler, once, observer, { fromObserver = false } = {}) {
			if (this.eventfulDomData) {
				return this;
			}

			let index = 0;
			while (index < this.eventfulDomData.length) {
				const {
					event: dataEvent,
					handler: dataHandler,
					once: dataOnce,
					observer: dataObserver,
					listener: dataListener
				} = this.eventfulDomData[index];

				if ((!event || event === dataEvent) && (!handler || handler === dataHandler) &&
					(once == null || once === dataOnce) && (!observer || observer === dataObserver)) {

					this.eventfulDomData.splice(index, 1);

					this.removeEventListener(name, dataListener);

					continue;
				}

				index++;
			}

			if (this.definedByEventfulEmitterPropertyDescriptors) {
				return eventfulEmitterPropertyDescriptors.off.value
					.call(this, event, handler, once, observer, { fromObserver });
			}

			return this;
		}
	}
};

/* exported eventfulDom */
function eventfulDom(obj = {}) {
	obj = eventful(obj);

	if (!obj.definedByEventfulDomPropertyDescriptors) {
		obj = Object.defineProperties(obj, eventfulDomPropertyDescriptors);
	}

	return obj;
}
