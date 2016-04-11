"use strict";

function Square(parent, column, row) {
	var _self = this;
	this.parent = parent;
	this.width = 30;
	this.height = 30;
	this.column = column || 20;
	this.row = row || 20;
	this.nodes = [];
	this.parent.style.width = this.width * this.column + "px";
	this.parent.style.height = this.height * this.row + "px";
	this.parent.style.border = "1px solid #CCC";
	this.parent.style.position = "relative";
	this.carX = 1;
	this.carY = 1;
	this.carHead = "RIG";
	this.direction = ["RIG", "BOT", "LEF", "TOP"];
	this.carRotate = 0;
	this.state = "static";
	//禁用右键
	this.parent.oncontextmenu = function(e) {
			return false;
		}
	//创建格
	this.createNodes = function() {
		for (var i = 0; i < this.row; i++) {
			for (var j = 0; j < this.column; j++) {
				(function(nowI, nowJ) {
					var nodeElement = document.createElement("div");
					var nodeObj;
					nodeElement.className = "node";
					nodeElement.style.width = _self.width + "px";
					nodeElement.style.height = _self.height + "px";
					if (nowI === 0) {
						createNumElement(nowJ + 1, nodeElement, 0, "-" + _self.height)
					}
					if (nowJ === 0) {
						createNumElement(nowI + 1, nodeElement, "-" + _self.width, 0)
					}
					//绑定点击事件快速移动
					nodeElement.addEventListener("click", function() {
						_self.carMove(nowJ + 1, nowI + 1);
					});
					nodeObj = {
						x: nowJ + 1,
						y: nowI + 1,
						element: nodeElement,
						hasWall: false
					};
					_self.nodes.push(nodeObj);
					_self.parent.appendChild(nodeElement);

				}(i, j));
			}
		}
		//创建数字索引
		function createNumElement(content, parent, left, top) {
			var numElement = document.createElement("div");
			numElement.className = "numElement";
			numElement.style.left = left + "px";
			numElement.style.top = top + "px";
			numElement.style.lineHeight = _self.height + "px";
			numElement.innerText = content;
			parent.appendChild(numElement);
		}
	};
	//创建车
	this.createCar = function() {
		var carElement = document.createElement("div");
		var headElement = document.createElement("div");
		headElement.className = "carHead";
		carElement.className = "car";
		carElement.appendChild(headElement);
		carElement.style.width = this.width + "px";
		carElement.style.height = this.height + "px";
		this.parent.appendChild(carElement);
		this.car = carElement;
	};
	this.carMove = function(x, y) {
		this.carX = x;
		this.carY = y;
		this.refresh();
	};
	this.go = function(num,direction) {
		var timer=null;
		if(direction&&direction !== _self.direction){
			this.turnTo(direction);
			setTimeout(start,500);
		}
		else{
			start();
		}
		function start(){
			goOne();
			if (!num) {
				return;
			} else {
				var count = 1;
				_self.state="moving";
				timer = setInterval(function() {
					if (count >= num) {
						_self.state = "static";
						clearInterval(timer);
						return;
					} else {
						_self.state = "moving";
						goOne();
						count++;
					}

				}, 500);
			}
		}
		function goOne() {
			var tmpX=_self.carX;
			var tmpY=_self.carY;
			if (_self.carHead === "LEF") {
				tmpX -= 1;
			} else if (_self.carHead === "RIG") {
				tmpX += 1;
			} else if (_self.carHead === "BOT") {
				tmpY += 1;
			} else if (_self.carHead === "TOP") {
				tmpY -= 1;
			} else {
				return;
			}
			if(tmpY<1||tmpY>_self.row||tmpX<1||tmpX>_self.column){
				console.log("out!");
				if(_self.timer){
					_self.state = "static";
					clearInterval(_self.timer);
					_self.timer=null;
				}
				if(timer){
					_self.state = "static";
					clearInterval(timer);
					timer=null;
				}
				return;
			}
			else{
				_self.carX=tmpX;
				_self.carY=tmpY;
				_self.refresh();
			}
			
		}


	}
	this.turnTo = function(direction) {
		if (direction === this.direction) {
			return;
		}
		var num = this.direction.indexOf(direction);
		if (num < 0) {
			console.log("参数错误！");
			return;
		} else {
			this.carRotate = num * 90;
			this.carHead = direction;
			this.refresh();
		}
	};
	this.turn = function(direction) {
		if(!direction){
			console.log("参数错误！")
			return;
		}
		if (direction.match(/LEF/ig)) {
			this.carRotate -= 90;
		} else if (direction.match(/RIG/ig)) {
			this.carRotate += 90;
		} else if (direction.match(/BAC/ig)) {
			this.carRotate += 90;
		} else {
			console.log("参数错误！");
			return;
		}
		var num = this.carRotate / 90;
		if (num >= 0) {
			num = num % 4;
		} else {
			num = (4 + (num % 4)) % 4;
		}
		this.carHead = this.direction[num];
		this.refresh();
	};
	//
	this.goTo=function(x,y){
		var xLen=x-this.carX;
		var yLen=y-this.carY;
		var command=[];
		var absX=Math.abs(xLen);
		var absY=Math.abs(yLen);
		console.log(x,y,xLen,yLen);
		if(xLen>0){
				_self.go(xLen,"RIG");
		}
		if(xLen<0){
				_self.go(absX,"LEF");
		}
		if(yLen>0){
			setTimeout(function(){
				_self.go(yLen,"BOT");
			},Math.abs(absX+1)*500);
		}
		if(yLen<0){
			setTimeout(function(){
				_self.go(absY,"TOP");
			},Math.abs(absX+1)*500);
		}
	}
	//指令系统
	this.action = function(command) {
		var count = 1;
		//命令错误或正在执行是跳出
		if (command.length < 1||_self.state==="moving") {
			return;
		} else {
			//先执行一次
			command[0]();
			//定时器，判断是否执行或是否执行到最后一个任务
			_self.timer = setInterval(function() {
				if (command.length === count) {
					_self.state="static";
					clearInterval(_self.timer);
					_self.timer = null;
					return;
				} else if (_self.state === "moving") {
					return;
				} else {
					_self.state="moving";
					command[count]();
					count++;
				}
			}, 500);
		}
	};


	//每次改变carX,carY,carRorate时刷新
	this.refresh = function() {
		this.car.style.transform = "translate(" + (this.carX - 1) * this.width + "px," + (this.carY - 1) * this.height + "px) rotate(" + this.carRotate + "deg)";
	};

	this.createNodes();
	this.createCar();
}

/*(function(){
	var line=document.getElementById("line");
	for(var i=0;i<10;i++){
		(function(index){
			var element=document.createElement("div");
			element.innerText=index+1;
			element.className="lineNum";
			line.appendChild(element);
		}(i));
	}
}());*/
var command=document.getElementById("command")
command.addEventListener("input",function(){
	var line=document.getElementById("line");
	var val=this.value;
	var lineNum=val.split(/\n/).length;
	line.innerHTML="";
	for(var i=0;i<lineNum;i++){
		(function(index){
			var element=document.createElement("div");
			element.innerText=index+1;
			element.className="lineNum";
			line.appendChild(element);
		}(i));
	}
});

command.addEventListener("scroll",function(e){
	var line=document.getElementById("line");
	line.style.transform="translateY(-"+e.target.scrollTop+"px)";
});




var square = new Square(document.getElementById('wrap'));

document.getElementById("btn").addEventListener("click", function() {
	var val=document.getElementById('command').value.split(/\n/);
	var command=[];
	for(var i in val){
		(function(index){
			var valArr=val[i].split(/\s/);
			var foo;
			foo=valArr[0];
			if(valArr.length===1){
				command.push(
					function(){
						square[foo]();
					}
				);
				
			}
			else if(valArr.length===2){
				command.push(
					function(){
						square[foo](valArr[1]);
					}
				);
			}
			else if(valArr.length===3){
				command.push(
					function(){
						square[foo](valArr[1],valArr[2]);
					}
				);
			}
			else{
				return;
			}
		}(i))
	}
	square.action(command);

});
