/* global eventful */

const eventfulDictionaryPropertyDescriptors = {
	definedByEventfulDictionaryPropertyDescriptors: {
		value: true
	},

	eventfulDictionaryData: {
		writable: true
	},

	observeProperty: {
		value(name, value = this[name], {
			setter = (value, setterCbk) => setterCbk(),
			getter = (getterCbk) => getterCbk()
		} = {}) {
			if (!this.eventfulDictionaryData) {
				this.eventfulDictionaryData = {};
			}

			const propertyDescriptor = Object.getOwnPropertyDescriptor(this, name);
			if (!propertyDescriptor || (!propertyDescriptor.get && !propertyDescriptor.set)) {
				if (value !== undefined) {
					this.eventfulDictionaryData[name] = value;
				}

				delete this[name];

				Object.defineProperty(this, name, {
					configurable: true,
					enumerable: true,
					set(value) {
						if (this.eventfulDictionaryData[name] !== value) {
							const oldValue = this.eventfulDictionaryData[name];

							setter.call(this, value, () => {
								this.eventfulDictionaryData[name] = value;

								if (this.definedByEventfulEmitterPropertyDescriptors && value !== oldValue) {
									this.trigger('change', name, value, oldValue);
									this.trigger(`change:${name}`, value, oldValue);
								}
							});
						}
					},
					get() {
						return getter.call(this, () => {
							return this.eventfulDictionaryData[name];
						});
					}
				});
			}

			return this;
		}
	},

	unobserveProperty: {
		value(name) {
			if (this.eventfulDictionaryData) {
				return this;
			}

			const propertyDescriptor = Object.getOwnPropertyDescriptor(this, name);
			if (propertyDescriptor && (propertyDescriptor.get || propertyDescriptor.set)) {
				const value = this.eventfulDictionaryData[name];

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
		value() {
			const json = Object.assign({}, this.eventfulDictionaryData);
			for (const key in json) {
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
function eventfulDictionary(obj = {}) {
	obj = eventful(obj);

	if (!obj.definedByEventfulDictionaryPropertyDescriptors) {
		obj = Object.defineProperties(obj, eventfulDictionaryPropertyDescriptors);
	}

	Object.keys(obj).forEach((property) => {
		obj.observeProperty(property);
	});

	return obj;
}
