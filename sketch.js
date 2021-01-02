//created game variables
var dog,sadDog,happyDog,garden,washroom, database;

var foodS,foodStock;

var fedTime,lastFed,currentTime;

var feed,addFood,foodObj;

var gameState,readState;

//preloaded images for the game
function preload(){
sadDog = loadImage("Images/Dog.png");

happyDog = loadImage("Images/happy dog.png");

bedroom = loadImage("Images/Bed Room.png");

garden = loadImage("Images/Garden.png");

washroom = loadImage("Images/Wash Room.png");
}

function setup() {

  //links code with database
  database = firebase.database();
  
  createCanvas(400,500);
  
  foodObj = new Food();

  //reads value of food from database and stores in foodStock
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  //reads value of gamestate from database and stores in readState
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });

  //reads value of FeedTime and stores in fedTime
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
   
  //button to feed the dog
  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  //button to add food
  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  //sprite for dog
  dog = createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15;
}

function draw() {
  
  //updates the activity based on the time the dog wasn't fed
  currentTime = hour();
  if(currentTime == (lastFed + 1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime == (lastFed + 2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   //changes the dog's behaviour when it becomes hungry
   if(gameState != "Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to feed the dog
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//updates gamestate in database
function update(state){
  database.ref('/').update({
    gameState:state
  })
}