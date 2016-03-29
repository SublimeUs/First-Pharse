//新手不习惯写注释啊，不知道三十天后我还能不能看懂我的代码
var x=0;
var message="";
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
	this.status="stop";
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
		if(this.status==="start"){
			addMessage("err:飞船已经启动！");
			return;
		}
		this.status="start";
		addMessage("启动飞船成功！");
		this.timer=setInterval(function(){
			that.angle+=that.angleSpeed;
			that.left=250-Math.cos(that.angle)*that.r-25;
			that.top=250-Math.sin(that.angle)*that.r-10;
			that.move(that.element);
			that.energy-=1;
			if(that.energy<=0){
				that.stop();
			}
		},this.time);
	}
	this.stop=function(){
		var that=this;
		if(this.status==="stop"){
			addMessage("err:飞船已经停止！");
			return;
		}
		this.status="stop";
		addMessage("停止飞船成功！");
		clearInterval(that.timer);
	}
	this.charge=function(){
		var that=this;
		setInterval(function(){
			if(that.energy>=100){
				that.energy=100;
			}
			else if(that.energy<100){
				that.energy+=1;
			}
			else{
				return;
			}
		},100)
	}
	this.distory=function(){
		addMessage("摧毁飞船成功！");
		this.element.parentNode.removeChild(this.element);
		this.btnWrap.parentNode.removeChild(this.btnWrap);
	}
	this.displayEnergy=function(){
		var that=this;
		setInterval(function(){
			that.element.innerText=that.energy+"%";
		},200);
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
		listen(distoryBtn,"click",function(){
			that.distory();
		});
		listen(stopBtn,"click",function(){
			that.stop();
		});
		listen(startBtn,"click",function(){
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

function listen(obj,type,foo){
	obj.addEventListener(type,function(){
		var i=parseInt(Math.random()*10);
		if(i<3){
			addMessage("操作失败!");
			return;
		}
		else{
			addMessage("操作成功!");
			setTimeout(function(){
				foo();
			},1000)
		}
	});
}


listen(document.getElementById("add"),"click",function(){
	if(x>=4){
		return;
	}
	new SpaceShip;
	x++;
});

function addMessage(mess){
	var date=new Date();
	message+=("<p>"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" "+mess+"</p>");
	document.getElementById('message').innerHTML=message;
}