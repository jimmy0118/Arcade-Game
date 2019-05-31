/*----------------------------------------------------------------------------*/
/*-----------------------------Score Board and Modal--------------------------*/
const panelLive = document.querySelector('.lives');
const panelScore = document.querySelector('.score');
const modal = document.querySelector('.modal');
const modalScore = document.querySelector('.modal-score');
const replay = document.querySelector('.replay');

// Initial lives and score
let lives = 5;
let score = 0;

/*----------------------------------------------------------------------------*/
/*-----------------------------Enemy------------------------------------------*/

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (lives > 0) {
        this.x += this.speed * dt;
    }
    // Reset the enemy after it goes off screen
    if (this.x > 505) {
        this.x = -100;
        const randomSpeed = Math.floor(Math.random() * 10 + 1);
        this.speed = 60 * randomSpeed;
    }
    this.checkCollisions();
    panelLive.textContent = `Lives: ${lives}`;
    panelScore.textContent = `Score: ${score}`;
    modalScore.textContent = `Your Score: ${score}`;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check for collision
Enemy.prototype.checkCollisions = function() {
    // Set hitbox
    const playerBox = {x: player.x, y: player.y, width: 50, height: 40};
    const enemyBox = {x: this.x, y: this.y, width: 60, height: 70};
    // If playerBox intersects enemyBox, collision happens
    if (playerBox.x < enemyBox.x + enemyBox.width &&
        playerBox.x + playerBox.width > enemyBox.x &&
        playerBox.y < enemyBox.y + enemyBox.height &&
        playerBox.y + playerBox.height > enemyBox.y) {
            this.collisionHappen();
        }
};

// Collision happen, reset player position
Enemy.prototype.collisionHappen = function() {
    player.resetPosition();
    // Decrease live when collision occur
    lives -= 1;
    // Game over when lives = 0
    if (lives < 1) {
        modal.style.display = 'block';
        // Stop user from playing after game is over
        document.removeEventListener('keyup', keyInput);
    }
};

/*----------------------------------------------------------------------------*/
/*------------------------------Player----------------------------------------*/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const characters = ['images/char-boy.png',
                    'images/char-cat-girl.png',
                    'images/char-horn-girl.png',
                    'images/char-pink-girl.png',
                    'images/char-princess-girl.png'];
let index = 0;

const Player = function() {
    // Choosing random character
    this.sprite = characters[index];
    this.x = 202;
    this.y = 405;
};

Player.prototype.switchCharacter = function() {
    if (index < 4) {
        index += 1;
    } else {
        index = 0;
    }
    this.sprite = characters[index];
}

Player.prototype.resetPosition = function() {
    this.x = 202;
    this.y = 405;
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Move the player according to keys pressed
Player.prototype.handleInput = function(allowedKeys) {
    switch (allowedKeys) {
        case "left":
            // moveleft
            if (this.x > 0) {
                this.x -= 101;
            }
            break;
        case "right":
            // moveright
            if (this.x < 404) {
                this.x += 101;
            }
            break;
        case "up":
            // move up
            if (this.y > 0) {
                this.y -= 83;
            } else {
                player.resetPosition();
                score += 10;
            }
            break;
        case "down":
            // move down
            if (this.y < 404) {
                this.y += 83;
            }
            break;
    }
};

/*----------------------------------------------------------------------------*/
/*------------------------------Selector--------------------------------------*/

// Selector for user to switch character
const Selector = function() {
    this.sprite = 'images/Selector.png';
    this.x = 404;
    this.y = 380;
}

// Switch character when player step on selector
Selector.prototype.update = function() {
    this.switchCharacter();
}

Selector.prototype.switchCharacter = function() {
    // Set hitbox
    const playerBox = {x: player.x, y: player.y, width: 50, height: 40};
    const selectorBox = {x: this.x, y: this.y, width: 60, height: 70};
    // If playerBox intersects enemyBox, collision happens
    if (playerBox.x < selectorBox.x + selectorBox.width &&
        playerBox.x + playerBox.width > selectorBox.x &&
        playerBox.y < selectorBox.y + selectorBox.height &&
        playerBox.y + playerBox.height > selectorBox.y) {
            player.switchCharacter();
            setTimeout(function() {
                player.resetPosition();
            }, 0);
        }
};

// Draw the Selector to the screen
Selector.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*----------------------------------------------------------------------------*/
/*-------------------------Instantiate Objects--------------------------------*/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Instantiate player
const player = new Player();

// Instantiate Selector
const selector = new Selector();

// allEnemies array
var allEnemies = [];

// Instantiate all enemies and push them to allEnemies array
for (let i = 0; i < 3; i++) {
    const randomSpeed = Math.floor(Math.random() * 10 + 1);
    allEnemies.push(new Enemy(-101, 60 + (83 * i), 60 * randomSpeed));
}

/*----------------------------------------------------------------------------*/
/*---------------------------Event Listener-----------------------------------*/

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
const keyInput = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
};

document.addEventListener('keyup', keyInput);

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(evt){
    if (event.target == modal) {
      modal.style.display = 'none';
    }
});

// Set up the event listener for replay button
replay.addEventListener('click', function(){
    modal.style.display = 'none';
    restart();
    document.addEventListener('keyup', keyInput);
});

// Restart the initial game
function restart() {
    lives = 5;
    score = 0;
    allEnemies = [];
    // Instantiate all enemies and push them to allEnemies array
    for (let i = 0; i < 3; i++) {
        const randomSpeed = Math.floor(Math.random() * 10 + 1);
        allEnemies.push(new Enemy(-101, 60 + (83 * i), 60 * randomSpeed));
    }
}
