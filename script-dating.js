//Creating all the variables and arrays for the personality quiz
var grammar, lines, json, result; 
var questionState = 0;	//Keeps track of users place in quiz
var quizActive = true;	//True until the last question is answered
var userStats = [
	0,	//Personality descriptions to come soon (profile descriptions)
	0, 
	0, 
	0, 	
	0, 	
	0, 
	0, 	
	0,
];

var startStats = userStats; //Holds the increasing values in userStats relating to user selection
var questionText = [
	" If you are out with someone new and things don't work out the way you expected, how do you react?", //q1
	"When you are spending time with someone on a date, what are you thinking of?", //q2
	"Your discussions on dates involve:",  //q3
	"How do you dress for a first date?", //q4
	"When organizing a follow-up date:", //q5
	"They have made plans, but you were hoping to do something else. You:", //q6
	"How long do you need to decide whether you will go on a date?", //q7
	"What would be your ideal location for a date?", //q8
];

var answerText = [		
    //question 1 answers													
	[   "It must have been something you said.",
		"It must just not have been meant to be.",
		"He/she was obviously the problem.",
		"It depends on many things."],

	//question 2 answers
	["Having a good time on your outing.",
		"Seeing if they are are good enough for you.",
		"Making a good impression on them.",
		"How things are going to go"],

	//question 3 answers
	["What you find interesting",
		"What you find interesting",
		"Common interests",
		"Just casual things"],

	//question 4 answers
	["Clothes you think will impress him/her.",
		"Whatever you feel like wearing.",
		"I do what my heart tells me.",
		"I deal with decisions last minute."],
	
	//question 5 answers
	["You find out when it will suit them and make sure to clear your schedule.",
		"You let them know when you are available and say you will call.",
		"You find out when it will suit both of you again and ask to see them again.",
		"You just find out about a good holiday, and then choose the same."],

	//question 6 answers
		["Follow through with what he/she has planned",
		"Persuade him/her to do something you want to do",
		"Let them know what you would prefer to do and find out if they agree with you.",
		"Would simply deny them and do what you have to"],

	//question 7 answers
        ["A few hours",
        "At least a week",
        "One or two days",
        "A very long time"],

	//question 8 answers
        ["An expensive restaurant",
        "Rooftop candlelit dinner",
        "The beach",
        "Anything that makes your partner happy"],
];

var answerValues = [
	//question 1 answer values
	[[1, 0, 0, 1, 1, 0, 0, 1],
	[0, 1, 1, 0, 0, 2, 0, 1],
	[2, 1, 1, 0, 1, 0, 1, 0],
	[1, 0, 0, 1, 0, 1, 0, 1],
	],

	//question 2 answer values
	[[1, 0, 1, 1, 1, 0, 1, 1],
	[0, 2, 1, 0, 0, 1, 1, 0],
	[1, 0, 0, 1, 1, 1, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1],
	],

	//question 3 answer values
	[[1, 0, 2, 0, 1, 0, 1, 1],
	[0, 2, 0, 1, 1, 1, 0, 1],
	[1, 0, 1, 1, 1, 1, 1, 1],
	[0, 1, 0, 1, 0, 0, 1, 1],
	],

	//question 4 answer values
	[[1, 1, 0, 0, 1, 1, 0, 2],
	[1, 1, 0, 2, 1, 0, 0, 1],
	[1, 0, 0, 1, 2, 0, 0, 1],
	[0, 0, 1, 0, 1, 1, 1, 0],
	],

	//question 5 answer values
	[[2,0,1,1,1,0,1,1],
	[0,1,1,0,1,0,1,0],
	[1,1,2,0,1,0,1,0],
	[0,1,0,2,1,1,0,1],
	],

	//question 6 answer values
	[[1,0,1,0,1,0,1,0],
	[1,0,1,0,1,0,1,0],
	[0,1,0,1,0,1,0,1],
	[0,1,0,1,0,1,0,1],
	],

	//question 7 answer values
	[[1,0,1,1,1,1,1,0],
	[1,1,1,1,1,1,1,1],
	[0,1,0,1,1,1,0,1],
	[1,1,2,1,1,1,1,1],
	],

	//question 8 answer values
	[[0,0,0,0,0,0,0,0],
	[1,0,1,0,0,1,0,1],
	[1,0,1,0,1,0,1,0],
	[0,1,0,1,0,1,0,1],
	],
];

var results = document.getElementById("results");
var resultPlural = document.getElementById("plural");
var quiz = document.getElementById("quiz");
var printResult = document.getElementById("topScore");
var printDescription = document.getElementById("description");
var printDescription2 = document.getElementById("description2");
var printBotanical = document.getElementById("botanical");
var buttonElement = document.getElementById("button");
var theme = document.getElementsByTagName('link')[0];
var printLines = document.getElementById("gen");

buttonElement.addEventListener("click", changeState);

//This function progresses the user through the quiz

function changeState() {

	updatePersonality(); 	//Adds the values of the startStats to the userStats	
	swapCSS("quiz.css");									
	
	if (quizActive) {
		initText(questionState);	//sets up next question based on user's progress through quiz
		questionState++;			//advances progress through quiz
		buttonElement.disabled = true; //disables button until user chooses next answer
		buttonElement.innerHTML = "Please select an answer";
		buttonElement.style.opacity = 0.8;

	} else {
		/*All questions answered*/

		setResultPage(); //runs set up for result page
	}
};

//This function determines the question and answer content based on user progress through the quiz

function initText(question) {

	var answerSelection = "";
	for (i = 0; i < answerText[question].length; i++) {

		answerSelection += "<li><input type='radio' name='question" +
			(question + 1) + "' onClick='setAnswer(" + i + ")' id='" + answerText[question][i] + "'><label for='" + answerText[question][i] + "'>" + answerText[question][i] + "</label></li>";
	}

	document.getElementById("questions").innerHTML = questionText[question];	//set question text
	document.getElementById("answers").innerHTML = answerSelection;				//set answer text
};

//This function is called when a user selects an answer, NOT when answer is submitted

function setAnswer(input) {

	clearStartStats();	//clear startStats in case user reselects their answer
	
	startStats = answerValues[questionState - 1][input];	//selects personality values based on user selection 

	if (questionState < questionText.length) {
		/*User has not reached the end of the quiz */

		buttonElement.innerHTML = "Continue";
		buttonElement.disabled = false;
		buttonElement.style.opacity = 1;

	} else {
		/*All questions answered*/

		quizActive = false;
		buttonElement.innerHTML = "RESULTS"
		buttonElement.disabled = false;
		buttonElement.style.opacity = 1;
	}
};

function clearStartStats() {
	startStats = [0, 0, 0, 0, 0, 0, 0, 0];
};

//This function adds the values of the startStats to the userStats based on user selection 

function updatePersonality() {

	for (i = 0; i < userStats.length; i++) {
		userStats[i] += startStats[i];
	}
};

function swapCSS(value) {
	var sheets = document.getElementsByTagName('link');

	sheets[0].href = value;
}

//This function determines the highest personality value

function setResultPage() {

	var highestStatPosition = 0;	//highest stat defaults as 'bamboo'

	//This statement loops through all personality stats and updates highestStatPosition based on a highest stat 

	for (i = 1; i < userStats.length; i++) {

		if (userStats[i] > userStats[highestStatPosition]) {
			highestStatPosition = i;
		}
	}

	displayResults(highestStatPosition); //passes the index value of the highest stat discovered

	/* Hides the quiz content, shows results content */
	quiz.style.display = "none";

}

function preload() {
	json = loadJSON('haiku.json');
};

//Might have to remove later
function setup() {
	grammar = RiTa.grammar(json);
	result = grammar.expand();
	printLines.innerText = result;
	noCanvas();
};

function displayResults(personality) {
	switch (personality) {

		case 0:	//type1 code
			results.style.display = "flex";
			//results.classList.add("Bamboo");
			printResult.innerText = "The Submissive!";
			//printDescription.innerText = "Purple Bamboo, or";
			//printBotanical.innerText =  "Phyllostachys nigra";
			printDescription2.innerText = "You want to please your date and put them first before anything you want. You like going for walks and love spending quality time! Your favourite food is Italian!"
			printLines.innerText = result;
			resultPlural.innerText = "Good Luck!";
			break;

		case 1:		//type2
			results.style.display = "flex";
			//results.classList.add("Orchid");
			printResult.innerText = "The Romantic!";
			//printDescription.innerText = "The Moon Orchid, or";
			//printBotanical.innerText =  "Phalaenopsis amabilis";
			printDescription2.innerText = "You think love is easy, but you have to find the perfect partner and give up on relationships quickly. You like fancy candle-lit dinners and love to go on vacations."
			printLines.innerText = result;
			resultPlural.innerText = "Good Luck!";
			break;

		case 2:		//type3
			results.style.display = "flex";
			//results.classList.add("Ficus");
			printResult.innerText = "The Maximizer";
			//printDescription.innerText = "The Rubber Fig, or";
			//printBotanical.innerText =  "Ficus elastica";
			printDescription2.innerText = "You have unrealistic expectations of a partner and are always looking for better opportunities. You like going clubbing and are just looking for something casual."
			printLines.innerText = result;
			resultPlural.innerText = "Good Luck!";
			break;

		case 3:		//type4
			results.style.display = "flex";
			//results.classList.add("Wakame");
			printResult.innerText = "The Hesitator";
			//printDescription.innerText = "Wakame, or";
			//printBotanical.innerText =  "Undaria pinnatifida";
			printDescription2.innerText = "You have low self-confidence and never feel ready to date or start a relationship. You like quiet cafes and really love personal alone-time."
			printLines.innerText = result;
			resultPlural.innerText = "Good Luck!";
			break;

		case 4:		//type5
			results.style.display = "flex";
			//results.classList.add("Sakura");
			printResult.innerText = " The Nurturer/Protector";
			//printDescription.innerText = "The Japanese Cherry Tree, or";
			//printBotanical.innerText =  "Prunus serrulata";
			printDescription2.innerText = "You always end up dating dependent and needy people. You like givin people gifts and just want the comfort of their company so you end up buying them with money."
			printLines.innerText = result;
			resultPlural.innerText = "Good Luck!";
			break;

		case 5:		//type6
			results.style.display = "flex";
			//results.classList.add("Hydrangea");
			printResult.innerText = "The Charmer.";
			//printDescription.innerText = "The Big-Leaf Hydrangea, or";
			//printBotanical.innerText =  "Hydrangea macrophylla";
			printDescription2.innerText = "You dates many people for short periods and are against monogamy. You like going clubbing and are just looking for something casual."
			printLines.innerText = result;
			resultPlural.innerText = "Good Luck!";
			break;

		case 6:		//type7
			results.style.display = "flex";
			//esults.classList.add("lotus");
			printResult.innerText = "The Martyr";
			//printDescription.innerText = "The Lotus, or";
			//printBotanical.innerText =  "Nelumbo nucifera";
			printDescription2.innerText = "You cannot say no to a new relationship and date people that choose you. You like going for walks and love spending quality time! Your favourite food is Italian!l"
			printLines.innerText = result;
			resultPlural.innerText = "Good Luck!";
			break;

		case 7:		//type8
			results.style.display = "flex";
			//results.classList.add("gingko");
			printResult.innerText = "The Balanced!";
			//printDescription.innerText = "The Gingko Tree, or";
			//printBotanical.innerText =  "Ginkgo biloba";
			printDescription2.innerText = "You are selective in who you choose to spend your time with and prefer relationships that are more on an equal footing. You like quiet cafes and really love personal alone-time."
			printLines.innerText = result;
			resultPlural.innerText = "Gingko Trees";
			break;


		default:
			document.getElementById("error").style.display = "inline-block";

	}
}

// Profiles
var profile_one = document.querySelector(".two");
var profile_three = document.querySelector(".three");

profile_one.addEventListener("click", message);
profile_three.addEventListener("click", message);
// profile_one.removeEventListener("click", message);

function message(){
	fail.innerHTML = '<div class="failbox"> You chose the wrong person! You are the worst matchmaker and this is why you are single, you will die alone. </div> '
}

const heart = document.querySelector(".heart-like-button");
var fail = document.querySelector(".fail");

heart.addEventListener("click", () => {
  if (heart.classList.contains("liked")) {
    heart.classList.remove("liked");
	console.log("check");
  } else {
    heart.classList.add("liked");
  }
});

heart.addEventListener("click", () => {
	fail.innerHTML = '<div class="failbox"> You chose the wrong person! You are the worst matchmaker and this is why you are single, you will die alone. </div> '
})

