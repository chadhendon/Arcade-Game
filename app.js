const billboard = document.getElementById('billboard')
const announcements = document.getElementById('announcements')
const winDisplay = document.getElementById('win')
const lossDisplay = document.getElementById('loss')
const winPhrases = ['You win', 'Bragging rights!', 'Winning is all in the attitude!!', 'Bring home the bacon!', 'Best in class!', 'Winning is a habit!', 'Epic', 'This will be remembered', 'Winning tastes good!', 'The key to winning is posie under stress!', 'Win big!!!', 'Win faster!!', 'Viral meme', 'Happy thoughts', 'Winning starts with beginning.']
const lossPhrases = ['Mashed', 'Accident', 'Bereavement', 'Bad Luck', 'Impairment', 'Fatality', 'Catastrophe', 'Open your eyes!!', 'Casualty', 'Disappearance', 'Depletion', 'Trashed', 'Perdition', 'Trouble']

// Enemies our player must avoid
let Enemy = function (x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    //reset position of enemy to move across canvas again
    if (this.x > 500) {
        /* respawn params: (min speed, max speed,
        min starting position, max starting position) */
        this.respawn(100, 300, 50, 500);
        this.levelUp();
    }
    // collision check between player and enemies
    this.collision();
}

// Respawn enemy with random speed and off screen position
Enemy.prototype.respawn = function (minSpeed, maxSpeed, minPos, maxPos) {
    let randomSpeed = numberGenerator(minSpeed, maxSpeed)
    let randomStartingPoint = numberGenerator(minPos, maxPos)
    this.x = -randomStartingPoint
    this.speed = randomSpeed
}

// Collision between player and enemy
Enemy.prototype.collision = function () {
    if (player.x < this.x + 60 &&
        player.x + 37 > this.x &&
        player.y < this.y + 25 &&
        30 + player.y > this.y) {
        player.reset()
        player.handleLoss()
    }
}

// Level up every 5 accumulated wins
Enemy.prototype.levelUp = function () {
    let wins = winDisplay.innerText
    /* speed between 100 (very slow) - 1000 (very fast). Position between 50
    (immediately off screen left) and 500 (farther left, takes time to
    reappear on screen) */
    if (wins > 4) this.respawn(200, 400, 50, 400)
    if (wins > 9) this.respawn(250, 400, 50, 350)
    if (wins > 14) this.respawn(250, 500, 50, 300)
    if (wins > 19) this.respawn(100, 700, 50, 200)
    if (wins > 24) this.respawn(300, 600, 50, 100)
    if (wins > 29) this.respawn(400, 800, 50, 100)
    if (wins > 34) this.respawn(500, 1000, 50, 100)
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-boy.png'
};

Player.prototype.update = function () {
    //Player stay in canvas boundaries
    if (this.y > 380) {
        this.y = 380;
    }

    if (this.x > 400) {
        this.x = 400;
    }

    if (this.x < 0) {
        this.x = 0;
    }

    // Check to see if player is at top of canvas to win the games
    if (this.y < 0) {
        this.reset()
        this.handleWin()
    }
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset function that places  Player on a random starting block
Player.prototype.reset = function () {
    let xArray = [0, 100, 200, 300, 400]
    let yArray = [300, 380]
    shuffle(xArray)
    shuffle(yArray)
    this.x = xArray[0]
    this.y = yArray[0]
}

// Win and Loss sequences
let loss = 0
Player.prototype.handleLoss = function () {
    shuffle(lossPhrases)
    loss++
    lossDisplay.innerText = loss
    announcements.classList.add('loss-sequence')
    lossDisplay.classList.add('loss-sequence')
    announcements.innerText = lossPhrases[0]
    setTimeout(() => {
        announcements.classList.remove('loss-sequence')
        lossDisplay.classList.remove('loss-sequence')
    }, 800)
}

let win = 0
Player.prototype.handleWin = function () {
    shuffle(winPhrases)
    win++
    winDisplay.innerText = win
    announcements.classList.add('win-sequence')
    winDisplay.classList.add('win-sequence')
    announcements.innerText = winPhrases[0]
    this.nextLevel()
    setTimeout(() => {
        announcements.classList.remove('win-sequence')
        winDisplay.classList.remove('win-sequence')
    }, 800)
}

Player.prototype.nextLevel = function () {
    let wins = winDisplay.innerText
    if (wins === '1') announcements.innerText = 'Level: 1. Slow stroll'
    if (wins === '5') announcements.innerText = 'Level: 2. Morning rush'
    if (wins === '10') announcements.innerText = 'Level: 3. Lunch time'
    if (wins === '15') announcements.innerText = 'Level: 4. Afternoon rush'
    if (wins === '20') announcements.innerText = 'Level: 5. Crazy House'
    if (wins === '25') announcements.innerText = 'Level: 6. I-285 Crash Time'
    if (wins === '30') announcements.innerText = 'Level: 7. Connector Crash Time'
    if (wins === '35') announcements.innerText = 'Level: 8. State of Emengency'
}

Player.prototype.handleInput = function (keyPress) {
    switch (keyPress) {
    case 'left':
        this.x -= this.speed + 50
        break
    case 'up':
        this.y -= this.speed + 30
        break
    case 'right':
        this.x += this.speed + 50
        break
    case 'down':
        this.y += this.speed + 30
        break
    }
}

// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies
let allEnemies = []
let enemyPosition = [60, 140, 220]

// Place the player object in a variable called player
let player = new Player(200, 380, 50)

/* Instantiate on enemy for each y lane,
spawn it 150 off screen left (x),
and give it a random speed */

enemyPosition.forEach(pY => {
    let randomSpeed = numberGenerator(100, 300)
    let enemy = new Enemy(-150, pY, randomSpeed)
    allEnemies.push(enemy)
})

function numberGenerator(min, max) {
    return min + Math.floor(Math.random() * max)
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left'
        , 38: 'up'
        , 39: 'right'
        , 40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/* Shuffle function from https://stackoverflow.com/
questions/2450954/how-to-randomize-shuffle-a-javascript-array/
2450976#2450976 */

function shuffle(array) {
    let currentIndex = array.length
        , temporaryValue, randomIndex

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}
