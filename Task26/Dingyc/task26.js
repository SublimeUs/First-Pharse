//新手不习惯写注释啊，不知道三十天后我还能不能看懂我的代码
var x=0;
function SpaceShip(){
	this.timer=null;
	this.time=30;
	this.r=80+Math.floor(170*Math.random());
	this.left=250-this.r;
	this.top=250;
	this.speed=5;
	this.perimeter=Math.PI*this.r*this.r;
	this.angleSpeed=(this.speed/this.perimeter)*360;
	this.angle=0;
	this.energy=100;
	this.init=function(){
		var spaceShip=document.createElement("div");
		spaceShip.className="spaceShip";
		document.getElementById('wrap').appendChild(spaceShip);
		this.move(spaceShip);
		return spaceShip;
	}
	this.move=function(obj){
		obj.style.left=this.left+"px";
		obj.style.top=this.top+"px";

	}
	this.element=this.init();

	this.start=function(){
		var that=this;
		
		this.timer=setInterval(function(){
			that.angle+=that.angleSpeed;
			that.left=250-Math.cos(that.angle)*that.r-25;
			that.top=250-Math.sin(that.angle)*that.r-10;
			that.move(that.element);
			that.energy-=0.5;
			if(that.energy<=0){
				that.element.innerText=that.energy+"%";
				that.stop();
			}
		},this.time);
	}
	this.stop=function(){
		var that=this;
		clearInterval(that.timer);
	}
	this.charge=function(){
		var that=this;
		setInterval(function(){
			if(that.energy>=100){
				that.energy=100;
			}
			else{
				that.energy+=5;
			}
		},1000)
	}
	this.distory=function(){
		this.element.parentNode.removeChild(this.element);
		this.btnWrap.parentNode.removeChild(this.btnWrap);
	}
	this.displayEnergy=function(){
		var that=this;
		setInterval(function(){
			that.element.innerText=that.energy+"%";
		},500);
	}
	this.createCaptain=function(){
		var btnWrap=document.createElement("div");
		var distoryBtn=document.createElement("button");
		var stopBtn=document.createElement("button");
		var startBtn=document.createElement("button");
		var that=this;
		distoryBtn.innerText="摧毁飞船";
		startBtn.innerText="启动飞船";
		stopBtn.innerText="停止飞船";
		distoryBtn.setAttribute("type","button");
		startBtn.setAttribute("type","button");
		stopBtn.setAttribute("type","button");
		distoryBtn.addEventListener("click",function(){
			that.distory();
		});
		stopBtn.addEventListener("click",function(){
			that.stop();
		});
		startBtn.addEventListener("click",function(){
			that.start();
		});
		btnWrap.appendChild(startBtn);
		btnWrap.appendChild(stopBtn);
		btnWrap.appendChild(distoryBtn);
		document.getElementById("caption").appendChild(btnWrap);
		return btnWrap;
	}
	this.btnWrap=this.createCaptain();
	this.charge();
	this.displayEnergy();

}

document.getElementById("add").addEventListener("click",function(){
	if(x>=4){
		return;
	}
	new SpaceShip;
	x++;
});
