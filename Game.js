const gameWidth = 1080;
const NUMBER_OF_WAVES = 10;
const DISTANCE_BETWEEN_WAVES = 250;
const NUMBER_OF_LEAVES = 4;
var stage, stageHeight, stageWidth, canvasWidth, canvasHeight;
var queue, canvas;
var river;
var leafDistance;
var frog_sequence, frog;
var insects_sequence;
var waves = [];
var leaves = [];
var insects = [];
var lives = [];
var score;

var btn_turn_left;
var turn_left = false;
var btn_turn_right;
var turn_right = false;
var btn_jump;
var lifeboard;
var startScreen;
var gameRuning = false;
var isGameOver = false;

var insects_data = {
    "images":["assets/insects_spritesheet.png"],
    "frames":[
       [0,0,100,100],
       [100,0,100,100],
       [200,0,100,100],
       [0,100,100,100],
       [100,100,100,100],
       [200,100,100,100]
    ],
    "animations":{
        "insect1":[0],
        "insect2":[1],
        "insect3":[2],
        "insect4":[3],
        "insect5":[4],
        "insect6":[5]
    }
};

var frog_data = {
    "images":["assets/frog_spritesheet.png"],
    "frames":[
        [0,0,200,200],
        [200,0,200,200]
    ],
    "animations":{
        "seating":[0],
        "jumping":[1]
    }
};

function preload(){
    stageWidth = window.innerWidth;
    stageHeight = window.innerHeight;
    var ratio = stageHeight/stageWidth;
    canvasWidth = document.getElementById("canvas").width = gameWidth;
    canvasHeight = document.getElementById("canvas").height = gameWidth * ratio;
    queue = new createjs.LoadQueue();
    queue.addEventListener("complete", init);
    queue.loadManifest([
        {id:"sidewave", src:"assets/sidewave.png"},
        {id:"awave", src:"assets/awave.png"},
        {id:"leaf", src:"assets/leaf.png"},
        {id:"frog", src:"assets/frog_spritesheet.png"},
        {id:"turn", src:"assets/rotate.png"},
        {id:"jump", src:"assets/btn_jump.png"},
        {id:"heart", src:"assets/heart.png"}
    ]);
}

function init(){
    canvas = document.getElementById('canvas');
    stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    CreateRiver();
    CreateRiverSides();
    CreateWaves();
    CreateInsects();
    CreateLeaves();
    AddFrog();
    SetFrogPosition();
    AddControls();
    CreateLifeBoard();
    CreateScoreBoard();
    StartScreen();
    StartGame();
    stage.addEventListener("mousedown",RunTheGame);
    stage.update();
}

function RunTheGame(){
    console.log("Run The Game");
    gameRuning = true;
    stage.removeChild(startScreen);
    stage.removeEventListener("mousedown",RunTheGame);
}

function StartGame(){
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function (e) {
       if(gameRuning){
        GameLoop();
        stage.update();
    }
            
    });
}

function CreateRiver(){
    river = new createjs.Shape();
    river.graphics.beginFill("#3AACBE");
    river.graphics.drawRect(0, 0 , canvasWidth, canvasHeight);
    stage.addChild(river); 
   
}

function CreateRiverSides(){
    var riverSideLeft = new RiverSide(stage);
    stage.addChild(riverSideLeft);
    var riverSideRight = new RiverSide(stage);
    riverSideRight.scaleX = -1;
    riverSideRight.x = stage.canvas.width;
    stage.addChild(riverSideRight);
}

function CreateWaves(){
    for(var i=0; i<NUMBER_OF_WAVES; i++){
        var wave = new Wave(stage);        
        wave.container.y = i * DISTANCE_BETWEEN_WAVES;
        
        stage.addChild(wave.container);
        waves.push(wave);
    }
    setInterval(function(){
        for(var i=0; i<waves.length; i++){
            waves[i].animateWaves();
        }
    }, 4000);
}

function CreateInsects(){
    insects_sequence = new createjs.SpriteSheet(insects_data);
    for(var i=0; i<6; i++){
        var insect = new createjs.Sprite(insects_sequence);
        insect.regX = 50;
        insect.regY = 50;        
        insect.gotoAndStop(i);        
        insects.push(insect);
    }
}

function CreateLeaves(){
    var leafTexture = queue.getResult('leaf');   
    leafDistance = stage.canvas.height / NUMBER_OF_LEAVES;
    
    
    for(var i=0; i<NUMBER_OF_LEAVES+2; i++){
        var leafContainer = new createjs.Container();
        leafContainer.x = Math.floor(Math.random() * (1024-300))+150;
        leafContainer.y = leafDistance * i + -200;
        leafContainer.velX = Math.random()*2 - 1;
        leafContainer.velY = 0.75;
        leafContainer.rotationStep = Math.random()*1 - 0.5;
        
        // Add leaf to container
        var leaf = new createjs.Shape();
        var leafMetrix = new createjs.Matrix2D();
        leafMetrix.translate(-125,-125);
        leaf.graphics.beginBitmapFill(leafTexture,'no-repeat',leafMetrix);
        leaf.graphics.drawCircle(0,0,125);        
        leafContainer.addChild(leaf); 
              
        // Add insect to container
        AddInsect(leafContainer); 
        
        stage.addChild(leafContainer);
        leaves.push(leafContainer);
    }
}

function AddInsect(leafContainer){
    var insect = insects[Math.floor(Math.random()*5)].clone();        
    leafContainer.addChild(insect);
}

function RemoveInsect(leafContainer){
    leafContainer.removeChildAt(1);
}

function AddFrog(){
    frog_sequence = new createjs.SpriteSheet(frog_data);
    frog = new createjs.Sprite(frog_sequence);
    frog.gotoAndStop('seating');
    frog.regX = 100;
    frog.regY = 100;
    frog.status = "seating";
    //frog.onTheLeaf = 0;
    stage.addChild(frog);
}

function SetFrogPosition(){
    for(var i=0; i<leaves.length; i++){
        var leaf = leaves[i];
        if(leaf.y > 600 && leaf.y < 1000){
            frog.onTheLeaf = i;
            RemoveInsect(leaf);            
            break;
        }
    }
}


/*
 * Game Controls
 */


function AddControls(){
    gfx_turn_left = new createjs.Bitmap(queue.getResult('turn'));
    gfx_turn_left.x = 50;
    gfx_turn_left.y = canvasHeight - 500;
    gfx_turn_left.alpha = 0.2;
    stage.addChild(gfx_turn_left);
    
    btn_turn_left = new createjs.Shape();
    btn_turn_left.graphics.beginFill('#ffffff');
    btn_turn_left.graphics.drawRect(0,0, 200, 200);
    btn_turn_left.x = 50;
    btn_turn_left.y = canvasHeight - 500;
    btn_turn_left.alpha = 0.01;
    stage.addChild(btn_turn_left);
    btn_turn_left.addEventListener("mousedown", function(e){
        turn_left = true;
        //console.log(turn_left);
    });    
    stage.addEventListener("pressup", function(e){
        turn_left = false;
        //console.log(turn_left);
    });
    
    gfx_turn_right = new createjs.Bitmap(queue.getResult('turn'));
    gfx_turn_right.x = canvasWidth - 50;
    gfx_turn_right.y = canvasHeight - 500;
    gfx_turn_right.alpha = 0.2;
    gfx_turn_right.scaleX = -1;
    stage.addChild(gfx_turn_right);
    
    btn_turn_right = new createjs.Shape();
    btn_turn_right.graphics.beginFill('#ffffff');
    btn_turn_right.graphics.drawRect(0,0, 200, 200);
    btn_turn_right.x = canvasWidth - 50 - 200;
    btn_turn_right.y = canvasHeight - 500;
    btn_turn_right.alpha = 0.01;
    
    stage.addChild(btn_turn_right);
    btn_turn_right.addEventListener("mousedown", function(e){
        turn_right = true;
    });    
    stage.addEventListener("pressup", function(e){
        turn_right = false;
    });
    
    
    gfx_jump = new createjs.Bitmap(queue.getResult('jump'));
    gfx_jump.regX = 170;
    gfx_jump.regY = 200;
    gfx_jump.x = canvasWidth/2;
    gfx_jump.y = canvasHeight - 50;
    gfx_jump.alpha = 0.2;
    stage.addChild(gfx_jump);
    
    btn_jump = new createjs.Shape();
    btn_jump.graphics.beginFill('#ffffff');
    btn_jump.graphics.drawRect(0,0, 340, 200);
    btn_jump.regX = 170;
    btn_jump.regY = 200;
    btn_jump.x = canvasWidth/2;
    btn_jump.y = canvasHeight - 50;
    btn_jump.alpha = 0.01;
    stage.addChild(btn_jump);
    btn_jump.addEventListener("click", jumpFrog);
}

function jumpFrog(){
    var angle = toRadians(frog.rotation);
    var jumpDistance = 400;
    var currentPosition = new createjs.Point(frog.x, frog.y);
    var targetPosition = new createjs.Point();
    var offset = new createjs.Point();
    offset.x = Math.sin(angle) * jumpDistance;
    offset.y = Math.cos(angle) * jumpDistance;
        
    targetPosition.x = currentPosition.x + offset.x;
    targetPosition.y = currentPosition.y - offset.y;
        
    if(frog.status == "seating"){
        frog.status = "jumping";
        frog.gotoAndStop("jumping");
        createjs.Tween.get(frog, {override:true, onChange:frogJumpProgress}).to({x:targetPosition.x, y:targetPosition.y},300).call(frogJumpComplete);
    }
}

function frogJumpProgress(){   
    
    var hit = false;
    for(var i=0; i<leaves.length; i++){
        if(frog.onTheLeaf == i){
            continue;
        }
       
        var leaf = leaves[i];
        var pt = leaf.globalToLocal(frog.x, frog.y);
        hit = leaf.hitTest(pt.x, pt.y); 
        
        if(hit){              
            frog.status = "seating";
            frog.gotoAndStop("seating");
            createjs.Tween.get(frog, {override:true});
            frog.onTheLeaf = i;
            
                if(leaf.children.length > 1){
                score.text = score.text + 10;
                RemoveInsect(leaf);
            }
                       
            break;
        }
    }    
}

function frogJumpComplete(){
    
    frog.visible = false;
    frog.status = "seating";
            frog.gotoAndStop("seating");
            setTimeout(function(){
                frog.visible = true;
                SetFrogPosition();                
            },3000);
            RemoveOneLife();
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

/*
 * GAME LOOP
 */

function GameLoop(){
    MoveWaves();
    MoveLeaves();
    UpdateFrog();
    RotateFrog();
}

function MoveWaves(){
    for(var i=0; i<waves.length; i++){
        var wave = waves[i].container;
        wave.y = wave.y + 1;
        //console.log("Moving: " + wave.y);
        if(wave.y > NUMBER_OF_WAVES * DISTANCE_BETWEEN_WAVES){
            wave.y = 0;
        }
    }
}

function MoveLeaves(){
    for(var i=0; i<leaves.length; i++){
        var leaf = leaves[i];
        leaf.y += leaf.velY;
        
        if(leaf.y > (leafDistance*leaves.length) - 200){
            leaf.y = -200;
            if(leaf.numChildren < 2){
                AddInsect(leaf);
            }
        }
        
        leaf.x += leaf.velX;
        
        if(leaf.x < 150 || leaf.x > canvas.width - 150){
            leaf.velX *= -1;
        }
        
        leaf.rotation += leaf.rotationStep;
    }
}

function UpdateFrog(){
     //console.log(frog.status);
        if(frog.status == "seating" && frog.onTheLeaf != undefined){
            var frogLeaf = leaves[frog.onTheLeaf];
            frog.x = frogLeaf.x;
            frog.y = frogLeaf.y;
            frog.rotation += frogLeaf.rotationStep;

            if(frog.y > canvasHeight + 150){
                SetFrogPosition();
                RemoveOneLife();
            }
        }else if(frog.onTheLeaf == undefined){
            SetFrogPosition();
        }
}

function RotateFrog(){
    if(turn_left){
        frog.rotation -=3;
    }
    
    if(turn_right){
        frog.rotation +=3;
    }
}

/*
 * Scoreboard
 */

function CreateScoreBoard(){
    score = new createjs.Text(0, "72px Righteous", "#ffffff");
        score.textBaseline = "top";
        score.textAlign = "right";
        score.x = canvasWidth - 25;
        score.y = 25;
        stage.addChild(score);
}

/*
 * Life Board
 */

function CreateLifeBoard(){
    lifeboard = new createjs.Container();
    lifeboard.x = 25;
    lifeboard.y = 25;
    var background = new createjs.Shape();
    background.graphics.beginFill("#000000");
    background.alpha = 0.5;
    var radius = 15;
    background.graphics.drawRoundRect(0,0,320,80,radius,radius,radius,radius);
    lifeboard.addChild(background);
    
    for(var i=0; i<5; i++){
        var heart = new createjs.Bitmap(queue.getResult('heart'));
        heart.x = i * 60 + 20;
        heart.y = 20;
        lifeboard.addChild(heart);
        lives.push(heart);
    }    
    
    stage.addChild(lifeboard);
}

function RemoveOneLife(){
    if(lives.length > 0){
        lifeboard.removeChild(lives.pop());
    }else if(gameRuning){        
        GameOver();
    }
}

function StartScreen(){
    startScreen = new createjs.Container();
    startScreen.x = stage.canvas.width/2;
    startScreen.y = stage.canvas.height/2;
    stage.addChild(startScreen);
    
    var line1 = new createjs.Text("FROGGY","144px Righteous", "#11ff11");
    line1.textAlign = "center";
    line1.y = -180;
    startScreen.addChild(line1);
    
    var line2 = new createjs.Text("Tap anyware to","48px Righteous", "#fff");
    line2.textAlign = "center";
    line2.y = 0;
    startScreen.addChild(line2);
    
    var line3 = new createjs.Text("Start Game","96px Righteous", "#fff");
    line3.textAlign = "center";
    line3.y = 100;
    startScreen.addChild(line3);
    
//    var line4 = new createjs.Text("Use left and right arrow key to turn left right","24px Righteous", "#fff");
//    line4.textAlign = "center";
//    line4.y = 50;
//    startScreen.addChild(line4);
//    
//    var line5 = new createjs.Text("Spacebar to Jump","24px Righteous", "#fff");
//    line5.textAlign = "center";
//    line5.y = 80;
//    startScreen.addChild(line5);
}


function GameOver(){
    gameRuning = false;
    isGameOver = true;
    var text = new createjs.Text("Game Over", "96px Righteous", "#fff");
    text.textBaseline = "middle";
    text.textAlign = "center";
    text.x = stage.canvas.width / 2;
    text.y = stage.canvas.height / 2;
    stage.addChild(text);
    stage.update();
}