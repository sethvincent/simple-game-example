var Game = require('gameloop');
var Keyboard = require('crtrdg-keyboard');

var canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var game = new Game({
  renderer: canvas.getContext('2d'),
});

var keyboard = new Keyboard(game);

var box = {
  x: 0,
  y: 0,
  w: 10,
  h: 10,
  color: '#ffffff',
  speed: 5
}

box.update = function(interval){
  if ('W' in keyboard.keysDown) box.y -= box.speed;
  if ('S' in keyboard.keysDown) box.y += box.speed;
  if ('A' in keyboard.keysDown) box.x -= box.speed;
  if ('D' in keyboard.keysDown) box.x += box.speed;

  if (box.x < 0) box.x = 0;
  if (box.y < 0) box.y = 0;
  if (box.x >= canvas.width - box.w) box.x = canvas.width - box.w;
  if (box.y >= canvas.height - box.h) box.y = canvas.height - box.h;
}

box.draw = function(context){
  context.fillStyle = box.color;
  context.fillRect(box.x, box.y, box.w, box.h);
}

game.on('update', function(interval){
  box.update();
});

game.on('draw', function(context){
  context.fillStyle = '#E187B8';
  context.fillRect(0, 0, canvas.width, canvas.height);
  box.draw(context);
});

game.start();