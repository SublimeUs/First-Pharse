"use strict";
function Square(parent,column,row){
	var _self=this;
	this.parent=parent;
	this.width=30;
	this.height=30;
	this.column=column||20;
	this.row=row||20;
	this.nodes=[];
	this.parent.style.width=this.width*this.column+"px";
	this.parent.style.height=this.height*this.row+"px";
	this.parent.style.border="1px solid #CCC";
	this.carX=1;
	this.carY=1;
	this.carTranslateX=0;
	this.carTranslateY=0;
	this.carHeadNum=0;
	this.direction=["RIG","BOT","LEF","TOP"];
	this.carHead=this.direction[this.carHeadNum];
	this.carRotate=0;
	this.state="static";
	//禁用右键
	this.parent.oncontextmenu=function(e){
		return false;
	}
	//创建格
	this.createNodes=function(){
		for(var i=0;i<this.row;i++){
			for(var j=0;j<this.column;j++){
				(function (nowI,nowJ) {
					var nodeElement=document.createElement("div");
					var nodeObj;
					nodeElement.className="node";
					nodeElement.style.width=_self.width+"px";
					nodeElement.style.height=_self.height+"px";
					if(nowI===0){
						createNumElement(nowJ+1,nodeElement,0,"-"+_self.height)
					}
					if(nowJ===0){
						createNumElement(nowI+1,nodeElement,"-"+_self.width,0)
					}
					//绑定点击事件快速移动
					nodeElement.addEventListener("click",function(){
						_self.carMove(nowJ+1,nowI+1);
					});
					nodeObj={
						x:nowJ+1,
						y:nowI+1,
						element:nodeElement,
						hasWall:false
					};
					_self.nodes.push(nodeObj);
					_self.parent.appendChild(nodeElement);

				}(i,j));
			}
		}
		//创建数字索引
		function createNumElement(content,parent,left,top){
			var numElement=document.createElement("div");
			numElement.className="numElement";
			numElement.style.left=left+"px";
			numElement.style.top=top+"px";
			numElement.style.lineHeight=_self.height+"px";
			numElement.innerText=content;
			parent.appendChild(numElement);
		}
	};
	//创建车
	this.createCar=function(){
		var carElement=document.createElement("div");
		var headElement=document.createElement("div");
		headElement.className="carHead";
		carElement.className="car";
		carElement.appendChild(headElement);
		carElement.style.width=this.width+"px";
		carElement.style.height=this.height+"px";
		this.parent.appendChild(carElement);
		this.car={
			x:1,
			y:1,
			element:carElement
		};
	};

	this.carMove=function(x,y){
		if(this.carCheck(x,y)){
			this.carChangeXY(x,y);
			this.refresh();
		}
		else{
			return;
		}
	};
	this.goOne=function(){
		if(this.carHead==="LEF"){
			this.carMove(this.carX-1,this.carY)
		}
		else if(this.carHead==="RIG"){
			this.carMove(this.carX+1,this.carY)
		}
		else if(this.carHead==="BOT"){
			this.carMove(this.carX,this.carY+1)
		}
		else if(this.carHead==="TOP"){
			this.carMove(this.carX,this.carY-1)
		}
		else{
			return;
		}
	};
	this.go=function(num){
		_self.state="moving";
		var i=0;
		var timer=setInterval(function(){
			if(i>=num){
				_self.state="static";
				clearInterval(timer);
				return;
			}
			else{
				_self.state="moving";
				_self.goOne();
				i++;
			}
		},480)
	};
	//移动时修改坐标
	this.carChangeXY=function(x,y){
		this.carX=x;
		this.carY=y;
		this.carTranslateX=(this.carX-1)*30;
		this.carTranslateY=(this.carY-1)*30;
	};

	this.carCheck=function(x,y){
		if(x<1||y<1||x>this.column||x>this.row){
			this.error("超出边界！")
			return false;
		}
		else if(_self.getNode(x,y).hasWall===true){
			this.error("你被墙了！");
			return false;
		}
		else{
			return true;
		}
	};
	//通过坐标获取子元素
	this.getNode=function(x,y){
		for(var i in _self.nodes){
			if(_self.nodes[i].x===x&&_self.nodes[i].y===y){
				return _self.nodes[i];
			}
		}
	};
	//定转向
	this.carHeadTurn=function(carDirection){
		var direction={
			"LEF":180,
			"RIG":0,
			"BOT":90,
			"TOP":270
		};
		if(direction[carDirection]==="undefind"){
			console.log("输入方向错误!");
			return;
		}
		else{
			this.carDirection=carDirection;
			this.carRotate=direction[carDirection];
			this.refresh();
		}
	};
	//方向不定转向
	this.carHeadTurnAlways=function(carDirection){
		var num;
		if(carDirection.match(/^LEF$/ig)){
			num=-1;
		}
		else if(carDirection.match(/^RIG$/ig)){
			num=1;
		}
		else if(carDirection.match(/^BAC$/ig)){
			num=2;
		}
		else{
			return;
		}
		this.carHeadNumChange(num);
		this.carRotate+=90*num;
		this.refresh();

	};
	//转向时刷新方向
	this.carHeadNumChange=function(num){
		if(num>2||num<-2){
			return;
		}
		else{
			var tmpNum=this.carHeadNum+num;
			if(tmpNum>3){
				tmpNum=tmpNum%4;
			}
			else if(tmpNum<0){
				tmpNum=4-Math.abs(tmpNum);
			}
			this.carHeadNum=tmpNum;
			this.carHead=this.direction[this.carHeadNum];
		}
	}
	this.refresh=function(){
		this.car.element.style.transform="translate("+this.carTranslateX+"px,"+this.carTranslateY+"px) rotate("+this.carRotate+"deg)";
	}
	this.tar=function(arg){
		var args=arg.split(",");
		var direction=args[0];
		var step=args[1];
	}
	this.goTo=function(arg){
		var str=[];
		var xy=arg.split(",");
		var xLen=xy[0]-_self.carX;
		var yLen=xy[1]-_self.carY;
		if(xLen>yLen){

		}


		this.action(str);


	}
	//指令系统
	this.action=function(str){
		//禁止多次点击
		if(this.timer){
			return;
		}
		var i=0;
		var command={
			turn:function(arg){
				_self.carHeadTurnAlways(arg);
			},
			go:function(arg){
				if(arg){
					_self.go(arg)
				}
				else{
					_self.goOne();
				}
			},
			turnHead:function(arg){
				_self.carHeadTurn(arg);
			},
			goto:function(arg){
				_self.goTo(arg);
			}
		};
		if(this.checkAction(str,command).length>0){
			console.log("输入指令错误!");
			return;
		}
		this.timer=setInterval(function(){
			if(_self.state==="moving"){
				return;
			}
			if(i>=str.length){
				clearInterval(_self.timer);
				_self.timer=null;
				return;
			}
			else{
				var arr=str[i].split(/\s/);
				var foo,arg;
				if(arr.length===2){
					arg=arr[1].toLowerCase();
				}
				else if(arr.length===1){
					arg=null;
				}
				else{
					this.error("输入指令错误！")
					return;
				}
				console.log(arr);
				foo=arr[0].toLowerCase();
				command[foo](arg);
				i++;
			}
			
		},500);
	}
	this.checkAction=function(str,obj){
		var errArr=[];
		for(var i in str){
			if(!obj[str[i].split(/\s/ig)[0]]){
				errArr.push(i);
			}
		}
		return errArr;
	}

	this.error=function(message){
		clearInterval(this.timer);
		this.setInterval=null;
		console.log(message);
	}





	this.createNodes();
	this.createCar();
}

var square=new Square(document.getElementById('wrap'));

document.getElementById("btn").addEventListener("click",function(){
	var str=document.getElementById('command').value;
	str=str.split(/\n/);
	square.action(str);
});