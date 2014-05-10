ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
    'game.levels.week1',
	'impact.font',
	'game.entities.player',
	'game.entities.guard',
	'game.entities.void',
    'game.entities.chat-bubble',
    'game.entities.artifact',
    'plugins.director',
    'plugins.lights',
    'plugins.astar-for-entities',
    'plugins.line-of-sight'
    //'impact.debug.debug',
	//'plugins.camera'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	focusOnPlayer: true,

	gravity: 0,

	lightManager: '',

	myLightWindow: null,

	drawDates: false,

	currentDate: 0,

	gameTimer: null,
	historyDates: ['Ming Dynasty (1369-1644)',
	 'Prince Henry the Navigator (1394-1460)', 
	 'Christopher Columbus (1451-1506)', 
	 'Vasco da Gama (c. 1460-1524)',
	 'Francisco Pizarro (1475-1541)', 
     'Ferdinand Magellan (1480-1521)', 
     'Ulrich Zwingli (1484-1531)',
     'Thomas Cromwell (1485-1540)', 
     'Hernan Cortes (1485-1547)', 
     'Montezuma',
	 'Menno Simons (1486-1561)',
	 'The Santa Maria, the Nina, the Pinta, October 12, 1492 ',
	 'Era of slave trade (1500s-1800s)', 
	 'Witchcraft hysteria (16th-17th centuries)', 
	 'Henry VIII (1509-1547)',
	 'John Calvin (1509-1564)',
	 '1st Portuguese contact with China (1514)',
	 'Council of Trent (1545-1563)', 
     'Bloody Mary (1553-1558)',
	 'Peace of Augsburg (1555)', 
	 'Elizabeth I (1558-1603)',
	 'French Wars of Religion (1562-1598)',
	 'Dutch Revolt (1566-1648)',
	 'Spanish Armada (1588)',  
     '1st permanent English settlement in America (Jamestown, Virginia, 1607)',
     '1st permanent French settlement in America (Quebec, Canada, 1608)',
     'Romanov Dynasty in Russia (1613-1917)',
     'Thirty Years War (1618-1648)',
     'English Civil War (1642-1646)',
     'Peace of Westphalia (1648)',
     'English Commonwealth (1649-1653)',
     'Thomas Hobbes Leviathan (1651)',
     'Age of Louis XIV (1661-1715)',
     'Glorious Revolution (1688-1689)',
     'English Bill of Rights (1689)',
     'Peter the Great (1689-1725)',
     'John Locke’s Two Treatises of Government (1689)',
     '1st English trading post in China (1699)',
     '7 Years War (1756-1763)',
     '1st successful slave uprising, Saint Dominique (1793)'],

	
	
	init: function() {
		// Initialize your game here; bind keys etc.
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right')
        ig.input.bind( ig.KEY.UP_ARROW, 'up');
        ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
        ig.input.bind( ig.KEY.SPACE, 'open');

        this.lightManager = new ig.LightManager();

        this.myLightWindow = new lightwindow();

        this.gameTimer = new ig.Timer();


        //this.camera = new Camera( ig.system.width/4, ig.system.height/3, 5 );
        //this.camera.trap.size.x = ig.system.width/10;
        //this.camera.trap.size.y = ig.system.height/3;
        //this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;

        //this.myDirector = new ig.Director(this, [LevelWeek1]);
        //this.myDirector.firstLevel();
        ig.game.loadLevel(LevelWeek1);
	},

	loadLevel: function( data ){
		this.parent( data );
		var levelinfo = this.getEntityByName( 'levelinfo' );
		this.respawnPosition = levelinfo.pos;

		this.player = this.getEntitiesByType( EntityPlayer )[0];

		
		//this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
        //this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

        //this.camera.set( this.player );
	},
	
	update: function() {
		// Update all entities and backgroundMaps

		var player = this.getEntitiesByType( EntityPlayer )[0];

        if( player && this.focusOnPlayer) { 
        	this.screen.x = player.pos.x - ig.system.width/ 2; 
        	this.screen.y = player.pos.y - ig.system.height/ 2;
       	}
        /** if( player && this.focusOnPlayer) {
        	console.log('following player');
            this.camera.follow( this.player );

        } */

        if(ig.input.state('open')){
        	this.drawDates = true;
        }else{
        	this.drawDates = false;
        }

        this.lightManager.update();

		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		console.log()
		this.lightManager.drawLightMap();
    	this.drawEntities();
    	this.lightManager.drawShadowMap();

		drawEntitiesAbove = new Array();

		drawEntitiesAbove.push(EntityChatBubble);
		this.font.letterSpacing = 1;
		this.reallyDraw(drawEntitiesAbove);
		// Add your own drawing code here
		if(this.drawDates){
			var j = this.font.height*2;
			firstPass = true;
			for(var i = this.currentDate; i < ig.system.height/this.font.height - (2*this.font.height) + this.currentDate; i++){
	
				if(firstPass && this.historyDates != undefined){
					this.font.draw( '--> ' + this.historyDates[i], ig.system.width/2, j, ig.Font.ALIGN.CENTER);
					firstPass = false;
				}else if(this.historyDates != undefined){
					this.font.draw( this.historyDates[i], ig.system.width/2, j, ig.Font.ALIGN.CENTER);
				}
				
				j = j + this.font.height;
			}
		}else{
			this.font.draw('Current object of value: ' + this.historyDates[this.currentDate] + ' : ' + Math.floor(this.gameTimer.delta()), ig.system.width/2, ig.system.height/8, ig.Font.ALIGN.CENTER);
		}


	},

	reallyDraw: function(entityTypes) {
    for (var i = 0; i < entityTypes.length; i++) {
                // Get all entities of this type.
        var entities = this.getEntitiesByType(entityTypes[i]);

                // Entities found.
        if (entities) {
                    // All entities.
            for (var j = 0; j < entities.length; j++) {
                            // Really draw them this time.
                entities[j].draw(true);
            }
    	}
    }
	},

    openBox: function(url, title, caption, x, y){
    	this.myLightWindow.activateWindow({
			href: url, 
			title: title, 
			caption: caption, 
			height: y,
			width: x,
		});
    }


});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 3 );

});
