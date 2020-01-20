/* global eventfulObserver eventfulEmitter */

/* exported eventful */
function eventful(obj) {

	return eventfulObserver(eventfulEmitter(obj));
}
