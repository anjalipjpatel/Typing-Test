
// variable declerations
const inputElement = document.getElementById("Textbox");
const headingElement = document.getElementById("TestOutput");
const timerElement = document.getElementById("Timer");
const timeTakenElememt = document.getElementById("Time");
const WPMElement = document.getElementById("WPM");
const ScoreElement = document.getElementById("score");
let PlaceholderText = "";
let countdown = 5;
let isCountdownRunning = false;
let startTime = null;
let elapsedTime = null;
let CurrentWPM = null;
let CurrentScore = null;
let ValsToDisplay = null;
let LineToWrite = null;
let CurrentUsername = null;

// start hte timer
function startTimer() {
  startTime = Date.now();
}

// stop the timer
function stopTimer() {
  if (startTime !== null) {
    const currentTime = Date.now();
    elapsedTime = Math.floor((currentTime - startTime) / 1000); // in seconds
	}
}

// generate string of words + start the game
document.addEventListener("DOMContentLoaded", function() {
	fetch("basicwords.txt")
		.then(response => response.text())
		.then(text => {
			const words = text.trim().split("\n");
			const length = 30;
			const randWords = [];

			for (let i = 0; i < length; i++) {
				const rand = Math.floor(Math.random() * words.length);
				randWords.push(words[rand]);
			}

			PlaceholderText = randWords.join(' ');

			headingElement.textContent = PlaceholderText;

			// create a textbox taht holds username, enter username to start game and on button clikc do the rest [hide textbox after clicking enter]

			const TestBox = document.getElementById("TextInput");
			const toggleBttn = document.getElementById("submitUsername");
			const redoBttn = document.getElementById("retakeBttn");

			TestBox.classList.add("hidden");
			redoBttn.classList.add("hidden");
			toggleBttn.addEventListener("click",function() {
				const UsernameBox = document.getElementById("UsernameInput");
				const UserInputName = document.getElementById("Username")
				CurrentUsername = UserInputName.value;
				UsernameBox.classList.add("hidden");
				toggleBttn.classList.add("hidden");
				TestBox.classList.remove("hidden");
				redoBttn.classList.remove("hidden");
				startCountdown();
				startTimer();
			});
		});
});

// countdwon system
function startCountdown(){
	if (isCountdownRunning) return;

	isCountdownRunning = true;
	inputElement.disabled = true;
	const countdownInterval = setInterval(function(){
		timerElement.textContent = countdown;
		countdown --;
		if (countdown < 0){
			clearInterval(countdownInterval);
			timerElement.textContent = "";
			isCountdownRunning = false;
			inputElement.disabled = false;
			inputElement.focus();
		}
	}, 1000);
}

// calculate wpm
function CalculateWPM(){
	let standardWords = PlaceholderText.length / 5;
	let timeInMins = elapsedTime / 60;
	let WPM = Math.round(standardWords / timeInMins);
	/*
	let Score = WPM;
	for (let j=0;j < PlaceholderText.length;j++){
		if (PlaceholderText[j] != inputValue[j]){
			Score -= 1;
			if (Score < 0){
				Score = 0;
			}
		}
	}
	let returnVals = [WPM,Score];
	*/
	return WPM;
}

// update colours upon user entry + check for end
inputElement.addEventListener("input", function() {
	const inputValue = inputElement.value;
	const containerElement = document.createElement("div");

	for (let i = 0; i < PlaceholderText.length; i++) {
		const charSpan = document.createElement("span");
		charSpan.textContent = PlaceholderText[i];

		if (i < inputValue.length) { // check each character and display color
			if (inputValue[i] == PlaceholderText[i]) {
				charSpan.style.backgroundColor = "#2D6144";
			} else {
				charSpan.style.backgroundColor = "#C70039";
			}
		} else {
			charSpan.style.color = "white"; // Original characters in white
		}

		containerElement.appendChild(charSpan);
	}
	headingElement.innerHTML = "";
	headingElement.appendChild(containerElement);
	
	if (PlaceholderText.length == inputValue.length) { // test finsihed
		stopTimer();
		inputElement.disabled = true;
		CurrentWPM = CalculateWPM();
		timeTakenElememt.innerHTML = "Time: " + elapsedTime + " seconds";
		WPMElement.innerHTML = "WPM: " + CurrentWPM;
		if (CurrentUsername == "") {
			let RandomNum = Math.floor((Math.random() * 1000) + 1);
			CurrentUsername = "guest" + RandomNum;
		}
		fetch("/saveData", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ data: CurrentWPM + "," + CurrentUsername})
		})
		.then(response => response.json())
		.then(data => {
		  console.log("Data appended successfully");
		})
		.catch(error => {
		  console.error("Error appending data: ", error);
		});
	}		
});

// local storage key value username

// now need to read file, find top 10 vlaues and then output to leaderboard screen