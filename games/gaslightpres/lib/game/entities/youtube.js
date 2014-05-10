ig.module(
	'game.entities.youtube'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityYoutube= ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.7)',
	text: '',

	collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,

	size: {x: 20, y: 20},
	animSheet: new ig.AnimationSheet( 'media/youtube.png', 20, 20 ),



	init: function( x, y, settings ){
		this.addAnim( 'idle', 1, [0] );
		this.parent( x, y, settings );
	},
	
	/* triggeredBy: function( entity, trigger ) {	
		font.draw( text, (this.x + 10), this.y);		
	}, **/

	check: function( other ){
		//this.drawText = true;
		if(!this.activated){
			ig.game.playVideo(this.url);
			this.activated = true	
		};

        
		//ig.game.myNoteManager.spawn(this.font, this.text, x, y, {vel: { x: 0, y: 0 },  alpha: 1, lifetime: 2.2, fadetime: 0.3 });
		
	},
	
	update: function(){
		this.currentAnim = this.anims.idle;
		this.parent();
	}
});

});