//====== VARIABLES =======
const popupModal = document.querySelector(".popup");
const popupOverlay = document.querySelector(".pop-overlay");
const pausedOverlay = document.querySelector(".pause-overlay");
const game = document.querySelector(".game");
const playButton = document.querySelector(".game .homepage .play");
const homepage = document.querySelector(".game .homepage");
const body = document.querySelector(".body");
const infoIcon = document.querySelector(".info.icon");
const scoreWrapper = document.querySelector(".game .scoreWrapper");
const score = document.querySelector(".game .scoreItem .score");
const cardItems = document.querySelectorAll(".cards");
const cardsText = document.querySelectorAll(".cards .card-item .text img");
const successModal = document.querySelector(".success-wrapper");
const arrows = document.querySelectorAll(".game .body .arrow");
const pauseButton = document.querySelector(".game .pause.icon");
const scoreItem = document.querySelector(".scoreItem .items");

const iconsArr = [...arrows, pauseButton];

let animationCounter = 0,
  isRunning = false,
  theTimer = 0,
  timerInterval,
  counter = 0,
  trueAnswers = 0,
  textCounter = 0,
  wrongAnswers = 0,
  questionsShow = 0;

const animateInfo = () => {
  infoIcon.classList.add("show");
  infoIcon.addEventListener("animationend", () => {
    setTimeout(() => {
      infoIcon.classList.remove("show");
      infoIcon.classList.add("hide");
    }, 1000);
  });
};

infoIcon.addEventListener("click", () => {
  infoIcon.classList.remove("hide");
  animateInfo();
});
scoreElements();
const scoreSpans = document.querySelectorAll(".scoreItem .items .part");

playButton.addEventListener("click", debounce(() => {
  console.log("start");
  openFullscreen();
  document.querySelector("#start-audio").play();
  game.style.backgroundImage = "url(./media/images/bg2.png)";
  homepage.classList.add("hide");
  homepage.addEventListener("animationend", () => {
    homepage.classList.remove("hide");
    homepage.style.visibility = "hidden";
    scoreWrapper.style.visibility = "visible";
    score.textContent = `0/${cardItems.length}`;
    body.classList.add("show");
    pauseButton.style.visibility = "visible";
    cardItems[questionsShow].classList.add("show");
    if (!isRunning) {
      startTimer();
    } else {
      stopTimer();
    }
  });
} , 500 ));

pauseButton.addEventListener("click", () => {
  console.log("paused");
  const hiddenIcon = pauseButton.querySelector("i.hide");
  const shownIcon = pauseButton.querySelector("i:not(.hide)");
  hiddenIcon.classList.remove("hide");
  shownIcon.classList.add("hide");
  pausedOverlay.classList.toggle("hide");
  if (isRunning) {
    stopTimer();
  } else {
    startTimer();
  }
});

cardsText.forEach((card) => {
  card.addEventListener("click", debounce((e) => {
    console.log("card clicked");
    //CHECK ANSWERS
    var question_by_id = document.getElementById(`q_${e.target.dataset.number}`);

    //IF ANSWER IS TRUE
    if (card.dataset.status === "true") {
      question_by_id.classList.add("true");
      trueAnswers++;
      scoreSpans.forEach((span) => {
        if (e.target.dataset.number === span.id) {
          span.classList.add("true");
        }
      });
      document.querySelector("#start-audio").play();
    }
    //IF ANSWER IS FALSE
    else {
      scoreSpans.forEach((span) => {
        if (e.target.dataset.number === span.id) {
          span.classList.add("false");
        }
      });
      document.querySelector("#start-audio").play();
      question_by_id.classList.add("false");
      wrongAnswers++;
    }
    counter++;
    questionsShow++;
    document.querySelector(".score").textContent = `${counter}/${cardItems.length}`;
    //SHOW THE NEXT QUESTION
    if (questionsShow === cardItems.length) {
      const text = document.querySelector(".text-card .score-text");
      text.textContent = `${trueAnswers}/${cardItems.length}`;
      text.setAttribute("text", `${trueAnswers}/${cardsText.length}`);

      setTimeout(() => {
        clearInterval(timerInterval);
        successModal.style.visibility = "visible";
        successModal.classList.add("show");
        overlay.classList.add("show");
        document.querySelector(`audio[id="success"]`).play();
      }, 500);
    } else {
      setTimeout(() => {
        animateNextQuestion();
      }, 500);
    }
  }, 500)); // تأخير الحدث لمدة 500 ميلي ثانية (نصف ثانية)
});

const hideItems = () => {
  iconsArr.forEach((item) => {
    item.style.opacity = 0;
  });
};
let timer;
const resetTimer = () => {
  clearTimeout(timer);
  iconsArr.forEach((item) => {
    item.style.opacity = 1;
  });
  timer = setTimeout(hideItems, 3000);
};

document.addEventListener("mousemove", resetTimer);
document.addEventListener("click", resetTimer);
const checkScreen = () => {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isMobile = window.innerWidth < 768 && isPortrait;
  return isMobile;
};
window.addEventListener("load", () => {
  const is_mobile = checkScreen();
  if (is_mobile) {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  } else {
    game.style.visibility = "visible";
  }
  animateInfo();
});

document.addEventListener("contextmenu", function (event) {
  var target = event.target;
  if (target.tagName === "IMG") {
    event.preventDefault();
  }
  return false;
});

window.addEventListener("orientationchange", function () {
  const is_mobile = checkScreen();
  if (window.orientation === 90 || window.orientation === -90) {
    if (is_mobile) {
      game.style.visibility = "visible";
      popupModal.style.visibility = "hidden";
      popupOverlay.style.visibility = "hidden";
    } else {
      popupModal.style.visibility = "visible";
      popupOverlay.style.visibility = "visible";
    }
  } else {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  }
});

var elem = document.body;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.webkitRequestFullScreen) { /* for iOS Safari */
    elem.webkitRequestFullScreen();
  }
}

function animateNextQuestion() {
  cardItems.forEach((card) => {
    card.classList.remove("show");
  });
  cardItems[questionsShow].classList.add("show");
}

function startTimer() {
  if (!isRunning) {
    timerInterval = setInterval(function () {
      theTimer++;
      console.log("the timer is work....");
      console.log(theTimer);
    }, 1000);
    isRunning = true;
  }
}



function stopTimer() {
  clearInterval(timerInterval);
  console.log("the timer is stopped....");
  isRunning = false;
}


function scoreElements() {
  for (let i = 1; i <= cardItems.length; i++) {
    let span = document.createElement("span");
    span.id = `${i}`;
    span.className = "part";
    span.style.width = `${100 / cardItems.length}%`;
    if (i == cardItems.length) {
      span.style.borderTopRightRadius = "10px";
      span.style.borderBottomRightRadius = "10px";
    }
    scoreItem.appendChild(span);
  }
}

function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// تعيين debounce function للحدث
document.addEventListener("touchstart", resetTimer);

document.addEventListener("touchstart", debounce((e) => {
  console.log("touch event occurred");
}, 500)); // تأخير الحدث لمدة 500 ميلي ثانية (نصف ثانية)
