// define global variables
let startTime = 0;
let endTime = 0;

// set up work timer
function startTimer() {

	startTime = Date.now();

	setInterval(function() {
		endTime = Date.now();
	    $(".clock").text(Math.floor((endTime - startTime) / 1000));
	}, 1000);

}