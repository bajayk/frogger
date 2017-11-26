function Wave(stage){
    this.stage = stage;
    this.waves = [];
    this.container = new createjs.Container();
    this.container.addChild(this.createAWave());
    
}

Wave.prototype = {
    createAWave:function(){
        var waveContainer = new createjs.Container();
        for(var i=0; i<3; i++){
            var j = i+1;
            var awave = new AWave(this.stage);            
            awave.y = i * 25;
            awave.fromY = awave.y;
            awave.toY = awave.y + (i*5 + 25);
            awave.alpha = 0.1;
            this.waves.push(awave);
            
            waveContainer.addChild(awave);
        }
        return waveContainer;
    },
    animateWaves: function(){
        //console.log("calling wave");
        for(var i=0; i<this.waves.length; i++){
        var awave = this.waves[i];
        
//        createjs.Tween.get(awave).wait(i*80).to({alpha:0.5,y:awave.toY},1000).call(function(){
//                createjs.Tween.get(this).to({alpha:0.1, y:this.fromY}, 2000);
//            });
            
            createjs.Tween.get(awave).wait(i*80).to({alpha:0.3},500).call(function(){
                createjs.Tween.get(this).to({alpha:0.1}, 1000);
            });
        }
    }
    
}

function AWave(stage){
    var awave = new createjs.Bitmap("assets/awave.png");
    awave.alpha = 0.7;
    return awave;
}

