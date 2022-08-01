//variáveis para o t-rex
var trex, trexRunning, trexcolisao;
//variável para as bordas
var edges;
//variáveis para o chão
var ground, groundImage;
//variável para chão invisivel
var invisibleGround;
//variável para nuvem
var nuvem, nuvemimage;
//variável para cactos
var cacto1, cacto2, cacto3, cacto4, cacto5, cacto6;
var PLAY = 1
var END = 0
var GameState = PLAY
//variável para game over
var gamerover, gameoverimage;
//variável para ter o botão de restart
var restart, restartimage;
//variável pontuação
var score = 0
//variável para som do jogo
var jumpsound, checksound, deathsound;
//pré carregamento de imagens 
function preload() {
  //imagens do t-rex sendo carregadas na var auxiliar 
  trexRunning = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  //imagem do chão sendo carregada na var auxiliar 
  groundImage = loadImage("ground2.png");
  nuvemImage = loadImage("cloud.png");
  cacto1 = loadImage("obstacle1.png");
  cacto2 = loadImage("obstacle2.png");
  cacto3 = loadImage("obstacle3.png");
  cacto4 = loadImage("obstacle4.png");
  cacto5 = loadImage("obstacle5.png");
  cacto6 = loadImage("obstacle6.png");
  trexcolisao = loadImage("trex_collided.png");
  gameoverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  jumpsound = loadSound("jump.mp3");
  checksound = loadSound("checkPoint.mp3");
  deathsound = loadSound("die.mp3");
}

  //função de configuração
  function setup() {
  //área do game
  createCanvas(windowWidth,windowHeight);

  invisibleGround = createSprite(width/2,height-10,width,10)
  invisibleGround.visible = false
  cactog = new Group ();
  nuvemg = new Group ();
  //t-rex sprite e caracteristicas
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("correndo", trexRunning);
  trex.addAnimation("trexcolidindo",trexcolisao);
  trex.scale = 0.4;
  trex.setCollider("circle",0,0,50);
  //trex.debug = true;
  //sprite do chão e características 
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("chao", groundImage);
  gameover = createSprite(width/2,height/2);
  gameover.addImage(gameoverimage);
  gameover.scale = 0.5;
  gameover.visible = false
  restart = createSprite(width/2,height/2+40);
  restart.addImage(restartimage);
  restart.scale = 0.5;
  restart.visible = false

  //bordas
  edges = createEdgeSprites();
}

//executa várias vezes 
  function draw() {
  //cor de fundo
  background("white");
  text ("score: "+score,width-100,50)
  if (GameState===PLAY){
  //velocidade do chão
  ground.velocityX = -(6+score/100);
  score = score+Math.round(getFrameRate()/60);
  if (score>0 && score%500===0){
  checksound.play();
  }
  //recarregamento do chão
  if (ground.x<0){
  ground.x = ground.width/2;
  }
  //código para o trex pular
  if (touches.length > 0 || keyDown("space")) {
  if (trex.y >= height-40){
    trex.velocityY = -10;
    jumpsound.play();
    touches = [];
  }
  }
  //gravidade
  trex.velocityY = trex.velocityY + 0.5;

  criarnuvem();
  criarcactos();
  if(cactog.isTouching(trex)){
    GameState = END;
    deathsound.play();
  }
  } 
  else if (GameState===END){
  gameover.visible = true
  restart.visible = true
  ground.velocityX = 0;
  cactog.setVelocityXEach(0);
  nuvemg.setVelocityXEach(0);
  trex.changeAnimation("trexcolidindo",trexcolisao);
  nuvemg.setLifetimeEach(-1);
  cactog.setLifetimeEach(-1);
  trex.velocityY = 0
  if(mousePressedOver(restart)|| touches.length > 0){
    touches = [];
    reset();
  }
  }
  //trex colidindo
  trex.collide(invisibleGround);

  //desenha os sprites 
  drawSprites();
}
function reset(){
  GameState = PLAY
  gameover.visible = false
  restart.visible = false
  cactog.destroyEach();
  nuvemg.destroyEach();
  trex.changeAnimation("correndo", trexRunning);
  score = 0
}

function criarnuvem(){
if(frameCount%60==0){
nuvem = createSprite(width+10,height-100,10,10);
nuvem.y = Math.round(random(height-150,height-100));
nuvem.velocityX = -3
nuvem.addImage("nuvem",nuvemImage);
nuvem.scale = 0.5;
nuvem.depth = trex.depth;
trex.depth = trex.depth+1;
nuvem.lifetime = width+10;
nuvemg.add(nuvem);
}
}
function criarcactos(){
if(frameCount%60==0){
var cacto = createSprite(width+10,height-35,10,40);
cacto.velocityX = -(6+score/100);
var rand = Math.round(random(1,6));
switch(rand){
  case 1: cacto.addImage(cacto1);
  break;
  case 2: cacto.addImage(cacto2);
  break;
  case 3: cacto.addImage(cacto3);
  break;
  case 4: cacto.addImage(cacto4);
  break;
  case 5: cacto.addImage(cacto5);
  break;
  case 6: cacto.addImage(cacto6);
  break;
  default:break;
}
cacto.scale = 0.5;
cacto.lifetime = width+10;
cactog.add(cacto);
}
}