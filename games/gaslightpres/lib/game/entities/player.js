ig.module(
    'game.entities.player'
    )
.requires(
    'impact.entity',
    'plugins.camera',
    'impact.sound',
    'game.entities.particle'

    )
.defines(function(){
    EntityPlayer = ig.Entity.extend({
        jumpSFX: new ig.Sound( 'media/sounds/jump.*'),
        shootSFX: new ig.Sound( 'media/sounds/shoot.*'),
        deathSFX: new ig.Sound( 'media/sounds/death.*'),
        animSheet: new ig.AnimationSheet( 'media/PaladinSheet.png', 20, 23 ),
        size: {x: 9, y: 17},
            //animSheet: new ig.AnimationSheet( 'media/CrawilingNinja1.png', 10, 10 ),
            //size: {x: 20, y: 23},
            offset: {x:2, y:5 },
            flip: false,

            font: new ig.Font( 'media/04b03.font.png'),

            maxVel: {x: 100, y: 160},
            friction: {x: 600, y: 0},
            gravityFactor: 1,
            frictionGround: {x: 1000, y: 0},
            airFriction: {x: 0, y: 0},
            accelAir: 150,
            accelGround: 300,
            jump: 200,
            jumpWhileInAir: 200,
            jumpWall: 9999999999,
            offJumpWallPower: 300,
            jumpPowered: 350,
            climb: 50,
            fall: 150,
            wallJumpTimer: new ig.Timer(),
            wallJumpDelay: .4,
            jumpTimer: new ig.Timer(),
            jumpTimeDefault: 0.3, 
            jumpTimePower: 2,
            earlyReleaseFactor: -0.33,
            relaseFallConstant: -20,

            footstep: new ig.Sound( 'media/sounds/footstep.*'),


            health: 20,
            weapon: 0,
            totalWeapons: 2,
            activeWeapon: "EntityBullet",
            invincible: true,
            invincibleDelay: 2,
            invincibleTimer: null,
            type: ig.Entity.TYPE.A,
            wallDelay: 0.5,
            wallTimer: null,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            momentumDirection: {'x':0,'y':0},
            newPosition: false,
            positionTimer: null,
            name: 'player',

            init: function( x, y, settings ){
                this.parent( x, y, settings);
                this.startPosition = { x:x, y:y};
                this.invincibleTimer = new ig.Timer();
                this.makeInvincible();
                this.setupAnimation();
                this.zIndex = -99;
                //don't resort if in weltmeister
                if (!ig.global.wm)ig.game.sortEntitiesDeferred();

            },
            setupAnimation: function(offset){
                this.addAnim('idle', 0.07, [0]);
                this.addAnim('run', 0.05, [0,1,2,2,2,2,3,4]);
                this.addAnim('jump', (this.jumpTimeDefault/3), [5,6,7]);
                this.addAnim('fall', 0.04, [8,9]);
                this.addAnim('happyinair', 1, [7]);
            },
            makeInvincible: function(){
                this.invincible = true;
                this.invincibleTimer.reset();
            },
            kill: function(){
                ig.game.focusOnPlayer = false;
                this.parent();
                
                for( var i = 0; i < 100; i++){
                    ig.game.spawnEntity(EntityDeathParticle, this.pos.x, this.pos.y);
                }
                this.deathSFX.play();
                var chatbubbles = ig.game.getEntitiesByType( EntityChatBubble );
                for( var i = 0; i < chatbubbles.length; i++ ) {
                    console.log(chatbubbles[i]);
                    chatbubbles[i].kill();
                }
                this.onDeath();
            },
            receiveDamage: function(amount, from){
              //  if(this.invincible)
                   // return;

                   this.parent(amount, from);
            },
            onDeath: function(){
              ig.game.spawnEntity(EntityPlayer, ig.game.respawnPosition.x, ig.game.respawnPosition.y);



            },

            update: function(){

                this.friction = this.standing ? this.frictionGround : this.airFriction;

                var accel = this.standing ? this.accelGround : this.accelAir;



                if(this.standing && ig.input.pressed('jump')){
                    this.vel.y = -this.jump;
                    this.jumpTimer.set(this.jumpTimeDefault);
                    this.currentAnim = this.anims.jump;
                }

                if(!this.standing && ig.input.state('jump') && this.jumpTimer.delta() < 0){
                    this.vel.y = -this.jumpWhileInAir;

                }
                if(!this.standing && ig.input.released('jump') && this.jumpTimer.delta() < 0){
                    this.vel.y *= this.earlyReleaseFactor;
                    //this.vel.y = this.releaseFallConstant;

                }
                if( ig.input.state('left')) {
                   // this.footstep.play();
                   if(ig.input.pressed('left')){
                    this.vel.x = 0;                        
                }
                this.accel.x = -accel;
                this.flip = true;
            }
            else if( ig.input.state('right') ) {
                    // this.footstep.play();
                    if(ig.input.pressed('right')){

                        this.vel.x = 0;
                    }
                    this.accel.x = accel;
                    this.flip = false;
                }
                else {
                    this.vel.x = 0;
                    this.accel.x = 0;
                }
                if( this.gravityFactor == 0){
                    if( ig.input.state('up')) {
                        // this.footstep.play();
                        if(ig.input.pressed('up')){
                            this.vel.y = 0;
                        }
                        this.accel.y = -accel;
                        this.flip = true;
                    }else if( ig.input.state('down')) {
                        // this.footstep.play();
                        if(ig.input.pressed('down')){
                            this.vel.y = 0;
                        }
                        this.accel.y = accel;
                        this.flip = false;
                    }else if (this.gravityFactor == 0) {
                        this.vel.y = 0;
                        this.accel.y = 0;
                    }
                }


                if(!this.standing){

                    this.currentAnim = this.anims.happyinair;
                }else if( this.vel.x !== 0 ) {

                    this.currentAnim = this.anims.run;

                }else{

                    this.currentAnim = this.anims.idle;
                }
                this.currentAnim.flip.x = this.flip;

                if(this.flip){
                    this.offset = {x: 8, y: 5}
                }else{
                    this.offset = {x: 3, y: 5}
                }

                if( this.invincibleTimer.delta() > this.invincibleDelay ){
                    this.invincible = false;
                    this.currentAnim.alpha = 1;
                    ig.game.focusOnPlayer = true;
                }

                if( ig.input.state('fly1') && ig.input.state('fly2') && ig.input.pressed('fly3') ){
                    this.gravityFactor = this.gravityFactor == 1 ? 0 : 1
                }
                this.parent();


            }



        });
EntityDeathParticle = EntityParticle.extend({
    lifetime: 2,
    fadetime: 1,
    bounciness: .5,
    vel: {x: 200, y: 400},
    
    animSheet: new ig.AnimationSheet( 'media/BloodStuffs.png', 5, 5 ),

    init: function( x, y, settings ) {
        this.addAnim( 'idle', 5, [0,1,2,3,4,5] );        
        this.parent( x, y, settings );
        this.vel.x = (Math.random() * 2 -1) * this.vel.x;
        this.vel.y = (Math.random() * 2 -1) * this.vel.y;
    }
});


});
