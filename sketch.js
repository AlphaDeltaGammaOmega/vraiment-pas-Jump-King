let levels = [[
	'    d            d',
	'    d            d',
	'    d     #      d',
	'    d            d',
	'    d            d',
	'    d            d ddddddd',
	'    d                     d',
	'    d                     d',
	'    dc                  0 d',
	'    d P          ggggggggg',
	'    d       p    d',
	'    d            d',
	'    d           cd',
	'    d         rrrd',
	'    dc         rrd',
	'    d P         rd',
	'    d            d',
	'    d            d',
	'    d            d',
	'    d   c        d',
	'    d   p        d',
	'    d        c   d',
	'    d        p   d',
	'    d            d',
	'    d            d    d',
	'    d           rd     0',
	'    d   t    t  rd      ',
	'                       d',
	'dggggggggggggggggggggggggggggggggd'
]
, [
	'    d            d',
	'    d            d',
	'    d     #      d',
	'    d            d',
	'    d            d',
	'    d            d ddddddd',
	'    d                     d',
	'    d                     d',
	'    dc                  0 d',
	'    d P          ggggggggg',
	'    d       p    d',
	'    d            d',
	'    d           cd',
	'    d         rrrd',
	'    dc         rrd',
	'    d P         rd',
	'    d            d',
	'    d            d',
	'    d            d',
	'    d   c        d',
	'    d   p        d',
	'    d        c   d',
	'    d        p   d',
	'    d            d',
	'    d            d    d',
	'    d           rd     0',
	'    d   t    t  rd      ',
	'               rrd     d',
	'dgggggggggggggggggd'
]]









function preload() {
	playerImage = loadImage('assets/sprites/knight.png');
	coinImage = loadImage('assets/sprites/coin.png');
	platformImage = loadImage('assets/sprites/platforms.png');
	worldImage = loadImage('assets/sprites/world_tileset.png');
	barImage = loadImage('assets/sprites/bar.png');
	slimePImage = loadImage('assets/sprites/slime_purple.png');
	portalImage = loadImage('assets/sprites/Dimensional_Portal.png');
	
	jumpSound = loadSound('assets/sounds/jump.wav');
}

function setup() {
	new Canvas(innerWidth / 4, innerHeight / 4, "pixelated x4");
	tileNum = 12
//Player related
	jumps = 0;
	jumping = false;
	jump_power = 0;
	max_jumps = 1;

	player = new Sprite();
	player.height = 14;
	player.width = 12;
	player.y = -300
	player.rotationLock = true;
	player.anis.offset.y = -4;
	player.spriteSheet = playerImage;
	player.addAnis({
		idle: { w: 32, h: 32, col: 0, row: 0, frames: 4, frameDelay: 10 },
		run: { w: 32, h: 32, col: 0, row: 2, frames: 16, frameDelay: 5 },
		roll: { w: 32, h: 32, col: 0, row: 5, frames: 8, frameDelay: 3 },
		stun: { w: 32, h: 32, col: 3, row: 7}
	})
	stunned = true;
	rolling = true;
	rolls = 1;
	player.vel.y = 1;
	player.x = 135;
	previousVel = player.vel;

	bar = new Sprite();
	bar.collider = 'none';
	bar.height = 3;
	bar.width = 15;
	bar.rotationLock = true;
	bar.spriteSheet = barImage;
	bar.addAnis({
		charging: {col:0, row:0, w:15, h:5, frames:11, frameDelay:10},
		empty: {col:0, row:0, w:15, h:5},
		full: {col:2, row:3, w:15, h:5}
	});

	feet = new Sprite();
	feet.collider = 'none';
	feet.height = 2;
	feet.width = 10;
	feet.rotationLock = true;
	feet.visible = false;

//NPCs
/*
	slimeP = new Sprite();
	slimeP.height = 14;
	slimeP.width = 12;
	slimeP.rotationLock = true;
	slimeP.x = 40
	slimeP.anis.offset.y = -4;
	slimeP.spriteSheet = slimePImage;
	slimeP.addAnis({
		spawn: { w: 24, h: 24, col: 0, row: 0, frames: 4, frameDelay: 10 },
		idle: { w: 24, h: 24, col: 0, row: 1, frames: 4, frameDelay: 5 },
	})
*/
//Tiles

	spawnPoint = new Group();
	spawnPoint.collider = 'none';
	spawnPoint.w = 16;
	spawnPoint.h = 16;
	spawnPoint.spriteSheet = worldImage;
	spawnPoint.addAnis({
		1: {col:0, row:0, w:16, h:16},
		2: {col:2, row:0, w:16, h:16}
	});
	spawnPoint.tile = '#';
	spawnPoint.visible = false;

	grass = new Group();
	grass.collider = 'satic';
	grass.w = 16;
	grass.h = 16;
	grass.spriteSheet = worldImage;
	grass.addAnis({
		1: {col:0, row:0, w:16, h:16},
		2: {col:2, row:0, w:16, h:16}
	});
	grass.tile = 'g';
	grass.friction = 3;
	grass.bounciness = 0.45;

	dirt = new Group();
	dirt.collider = 'satic';
	dirt.w = 16;
	dirt.h = 16;
	dirt.spriteSheet = worldImage;
	dirt.addAnis({
		1: {col:0, row:1, w:16, h:16},
		2: {col:2, row:1, w:16, h:16}
	});
	dirt.tile = 'd';
	dirt.bounciness = 0.75;

	platform = new Group();
	platform.collider = 'satic';
	platform.w = 16;
	platform.h =7;
	platform.spriteSheet = platformImage;
	platform.addAnis({
		1: {col:0, row:0, w:16, h:16},
		2: {col:0, row:1, w:16, h:16}
	});
	platform.ani.offset.y = 5
	platform.friction = 5;
	platform.tile = 'p';

	bigPlatform = new Group();
	bigPlatform.collider = 'satic';
	bigPlatform.w = 32;
	bigPlatform.h = 8;
	bigPlatform.spriteSheet = platformImage;
	bigPlatform.addAnis({
		1: {col:1, row:0, w:48, h:16},
		2: {col:1, row:0, w:48, h:16},
	});
	bigPlatform.ani.offset.y = 4;
	bigPlatform.tile = 'P';

	portal1 = new Group();
	portal1.collider = 'satic';
	portal1.w = 16;
	portal1.h = 32;
	portal1.spriteSheet = portalImage;
	portal1.addAnis({
		1: {col:0, row:0, w:32, h:32, frames:6},
		2: {col:0, row:0, w:32, h:32, frames:6}
	});
	portal1.ani.offset.x = -1;
	portal1.tile = '0';

	coins = new Group();
	coins.collider = 'satic';
	coins.w = 16;
	coins.h = 16;
	coins.spriteSheet = coinImage;
	coins.addAnis({
		1: {col:0, row:0, w:16, h:16, frames:12},
		2: {col:0, row:0, w:16, h:16, frames:12}
	});
	coins.tile = 'c';
	coins.collider = 'none';

	crate = new Group();
	crate.collider = 'satic';
	crate.w = 16;
	crate.h = 16;
	crate.spriteSheet = worldImage;
	crate.addAnis({
		1: {col:7, row:3, w:16, h:16},
		2: {col:7, row:3, w:16, h:16}
	});
	crate.tile = 'r';

	tree = new Group();
	tree.collider = 'satic';
	tree.w = 16;
	tree.h = 48;
	tree.spriteSheet = worldImage;
	tree.addAnis({
		1: {col:0, row:1, w:16, h:48},
		2: {col:5, row:1, w:16, h:48}});
		
	tree.tile = 't';
	tree.layer = -1;
	tree.collider = 'none';
	
	
	levelStr = ['1', '2'];
	currentLevel = 0;
	tiles = new Tiles(levels[currentLevel], 0, 0, 16, 16);
	for (tile of tiles) {
		tile.changeAni(levelStr[currentLevel]);
	}



	for (let point of spawnPoint) {
		player.x = tileNum % 2 == 0 ?point.x + player.width/2 : point.x;
		player.y = point.y;
	}
	for (let portal of portal1) {
		portal.y += 8;
	}

	world.gravity.y = 9.81;

	camera.x = player.x;
	console.log(tileNum*16)

	btn = createButton('Play');
	btn.position(innerWidth/2 - 100, innerHeight/2 - 50);
	btn.size(200, 100);

	btn.mousePressed(()=>{
		loop();
		btn.remove();
	})
	noLoop();

}

function checkdirection(speed) {
	if (kb.pressing('left')) {
		if (player.vel.x > -speed) {
			player.vel.x = -speed;
		}
		player.mirror.x = true;
		if (! rolling) {
		player.changeAni('run');
		}
	}
	if (kb.pressing('right')) {
		if (player.vel.x < speed) {
			player.vel.x = speed;
		}
		player.mirror.x = false;
		if (! rolling) {
		player.changeAni('run');
		}
	}
}


function draw() {
	background(150, 150, 255);
	if (player.y < 360) {
		camera.y = player.y;
	}
	if (abs(player.x-camera.x) > tileNum*8+10) {
		camera.x += player.x > camera.x ? tileNum*16 : -tileNum*16;
	}
	feet.x = player.x;
	feet.y = player.y+7;
	bar.x = player.x;
	bar.y = player.y-10;

	if (abs(player.vel.x) < 0.25) {
		player.changeAni('idle');
	}

	if (previousVel > 5 && feet.overlapping(tiles)) {
		stunned = true;
	}
	
	if (kb.pressing('up') && ! stunned && ! rolling) {
		if (jumping == false) {
			jumping = true;
			bar.changeAni('charging')
			bar.ani.frame = 0;
			
		}
		else if (jump_power < 11) {
			if (bar.ani.frameDelay == 10) {
				jump_power += 0.1;
			}
			else {
				jump_power += 0.3;
			}
		}
		else {
			bar.changeAni('full')
		}
	}
	else {
		if (jumping) {
			if (jumps > 0) {
				player.vel.y = -jump_power/2;
				jumps -= 1
				jumpSound.play();
			}
		}
		if (feet.overlapping(tiles) && stunned == false) {
			jumps = max_jumps;
			checkdirection(2.5);
		}
		else if (stunned == false){
			checkdirection(1)
		}
		bar.changeAni('empty')
		jump_power = 0;
		jumping = false;

		if (kb.pressed('shift') && stunned == false) {
			rolling = true;
			player.vel.x =player.mirror.x ? -6 : 6;
			player.changeAni('roll')

		}
	}

	for (let portal of portal1) {
		if (player.colliding(portal)) {
			currentLevel += 1;
			tiles.remove();
			tiles = new Tiles(levels[currentLevel], 0, 0, 16, 16);
			for (point of spawnPoint) {
				player.x = point.x
				player.y = point.y
			}
			for (tile of tiles) {
				tile.changeAni(levelStr[currentLevel]);
			}
		}
	}


	for (let coin of coins) {
		if (player.overlapping(coin)) {
			coin.remove()
		}
	}
	
	if (player.vel.y == 0 && player.vel.x == 0 && feet.overlapping(tiles)){
		stunned = false;
	}
	
	if (stunned == true) {
		player.changeAni('stun');
	}

	if (player.mirror.x ? player.vel.x > -3: player.vel.x < 3) {
		rolling = false;
	}

	previousVel = player.vel.y;

	

}

function postProcess() {
	text("FPS: " + frameRate(), 5, 32)
	
}