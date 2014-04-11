
//base class
function roboPanelBase(parent, duration){
	this.parent = parent;
	this.duration = duration;
	this.isAnimated = false;
}

function animObj(parent, direction, numPanels, borderWidth, borderRadius, roundness, shadowSize){
	//the vars parent, direction, and isAnimated can be stored in a base class
	// for all of these objects.
	roboPanelBase.call(this, parent);
	this.direction = direction;
	this.numPanels = numPanels;
	this.borderWidth = (borderWidth==undefined) ? 3 : borderWidth;
	this.borderRadius = (borderRadius==undefined) ? 3 : borderRadius;
	this.roundness = roundness;
	this.shadowSize = (shadowSize==undefined) ? 5: shadowSize;
	this.panels = [];

	this.reset = function(dur, sync){
		this.animatePanels(dur, 0, sync, true);
		this.isAnimated = false;
	};

	this.animatePanels = function(dur, i, sync, reset){
		
		var div;
		var	animVal;
		var setInitPosition = this.setInitPosition;
		var animatePanels = this.animatePanels;
		var panels = this.panels;
		var isAnimated = this.isAnimated;
		var thisObj = this;

		if(reset){
			var invI = this.panels.length-i-1;
			div = $(this.panels[invI]);
			if(sync){
				animVal = (this.dimVal*(-1)).toString()+"%";
			}
			else{
				animVal = (this.dimVal*(invI)).toString()+"%";
			}
		}
		else{
			div = $(this.panels[i]);
			animVal = (this.dimVal*i).toString()+"%";	
		} 
		
		switch(this.direction){
			case 'right':
				vals = {'right':animVal};
				break;
			case 'top':
				vals = {'top':animVal};
				break;
			case 'bottom':
				vals = {'bottom':animVal};
				break;
			default:
				vals = {'left':animVal};
				break;
		}

		div.animate(vals, dur);

		if(sync){
			if(i<(this.panels.length-1)){
				this.animatePanels(dur, i+1, sync, reset);
			}
			else this.isAnimated = true;
		}
		else{
			setTimeout(function(){
				setInitPosition.call(thisObj, i, animVal);
				if(i<(panels.length-1)){
					animatePanels.call(thisObj, dur, i+1, sync, false);
				}
				else isAnimated = true;
			}, dur);
		}

		return true;
	};

	this.setInitPosition = function(i, val){
		//should be a method of the animObj class
		var panels = this.panels;
		for(var j=i+1; j<panels.length; j++){
			var exp = "panels["+j+"].style."+this.direction+"= '"+val+"'";
			eval(exp);	
		}
	};

	this.getShadDir = function(){
	
		//var shadDir;
		switch(this.direction){
			case 'right':
				this.shadowDirection = '-'+this.shadowSize+'px 0px';
				break;
			case 'top':
				this.shadowDirection = '0px '+this.shadowSize+'px';
				break;
			case 'bottom':
				this.shadowDirection = '0px -'+this.shadowSize+'px';
				break;
			default:
				this.shadowDirection = this.shadowSize+'px 0px';
				break;
		}

		//return shadDir;
	}

	this.setBGStyle = function(){
		//what am I doing here?
		//you want some variations in background styling
		//this will be a styling of the divs backgound with some variation built in
		//make them look shiny and textured
		//this would make it possible to switch the styling of the divs between 
		// transitions
	};

	this.basicLinear = function(){

		var round = true;
		if(this.roundness==undefined){
			this.roundness = 0;
			round = false;
		}
		this.getShadDir();
		var dimVal = 100/this.numPanels;
		var vwr = document.getElementById('viewer');
		var parBrdWdth = Math.floor($(this.parent).css('border-width').replace('px', ''));
		var texNum;
		var lastTextNum;
		var lastLastTextNum
		var height;
		var width;
		var div;
		var exp;
		var gradValA;
		var gradValB;
		var divBG;
		
		this.parent.style.overflow = 'hidden';//this may cause problems if you need overflow for some reason
		if( !(this.parent.style.position.match('relative|absolute')) ) this.parent.style.position = 'relative';
		for(var i=0; i<this.numPanels; i++){
			while(texNum==lastTextNum || texNum==lastLastTextNum){
				texNum = returnRandNum(1,5);
			}
			lastLastTextNum = lastTextNum;
			lastTextNum = texNum;
			gradValA = returnRandNum(0, 25);
			gradValB = returnRandNum(50, 150);
			div = document.createElement('div');
			this.parent.appendChild(div);
			div.className = 'anim-panel';
			div.id = this.parent.id+'-panel-'+i;
			divBG = window.getComputedStyle(div).getPropertyValue('background-image');
			div.style.zIndex = (this.numPanels - i).toString();
			div.style.borderRadius = this.borderRadius+'px';
			div.style.backgroundColor = 'rgb(50,50,50)';
			div.style.backgroundImage = divBG+', url(images/metalTexture0'+texNum+'.jpg)';
			div.style.border = this.borderWidth+'px groove rgb(75,75,75)';
			div.style.position = 'absolute';
			div.style.boxShadow = this.shadowDirection+' 2px rgba(0,0,0,0.7)';

			if(this.direction==='left' || this.direction==='right'){
				height = (this.parent.offsetHeight - parBrdWdth*2 - this.borderWidth*2).toString()+'px';
				width = (this.parent.offsetWidth/this.numPanels-this.borderWidth+this.roundness)+'px';//dimVal.toString() + "%";
				if(this.direction==='right'){
					div.style.right = '-'+width;//.replace('px', '')+brdWdth+'px';
					div.style.borderRightWidth = '0px';
					if(round){
						div.style.borderTopLeftRadius = this.roundness+'px';
						div.style.borderBottomLeftRadius = this.roundness+'px';
						div.style.marginRight = ((-1)*this.roundness)+'px';
					}
				}
				else{
					div.style.left = '-'+width;//.replace('px', '')+brdWdth+'px';
					div.style.borderLeftWidth = '0px';
					if(round){
						div.style.borderTopRightRadius = this.roundness+'px';
						div.style.borderBottomRightRadius = this.roundness+'px';
						div.style.marginLeft = ((-1)*this.roundness)+'px';
					}
				}
				div.style.bottom = '0px';
			}
			else{
				height = (this.parent.offsetHeight/this.numPanels-this.borderWidth+this.roundness)+'px';//dimVal.toString() + "%";
				width = (this.parent.offsetWidth - parBrdWdth*2-this.borderWidth*2).toString()+'px';
				if(this.direction==='bottom'){
					div.style.bottom = '-'+height;//.replace('px', '')+brdWdth+'px';
					//div.style.borderBottomWidth = '0px';
					if(round){
						div.style.borderTopLeftRadius = this.roundness+'px';
						div.style.borderTopRightRadius = this.roundness+'px';
						div.style.marginBottom = ((-1)*this.roundness)+'px';
					}
				}
				else{
					div.style.top = '-'+height;//.replace('px', '')+brdWdth+'px';
					div.style.borderTopWidth = '0px';
					if(round){
						div.style.borderBottomLeftRadius = this.roundness+'px';
						div.style.borderBottomRightRadius = this.roundness+'px';
						div.style.marginTop = ((-1)*this.roundness)+'px';
					}
				}
			}

			div.style.height = height;
			div.style.width = width;

			this.panels.push(div);
			this.dimVal = 100/this.panels.length;
		}
	};

}

//objects for different types of layouts

function layout(parent, duration){
	//the base class for layouts
	roboPanelBase.call(this, parent, duration);
	this.staticPanels = new Object();
	this.animObjects = new Object();	
	//this.parBrdWdth = Math.floor( $(parent).css('border-width').replace('px', '') );

	this.init = function(){
		this.createStaticPanels();
		this.addAnimPanels();
		this.randomizeOrientation();
		this.animatePanels();
	}

	this.getNumPanels = function(low, high){
		var diff = high - low,
			randVal = Math.random()*diff,
			finalVal = low+Math.round(randVal);

		return finalVal;
	};

	this.randomizeOrientation = function(){

		var vals = [1,1];
		var flip;

		for(var i=0; i<2;i++){
			flip = flipCoin();
			if(flip){
				vals[i] = vals[i]*(-1);
			}
		}

		var mtrx = 'matrix('+vals[0]+',0,0,'+vals[1]+',0,0)';
		this.parent.style.transform = mtrx;
		this.parent.style.webkitTransform = mtrx;

		return mtrx;
	};	

}

function layoutA(parent, duration){

	layout.call(this, parent, duration);
	this.parBrdWdth = Math.floor( $(parent).css('border-width').replace('px', '') );
	
	this.createStaticPanels = function(){
		
		var panels = this.staticPanels;
		var panelHeight = (this.parent.offsetHeight/3-this.parBrdWdth*2/3)+'px';
		var thirdWidth = this.parent.offsetWidth/3;
		var parBrdWdth = $(this.parent).css('border-width').replace('px', '');
		parBrdWdth = Math.floor(parBrdWdth);//convert to number

		panels.topLeft = document.createElement('div'),
		panels.topRight = document.createElement('div'),
		panels.topRightUpr = document.createElement('div'),
		panels.topRightLwr = document.createElement('div'),
		panels.center = document.createElement('div'),
		panels.bot = document.createElement('div'),
		panels.botUpr = document.createElement('div'),
		panels.botLwr = document.createElement('div');

		for(var panel in panels){
			this.parent.appendChild(panels[panel]);
			panels[panel].style.position = 'relative';
			panels[panel].id = this.parent.id+'-'+panel;
			if(panel.search('(Up|Lw)r')==-1) panels[panel].style.height = panelHeight;
			else{
				panels[panel].style.height = '50%';
			}
		}
		panels.topRight.appendChild(panels.topRightUpr);
		panels.topRight.appendChild(panels.topRightLwr);
		panels.bot.appendChild(panels.botUpr);
		panels.bot.appendChild(panels.botLwr);

		panels.topLeft.style.display = 'inline-block';
		panels.topLeft.style.float = 'left';
		panels.topLeft.style.width = (thirdWidth-parBrdWdth)+'px';
		panels.topRight.style.display = 'inline-block';
		panels.topRight.style.float = 'right';
		panels.topRight.style.width = (thirdWidth*2-parBrdWdth-7)+'px';
		panels.center.style.clear = 'both';
		panels.center.style.border = '2px ridge rbg(75,75,75)';
		panels.bot.style.width = '100%';
		panels.bot.style.webkitTransform = 'matrix(1,-1,1.1,1.1,0,0)';
		panels.bot.style.transform = 'matrix(1,-1,1.1,1.1,0,0)';
		panels.botUpr.style.width = '100%';
		panels.botUpr.style.opacity = '0';
		panels.botLwr.style.width = '100%';

		return true;
	};

	this.addAnimPanels = function(){
		
		var panels = this.staticPanels;
		var anim = this.animObjects;
		var roundVal = this.getNumPanels(20, 100);
		var tlNum = this.getNumPanels(2, 5),
			ctrNum = this.getNumPanels(3, 5),
			truNum = this.getNumPanels(1, 2),
			trlNum = this.getNumPanels(1, 2),
			buNum = this.getNumPanels(2, 6),
			blsNum = this.getNumPanels(3, 7);

		anim.topLeft = new animObj(panels.topLeft, 'left', tlNum, 2, 3);
		anim.center = new animObj(panels.center, 'right', ctrNum, 3, 3, roundVal);
		anim.topRightUpr = new animObj(panels.topRightUpr, 'top', truNum, undefined, undefined, 10);
		anim.topRightLwr = new animObj(panels.topRightLwr, 'bottom', trlNum, undefined, undefined, 10);
		anim.botUpr = new animObj(panels.botUpr, 'top', buNum, 2);
		anim.botLwr = new animObj(panels.botLwr, 'bottom', 1);
		anim.topLeft.basicLinear();
		anim.center.basicLinear();
		anim.topRightUpr.basicLinear();
		anim.topRightLwr.basicLinear();
		anim.botUpr.basicLinear();
		anim.botLwr.basicLinear();

		//secondary panels
		var botLwrPanel = anim.botLwr.panels[0];
		anim.botLwrSec = new animObj(botLwrPanel, 'left', blsNum, 2, 3, 10);
		anim.botLwrSec.basicLinear();

		return true;
	}; 

	this.animatePanels = function(){

		var anim = this.animObjects;
		var panels = this.staticPanels;
		var dur = this.duration;

		if(this.isAnimated){
			anim.topRightUpr.reset(dur, true);
			anim.topRightLwr.reset(dur, true);
			anim.botUpr.reset(dur, true);
			anim.botLwr.reset(dur, true);	
			anim.botLwrSec.reset(dur, true);
			setTimeout(function(){
				anim.topLeft.reset(dur/3, true);
				anim.center.reset(dur/3, true);
				$(panels.botUpr).animate({'opacity':'0'}, 400);
				$(panels.topRightLwr).animate({'opacity':'0'}, 400);
			}, dur);
			this.isAnimated = false;
		}
		else{
			anim.topLeft.animatePanels(dur/3, 0, true);
			anim.center.animatePanels(dur*2/3/anim.center.panels.length, 0, false);
			setTimeout(function(){
				$(panels.topRightLwr).animate({'opacity':'1.0'}, 400);
				anim.topRightUpr.animatePanels(dur, 0, true);
				anim.topRightLwr.animatePanels(dur, 0, true);				
			}, dur/3);
			setTimeout(function(){
				$(panels.botUpr).animate({'opacity':'1.0'}, 400);
				anim.botUpr.animatePanels(dur, 0, true);
				anim.botLwr.animatePanels(dur, 0, true);
				anim.botLwrSec.animatePanels(dur/anim.botLwrSec.panels.length, 0, false);
			}, dur/2);
			this.isAnimated = true;
		}
	};
}

function horizontalLayoutA(parent, duration){

	layout.call(this, parent, duration);
	this.parBrdWdth = Math.floor( $(parent).css('border-width').replace('px', '') );

	this.createStaticPanels = function(){
		
		var panels = this.staticPanels;
		var widthVal = this.parent.offsetWidth/11;
		var parBrdWdth = $(this.parent).css('border-width').replace('px', '');
		parBrdWdth = Math.floor(parBrdWdth);//convert to number

		panels.left = document.createElement('div');
		panels.center = document.createElement('div');
		panels.right = document.createElement('div');

		for(var panel in panels){
			this.parent.appendChild(panels[panel]);
			panels[panel].id = this.parent.id+'-'+panel;
			panels[panel].style.position = 'relative';
			panels[panel].style.height = (this.parent.offsetHeight-2)+'px';
			panels[panel].style.display = 'inline-block';
			panels[panel].style.float = 'left';
			if(panel=='center')panels[panel].style.width = (widthVal*5-2)+'px';
			else panels[panel].style.width = (widthVal*3-2)+'px';
		}

		return true;
	};

	this.addAnimPanels = function(){
		
		var panels = this.staticPanels;
		var anim = this.animObjects;
		var lNum = this.getNumPanels(3, 6),
			ctrNum = this.getNumPanels(2, 3),
			rNum = this.getNumPanels(2, 4);

		anim.left = new animObj(panels.left, 'left', lNum, 2, 3, 40);
		anim.center = new animObj(panels.center, 'top', ctrNum, 3, 3, 10);
		anim.right = new animObj(panels.right, 'right', rNum, 2, 3);
		anim.left.basicLinear();
		anim.center.basicLinear();
		anim.right.basicLinear();

		return true;
	}; 

	this.animatePanels = function(){
		
		var anim = this.animObjects;
		var panels = this.staticPanels;
		var dur = this.duration;

		if(this.isAnimated){
			anim.left.reset(dur, true);
			anim.center.reset(dur, true);
			anim.right.reset(dur, true);
			this.isAnimated = false;
		}
		else{
			anim.left.animatePanels(dur*0.5/anim.left.panels.length, 0, false);
			anim.right.animatePanels(dur*0.9/anim.right.panels.length, 0, false);
			setTimeout(function(){
				anim.center.animatePanels(dur/2, 0, true);
			}, dur);
			this.isAnimated = true;
		}
	};	
}

function doorLayout(parent, duration){

	this.parent = parent;
	this.duration = duration;
	this.isAnimated = true;
	this.staticPanels = new Object();
	this.animObjects = new Object();

	this.init = function(){
		var tmpDur = this.duration;
		this.duration = 1;
		this.createStaticPanels();
		this.addAnimPanels();
		this.animatePanels();
		this.duration = tmpDur;
	}

	this.createStaticPanels = function(){
		
		var panels = this.staticPanels;
		var widthVal = this.parent.offsetWidth/2;
		var heightVal = this.parent.offsetHeight/2;
		var parBrdWdth = $(this.parent).css('border-width').replace('px', '');
		parBrdWdth = Math.floor(parBrdWdth);//convert to number

		panels.topLeft = document.createElement('div');
		panels.topRight = document.createElement('div');
		panels.botLeft = document.createElement('div');
		panels.botRight = document.createElement('div');

		for(var panel in panels){
			this.parent.appendChild(panels[panel]);
			panels[panel].id = this.parent.id+'-'+panel;
			panels[panel].style.position = 'relative';
			panels[panel].style.height = (heightVal-1)+'px';
			panels[panel].style.display = 'inline-block';
			panels[panel].style.float = 'left';
			panels[panel].style.width = (widthVal-1)+'px';
		}

		return true;
	};

	this.addAnimPanels = function(){
		
		var panels = this.staticPanels;
		var anim = this.animObjects;

		anim.topLeft = new animObj(panels.topLeft, 'top', 3, 2, 3);
		anim.topRight = new animObj(panels.topRight, 'right', 2, 2, 3);
		anim.botLeft = new animObj(panels.botLeft, 'left', 2, 2, 3)
		anim.botRight = new animObj(panels.botRight, 'bottom', 3, 2, 3);
		anim.topLeft.basicLinear();
		anim.topRight.basicLinear();
		anim.botLeft.basicLinear();
		anim.botRight.basicLinear();

		return true;
	}; 

	this.animatePanels = function(){
		
		var anim = this.animObjects;
		var panels = this.staticPanels;
		var dur = this.duration;
		var grandpa = this.parent.parentElement;

		if(this.isAnimated){
			anim.topLeft.reset(dur, true);
			anim.topRight.reset(dur, true);
			anim.botLeft.reset(dur, true);
			anim.botRight.reset(dur, true);
			setTimeout(function(){
				grandpa.style.width = '0px';
			}, dur);
			this.isAnimated = false;
		}
		else{
			grandpa.style.width = '59%';
			anim.topLeft.animatePanels(0.9*dur, 0, true);
			anim.topRight.animatePanels(0.75*dur/anim.topRight.panels.length, 0, false);
			anim.botLeft.animatePanels(0.65*dur/anim.botLeft.panels.length, 0, false);
			anim.botRight.animatePanels(dur, 0, true);
			this.isAnimated = true;
		}
	};
}