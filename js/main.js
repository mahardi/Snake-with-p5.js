let snake;
let game;
let res = 20;
let x = 0;
let y = 0;
let speed = 7;
let w;
let h;
let isPaused = false;
let isStarted = false;
let isGameOver = false;
let dir;
let canvas;
let dim;
let xDown = null;                                                        
let yDown = null;
let turnt;


document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

function setup() {
    // Set the background canvas
    dim = document.getElementById("canvas").clientWidth;
    canvas = createCanvas(dim, dim);
    canvas.parent("canvas");
    
    //Set initial canvas dimension
    w = floor(dim/res);
    h = floor(dim/res);

    snake = new Snake();
    game = new GameEvent();

    //Draw first food
    foodLocation();
}

function draw() {
    //Draw the Snake elements and set the Snake's speed
    scale(res);
    background(220);
    frameRate(speed);

    //Update and draw the Snake elements
    snake.update(isPaused, isGameOver);
    snake.show();
    
    //Check if game is over or not
    isGameOver = checkIsGameOver();

    //Check if food is still exist in canvas and draw food
    checkFood();
    foodDraw();

    // if(detectmob()){
    //     document.getElementById("score").innerHTML= snake.len;
    // }
}

function foodLocation(){
    //Randomize food coordinate (x,y)
    let x = floor(random(w));
    let y = floor(random(h));

    //Check if food location overriding Snake's body
    let isBodyPresent = snake.checkBody(x, y);

    //Create food vector if (x, y) in canvas range and not
    //overridning Snake's body
    if(x == 0 || y == 0 || x > w-2 ||  y > h-2 ){
        foodLocation();
    }else if(isBodyPresent){
        foodLocation();
    }else{
        food = createVector(x, y);
    }
}

function foodDraw(){
    fill (255, 0, 0);
    rect(food.x, food.y, 1, 1);
}

function checkFood(){
    if(snake.eat(food)){
        foodLocation();
    }
}

function checkIsStarted(){
    if(game.isStarting()){
        isStarted = true;
    }
}

function checkIsGameOver(){
    if (snake.gameOver()){
        game.isOver();
        return true
    }else{
        return false;
    }
}

function checkIsPaused(){
    if(!snake.pause(isPaused)){
        game.isPausing();
        return true;
    }else{
        game.isUnpausing(x, y);
        return false;
    }
}


function keyPressed(){
    console.log(snake.checkHead(x,y)); 
    if(!snake.gameOver()){                      //Check if game is over or not and
        if(key == " " && isStarted){            //if game is paused or not when
             isPaused = checkIsPaused();        //function keyPressed() executed
        }else if(!isPaused && !detectmob()){
            switch(keyCode){
                case DOWN_ARROW:
                    if(dir == "up"){            //Check if current direction
                        snake.doNothing();      //is opposite with previous direction
                    }else{
                        dir = "down";
                        setSnakeDirection(dir);
                        checkIsStarted();
                    }
                    break;
                case UP_ARROW:
                    if(dir == "down"){
                        snake.doNothing();
                    }else{
                        dir = "up";
                        setSnakeDirection(dir);
                        checkIsStarted();
                    }
                    break;
                case RIGHT_ARROW:
                    if(dir == "left"){
                        snake.doNothing();
                    }else{
                        dir = "right";
                        setSnakeDirection(dir);
                        checkIsStarted();
                    }
                    break;
                case LEFT_ARROW:
                    if (dir == "right"){
                        snake.doNothing();
                    }else{
                        dir = "left";
                        setSnakeDirection(dir);
                        checkIsStarted();
                    }
                    break;
            }
        }
    }
}

function getTouches(evt) {
    return evt.touches || evt.originalEvent.touches;
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt){
    if(document.fullscreen){
        if ( ! xDown || ! yDown ) {
            return;
        }
    
        let xUp = evt.touches[0].clientX;                                    
        let yUp = evt.touches[0].clientY;
    
        let xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
    
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                if(dir == "right"){           
                    snake.doNothing();      
                }else{
                    dir = "left";
                    setSnakeDirection(dir);
                }
            } else {
                if(dir == "left"){           
                    snake.doNothing();      
                }else{
                    dir = "right";
                    setSnakeDirection(dir);
                }
            }                       
        } else {
            if ( yDiff > 0 ) {
                if(dir == "down"){           
                    snake.doNothing();      
                }else{
                    dir = "up";
                    setSnakeDirection(dir);
                }
            } else { 
                if(dir == "up"){           
                    snake.doNothing();      
                }else{
                    dir = "down";
                    setSnakeDirection(dir);
                }
            }                                                                 
        }
    }

    xDown = null;
    yDown = null;                                             
};

function setSnakeDirection(dir){
    switch(dir){
        case "down":
            x = 0;
            y = 1;
            break;
        case "up":
            x = 0;
            y = -1;
            break;
        case "right":
            x = 1;
            y = 0;
            break;
        case "left":
            x = -1;
            y = 0;
            break;
    }
    //Set Snake direction
    snake.setDir(x, y);
    checkIsStarted();
}
