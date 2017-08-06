//constants
var velocity_count = 150;
var angle_count = 1;


//
var game = new Phaser.Game(900, 700, Phaser.AUTO, null, 
    {preload: preload, create: create, update: update/*, render: render*/});

//sprites
var plane;

//game
var is_playing = false;
var textStyle = { font: '18px Arial', fill: '#0095DD' };

//wepon
var fireButton;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#000';
    
    game.load.image('plane', 'imgs/paper_plane_transparent.png');
    game.load.spritesheet('startButton','imgs/button.png',120,40);
    game.load.image('background1', 'imgs/sky_and_grass.jpg');
    game.load.image('evil_plane', 'imgs/evil_plane.png');
    game.load.image('bug', 'imgs/bug.png');
    game.load.image('bullet', 'imgs/shmup-bullet.png');
}

function add_sprite(x, y, sprite_image_name, is_immovable)
{
    sprite = game.add.sprite(x, y, sprite_image_name);
    sprite.anchor.set(0.5);
    //  Enable Arcade Physics
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.immovable = is_immovable === undefined ? false : is_immovable;
    sprite.body.collideWorldBounds = true;
    sprite.body.bounce.setTo(0,0);
    return sprite;
}

function create_weapon(weapon_image_name)
{
    //  Creates 30 bullets, using the weapon_image_name graphic
    var _weapon = game.add.weapon(30, weapon_image_name);

    //  The bullet will be automatically killed when it leaves the world bounds
    _weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    _weapon.bulletSpeed = 600;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    _weapon.fireRate = 100;

    return _weapon;
}

function create()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    backgroundSprite = this.game.add.tileSprite(0, 0, game.width, game.height, 'background1');

    plane = add_sprite(game.world.width*0.5, game.world.height*0.5, 'plane');
    plane.anchor.set(0.5);
    plane.body.drag.set(1);
    //evil_plane = add_sprite(game.width - 20, game.height * 0.5, 'evil_plane');
    bug = add_sprite(game.width - 20, game.height * 0.5, 'bug',true);
    weapon = create_weapon('bullet');

    weapon.trackSprite(plane,70,-10,true);

    game.physics.arcade.collide(plane, bug);
    game.physics.arcade.collide(weapon, bug);
    plane.body.collideWorldBounds = true;

    pauseText = game.add.text(game.world.width*0.5,game.world.height*0.5, 'PAUSE, click space to continue', textStyle);
    pauseText.anchor.set(0.5);
    pauseText.visible = true;
    changeGameStat(true);

    window.onkeydown = function(event) {
        if (event.keyCode == 32) {
            changeGameStat(!game.paused);
        }
    };
    game.physics.enable([plane, bug, weapon], Phaser.Physics.ARCADE);

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.CONTROL);
}

function planeCollideEnemy(plane, enemy)
{
    console.log('colide');
}

function weaponCollideEnemy(bullet, enemy)
{
    enemy.kill();
    bullet.kill();
    console.log('enemy collide');
}

function update()
{
    game.physics.arcade.collide(plane, bug, planeCollideEnemy);
    game.physics.arcade.overlap(weapon.bullets, bug, weaponCollideEnemy, null, this);
    //game.physics.arcade.collide(bug, weapon, )
    plane_control();
    weapon_control();

}

function weapon_control(){
    if (fireButton.isDown)
    {
        weapon.fire();
    }

    game.world.wrap(plane, 16);
}

function changeGameStat(is_paused) {
    pauseText.visible = is_paused;
    game.paused = is_paused;
}

function plane_control()
{

    if (cursors.up.isDown)
    {
        game.physics.arcade.accelerationFromRotation(plane.rotation, 300, plane.body.acceleration);
    }else if(cursors.down.isDown)
    {
        plane.body.velocity.set(0);
    }
    else
    {
        plane.body.acceleration.set(0);
    }

    if (cursors.left.isDown)
    {
        plane.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        plane.body.angularVelocity = 300;
    }
    else
    {
        plane.body.angularVelocity = 0;
    }
}

function render()
{    
}