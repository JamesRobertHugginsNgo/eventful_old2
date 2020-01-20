/* global eventful */

const eventfulCollectionPropertyDescriptors = {
	definedByEventfulCollectionPropertyDescriptors: {
		value: true
	},

	eventfulCollectionData: {
		writable: true
	},

	adjustEventfulCollection: {
		value(startingLength) {
			while (startingLength !== this.length) {
				if (startingLength < this.length) {
					const key = String(startingLength);
					Object.defineProperty(this, key, {
						configurable: true,
						enumerable: true,
						set(value) {
							if (this.eventfulCollectionData[key] !== value) {
								const oldValue = this.eventfulCollectionData[key];
								this.eventfulCollectionData[key] = value;

								if (this.definedByEventfulEmitterPropertyDescriptors && value !== oldValue) {
									this.trigger('change', key, value, oldValue);
									this.trigger(`change:${key}`, value, oldValue);
								}
							}
						},
						get() {
							return this.eventfulCollectionData[key];
						}
					});

					startingLength++;
				} else {
					delete this[String(startingLength - 1)];

					startingLength--;
				}
			}
		}
	},

	length: {
		get() {
			if (this.eventfulCollectionData) {
				return this.eventfulCollectionData.length;
			}

			return 0;
		}
	},

	toArray: {
		value() {
			if (!this.eventfulCollectionData) {
				return [];
			}

			const array = this.eventfulCollectionData.slice();
			array.forEach((value, index) => {
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

['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift']
	.forEach((method) => {
		eventfulCollectionPropertyDescriptors[method] = {
			value(...args) {
				const startingLength = this.length;
				const returnValue = Array.prototype[method].call(this.eventfulCollectionData, ...args);

				this.adjustEventfulCollection(startingLength);

				if (this.definedByEventfulEmitterPropertyDescriptors) {
					this.trigger('change');
				}

				return returnValue;
			}
		};
	});

['concat', 'includes', 'indexOf', 'join', 'lastIndexOf', 'slice', 'toSource', 'toString', 'toLocaleString', 'entries',
	'every', 'filter', 'find', 'findIndex', 'forEach', 'keys', 'map', 'reduce', 'reduceRight', 'some', 'values']
	.forEach((method) => {
		eventfulCollectionPropertyDescriptors[method] = {
			value(...args) {
				return Array.prototype[method].call(this.eventfulCollectionData, ...args);
			}
		};
	});

/* exported eventfulCollection */
function eventfulCollection(obj = {}, value = []) {
	if (Array.isArray(obj)) {
		value = obj;
		obj = {};
	}

	obj = obj = eventful(obj);

	if (!obj.definedByEventfulCollectionPropertyDescriptors) {
		obj = Object.defineProperties(obj, eventfulCollectionPropertyDescriptors);
	}

	obj.push(...value);

	return obj;
}
