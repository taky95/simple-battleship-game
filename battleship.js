/**
 * created by Takumi Minohara
 * provides game functionality for battleship game. 
 *
 */
 
//gloabl valuables
let row = 10;
let col = 10;

// player1's turn is 0, player2's turn is 1.
// state0: preparation, state1: in-game state, state2: end-state
var player1, player2, cpu;
var gamemode, countShips=0, turn = 0, state=0;



// constructors 
function user(name){
    this.name = name;
    this.score = 0;
    this.gameGrid = new Array(10);
    this.setGrid = function(){
        for (var i = 0; i < this.gameGrid.length; i++) {
          this.gameGrid[i] = new Array(10);
        }
    }
}

// create 1st player, and set boat location.
function initGame(){
    gamemode = document.getElementById("mode").checked;
    
    fadeForm("user");
    showForm("boats");
    
    unlockMap(turn);
    
    player1 = new user(document.user.name.value);
    player1.setGrid();
    
    turnInfo(player1.name);
    bindGrid(turn);
}

// user is ready.
function ready(){
    countShips=0;
    removeGrid(turn);
    fadeForm("boats");
    removeShip();
    lockReadyButton();
    
    // when 2nd player is ready.
    if(turn==1){
        showForm("gamescreen");
        unlockMap(turn);
        state=1;
        turnInfo(player1.name)
        turn--;
        bindGrid(turn+1);
        bindGrid(turn);
        
    //when it's AI mode ...    
    }else if(!gamemode){
        cpu = new user("AI");
        cpu.setGrid();
        var shipSize = 5;
        var coordinates= generateCoordinates();
        for(var i=0; i<4;i++){
            for(var j=0; j<shipSize;j++){
                console.log(coordinates);
                setCoordinates(coordinates, j);
            }
            shipSize--;
        }
        
        showForm("gamescreen");
        var placeholder=document.getElementById("info");
        var text = document.createTextNode("Sorry, CPU mode is under developement. Please reload and try PvP mode.");
        placeholder.appendChild(text);
        placeholder.appendChild(document.createElement("br"));
        draw2DArray(cpu.gameGrid);
        
    // when 1st player is ready.    
    }else{
        showForm("user2");
        unlockOptions();
        lockMap(turn);
    }
}

// create 2nd player, and set boat location.
function next(){
    player2=new user(document.user2.name.value);
    player2.setGrid();
    fadeForm("user2");
    showForm("boats");
    turnInfo(player2.name);
    
    turn++;
    unlockMap(turn);
    bindGrid(turn);
}

// drawGameBorad based on player id.
function drawGameBoard (id){
    var placeholder = document.getElementById(id);
    
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            var gridCell = document.createElement("div");
            
            placeholder.appendChild(gridCell);
            gridCell.classList.add("gridItem");
            gridCell.setAttribute("id", `${id}-${i}-${j}`);
        }
    }
}

// remove event listeners for the grid. 
function removeGrid(id){
    id++;
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            document.getElementById(`p${id}-${i}-${j}`).removeEventListener("click", markCoordinates);
        }
    }
}

// bind events to the grid.
function bindGrid(id){
    id++;
    
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            if(state==0){
                // set boats to the grid when it's clicked.
                document.getElementById(`p${id}-${i}-${j}`).addEventListener("click", markCoordinates); 
            }else{
                // fire the location when it's clicked.
                document.getElementById(`p${id}-${i}-${j}`).addEventListener("click", fireTo); 
            }
        }
    }
}

// add game information to <div id="info"></div> depending on the state.
function turnInfo(name){
    var text;
    var placeholder=document.getElementById("info");
    
    if(state==0){
        text = document.createTextNode(">: Welcome, " + name + "!");
    }else if(state==1){
        text = document.createTextNode(">: Your turn, " + name + "!");
    }else{
        text = document.createTextNode(">: You won, " + name + "!");
    }
    
    placeholder.appendChild(text);
    placeholder.appendChild(document.createElement("br"));
}

function reset(){
    countShips=0;
    unlockMap(turn);
    removeShip();
    unlockOptions();
    if(turn==0){
        player1.setGrid();
        //draw2DArray(player1.gameGrid);
    }else{
        player2.setGrid();
    }
}

// scan through the given grid and return true if it does not contain any true(ship).
function judge(grid){
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            if(grid[i][j]){
                return false;
            }
        }
    }
    return true;
}

function stripId(id){
    var coordinates = id.match(/\d+/g);
    return coordinates;
}

function showForm(formName){
    var form = document.getElementById(formName);
    form.classList.remove("fade");
    form.classList.add("show");
}

function fadeForm(formName){
    var form = document.getElementById(formName);
    form.classList.remove("show");
    form.classList.add("fade");
}

function unlockMap(player){
    var placeholder = document.getElementsByClassName("gameBoard");
    placeholder[player].style.opacity="1";
    placeholder[player].style.pointerEvents="auto";
}
function lockMap(player){
    var placeholder = document.getElementsByClassName("gameBoard");
    placeholder[player].style.opacity="0.5";
    placeholder[player].style.pointerEvents="none";
}

function unlockReadyButton(){
    var placeholder = document.getElementById("ready");
    placeholder.style.opacity="1";
    placeholder.style.pointerEvents="auto";
}

function lockReadyButton(){
    var placeholder = document.getElementById("ready");
    placeholder.style.opacity="0.5";
    placeholder.style.pointerEvents="none";
}

function lockResetButton(){
    var placeholder = document.getElementById("reset");
    placeholder.style.opacity="0.5";
    placeholder.style.pointerEvents="none";
}

function unlockOptions(){
    var labels = document.getElementsByClassName("options");
    var inputs = document.getElementsByClassName("radio");
    var len = inputs.length;
    for(var i=0;i<len;i++){
        inputs[i].style.display="block";
    }
    for(var i=0;i<labels.length;i++){
        labels[i].style.opacity="1";
        labels[i].style.pointerEvents="auto";
    }
}

function paintShip(gridItem){
    if(gridItem){
       gridItem.classList.add("ship"); 
    }
}

function removeShip(){
    var gridItems = document.getElementsByClassName("gridItem");
    document.getElementById("boat1").checked=true;
    //console.log(gridItems);
    var len = gridItems.length;
    for(var i=0;i<len;i++){
        gridItems[i].classList.remove("ship");
    }
}

function paintHit(gridItem){
    gridItem.classList.add("hit");
}

function paintMiss(gridItem){
    var x = document.createTextNode("x");
    var tag = document.createElement("p");
    tag.appendChild(x);
    gridItem.appendChild(tag);
}

function fireTo(){
    var coordinates = stripId(this.id);
    var check;
    
    if(turn==0){
        check = player2.gameGrid[coordinates[1]][coordinates[2]];
    }else{
        check = player1.gameGrid[coordinates[1]][coordinates[2]];
    }
    
    if(check){
        paintHit(this);
        if(turn==0){
            player2.gameGrid[coordinates[1]][coordinates[2]]=false;
        }else{
            player1.gameGrid[coordinates[1]][coordinates[2]]=false;
        }
    }else{
        paintMiss(this);
    }
    
    if(turn==0){
        lockMap(1);
        if(judge(player2.gameGrid)){
            state=2;
            turnInfo(player1.name);
            lockMap(0);
        }else{
            turnInfo(player2.name);
            turn++;
            unlockMap(0);
        }
    }else{
        lockMap(0);
        if(judge(player1.gameGrid)){
            state=2;
            turnInfo(player2.name);
            lockMap(1);
        }else{
            turnInfo(player1.name);
            turn--;
            unlockMap(1); 
        }
    }
        // show each player's internal 2d array    
        //draw2DArray(player1.gameGrid);
        //draw2DArray(player2.gameGrid);
} 

function markCoordinates(){
    if(countShips=="3"){
        unlockReadyButton();
        lockMap(turn);
    }
    var coordinates = stripId(this.id);
    placeBoats(coordinates);
}

function checkRadio(){
    var whichShip = document.getElementsByName ("radio");
    var len = whichShip.length;
    for(var i = 0; i<len; i++){
       if(whichShip[i].checked){
           return whichShip[i].value;
       }
    }
    return false;
}

function placeBoats(coordinates){
    var exp = checkRadio();
    switch (exp) {
        case "carrier":
            for(var x = 0; x < 5; x++){
                setCoordinates(coordinates,x);
            }
                var placeHolder = document.getElementById("boat1");
                var label = document.getElementById("label1");
                label.style.opacity="0.5";
                label.style.pointerEvents="none";
                placeHolder.style.display="none";
                placeHolder.checked=false;
            
            break;
        case "battleship":
            for(var x = 0; x < 4; x++){
                setCoordinates(coordinates,x);
            }
                var placeHolder = document.getElementById("boat2");
                var label = document.getElementById("label2");
                label.style.opacity="0.5";
                label.style.pointerEvents="none";
                placeHolder.style.display="none";
                placeHolder.checked=false;
            
            break;
        case "cruiser":
            for(var x = 0; x < 3; x++){
                setCoordinates(coordinates,x);
            }
                var placeHolder = document.getElementById("boat3");
                var label = document.getElementById("label3");
                label.style.opacity="0.5";
                label.style.pointerEvents="none";
                placeHolder.style.display="none";
                placeHolder.checked=false;
            
            break;
        case "destroyer":
            for(var x = 0; x < 2; x++){
                setCoordinates(coordinates,x);
            }
                var placeHolder = document.getElementById("boat4");
                var label = document.getElementById("label4");
                label.style.opacity="0.5";
                label.style.pointerEvents="none";
                placeHolder.style.display="none";
                placeHolder.checked=false;
            
            break;
    }
    countShips++;
}

function setCoordinates(coordinates, x){
    var rows = Number(coordinates[2])+x;
    var htmlDOM = document.getElementById(`p${coordinates[0]}-${coordinates[1]}-${rows}`);
    paintShip(htmlDOM);
    if(coordinates[0]==1){
        player1.gameGrid[coordinates[1]][rows] = true;   
    }else if(!gamemode){
        cpu.gameGrid[coordinates[1]][rows] = true; 
    }else{
        player2.gameGrid[coordinates[1]][rows] = true; 
    }
}

function generateCoordinates(){
    var coordinates = new Array(3);
    coordinates[0]=2;
    coordinates[1]= randomWholeNum();
    coordinates[2]= randomWholeNum();
    return coordinates;
}

function randomWholeNum() {
    var rand =Math.floor(Math.random() * 10);
  return rand;
}

// see a image of internal 2D array

function draw2DArray(array){
    var html="";
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            html = html + array[i][j] + ", ";
        }
        html=html+"\n";
    }
    console.log(html);
}

function uncheckRadio(){
    var placeholder = document.getElementsByClassName("radio");
    for(var i=0; i<placeholder.length;i++){
        placeholder.checked = false;
    }
}