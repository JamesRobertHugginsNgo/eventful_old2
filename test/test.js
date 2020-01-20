/* global $ eventful eventfulDictionary */

$(() => {
	const obj1 = {};
	eventful(obj1);
	obj1.on('event1', () => {
		console.log('EVENT 1');
	});

	let obj2 = {};
	eventful(obj2);
	obj2.listenTo(obj1, 'event1', () => {
		console.log('EVENT 1 + 1');
	});

	obj1.trigger('event1');

	obj2.stopListening();
	obj2 = null;

	obj1.trigger('event1');

	obj1.trigger('event1');

	const data = eventfulDictionary({
		prop1: null,
		prop2: null
	});

	data.on('change:prop1', (...arg) => {
		console.log('CHANGE:PROP1', ...arg);
	});

	data.on('change:prop2', (...arg) => {
		console.log('CHANGE:PROP2', ...arg);
	});

	data.prop1 = '123';
	data.prop2 = 'abc';
});
