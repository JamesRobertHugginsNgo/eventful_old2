/* global eventful */

//removeIf(merge)
window.eventful = window.eventful || {};
//endRemoveIf(merge)

eventful.observer = {};

eventful.observer.propertyDescriptors = {
	eventfulObserverData: {
		writable: true
	},

	listenTo: {
		value(emitter, event, handler, once) {
			if (Object.getOwnPropertyDescriptor(emitter, 'eventfulEmitterData')) {
				emitter.on(event, handler, once, this);
			}

			return this;
		}
	},

	onHandler: {
		value(emitter, event, handler, once) {
			if (!this.eventfulObserverData) {
				this.eventfulObserverData = {};
			}

			if (!this.eventfulObserverData[event]) {
				this.eventfulObserverData[event] = [];
			}

			this.eventfulObserverData[event].push({ emitter, handler, once });
		}
	},

	stopListening: {
		value(emitter, event, handler, once) {
			for (const key in this.eventfulObserverData) {
				if (event == null || key === event) {
					const emitters = [];

					for (let index = 0, length = this.eventfulObserverData[key].length; index < length; index++) {
						const eventfulObserverData = this.eventfulObserverData[key][index];
						if (emitter == null || eventfulObserverData.emitter === emitter) {
							if (emitters.indexOf(eventfulObserverData.emitter) === -1) {
								emitters.push(eventfulObserverData.emitter);
							}
						}

						if (emitter != null) {
							break;
						}
					}

					emitters.forEach((emitter) => {
						if (emitter.definedByEventfulEmitterPropertyDescriptor) {
							emitter.off(key, handler, once, this);
						}
					});

					if (event != null) {
						break;
					}
				}
			}

			return this;
		}
	},

	offHandler: {
		value(emitter, event, handler, once) {
			if (this.eventfulObserverData) {
				for (const key in this.eventfulObserverData) {
					if (event == null || key === event) {
						let index = 0;
						while (index < this.eventfulObserverData[key].length) {
							const data = this.eventfulObserverData[key][index];

							if ((emitter == null || data.observer === emitter)
								&& (handler == null || data.handler === handler)
								&& (once == null || data.once === once)) {

								this.eventfulObserverData[key].splice(index, 1);
							} else {
								index++;
							}
						}

						if (this.eventfulObserverData[key].length === 0) {
							delete this.eventfulObserverData[key];
						}

						if (event != null) {
							break;
						}
					}
				}
			}
		}
	}
};
