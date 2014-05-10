ig.module(
	'game.entities.spike'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntitySpike = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.7)',
	
	size: {x: 8, y: 8},
	damage: 10,
		
	triggeredBy: function( entity, trigger ) {	
		entity.receiveDamage(this.damage, this);
		console.log("Ouch!")
	},
	
	update: function(){}
});

});