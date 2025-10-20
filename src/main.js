// *** GLOBAL DOM DECLARATIONS ***

// start screen

const startScreen = document.querySelector('#start-screen')
const startButton = document.querySelector('#start-button')
const ssHighScoreNode = document.querySelector('#start-menu-high-score')
const ssLastScoreNode = document.querySelector('#start-menu-last-score')



// *** GLOBAL VARIABLES ***
let highScore = localStorage.getItem('highScore')
let formattedHighScore = `${highScore.padStart(6, '0')}`
ssHighScoreNode.innerHTML = formattedHighScore

if(highScore === null || highScore === undefined || highScore === ''){
    highScore === 0
}

let lastScore = localStorage.getItem('lastScore')
if(lastScore === null || lastScore === undefined || lastScore === ''){
    lastScore === 0
}
