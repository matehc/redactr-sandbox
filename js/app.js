//This is where my message will go 
const inputMsg = document.querySelector('#msg');

//This is an array of words to conceal
const keywordText = document.querySelector('#keyword');

//This stores character to use for redaction 
const substituteCharacter = document.querySelector('#substitute');

// This stores the result text of redacted text
const resultBox = document.querySelector('#resultBox');

// This clears every input field
const clearBtn = document.querySelector('.btn--clear');


const redactBtn = document.querySelector('#redactBtn');
const notify = document.querySelector('.notification');

// Stat output
const statWordCount = document.querySelector('.stat-word-count');
const statMatchCount = document.querySelector('.stat-match-count');
const statTimer = document.querySelector('.stat-timer');

// viewport variable
let isMobile = window.innerWidth < 700;






/*
==========================================================
CLEAR EVERYTHING
==========================================================
*/
function clearAllMsgs() {
  inputMsg.value = "";
  keywordText.value = "";
  substituteCharacter.value = "";
  resultBox.value = "";

  statWordCount.textContent = "0";
  statMatchCount.textContent = "0"
  statTimer.textContent = "0"
}



/*
===========================================================
PREDICATE FUNCTIONS
===========================================================
*/ 

function isMessageInputEmpty() {
    if((inputMsg.value === null) || (inputMsg.value === '')) {
      return true;
    } else {
      return false;
    }
}



function isKeywordInputEmpty() {
  if((keywordText.value === null) || (keywordText.value === '')) {
    return true;
  } else {
    return false;
  }
}


function isSubstitueInputEmpty() {
  if((substituteCharacter.value === null) || (substituteCharacter.value === '')) {
    return true;
  } else {
    return false;
  }
}

/*
===========================================================
PREDICATE FUNCTIONS END
===========================================================
*/





/*
=============================================================
MAIN REDACT FUNCTION
=============================================================
*/
let redactNow = (msgText, wordsToSearchAndReplace, characterForWordRedaction) => {
    const startExecutionTime = Date.now();
    let redactedText = '';

    let countMatch = 0;

    // LOOP
    wordsToSearchAndReplace.forEach((word) => {

      // charCount used for repeating characters


      let regexp = new RegExp(`\\b(${wordsToSearchAndReplace.join('|')})\\b`, 'gimu');      
    
 
      msgKeywordMatch = msgText.match(regexp).length;

      let redacted = (characterForWordRedaction.length < 3) ? msgText.replace(regexp, characterForWordRedaction.repeat(word.length)): msgText.replace(regexp, characterForWordRedaction);
        
      redactedText = redacted;
    })

    const duration = (Date.now() - startExecutionTime) / 1000;

    let wordCount = countWords();

    return {redactedText, msgKeywordMatch, duration, wordCount};

}



/*
=============================================================
FUNCTION TO CALL WHEN I CLICK THE 'Redact Now' button
=============================================================
*/
function redactNowHandler () {

    let result = "";

    if(isMessageInputEmpty() || isKeywordInputEmpty() || isSubstitueInputEmpty()) {

      //if i'm on mobile viewport
      if(isMobile) {
        notify.classList.remove('hidden');
        notify.classList.add('notification-mobile')
        setTimeout(() => {
          notify.classList.add('hidden');
      }, 6000);
      }else {
        notify.classList.remove('hidden');
        notify.classList.add('slide-note');
        setTimeout(() => {
            notify.classList.remove('slide-note');
        }, 6000);
      }
       
    } else {
      let keywordArr = keywordText.value.split(' ');
    console.log(keywordArr)

    result = redactNow(inputMsg.value, keywordArr, substituteCharacter.value);

    displayResult(result);
    }




}



/*
===============================================================
DISPLAY RESULT
===============================================================
*/

function displayResult(output) {

    resultBox.value = output.redactedText;


    ({msgKeywordMatch: numberOfMatchedWords, duration:execDuration, wordCount } = output);


    statWordCount.textContent = wordCount;
    statMatchCount.textContent = numberOfMatchedWords;
    statTimer.textContent = execDuration + "secs";
}

/*
==============================================================
COUNT WORDS
==============================================================
*/


function countWords() {

    let msg = inputMsg.value;

    let count = 0;

    let separatedWords = msg.split(' ');


    for (let word in separatedWords) {
         if(word != "") {
            count++                
         }
    }

    return count;
}

redactBtn.addEventListener("click", redactNowHandler);
clearBtn.addEventListener("click", clearAllMsgs);
