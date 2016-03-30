"use strict";
(function() {
	var box = document.getElementById('box');
	var boxNodes = [];
	var width = 30;
	var height = 30;
	//创建网格系统
	function Box(parent, x, y) {
		this.parent = parent || document.body;
		this.x = x;
		this.y = y;
		this.id = this.x + "-" + this.y;
		this.init();
		this.createWall();
	}


	//公用方法
	Box.prototype = {
			init: function() {
				var element = document.createElement("div");
				//Y轴索引
				if (this.x === 1) {
					var numX = document.createElement("span");
					numX.innerText = this.y;
					numX.style.position = "absolute";
					numX.style.left = "-" + this.width + "px";
					element.appendChild(numX);
				}
				//X轴索引
				if (this.y === 1) {
					var numY = document.createElement("span");
					numY.innerText = this.x;
					numY.style.position = "absolute";
					numY.style.top = "-" + this.height + "px";
					element.appendChild(numY);
				}

				element.id = "x" + this.x + "y" + this.y;
				element.className = "boxNodes";
				element.style.width = this.width + "px";
				element.style.height = this.height + "px";
				element.style.position = "relative";
				this.parent.appendChild(element);
				this.element = element;
			},
			createWall:function(){
				var that=this;
				this.element.addEventListener("mouseup",function(e){
					e.preventDefault();
					if(e.which===1){
						car.move(that.x,that.y);
					}
					else if(e.which===3){
						that.wall=true;
						that.element.className="boxNodes wall";
					}

				});
			},
			//默认宽高
			width: width,
			height: height
		};
		/*Box end*/


	function Car() {
		var that = this;
		this.x = 1;
		this.y = 1;
		this.directionNum = 1;
		//1right 2bottom 3left 4top
		this.width = width;
		this.height = height;
		this.deg = 0;
		this.translate = "translate(0,0)";
		this.rotate = "rotate(0deg)";
		this.status = "static";
		this.init = function() {
			var element = document.createElement('div');
			element.className = "car";
			element.style.width = this.width + "px";
			element.style.height = this.height + "px";
			box.appendChild(element);
			this.element = element;
		};
		this.move = function(x, y) {
				if (!this.check(x, y)) {
					window.console.log("check false");
					return;
				}
				this.x = x;
				this.y = y;
				this.translate = "translate(" + (x - 1) * width + "px," + (y - 1) * height + "px)";
				this.transform();
			};
			//检测是否有该网格或墙
		this.check = function(x, y) {
			var check = false;
			for (var key in boxNodes) {
				if (boxNodes[key].id === x + "-" + y&&!boxNodes[key].wall) {
					check = true;
				}
			}
			if(!check&&this.timer){
				clearInterval(that.timer);
				this.timer=null;
			}
			return check;
		};
		this.turn = function(direction) {
			if (direction === "right") {
				this.directionNum++;
				this.deg += 90;
				this.rotate = "rotate(" + this.deg + "deg)";
			} else if (direction === "left") {
				this.directionNum--;
				this.deg -= 90;
				this.rotate = "rotate(" + this.deg + "deg)";
			} else if (direction === "back") {
				this.directionNum += 2;
				this.deg += 180;
				this.rotate = "rotate(" + this.deg + "deg)";
			} else {
				return;
			}
			this.transform();
			this.checkDirectionNum();
		};
		this.numTurn = function(num) {
			if (this.directionNum !== num) {
				var len = num - this.directionNum;
				if (len == 1 || len == -3) {
					this.turn("right");
				} else if (len == -1 || len == 3) {
					this.turn("left");
				} else {
					this.turn("back");
				}
			} else {
				return;
			}

		};
		this.checkDirectionNum = function() {
			if (this.directionNum > 4) {
				this.directionNum = this.directionNum % 4;
			} else if (this.directionNum <= 0 && this.directionNum > -4) {
				this.directionNum = 4 - (parseInt(this.directionNum));
			} else if (this.directionNum <= -4) {
				this.directionNum = 4 - (parseInt(this.directionNum) % 4);
			}
		};
		this.go = function() {
			if (this.directionNum === 1) {
				this.move(this.x + 1, this.y);
			} else if (this.directionNum === 2) {
				this.move(this.x, this.y + 1);
			} else if (this.directionNum === 3) {
				this.move(this.x - 1, this.y);
			} else if (this.directionNum === 4) {
				this.move(this.x, this.y - 1);
			} else {
				return;
			}
		};
		this.goTo = function(x, y) {
			var xLen = x - this.x;
			var yLen = y - this.y;
			if(!this.check(x,y)){
				return;
			}
			if (this.timer || !x || !y) {
				return;
			}
			if (xLen > 0) {
				this.numTurn(1);
			} else if (xLen < 0) {
				this.numTurn(3);
			}
			this.status="move";
			this.timer = setInterval(function() {
				if (that.x == x) {
					clearInterval(that.timer);
					that.timer = null;
					if (yLen > 0) {
						that.numTurn(2);
					} else if (yLen < 0) {
						that.numTurn(4);
					}
					that.timer = setInterval(function() {
						if (that.y == y) {
							clearInterval(that.timer);
							that.timer = null;
							setTimeout(function(){
								that.status="static";
							},300);
						} else {
							that.go();
						}
					}, 500);

				} else {
					that.go();
				}
			}, 500);
		};
		this.findPath=function(x,y){
			var close=[];
			var path=[];
			var tmp=[];
			var tmpX=that.x;
			var tmpY=that.y;
			var min={x:tmpX,y:tmpY,len:len(tmpX,tmpY,x,y)};
			path.push({x:tmpX,y:tmpY});
			close.push({x:tmpX,y:tmpY});
			for(var i in boxNodes){
				if(boxNodes[i].wall){
					close.push({x:boxNodes[i].x,y:boxNodes[i].y});
				}
			}
			find(tmpX,tmpY,x,y);
			console.log(tmp);
			function find(x,y,targetX,targetY){
				var tmpArr=[];
				tmpArr.push({x:x+1,y:y,len:len(x+1,y,targetX,targetY)});
				tmpArr.push({x:x-1,y:y,len:len(x-1,y,targetX,targetY)});
				tmpArr.push({x:x,y:y+1,len:len(x,y+1,targetX,targetY)});
				tmpArr.push({x:x,y:y-1,len:len(x,y-1,targetX,targetY)});
				for(var i in tmpArr){
					if(!tmpArr[i].len&&tmpArr[i].len!=0){
						continue;
					}
					close.push(tmpArr[i]);
					if(min.len>tmpArr[i].len){
						min.len=tmpArr[i].len;
						min.x=tmpArr[i].x;
						min.y=tmpArr[i].y;
						tmpX=min.x;
						tmpY=min.y;
						path.push({x:min.x,y:min.y});
						if(min.len==0){
							return;
						}
						else{
							find(tmpX,tmpY,targetX,targetY);
						}
					}
				}

			}
			function len(x,y,targetX,targetY){
				for(var i in close){
					if(close[i].x==x&&close[i].y==y){
						return;
					}
				}
				if(x<=0||y<=0||x>20|y>20){
					return;
				}
				else{
					return Math.sqrt((targetX-x)*(targetX-x)+(targetY-y)*(targetY-y));
				}
			}

		};
		this.transform = function() {
			this.element.style.transform = this.translate + this.rotate;
		};

		this.init();
	}

	/*Car end*/

	var car = new Car();


	document.getElementById('btn').addEventListener("click", function() {
		var val = document.getElementById('input').value;
		if (val.match(/^turn/i)) {
			val = val.replace(/turn/i, "");
			val = val.replace(/\s*/, "");
			car.turn(val);
		} else if (val.match(/^go$/i)) {
			car.go();
		} else if (val.match(/^(goto){1}\s*\S+$/)) {
			val = val.replace(/(goto){1}/i, "");
			val = val.replace(/\s*/, "");
			var x = val.split(",")[0];
			var y = val.split(",")[1];
			car.goTo(x, y);
		} else if (val.match(/find/)){
			car.findPath(9,9);
		}
	});
	//屏蔽右键菜单
	document.addEventListener("contextmenu",function(e){
		e.preventDefault();
	});



	for (var i = 1; i <= 20; i++) {
		for (var j = 1; j <= 20; j++) {
			boxNodes.push(new Box(box, j, i));
		}
	}
}());