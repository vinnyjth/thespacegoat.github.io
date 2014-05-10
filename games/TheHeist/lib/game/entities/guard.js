ig.module(
	'game.entities.guard'
)
.requires(
	'impact.entity',
	'plugins.camera',
	'impact.sound'
)
	.defines(function(){
		EntityGuard = ig.Entity.extend({
			animSheet: new ig.AnimationSheet( 'media/bitzenCop.png', 13, 19),
			size: {x: 11, y: 17},
			offset: {x: 1, y: 1},
			flip: false,
			yFlip: 0,
            xFlip: 0,

			maxVel: {x: 800, y: 800},
			friction: {x: 0, y: 0},
			accelGround: 30,


			footstep1: new ig.Sound( 'media/sounds/walk1.*'),
			footstep2: new ig.Sound( 'media/sounds/walk2.*'),

			health: 20,

            walkTimer: null,
            talkTimer: null, 

            isTalking: false,


			type: ig.Entity.TYPE.B,
			checkAgainst: ig.Entity.TYPE.A,
			collides: ig.Entity.COLLIDES.PASSIVE,

            random: true,
			startPosition: null,
            followingPlayer: false,

            possiblePhrases: [
                'Sir Francis Drake is my favorite pirate',
                'Anyone have a taco?',
                'Queen Elizabeth ruler her nation well',
                'I REALLY want a taco',
                'Patrolling is hard',
                'I feel like I am being watched',
                'What are these random chests for?',
                'I feel like having a taco',
                'Did you know that Chris wanted to find India',
                'Dr. Wood is teh coolest teacher ever!',
                'Anyone got any edjucation',
                'Give me my stinking taco'
                ],

			init: function( x, y, settings){
				this.parent( x, y, settings);

				this.invincibleTimer = new ig.Timer();
				this.makeInvincible();

                this.walkTimer = new ig.Timer();
                this.talkTimer = new ig.Timer();

                this.walkTimer.set(20);
                this.talkTimer = new ig.Timer();

                this.pathTimer = new ig.Timer(.5);

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

			},

            check: function( other ){
                if(other instanceof EntityPlayer){
                    other.kill();
                }
            },

            handleMovementTrace: function( res ){
                if(res.collision.y){
                    if(this.yFlip == 1){
                        this.yFlip = 2;
                    }else{
                        this.yFlip = 1;
                    }
                }

                if(res.collision.x){
                    this.flip = !this.flip;
                }

                this.parent( res );
            },

			onDeath: function(){
			},

			update: function(){

				var vel = this.accelGround;

                var player = ig.game.getEntityByName( 'player' );

                var distanceToPlayer = this.distanceTo(player);

                if(distanceToPlayer < 60){
                    this.vel.x = 0;
                    this.vel.y = 0;
                    this.followingPlayer = true;
                }

                if(this.followingPlayer){
                    if(this.pathTimer.delta() > 0){
                        this.getPath(player.pos.x, player.pos.y, false, [], []);
                    }

                    var dx = player.pos.x - this.pos.x;
                    var dy = player.pos.y - this.pos.y;

                    this.enemyLos = ig.game.collisionMap.traceLos(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, dx, dy, 4, 4, [], []);
                    if(this.enemyLos){
                        this.followingPlayer = false;
                    }
                    if(this.followingPlayer){
                        this.followPath(this.accelGround);                       
                    }

                }

                var talkChance = Math.floor(Math.random()*160);
                if(!this.isTalking){
                    if( talkChance == 1){
                        this.isTalking = true;
       
                        var phraseNumber = Math.floor(Math.random()* this.possiblePhrases.length);
                        phrase = this.possiblePhrases[phraseNumber];
        
                        this.talkTimer.set(10);
                        this.chatbubble = ig.game.spawnEntity(EntityChatBubble, this.pos.x, this.pos.y, {
                            
                            
                            msg: phrase,
                            follow: this,
                        });
                    }
                }else if(this.isTalking && this.talkTimer.delta() >= 0 && talkChance < 40){
                    this.isTalking = false;
                    this.chatbubble.kill();
                    this.talkTimer.reset();

                }


                // xFLip 1 = Left, xFlip 2 = right, yFlip 1 = Up, yFlip 2 = down
                if(this.random && !this.followingPlayer){
                    if(this.walkTimer.delta() >= 0){
                        var seed = Math.floor((Math.random()*4));
                        if(seed == 0){
                            this.yFlip = 2;
                        }else if(seed == 1){
                            this.yFlip = 1;
                        }else if(seed == 2){
                            this.yFlip = 0;
                            this.flip = true;
                        }else if(seed == 3){
                            this.yFlip = 0;
                            this.flip = false;
                        }
                        this.walkTimer.set(20);
                    }
                }
                this.currentAnim = this.anims.idle;
                if(!this.followingPlayer){
                    if(this.yFlip == 2){
                        this.vel.x = 0;
                        this.vel.y = -vel;
                    } else if(this.yFlip == 1){
                        this.vel.x = 0;
                        this.vel.y = vel;
                    } else if(this.flip){
                        this.vel.x = vel;
                        this.vel.y = 0;
                    } else {
                        this.vel.x = -vel;
                        this.vel.y = 0;
                    }
                }


                this.currentAnim.flip.x = this.flip;
                if(this.vel.y < 0 && this.vel.y != 0){
                	this.light.angle = 275;
                } else if(this.vel.y > 0 && this.vel.y != 0){
                	this.light.angle = 95;
                }
                else if(this.vel.x > 0) {
       		    	this.light.angle = 5;
    			} else {
        			this.light.angle = 185;
    			}

                this.parent();


			}


		});
	});