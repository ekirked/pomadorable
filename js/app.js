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
    this.hidePup();

  },

  // Define notifications to be used by Pomodoro
  breakNotification: undefined,
  workNotification: undefined,
  userVariables: function() {

    // set up buttons to adjust timer
    this.toggleTimerBtns = document.getElementsByClassName( "toggle-timer" );
    this.increasePom     = document.getElementById( "increase-pom" );
    this.decreasePom     = document.getElementById( "decrease-pom" );
    this.increaseBreak   = document.getElementById( "increase-break" );
    this.decreaseBreak   = document.getElementById( "decrease-break" );

    // set up display of timer lengths
    this.pomLengthDisplay     = document.getElementById( "pom-length" );
    this.breakLengthDisplay   = document.getElementById( "break-length" );

    // set up clock element and associated buttons
    this.countdownDisplay   = document.getElementById( "countdown" );

    this.typeDisplay        = document.getElementById( "type" );

    this.startCountdownBtn  = document.getElementById( "start-pom" );
    this.resetCountdownBtn  = document.getElementById( "refresh-pom" ); 
    this.stopCountdownBtn   = document.getElementById( "stop-pom" ); 
    this.skipPomBtn         = document.getElementById( "skip-pom" ); 

    this.countdownContainer = document.getElementById( "countdown-container" );

    this.pupImage = document.getElementById( "pup-image" );

    // this.keyPress         = document.addEventListener( "keydown", 32 );        
  
  }, 

  timerVariables: function() {

    // set default Length values (in minutes)
    this.pomLength =  1;
    this.breakLength   =  1;   

    // define the variable that includes the setinterval method;
    // if the clock is counting down, the value will be true, and 
    // the counter will be stopped on click
    this.timeinterval = false;
    this.workSession = true;
    this.pausedTime = 0;
    this.timePaused = false;
    this.timeStopped = false;

    // request permission 

  },

  bindEvents: function() {

    // bind increase / decrease pomodoro length to buttons
    this.increasePom.onclick = pomodoro.incrPom;
    this.decreasePom.onclick = pomodoro.decrPom;
    this.increaseBreak.onclick = pomodoro.incrBreak;
    this.decreaseBreak.onclick = pomodoro.decrBreak;

    // bind start date to #countdown and countdown buttons
    this.countdownDisplay.onclick  = pomodoro.startCountdown;
    this.startCountdownBtn.onclick = pomodoro.startCountdown;
    this.resetCountdownBtn.onclick = pomodoro.resetCountdown;
    this.stopCountdownBtn.onclick  = pomodoro.stopCountdown;
    this.skipPomBtn.onclick        = pomodoro.skipPom;
    
    // add option to use spacebar instead of buttons
    // this.keyPress = pomodoro.startCountdown;

  },

  updateAllDisplays: function() {

    // Change HTML of displays to reflect current values
    pomodoro.pomLengthDisplay.innerHTML     = this.pomLength;
    pomodoro.breakLengthDisplay.innerHTML   = this.breakLength;
    pomodoro.countdownDisplay.innerHTML     = this.pomLength + ":00";

    pomodoro.resetVariables();

  },

  requestNotification: function() {
    
    if (!("Notification" in window)) {
      return console.log("This browser does not support desktop notification");
    }
    
  },


  // SET UP FUNCTIONALITY TO INCREASE OR DECREASE LENGTHS OF SESSIONS

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


  // SET UP TIMER FUNCTIONALITY

  // reset variables to initial values
  resetVariables: function() {

    pomodoro.timeinterval = false;
    pomodoro.workSession = true;
    pomodoro.pausedTime = 0;
    pomodoro.timeStopped = false;
    pomodoro.timePaused = false;

  },

  startCountdown: function() {

    pomodoro.disableButtons();

    // toggle typeDisplay and background color between work and break
    pomodoro.displayType();

    // note that timer is not stopped
    pomodoro.timeStopped = false;

    // when timer is not stopped, unhide the "stop" button
    pomodoro.stopCountdownBtn.style.display = "";

    // when timer is not stopped, unhide the "refresh" button
    pomodoro.resetCountdownBtn.style.display = "";

    // pause pomodoro if countdown is currently running, 
    // otherwise start countdown
    if ( pomodoro.timeinterval !== false ) {
      pomodoro.pauseCountdown();
    } else {

      // set start and end time with system time  
      // and convert to ms to correctly meassure time ellapsed
      pomodoro.startTime = new Date().getTime();

      // check if pomodoro has just been unpaused
      if ( pomodoro.timePaused === false ) {
        pomodoro.unPauseCountdown();
      } else { 

      	// take into account saved paused time
        pomodoro.endTime = pomodoro.startTime + pomodoro.pausedTime;
        pomodoro.timePaused = false;

        // when timer is running, set start button to read "pause"
        pomodoro.startCountdownBtn.innerHTML = "pause";

      }  

      // run updateCountdown every 990ms to avoid lag with 1000ms;
      // update countdown checks time against system time 
      // and updates #countdown display
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

    // stop countdown
    clearInterval( pomodoro.timeinterval );

    // when either session ends, play sound
    pomodoro.playSound();

    // toggle between workSession being active or not;
    // this determines if break session or work session is displayed
    if ( pomodoro.workSession === true ) {
      pomodoro.workSession = false;
    } else {
      pomodoro.workSession = true;
    }

    // if it's a work session, hide the pomeranian image,
    // but show it if it's a break session,
    // and also adjust the buttons
    if (pomodoro.workSession === true ) {

    	pomodoro.hidePup();

    	// when not on a break, set the "skip break" button to read "skip to break"
    	pomodoro.skipPomBtn.innerHTML = "skip to break";

    } else {

    	pomodoro.showPup();

    	// when on a break, set the "skip to break" button to read "skip break"
    	pomodoro.skipPomBtn.innerHTML = "skip break";

    	// when on a break, hide the "refresh" button
    	pomodoro.resetCountdownBtn.style.display = "none";	

    }

    // stop countdown
    pomodoro.timeinterval = false;

    // restart, with workSession changed
    pomodoro.startCountdown();

  },

  pauseCountdown: function() {

  	pomodoro.startCountdownBtn.innerHTML = "pause";

    // save paused time to restart clock at correct time
    var currTime = new Date().getTime();
    pomodoro.pausedTime = pomodoro.endTime - currTime;
    
    // note that timer is paused
    pomodoro.timePaused = true;      

    // stop the countdown on second click    
    clearInterval( pomodoro.timeinterval );    
       
    // reset variable so that counter will start again on click
    pomodoro.timeinterval = false;

	// when timer is paused, set start button to read "resume"
    if ( pomodoro.timePaused === true ) {
    	pomodoro.startCountdownBtn.innerHTML = "resume";
    } 

  },

  unPauseCountdown: function() {

    if ( pomodoro.workSession === true ) {
    	pomodoro.endTime = pomodoro.startTime + ( pomodoro.pomLength * 60000 );
    } else {
    	pomodoro.endTime = pomodoro.startTime + ( pomodoro.breakLength * 60000 );      
    } 

	// when timer is running, set start button to read "pause"
    pomodoro.startCountdownBtn.innerHTML = "pause";
    
  },

  resetCountdown: function(){

    // stop clock and reset variables
    clearInterval( pomodoro.timeinterval );
    pomodoro.resetVariables();

    // restart variables
    pomodoro.startCountdown();

    // make sure pomeranian image is hidden
    pomodoro.hidePup();

    // when not on a break, set the "skip break" button to read "skip to break"
    pomodoro.skipPomBtn.innerHTML = "skip to break";
   
  },

  stopCountdown: function() {

    // stop timer
    clearInterval( pomodoro.timeinterval );
    pomodoro.timeStopped = true;

    // change HTML
    pomodoro.updateAllDisplays();

    // make sure pomeranian image is hidden
    pomodoro.hidePup();

    // reset Variables
    pomodoro.resetVariables();

    pomodoro.unDisableButtons();

    // when timer is stopped, set start button to read "start" again
    pomodoro.startCountdownBtn.innerHTML = "start";

	// when timer is stopped, hide the "stop" button
    pomodoro.stopCountdownBtn.style.display = "none";
	
	// when timer is stopped, hide the "refresh" button
    pomodoro.resetCountdownBtn.style.display = "none";

  },

  displayType: function() {

    // check what session is running; 
    // change appearance and text above countdown
    // depending on session (break or work)
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

  skipPom: function() {

  	// change to break session
  	pomodoro.changeSessions();

  },


  // ADD FUNCTIONALITY FOR SHOWING POMERANIAN IMAGE

  shufflePups: function() {

	var images = ["pom-1.jpg", "pom-2.jpg", "pom-3.jpg", "pom-4.jpg", "pom-5.jpg", "pom-6.jpg", "pom-7.jpg", "pom-8.jpg", "pom-9.jpg", "pom-10.jpg", "pom-11.jpg", "pom-12.jpg", "pom-13.jpg", "pom-14.jpg", "pom-15.jpg", "pom-16.jpg", "pom-17.jpg", "pom-18.jpg", "pom-19.jpg", "pom-20.jpg", "pom-21.jpg", "pom-22.jpg", "pom-23.jpg", "pom-24.jpg", "pom-25.jpg", "pom-26.jpg"];

	return images[Math.floor(Math.random() * images.length)];

  },

  showPup: function() {

  	// get random pomeranian image from folder
  	pomodoro.pupImage.src = "css/images/" + pomodoro.shufflePups();

	// show the pomeranian image
    pomodoro.pupImage.style.display = "";

  },

  hidePup: function() {

	// hide the pomeranian image
    pomodoro.pupImage.style.display = "none";

  },


  // OTHER ELEMENTS

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


