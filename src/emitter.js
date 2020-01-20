/* exported eventfulEmitterPropertyDescriptors */
const eventfulEmitterPropertyDescriptors = {
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
		value(event, handler, once, observer, { fromObserver = false } = {}) {
			if (!this.eventfulEmitterData) {
				this.eventfulEmitterData = [];
			}

			this.eventfulEmitterData.push({ event, handler, once, observer });

			if (!fromObserver && observer) {
				observer.listenTo(this, event, handler, once, { fromEmitter: true });
			}

			return this;
		}
	},

	off: {
		value(event, handler, once, observer, { fromObserver = false } = {}) {
			if (!this.eventfulEmitterData) {
				return this;
			}

			const observers = [];

			let index = 0;
			while (index < this.eventfulEmitterData.length) {
				const {
					event: dataEvent,
					handler: dataHandler,
					once: dataOnce,
					observer: dataObserver
				} = this.eventfulEmitterData[index];

				if ((!event || event === dataEvent) && (!handler || handler === dataHandler) &&
					(once == null || once === dataOnce) && (!observer || observer === dataObserver)) {

					this.eventfulEmitterData.splice(index, 1);

					if (dataObserver && observers.indexOf(dataObserver) === -1) {
						observers.push(dataObserver);
					}

					continue;
				}

				index++;
			}

			if (!fromObserver) {
				observers.forEach((dataObserver) => {
					dataObserver.stopListening(this, event, handler, once, { fromEmitter: true });
				});
			}

			return this;
		}
	},

	trigger: {
		value(event, ...args) {
			if (!this.eventfulEmitterData || !this.eventfulEmitterEnabled) {
				return this;
			}

			this.eventfulEmitterData.forEach(({ event: dataEvent, handler, observer }) => {
				if (event === dataEvent) {
					const context = observer || this;
					handler.call(context, ...args);
				}
			});

			this.off(event, null, true);

			return this;
		}
	}
};

/* exported eventfulEmitter */
function eventfulEmitter(obj = {}) {
	if (!obj.definedByEventfulEmitterPropertyDescriptors) {
		obj = Object.defineProperties(obj, eventfulEmitterPropertyDescriptors);
	}

	return obj;
}
