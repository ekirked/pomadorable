// define global variables
let startTime = 0;
let endTime = 0;
let countdown = 1500;

// set up end time
var countDownDate = new Date("Sep 5, 2018 15:37:25").getTime();

// update the countdown every 1 second
var x = setInterval(function() {

	// get current date and time
  	var now = new Date().getTime();

  	// find the distance between now an the countdown date
  	var distance = countDownDate - now;

  	// Time calculations for days, hours, minutes and seconds
  	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  	// Display the result in the element with id="demo"
  	document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  	+ minutes + "m " + seconds + "s ";

  	// If the count down is finished, write some text
  	if (distance < 0) {
    	clearInterval(x);
    	document.getElementById("demo").innerHTML = "EXPIRED";
  	}
}, 1000);


// set up work timer
// function startTimer() {

	// startTime = Date.now();

	// setInterval(function() {
		// countdown = countdown - 1;	
		// $(".time").text(Math.floor(countdown);
	// }, 1000);

		// endTime = Date.now();
	    // $(".time").text(Math.floor((endTime - startTime) / 1000));
	// }, 1000);

// }

// add event listener for start button


// set up event listener for restart button
// $('.fa-repeat').on('click', function(event) {

	// startPom();

// });



// start Pomodoro
function startPom() {

	startTimer();

}