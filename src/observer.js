const eventfulObserverPropertyDescriptors = {
	definedByEventfulObserverPropertyDescriptors: {
		value: true
	},

	eventfulObserverData: {
		writable: true
	},

	listenTo: {
		value(emitter, event, handler, once, { fromEmitter = false } = {}) {
			if (!fromEmitter && emitter) {
				emitter.on(event, handler, once, this, { fromObserver: true });
			}

			if (!this.eventfulObserverData) {
				this.eventfulObserverData = [];
			}

			this.eventfulObserverData.push({ emitter, event, handler, once });

			return this;
		}
	},

	stopListening: {
		value(emitter, event, handler, once, { fromEmitter = false } = {}) {
			if (!this.eventfulObserverData) {
				return this;
			}

			const emitters = [];

			let index = 0;
			while (index < this.eventfulObserverData.length) {
				const {
					emitter: dataEmitter,
					event: dataEvent,
					handler: dataHandler,
					once: dataOnce
				} = this.eventfulObserverData[index];

				if ((!emitter || emitter === dataEmitter) && (!event || event === dataEvent) &&
					(!handler || handler === dataHandler) && (once == null || once === dataOnce)) {

					this.eventfulObserverData.splice(index, 1);

					if (dataEmitter && emitters.indexOf(dataEmitter) === -1) {
						emitters.push(dataEmitter);
					}

					continue;
				}

				index++;
			}

			if (!fromEmitter) {
				emitters.forEach((emitter) => {
					emitter.off(event, handler, once, this, { fromEmitter: true });
				});
			}

			return this;
		}
	}
};

/* exported eventfulObserver */
function eventfulObserver(obj = {}) {
	if (!obj.definedByEventfulObserverPropertyDescriptors) {
		obj = Object.defineProperties(obj, eventfulObserverPropertyDescriptors);
	}

	return obj;
}
