/* global eventful */

//removeIf(merge)
window.eventful = window.eventful || {};
//endRemoveIf(merge)

eventful.emitter = {};

eventful.emitter.propertyDescriptors = {
	eventfulEmitterData: {
		writable: true
	},

	on: {
		value(event, handler, once, observer) {
			if (!this.eventfulEmitterData) {
				this.eventfulEmitterData = {};
			}

			if (!this.eventfulEmitterData[event]) {
				this.eventfulEmitterData[event] = [];
			}

			const data = { handler, once, observer };
			this.eventfulEmitterData[event].push(data);

			if (observer && Object.getOwnPropertyDescriptor(observer, 'onHandler')) {
				observer.onHandler(this, event, handler, once);
			}

			return this;
		}
	},

	off: {
		value(event, handler, once, observer) {
			if (this.eventfulEmitterData) {
				const observers = [];

				for (const key in this.eventfulEmitterData) {
					if (event == null || key === event) {
						let index = 0;
						while (index < this.eventfulEmitterData[key].length) {
							const data = this.eventfulEmitterData[key][index];

							if ((handler == null || data.handler === handler)
								&& (once == null || data.once === once)
								&& (observer == null || data.observer === observer)) {

								this.eventfulEmitterData[key].splice(index, 1);

								if (data.observer && Object.getOwnPropertyDescriptor(data.observer, 'offHandler')
									&& observers.indexOf(data.observer) === -1) {

									observers.push(data.observer);
								}
							} else {
								index++;
							}
						}

						if (this.eventfulEmitterData[key].length === 0) {
							delete this.eventfulEmitterData[key];
						}

						if (event != null) {
							break;
						}
					}
				}

				observers.forEach((observer) => {
					observer.offHandler(this, event, handler, once);
				});
			}

			return this;
		}
	},

	trigger: {
		value(event, ...args) {
			if (this.eventfulEmitterData && this.eventfulEmitterData[event]) {
				this.eventfulEmitterData[event].forEach((emitterData) => {
					const context = emitterData.observer || this;
					emitterData.handler.call(context, ...args);
				});

				this.off(event, null, true);
			}

			return this;
		}
	}
};
