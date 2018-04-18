// store time completed as global variables
let workTimeCompleted = 0;
let breakTimeCompleted = 0;

// store pomodoros completed as global variables
let pomsCompleted = 0;
let breaksCompleted = 0;


// arithmetic to turn ms to days/hours/minutes/seconds
function interpretTime(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

// set up clock and update it every second
function initializeClock(id, endtime) {

  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = interpretTime(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

// set up 25-minute countdown
var deadline = new Date(Date.parse(new Date()) + 25 * 60 * 1000);

// initializeClock('clockdiv', deadline);


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

// add event listener for start/unpause button


// set up event listener for restart button
$('.fa-repeat').on('click', function(event) {

	initializeClock('clockdiv', deadline);

	// startPom();

});



// start Pomodoro
// function startPom() {

	// startTimer();

// }