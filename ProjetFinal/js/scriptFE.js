
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;


let app = new Application({
        width: 620,
        height: 580,
        antialiasing: true,
        transparent: false,
        resolution: 1
    }
);


document.getElementById("Jeu").appendChild(app.view);

loader
    .add("medias/hero.png")
    .add("medias/background.png")
    .add("medias/mechant.png")
    .load(setup);

//Define any variables that are used in more than one function
let hero,background,mechant,state;

function setup() {

    background = new Sprite(resources["medias/background.png"].texture);
    background.width=620;
    background.height=580;
    app.stage.addChild(background);

    //Create the ``hero sprite
    hero = new Sprite(resources["medias/hero.png"].texture);
    hero.x = 16;
    hero.y = 96;
    hero.vx = 0;
    hero.vy = 0;
    app.stage.addChild(hero);

    mechant = new Sprite(resources["medias/mechant.png"].texture);
    mechant.x = 50;
    mechant.y = 200;
    mechant.vx = 0;
    mechant.vy = 0;
    app.stage.addChild(mechant);

    let speed = 6,
        direction = 1;
        mechant.vx=speed*direction;
        mechant.vy=speed*direction;


    //Capture the keyboard arrow keys
    let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //Left arrow key `press` method
    left.press = function() {

        //Change the cat's velocity when the key is pressed
        hero.vx = -5;
        hero.vy = 0;
    };

    //Left arrow key `release` method
    left.release = function() {

        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
        if (!right.isDown && hero.vy === 0) {
            hero.vx = 0;
        }
    };

    //Up
    up.press = function() {
        hero.vy = -5;
        hero.vx = 0;
    };
    up.release = function() {
        if (!down.isDown && hero.vx === 0) {
            hero.vy = 0;
        }
    };

    //Right
    right.press = function() {
        hero.vx = 5;
        hero.vy = 0;
    };
    right.release = function() {
        if (!left.isDown && hero.vy === 0) {
            hero.vx = 0;
        }
    };

    //Down
    down.press = function() {
        hero.vy = 5;
        hero.vx = 0;
    };
    down.release = function() {
        if (!up.isDown && hero.vx === 0) {
            hero.vy = 0;
        }
    };

    //Set the game state
    state = play;

    //Start the game loop
    app.ticker.add(delta => gameLoop(delta));
}


function gameLoop(delta){

    //Update the current game state:
    state(delta);
    mechant.x += 5;
}

function play(delta) {

    //use the cat's velocity to make it move
    hero.x += hero.vx;
    hero.y += hero.vy;
    contain(hero,background);
    contain(mechant,background);
    mechant.x+=mechant.vx;
    mechant.y+=mechant.vy;
    let mechanthitwall=contain(mechant,background);
    if(mechanthitwall==="top"||mechanthitwall==="bottom"){
        mechant.vy *= -1;
    }
    if(mechanthitwall==="left"||mechanthitwall==="right"){
        mechant.vx *= -1;
    }
    if(hitTestRectangle(hero,mechant)){
        alert()
    }

}



function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};


//The `keyboard` helper function
function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}
function contain(sprite, container) {

    let collision = undefined;

    //Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }

    //Return the `collision` value
    return collision;
}
