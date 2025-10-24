// *** GLOBAL DOM DECLARATIONS ***

// START SCREEN

const startScreenNode = document.querySelector('#start-screen')
const startButton = document.querySelector('#start-button')
const ssHighScoreNode = document.querySelector('#start-menu-high-score')
const ssLastScoreNode = document.querySelector('#start-menu-last-score')
const ssMusicToggleNode = document.querySelector('#ss-music-toggle-btn')
const ssMusicStateNode = document.querySelector('#ss-music-state-text')

// GAMEBOX

// top left 

const gameBoxNode = document.querySelector('#game-box')
const collisionAreaNode = document.querySelector('#collision-area')

const gbCurrentScoreNode = document.querySelector('#gb-current-score')
const gbLastScoreNode = document.querySelector('#gb-last-score')
const gbHighScoreNode = document.querySelector('#gb-high-score')

const baseLifeNode = document.querySelector('#base-inner-bar')

const countdownNode = document.querySelector('#start-countdown')
const pauseDivNode = document.querySelector('#pause-div')

// top right 

const gbMusicToggleNode = document.querySelector('#gb-music-toggle-btn')
const gbMusicStateNode = document.querySelector('#gb-music-state')

const gbSfxToggleNode = document.querySelector('#gb-sfx-toggle-btn')
const gbSfxStateNode = document.querySelector('#gb-sfx-state')

const pauseBtn = document.querySelector('#pause-btn')
const quitBtn = document.querySelector('#quit-btn')

const quitConfirmDiv = document.querySelector('#quit-confirm')

const quitConfirmNo = document.querySelector('#quit-no')
const quitConfirmYes = document.querySelector('#quit-yes')


// RESULT SCREEN

const resultScreenNode = document.querySelector('#result-screen')

const gameEndMessageOne = document.querySelector('#game-end-message-one')
const gameEndMessageTwo = document.querySelector('#game-end-message-two')

const gameEndScore = document.querySelector('#game-end-result-score')
const gameEndHighScore = document.querySelector('#game-end-high-score')

const toStartMenuBtn = document.querySelector('#game-end-main-menu')




// -------------------------------------------------------------------------------------------------
// *** GLOBAL VARIABLES ***

isPause = false

// base life
let baseLife = 100

// score variables
let currentScore = 0
let highScore = Number(localStorage.getItem('highScore'))
let lastScore = Number(localStorage.getItem('lastScore'))
let isNewRecord = null

if (highScore === null || highScore === undefined || highScore === '') {
    highScore = 0
}

let formattedHighScore = `${highScore.toString().padStart(6, '0')}`
gbHighScoreNode.innerHTML = formattedHighScore


if (lastScore === null || lastScore === undefined || lastScore === '') {
    lastScore = 0
}
let formattedLastScore = `${lastScore.toString().padStart(6, '0')}`
ssLastScoreNode.innerHTML = formattedLastScore
gbLastScoreNode.innerHTML = formattedLastScore

// game items

let profObj = null
let lightBallArr = []
let invaderArr = []
let invaderInternalId
let gameIntervalId
let moveInterval

// -------------------------------------------------------------------------------------------------
// *** AUDIO FUNCTIONS ***

// music state
let isMusicOn = true
let isSfxOn = true

// music paths

let startScreenMusic = new Audio('./assets/audio/music/start-menu-music.mp3')
let gameBoxMusic = new Audio('./assets/audio/music/gameplay-music.mp3')
let resultScreenMusic = new Audio('./assets/audio/music/end-game-music.mp3')

// fx paths
let countDownFX = new Audio('./assets/audio/fx/game-countdown.mp3')
let lightBallSound = new Audio('./assets/audio/fx/light-ball-sound.mp3')
let gameOverMusic = new Audio('./assets/audio/fx/game-over-music.mp3')
let gameOverVoice = new Audio('./assets/audio/fx/game-over-voice.mp3')

// set all music to loop// 
startScreenMusic.loop = true
gameBoxMusic.loop = true
resultScreenMusic.loop = true

// set initial volume
startScreenMusic.volume = 0.07
gameBoxMusic.volume = 0.07
resultScreenMusic.volume = 0.07

// play music function
function playMusic(audio) {
    if (isMusicOn) {
        audio.play()
    }
}


// play sound effect
function playSfx(sfx) {
    if (isSfxOn) {
        sfx.volume = 0.04
        sfx.play()
    }
}

// stop all music

function stopAllMusic() {
    if (startScreenMusic) {
        startScreenMusic.pause()
        startScreenMusic.currentTime = 0
    }
    if (gameBoxMusic) {
        gameBoxMusic.pause()
        gameBoxMusic.currentTime = 0
    }
    if (resultScreenMusic) {
        resultScreenMusic.pause()
        resultScreenMusic.currentTime = 0
    }
}

// -------------------------------------------------------------------------------------------------
// *** FUNCTIONS ***

function showStartScreen() {
    stopAllMusic()

    // playMusic(startScreenMusic)

    clearInterval(gameIntervalId)
    clearInterval(invaderInternalId)

    startScreenNode.style.display = "block"
    gameBoxNode.style.display = "none"
    resultScreenNode.style.display = "none"

    updateScore()
}

function updateScore() {
    let formattedHighScore = `${highScore.toString().padStart(6, '0')}`
    ssHighScoreNode.innerHTML = formattedHighScore
    let formattedLastScore = `${lastScore.toString().padStart(6, '0')}`
    ssLastScoreNode.innerHTML = formattedLastScore
}


function showGameBox() {
    stopAllMusic()
    playMusic(gameBoxMusic)

    startScreenNode.style.display = "none"
    gameBoxNode.style.display = "block"
    resultScreenNode.style.display = "none"

    let formattedHighScore = `${highScore.toString().padStart(6, '0')}`
    gbHighScoreNode.innerHTML = formattedHighScore
    let formattedLastScore = `${lastScore.toString().padStart(6, '0')}`
    gbLastScoreNode.innerHTML = formattedLastScore

    profObj = new Prof()

    countdownStart()
}

function countdownStart() {
    setTimeout(playSfx(countDownFX), 1000)
    pauseBtn.style.display = 'none'
    quitBtn.style.display = 'none'
    let count = 4
    countdownNode.style.display = 'block'
    const countInterval = setInterval(() => {
        count--
        countdownNode.innerHTML = count
        if (count === 0) {
            countdownNode.style.display = 'none'
            clearInterval(countInterval)
            startGame()
        }
    }, 600);
}

function gameLoop() {
    invaderArr.forEach(invader => {
        invader.automaticMovement()
    })

    lightBallArr.forEach(lightBall => {
        lightBall.automaticMovement()
    })

    checkCollisions(invaderArr, lightBallArr)
    checkBaseLife()
    checkLightBallDespawn()
}

function startGame() {
    pauseBtn.style.display = 'inline-block'
    quitBtn.style.display = 'inline-block'

    gameIntervalId = setInterval(gameLoop, Math.floor(1000 / 60))
    invaderInternalId = setInterval(invaderSpawn, 2000)
}

function invaderSpawn() {
    let randomXPositive = Math.floor(Math.random() * 320)
    let randomXNegaive = Math.floor(Math.random() * -320)
    let randomArray = [randomXNegaive, randomXPositive]
    let randomX = randomArray[Math.floor(Math.random() * 2)]
    let newInvaderObj = new Invader(randomX)
    invaderArr.push(newInvaderObj)
}

function createLightBall() {
    playSfx(lightBallSound)
    let profX = profObj.x
    let newLightBall = new LightBall(profX)
    lightBallArr.push(newLightBall)
}

function checkCollisions(invaders, lightBalls) {
    for (let i = 0; i < invaders.length; i++) {
        for (let j = 0; j < lightBalls.length; j++) {
            const invader = invaders[i]
            const lightBall = lightBalls[j]

            if (invader.x < lightBall.x + lightBall.width &&
                invader.x + invader.width > lightBall.x &&
                invader.y < lightBall.y + lightBall.height &&
                invader.y + invader.height > lightBall.y) {

                invader.life--

                if (invader.life === 0) {
                    invader.die()
                    invaders.splice(i, 1)
                }

                lightBall.node.remove()
                lightBalls.splice(j, 1)
            }
        }
    }
}


function checkBaseLife() {
    invaderArr.forEach((invader, index) => {
        if (invader.y > 862) {
            invader.node.remove()
            invaderArr.splice(index, 1)
            baseLife = baseLife - 5
            baseLifeNode.style.width = `${baseLife}%`
            if (baseLife <= 0) {
                gameEnd()
            }
        }
    })
}

function checkLightBallDespawn() {
    lightBallArr.forEach((lightBall, index) => {
        if (lightBall.y < 552) {
            lightBall.node.remove()
            lightBallArr.splice(index, 1)
        }
    })
}


function isNewHighScore() {
    if (currentScore > highScore) {
        highScore = currentScore
        localStorage.setItem('highScore', highScore)
        isNewRecord = true
    }
}

function gameEnd() {
    if (isPause) {
        isPause = false
        pauseDivNode.style.display = 'none'
        pauseDivNode.style.innerHTML = ''
        pauseBtn.innerHTML = 'pause'
    }
    quitConfirmDiv.style.display = 'none'
    playSfx(gameOverMusic)
    setTimeout(playSfx(gameOverVoice), 3000)
    countdownNode.style.display = 'block'
    clearInterval(invaderInternalId)
    clearInterval(gameIntervalId)
    setTimeout(isNewHighScore(), 3000)
    setTimeout(showResultScreen(), 3000)
}

function showResultScreen() {

    stopAllMusic()
    startScreenNode.style.display = "none"
    gameBoxNode.style.display = "none"
    resultScreenNode.style.display = "block"

    let formattedScore = `${currentScore.toString().padStart(6, '0')}`
    gameEndScore.innerHTML = formattedScore

    let formattedHighScore = `${highScore.toString().padStart(6, '0')}`
    gameEndHighScore.innerHTML = formattedHighScore
}

function returnStartScreen() {
    stopAllMusic()
    invaderArr.forEach(invader => {
        invader.node.remove()
    })
    invaderArr = []


    lightBallArr.forEach(lightBall => {
        lightBall.node.remove()
    })
    lightBallArr = []

    profObj.node.remove()

    lastScore = currentScore
    localStorage.setItem('lastScore', lastScore)
    currentScore = 0
    baseLife = 100
    isNewRecord = null
    showStartScreen()
}

// -------------------------------------------------------------------------------------------------
// *** EVENT LISTENERS ***

// START BUTTON

startButton.addEventListener('click', () => {
    showGameBox()
})

// MUSIC TOGGLES

ssMusicToggleNode.addEventListener('click', () => {
    isMusicOn = !isMusicOn

    let musicState = isMusicOn ? 'on' : 'off'
    gbMusicStateNode.innerHTML = musicState
    ssMusicStateNode.innerHTML = musicState

    if (isMusicOn) {
        playMusic(startScreenMusic)
    } else if (!isMusicOn) {
        startScreenMusic.pause()
    }
})

gbMusicToggleNode.addEventListener('click', () => {
    isMusicOn = !isMusicOn

    let musicState = isMusicOn ? 'on' : 'off'
    gbMusicStateNode.innerHTML = musicState
    ssMusicStateNode.innerHTML = musicState

    if (isMusicOn) {
        playMusic(gameBoxMusic)
    } else if (!isMusicOn) {
        gameBoxMusic.pause()
    }
})

// PROF ACTIONS

document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase()


    if (!isPause) {
        if ((key === 'a' || key === 'arrowleft') && profObj.x > 0) {
            profObj.x -= profObj.moveSpeed
            profObj.node.style.left = `${profObj.x}px`
        } else if ((key === 'd' || key === 'arrowright') && profObj.x < gameBoxNode.offsetWidth - profObj.width) {
            profObj.x += profObj.moveSpeed
            profObj.node.style.left = `${profObj.x}px`
        } else if ((key === 'w' || key === 'arrowup')) {
            profObj.node.src = "./assets/img/prof-hands-up.png"
            createLightBall()
        }
    }
}
)

document.addEventListener('keyup', e => {
    const key = e.key.toLowerCase()

    if ((key === 'w' || key === 'arrowup')) {
        profObj.node.src = "./assets/img/prof-stable.png"
    }
}
)

// SFX TOGGLE 

gbSfxToggleNode.addEventListener('click', () => {
    isSfxOn = !isSfxOn
    console.log(`sfx state: ${isSfxOn}`)
    let sfxText = isSfxOn ? 'on' : 'off'
    gbSfxStateNode.innerText = sfxText
})

// PAUSE BTN

pauseBtn.addEventListener('click', () => {
    isPause = !isPause

    if (isPause) {
        gameBoxMusic.pause()
        clearInterval(gameIntervalId)
        clearInterval(invaderInternalId)
        pauseBtn.innerHTML = 'resume'
        pauseDivNode.innerHTML = 'PAUSED'
        pauseDivNode.style.display = 'block'
    } else {
        pauseDivNode.style.display = 'none'
        pauseDivNode.style.innerHTML = ''
        gameBoxMusic.play()
        pauseBtn.innerHTML = 'pause'
        gameIntervalId = setInterval(gameLoop, Math.floor(1000 / 60))
        invaderInternalId = setInterval(invaderSpawn, 2000)
    }
})


// QUIT BTN 


quitBtn.addEventListener('click', () => {
    clearInterval(gameIntervalId)
    clearInterval(invaderInternalId)
    quitConfirmDiv.style.display = 'flex'
    quitConfirmDiv.style.zIndex = 9
})

quitConfirmYes.addEventListener('click', gameEnd)

quitConfirmNo.addEventListener('click', () => {
    quitConfirmDiv.style.display = 'none'
    if (!isPause) {
        gameIntervalId = setInterval(gameLoop, Math.floor(1000 / 60))
        invaderInternalId = setInterval(invaderSpawn, 2000)
    }
})

toStartMenuBtn.addEventListener('click', returnStartScreen)
// -------------------------------------------------------------------------------------------------

// *** APP FLOW ***

// start screens
window.addEventListener("DOMContentLoaded", () => {
    updateScore()
})


// -------------------------------------------------------------------------------------------------
// if (key === 'w' || key === 'arrowup')
// createLightBall(profObj.x)