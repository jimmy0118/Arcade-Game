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
    this.x += this.speed * dt;
    // Reset the enemy after it goes off screen
    if (this.x > 505) {
        this.x = -100;
        const randomSpeed = Math.floor(Math.random() * 4 + 1);
        this.speed = 60 * randomSpeed;
    }
    this.checkCollision();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check for collision
Enemy.prototype.checkCollision = function() {
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
};

/*----------------------------------------------------------------------------*/
/*------------------------------Player----------------------------------------*/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
};

Player.prototype.resetPosition = function() {
    this.x = 200;
    this.y = 400;
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
            this.x -= 101;
            break;
        case "right":
            // moveright
            this.x += 101;
            break;
        case "up":
            // move up
            this.y -= 83;
            break;
        case "down":
            // move down
            this.y += 83;
            break;
    }
};

/*----------------------------------------------------------------------------*/
/*-------------------------Instantiate Objects--------------------------------*/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Instantiate player
const player = new Player();

// allEnemies array
var allEnemies = [];

// Instantiate all enemies and push them to allEnemies array
for (let i = 0; i < 3; i++) {
    const randomSpeed = Math.floor(Math.random() * 4 + 1);
    allEnemies.push(new Enemy(0, 60 + (85 * i), 60 * randomSpeed));
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
