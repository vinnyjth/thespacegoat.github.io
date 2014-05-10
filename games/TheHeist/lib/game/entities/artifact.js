ig.module(
	'game.entities.artifact'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityArtifact = ig.Entity.extend({

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NONE,

	xSize: 1024,
	ySize: 720,

	text: null,

	id: null,

	walkedOn: false,

	chatbubble: null,

	createdBubble: false,
	

	animSheet: new ig.AnimationSheet( 'media/artifact.png', 16, 13),
	size: {x: 16, y: 13},
	
	init: function( x, y, settings){
		this.parent( x, y, settings);
		this.addAnim('idle', 1, [0]);
	},

	check: function( other ){
		if(ig.game.currentDate == this.id){
			ig.game.currentDate++;
		}
		this.parent();
	},
	update: function(){
		player = ig.game.getEntityByName('player');
		
		var distanceToPlayer = this.distanceTo(player);
		if(distanceToPlayer < 60){
			if(!this.createdBubble){
				console.log("ceate bubble");
				this.chatbubble = ig.game.spawnEntity(EntityChatBubble, this.pos.x, this.pos.y, {

				// Pass in sign message to chat-bubble.
					msg: this.text,

				// Entity to follow.
					follow: this,
				});
				this.createdBubble = true;
			}
			

		}else{
			if(this.createdBubble){
				this.chatbubble.kill();
				this.createdBubble = false;
			}
		}
		this.parent();
	}
});

});