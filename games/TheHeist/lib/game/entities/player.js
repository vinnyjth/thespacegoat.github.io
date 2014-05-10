ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'plugins.camera',
	'impact.sound'
)
	.defines(function(){
		EntityPlayer = ig.Entity.extend({
			animSheet: new ig.AnimationSheet( 'media/bitzenRobber.png', 13, 19),
			size: {x: 11, y: 17},
			offset: {x: 1, y: 1},
			flip: false,
			yFlip: 0,

			maxVel: {x: 800, y: 800},
			friction: {x: 0, y: 0},
			accelGround: 100,


			footstep1: new ig.Sound( 'media/sounds/walk1.*'),
			footstep2: new ig.Sound( 'media/sounds/walk2.*'),

			health: 20,

			type: ig.Entity.TYPE.A,
			checkAgainst: ig.Entity.TYPE.NONE,
			collides: ig.Entity.COLLIDES.PASSIVE,

			name: 'player',

            leftSound: true,
            soundTimer: null,
            soundTime: .15,

			startPosition: null,

			init: function( x, y, settings){
				this.parent( x, y, settings);

                this.soundTimer = new ig.Timer();
                this.soundTimer.set(this.soundTime);
				this.invincibleTimer = new ig.Timer();
				this.makeInvincible();

				this.startPosition = {x: x, y: y};

				this.addAnim('idle', 1, [0]);
				console.log("init");
                if (!ig.global.wm){
				this.light = ig.game.lightManager.addLight(this, {
            		angle: 5,   
            		angleSpread: 80,   
            		radius: 120,         
            		color:'rgba(255,255,255,0.1)',  // there is an extra shadowColor option
            		useGradients: true, // false will use color/ shadowColor
            		shadowGradientStart: 'rgba(0,0,0,0.1)',         // 2-stop radial gradient at 0.0 and 1.0
            		shadowGradientStop: 'rgba(0,0,0,0.1)',
            		lightGradientStart: 'rgba(255,255,100,0.1)',    // 2-stop radial gradient at 0.0 and 1.0
            		lightGradientStop: 'rgba(0,0,0,0.6)',
            		pulseFactor: 5,
            		lightOffset: {x:0,y:0}      // lightsource offset from the middle of the entity
        		});
                }


			},

			makeInvincible: function(){
				this.invincible = true;
				this.invincibleTimer.reset();
			},

			kill: function(){
				ig.game.lightManager.removeLight(this.light);
				this.parent();

				this.onDeath();
			},

			onDeath: function(){
				ig.game.spawnEntity(EntityPlayer, ig.game.respawnPosition.x, ig.game.respawnPosition.y)	
			},

			update: function(){

				var vel = this.accelGround;

				if( ig.input.state('left')) {
                    if(ig.input.pressed('left')){
                        this.vel.x = 0;
                        this.vel.y = 0;
                    }
                    this.vel.x = -vel;
                    this.flip = false;
                    this.yFlip = 0;
                }
                else if( ig.input.state('right') ) {
                    if(ig.input.pressed('right')){
                        
                        this.vel.x = 0;
                        this.vel.y = 0;
                    }
                    this.vel.x = vel;
                    this.flip = true;
                    this.yFlip = 0;
                }
                else if( ig.input.state('up') ) {
                    if(ig.input.pressed('up')){
                        
                        this.vel.x = 0;
                        this.vel.y = 0;                        
                    }
                    this.yFlip = 1;
                    this.vel.y = -vel;
                }
                else if( ig.input.state('down') ) {
                    if(ig.input.pressed('down')){
                        this.vel.x = 0;                        
                        this.vel.y = 0;
                    }
                    this.yFlip = 2;
                    this.vel.y = vel;
                }else{
                	this.vel.x = 0;
                	this.vel.y = 0;
                }

                this.currentAnim = this.anims.idle;

                this.currentAnim.flip.x = this.flip;
                if(this.yFlip == 2){
                	this.light.angle = 95;
                } else if(this.yFlip == 1){
                	this.light.angle = 275;
                }
                else if(!this.flip) {
       		    	this.light.angle = 185;
    			} else {
        			this.light.angle = 5;
    			}

                if(this.soundTimer.delta() >= 0 && (this.vel.x != 0 || this.vel.y != 0)){
                    this.soundTimer.set(this.soundTime);
                    if(this.leftSound){
                        this.footstep1.play();
                        this.leftSound = false;
                    }else{
                        this.footstep2.play();
                        this.leftSound = true;
                    }

                }
                

                this.parent();


			}


		});
	});