ig.module(
	'game.entities.sign'
)
.requires(
	'impact.entity',
	'impact.font',
	'plugins.notification-manager'
)
.defines(function(){
	
EntitySign = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.7)',
	text: '',

	collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,

	size: {x: 20, y: 20},
	damage: 10,
	font: new ig.Font( 'media/04b03.font.black.png'),
	animSheet: new ig.AnimationSheet( 'media/LimboSign.png', 20, 20 ),
	drawText: false,
	playerIsOnSign: false,
	playerWasOffSign: true,
	chatbubble: null, 
	entityTouching: null,
	gravityFactor: 0,


	init: function( x, y, settings ){
		this.addAnim( 'idle', 1, [0] );
		this.parent( x, y, settings );
	},
	
	/* triggeredBy: function( entity, trigger ) {	
		font.draw( text, (this.x + 10), this.y);		
	}, **/

	check: function( other ){
		this.playerIsOnSign = true; 
		this.entityTouching = other;
		//this.drawText = true;
		/** ig.game.myNoteManager.spawnWordBalloon(this, this.font,
                                        this.text ,this.pos.x,this.pos.y,
                                        {vel: { x: 0, y: -30 },  alpha: 1, lifetime: .1, fadetime: .2 });
		*/

		
		//ig.game.myNoteManager.spawn(this.font, this.text, x, y, {vel: { x: 0, y: 0 },  alpha: 1, lifetime: 2.2, fadetime: 0.3 });
		
	},
	
	update: function(){
		this.currentAnim = this.anims.idle;
		if(this.playerIsOnSign && this.playerWasOffSign){
			this.chatbubble = ig.game.spawnEntity(EntityChatBubble, this.pos.x, this.pos.y, {

							// Pass in sign message to chat-bubble.
							msg: this.text,

							// Entity to follow.
							follow: this,
			});
		}

		if(this.playerIsOnSign){
			this.playerWasOffSign = false;
			if(!this.touches(this.entityTouching)){
				this.playerIsOnSign = false;
				this.playerWasOffSign = true;
				if(this.chatbubble){
					this.chatbubble.kill();
				}
			}
		}
		if(this.chatbubble && this.chatbubble.killed == true && this.playerIsOnSign == true){
			this.playerIsOnSign = false;
			this.playerWasOffSign = true;
		}

		this.parent();
	}
});

});