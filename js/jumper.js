//Initializing the engine
let engine = new Engine("tetris", 300, 300, 60, true);

//Start button UI
let restartBtn = engine.addUIShape(new Shape(new Vector2(canvas.width / 2 - 75, canvas.height / 2 - 25), new Vector2(150, 50), "#000", new Button("Start", "25px arial","#AAA", "#161616", "#161616"), "UI", true));
restartBtn.obj.bindFunction(restartButton);
let startUI = new Parent();
startUI.addShape(restartBtn);

//Score text
let score = engine.addUIShape(new Shape(new Vector2(canvas.width / 2 - 25, 45), Vector2.zero(), "#121212", new UIText("Start", "48px arial"), "UI", true))


//Creates a player and a rigidbody for it
let player = engine.addShape(new Shape(new Vector2(canvas.width / 2, 250), new Vector2(25, 25), "#121212", new Square(), "player"));
let playerRb = new Rigidbody(player, 0, 1);

camera.pos = new Vector2(player.transform.pos.x - ((canvas.width - player.transform.size.x) / 2), player.transform.pos.y - ((canvas.height - player.transform.size.x) / 2))

let t = 0;
let highestPoint = 0;
let bgColor = new Color(18, 18, 18);
let targetColor = new Color(18, 18, 18);
let fadeSpeed = 1;
let started = false;
function update() {
    if(started) getKeys();
    if(engine.keysPressed[" "] && !started) 
    {
        restartButton();
        jumped = 10;
    }
    
    score.obj.text = Math.floor(Math.abs((highestPoint + 300) / 150))
    
    //Updates the rb that uses the player
    playerRb.update("level");
    
    checkPlayerHeight();
    
    
    bgColor = Color.Lerp(bgColor, targetColor, Time.deltaTime * fadeSpeed);
    engine.settings.backgroundColor = bgColor.toHex();
    
    //Makes the camera movement smooth with linear lerp interpolation and makes it not go downwards only upwards
    camera.pos = Vector2.lerp(camera.pos, new Vector2(player.transform.pos.x - ((canvas.width - player.transform.size.x) / 2), MathF.clamp(player.transform.pos.y - ((canvas.height - player.transform.size.x) / 2), highestPoint, highestPoint)), Time.deltaTime);
    
    //Smooth camera movement that follows the player everywhere ---- FOR DEBUGGING
    //camera.pos = Vector2.lerp(camera.pos, new Vector2(player.transform.pos.x - ((canvas.width - player.transform.size.x) / 2), player.transform.pos.y - ((canvas.height - player.transform.size.x) / 2)), Time.deltaTime);
}

function checkPlayerHeight() {
    //Resetts the highest point to be the accuall highest point that the player has reached
    if(highestPoint > player.transform.pos.y - ((canvas.height - player.transform.size.y) / 2)) {
        highestPoint = player.transform.pos.y - ((canvas.height - player.transform.size.y) / 2);
    }
    
    if(player.transform.pos.y > highestPoint + canvas.height) {
        reset();
    }
}

function reset() {
    player.transform.pos = new Vector2(canvas.width / 2, 250);
    highestPoint = 0;
    camera.pos = new Vector2(player.transform.pos.x - ((canvas.width - player.transform.size.x) / 2), player.transform.pos.y - ((canvas.height - player.transform.size.x) / 2));
    targetColor = new Color(18, 18, 18);

    playerRb.setForce(new Vector2(0, 0));
    playerRb.g = 0;

    started = false;
    haveJumped = false;
    jumpingDir = false;
    jumps = 2;

    fadeSpeed = 15;

    startUI.toggle();
}

function lateUpdate() {
    checkPlayerWalled();
}

function restartButton() {
    startUI.toggle();
    started = true;
    targetColor = new Color(255,255,255);
    fadeSpeed = 1;
}

//Deafult jump values
var jumped = 0;
var jumpingDelay = 10;
var jumpingDir = false;
var jumps = 2;
var haveJumped = false;

function getKeys() {
    //Jumping
    if((engine.keysPressed[" "] || engine.keysPressed["ArrowUp"]) && jumped < 0 && jumps > 0) {
        playerRb.setForce(new Vector2(0, 0))
        playerRb.addForce(new Vector2(jumpingDir?-4:4, -11));
        jumped = jumpingDelay;
        jumpingDir = !jumpingDir;
        jumps-=1;
        haveJumped = true;
    }
    jumped--;
}

//Check for if the player is on the wall
function checkPlayerWalled() {
    let transform = player.transform;
    if(
        Shape.checkCollision("level", new Vector2(transform.pos.x - 5, transform.pos.y + transform.size.y / 2))
        || Shape.checkCollision("level", new Vector2(transform.pos.x - 5, transform.pos.y + 5))
        || Shape.checkCollision("level", new Vector2(transform.pos.x - 5, transform.pos.y + transform.size.y - 5))
        ) {
            playerRb.setGravity(0);
            playerWalled(false);
        } else if(Shape.checkCollision("level", new Vector2(transform.pos.x + transform.size.x + 5, transform.pos.y + transform.size.y / 2))
        || Shape.checkCollision("level", new Vector2(transform.pos.x + transform.size.x + 5, transform.pos.y + 5))
        || Shape.checkCollision("level", new Vector2(transform.pos.x + transform.size.x + 5, transform.pos.y + transform.size.y - 5))) {
            playerRb.setGravity(0);
            playerWalled(true);
        } else if(Shape.checkCollision("level", new Vector2(transform.pos.x + transform.size.x / 5, transform.pos.y + transform.size.y + 5))
        || Shape.checkCollision("level", new Vector2(transform.pos.x + transform.size.x, transform.pos.y + transform.size.y + 5))
        || Shape.checkCollision("level", new Vector2(transform.pos.x, transform.pos.y + transform.size.y + 5))) {
            jumps = 2;
            jumpingDir = playerRb.speedX > 0 ? false : true;
        } else if(haveJumped && started) {
            playerRb.setGravity(.5);
        }
    }
    
    //When the player is on the wall
    function playerWalled(bool = false) {
        playerRb.setForce(Vector2.zero());
        player.transform.pos.y+=1;
        jumps = 2;
    jumpingDir = bool;
    jumped = -1;
}

//Creates the level
let level = [];
let ground = engine.addShape(new Shape(new Vector2(-2500, 350), new Vector2(5000, 1000), "#121212", new Square(), "level"))
let currentX = 0;
let inARow = 0;
function generateLevel() {
    
    //Clears the current level and generates before generating a new one
    if(level.length > 0) {
        level.forEach(e => {
            engine.removeShape(e);
        });
    }
    
    currentX = 0;
    inARow = 0;
    
    //Creates 150 platforms
    for(let i = 0; i < 150; i++) {
        let rand = Random.value();
        let shape = engine.addShape(new Shape(new Vector2((currentX + (canvas.width / 2)),i * -149), new Vector2(25,150), "#121212", new Square(), "level"));
        level.push(shape);
        
        if(rand > .59 && rand < 1) {
            inARow++;
        } else {
            inARow = 0;
        }
        
        //Adds a "spike" if the 
        if(inARow > 100) {
            if(Random.value() > .5) {
                shape = engine.addShape(new Shape(new Vector2((currentX + (canvas.width / 2) + (Random.value() > .5 ? 24 : -24)),i * -149), new Vector2(25,25), "#AAAAAA", new Square(), "spike"));
                level.push(shape);
            }
        }
        
        //Adds or removes X depending on the random value
        currentX = rand < .3 ? currentX+=150 : rand < .6 ? currentX+=-150 : currentX;
    }
}

generateLevel();

//Binds the update functions in this script to the Engine
engine.bindUpdate(update);
engine.bindLateUpdate(lateUpdate);
