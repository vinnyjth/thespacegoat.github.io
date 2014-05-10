ig.module(
    'game.entities.respawn'
)
    .requires(
    'impact.entity'
)
    .defines(function(){

        EntityRespawn = ig.Entity.extend({
            animSheet: new ig.AnimationSheet( 'media/savepoint.png', 16, 16 ),


            size: {x: 16, y: 16},
            init: function(x, y, settings){
                this.addAnim( 'unactive', 1, [0] );
                this.addAnim( 'active', 1, [1] );
                this.parent(x, y, settings);
            },


            triggeredBy: function( entity, trigger ) {
                var player = ig.game.getEntitiesByType(EntityPlayer)[0];

                ig.game.respawnPosition = player.pos;
                console.log(ig.game.respawnPosition);
                this.currentAnim = this.anims.active;
            },

            update: function(){}
        });

    });