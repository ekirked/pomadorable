// store time completed as global variables
let workTimeCompleted = 0;
let breakTimeCompleted = 0;

// store pomodoros completed as global variables
let pomsCompleted = 0;
let breaksCompleted = 0;

/*
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

*/

var pomodoro = {
  
  init: function() {

    this.userVariables();
    this.timerVariables();
    this.bindEvents();
    this.updateAllDisplays();
    this.requestNotification();
  },

  // Define notifications to be used by Pomodoro
  breakNotification: undefined,
  workNotification: undefined,
  userVariables: function() {

    // set up buttons to adjust timer
    this.toggleTimerBtns = document.getElementsByClassName( "toggle-timer" );
    this.increasePom = document.getElementById( "increase-pom" );
    this.decreasePom = document.getElementById( "decrease-pom" );
    this.increaseBreak   = document.getElementById( "increase-break" );
    this.decreaseBreak   = document.getElementById( "decrease-break" );

    // set up display of timer lengths
    this.pomLengthDisplay = document.getElementById( "pom-length" );
    this.breakLengthDisplay   = document.getElementById( "break-length" );

    // set up clock element and associated buttons
    this.countdownDisplay   = document.getElementById( "countdown" );
    this.typeDisplay        = document.getElementById( "type" );
    this.resetCountdownBtn  = document.getElementById( "reset-pom" );    
    this.stopCountdownBtn   = document.getElementById( "stop-pom" ); 
    this.startCountdownBtn  = document.getElementById( "start-pom" );
    this.countdownContainer = document.getElementById( "countdown-container" );        
  
  }, 

  timerVariables: function() {

    // set default Length values (in minutes)
    this.pomLength =  25;
    this.breakLength   =  5;   

    // define the variable that includes the setinterval method;
    // If the clock is counting down, the value will be true, and 
    // the counter will be stopped on click. 
    this.timeinterval = false;
    this.workSession = true;
    this.pausedTime = 0;
    this.timePaused = false;
    this.timeStopped = false;

    // Request permission 

  },

  bindEvents: function() {

    // bind increase / decrease pomodoro length to buttons
    this.increasePom.onclick = pomodoro.incrPom;
    this.decreasePom.onclick = pomodoro.decrPom;
    this.increaseBreak.onclick = pomodoro.incrBreak;
    this.decreaseBreak.onclick = pomodoro.decrBreak;

    // bind start date to #countdown and countdown buttons
    this.countdownDisplay.onclick  = pomodoro.startCountdown;
    this.resetCountdownBtn.onclick = pomodoro.resetCountdown;
    this.stopCountdownBtn.onclick  = pomodoro.stopCountdown;
    this.startCountdownBtn.onclick = pomodoro.startCountdown;

  },

  updateAllDisplays: function() {

    // Change HTML of displays to reflect current values
    pomodoro.pomLengthDisplay.innerHTML = this.pomLength;
    pomodoro.breakLengthDisplay.innerHTML   = this.breakLength;
    pomodoro.countdownDisplay.innerHTML     = this.pomLength + ":00";

    pomodoro.resetVariables();

  },

  requestNotification: function() {
    
    if (!("Notification" in window)) {
      return console.log("This browser does not support desktop notification");
    }
    
  },

  incrPom: function() {

    if ( pomodoro.pomLength < 59 ) {
      pomodoro.pomLength += 1;
      pomodoro.updateAllDisplays();    
    }   

  },

  decrPom: function() {

    if (  pomodoro.pomLength > 1 ) {
      pomodoro.pomLength -= 1;
      pomodoro.updateAllDisplays();      
    }

  },

  incrBreak: function() {

    if (  pomodoro.breakLength < 30 ) {
      pomodoro.breakLength += 1;
      pomodoro.updateAllDisplays();    
    }

  },

  decrBreak: function() {

    if ( pomodoro.breakLength > 1 ) {
      pomodoro.breakLength -= 1;
      pomodoro.updateAllDisplays();     
    }    

  },

  // Reset variables to initial values
  resetVariables: function() {

    pomodoro.timeinterval = false;
    pomodoro.workSession = true;
    pomodoro.pausedTime = 0;
    pomodoro.timeStopped = false;
    pomodoro.timePaused = false;

  },

  startCountdown: function() {

    pomodoro.disableButtons();
    // Toggle typeDisplay and background color between work and break
    pomodoro.displayType();

    // Pause pomodoro if countdown is currently running, otherwise start
    // countdown
    if ( pomodoro.timeinterval !== false ) {
      pomodoro.pauseCountdown();
    } else {
      // Set start and end time with system time and convert to 
      // miliseconds to correctly meassure time ellapsed
      pomodoro.startTime = new Date().getTime();

      // Check if pomodoro has just been unpaused
      if ( pomodoro.timePaused === false ) {
        pomodoro.unPauseCountdown();
      } else {
        pomodoro.endTime = pomodoro.startTime + pomodoro.pausedTime;
        pomodoro.timePaused = false;
      }  

      // Run updateCountdown every 990ms to avoid lag with 1000ms,
      // Update countdown checks time against system time and updates
      // #countdown display
      pomodoro.timeinterval = setInterval(pomodoro.updateCountdown,990); 
    }
     
  },

  updateCountdown: function() {

    // Get differnce between the current time and the 
    // end time in miliseconds. difference = remaining time
    var currTime = new Date().getTime();
    var difference = pomodoro.endTime - currTime;

    // Convert remaining milliseconds into minutes and seconds 
    var seconds = Math.floor( ( difference/1000 ) % 60 );
    var minutes = Math.floor( ( difference/1000 ) / 60 % 60 );

    // Add 0 to seconds if less than ten
    if ( seconds < 10 ) { seconds = "0" + seconds; }

    // Display remaining minutes and seconds, unless there is less than 1 second
    // left on timer. Then change to next session.
    if ( difference > 1000 ) {
      pomodoro.countdownDisplay.innerHTML = minutes + ":" + seconds;
    } else {
      pomodoro.changeSessions();
    }  

  },

  changeSessions: function() {

    // Stop countdown
    clearInterval( pomodoro.timeinterval );

    pomodoro.playSound();

    // Toggle between workSession being active or not
    // This determines if break session or work session is displayed
    if ( pomodoro.workSession === true ) {
      pomodoro.workSession = false;
    } else {
      pomodoro.workSession = true;
    }

    // Stop countdown
    pomodoro.timeinterval = false;
    // Restart, with workSession changed
    pomodoro.startCountdown();

  },

  pauseCountdown: function() {

        // Save paused time to restart clock at correct time
        var currTime = new Date().getTime();
        pomodoro.pausedTime = pomodoro.endTime - currTime;
        pomodoro.timePaused = true;      

        // Stop the countdown on second click    
        clearInterval( pomodoro.timeinterval );    
       

        // Reset variable so that counter will start again on click
        pomodoro.timeinterval = false;
  },

  unPauseCountdown: function() {
    if ( pomodoro.workSession === true ) {
      pomodoro.endTime = pomodoro.startTime + ( pomodoro.pomLength * 60000 );
    } else {
      pomodoro.endTime = pomodoro.startTime + ( pomodoro.breakLength * 60000 );      
    }  
  },

  resetCountdown: function(){

    // Stop clock and reset variables
    clearInterval( pomodoro.timeinterval );
    pomodoro.resetVariables();

    // Restart variables
    pomodoro.startCountdown();
   
  },

  stopCountdown: function() {

    // Stop timer
    clearInterval( pomodoro.timeinterval );

    // Change HTML
    pomodoro.updateAllDisplays();

    // Reset Variables
    pomodoro.resetVariables();

    pomodoro.unDisableButtons();

  },

  displayType: function() {
    // Check what session is running and change appearance and text above
    // countdown depending on session (break or work)
    if ( pomodoro.workSession === true ) {
      pomodoro.typeDisplay.innerHTML = "work session";
      pomodoro.countdownContainer.className = pomodoro.countdownContainer.className.replace( "break", "" );
    } else {
      pomodoro.typeDisplay.innerHTML = "break";
      if ( pomodoro.countdownContainer.className !== "break" ) {
        pomodoro.countdownContainer.className += "break";
      }
    }   

  },

  playSound: function() {

    var mp3 = "http://soundbible.com/grab.php?id=1746&type=mp3";
    var audio = new Audio(mp3);
    audio.play();    

  },

  disableButtons: function() {

    for (var i = 0; i < pomodoro.toggleTimerBtns.length; i++) {
      pomodoro.toggleTimerBtns[i].setAttribute("disabled", "disabled");
      pomodoro.toggleTimerBtns[i].setAttribute("title", "Stop the countdown to change timer length"); 
    } 

  },

  unDisableButtons: function() {

    for (var i = 0; i < pomodoro.toggleTimerBtns.length; i++) {
      pomodoro.toggleTimerBtns[i].removeAttribute("disabled"); 
      pomodoro.toggleTimerBtns[i].removeAttribute("title"); 
    }  

  }
};

// initialise on page load
pomodoro.init();


