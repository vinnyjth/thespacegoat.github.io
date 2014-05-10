ig.module(
	'game.entities.picture'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityPicture= ig.Entity.extend({
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.7)',
	text: '',

	collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.A,

	size: {x: 20, y: 20},


	init: function( x, y, settings ){
		this.parent( x, y, settings );
	},
	inFocus: function() {
    	return (
       		(this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
       		((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
       		(this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
       		((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
    	);
 	},	
	update: function() {
    if (ig.input.pressed('leftButton') && this.inFocus()) {
    		ig.game.openImage(this.url, this.player, this.width, this.height);
       	 	ig.log('clicked');
       	 	
    	}
	},
});

});