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
		this.wall = false;
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
		createWall: function() {
			var that = this;
			this.element.addEventListener("mouseup", function(e) {
				e.preventDefault();
				if (e.which === 1) {
					car.move(that.x, that.y);
				} else if (e.which === 3) {
					if (!that.wall) {
						that.wall = true;
						that.element.className = "boxNodes wall";
					} else {
						that.wall = false;
						that.element.className = "boxNodes";
					}
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
		this.nextX = this.x + 1;
		this.nextY = this.y;
		this.directionNum = 1;
		//1right 2bottom 3left 4top
		this.width = width;
		this.height = height;
		this.deg = 0;
		this.translate = "translate(0,0)";
		this.rotate = "rotate(0deg)";
		this.status = "static";
		this.count = 0;
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
			this.next();
			this.translate = "translate(" + (x - 1) * width + "px," + (y - 1) * height + "px)";
			this.transform();
		};
		//检测是否有该网格或墙
		this.check = function(x, y) {
			var check = false;
			for (var key in boxNodes) {
				if (boxNodes[key].id === x + "-" + y && !boxNodes[key].wall) {
					check = true;
				}
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
			this.next();
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
		//校准方向数字
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
			this.move(this.nextX, this.nextY);
		};
		//预判下次位置
		this.next = function() {
			if (this.directionNum === 1) {
				this.nextX = this.x + 1;
				this.nextY = this.y;
			} else if (this.directionNum === 2) {
				this.nextX = this.x;
				this.nextY = this.y + 1;
			} else if (this.directionNum === 3) {
				this.nextX = this.x - 1;
				this.nextY = this.y;
			} else if (this.directionNum === 4) {
				this.nextX = this.x;
				this.nextY = this.y - 1;
			} else {
				return;
			}
		};
		this.goTo = function(x, y) {
			var xLen = x - this.x;
			var yLen = y - this.y;
			turn(xLen, yLen);
			this.status = "move";
			if (xLen === 0 && yLen === 0) {
				return;
			} else {
				setTimeout(function() {
					that.go();
					that.goTo(x, y);
				}, 500);
			}

			function turn(xL, yL) {
				if (xL !== 0) {
					if (xL > 0) {
						that.numTurn(1);
					} else {
						that.numTurn(3);
					}
				} else if (yL !== 0) {
					if (yL > 0) {
						that.numTurn(2);
					} else {
						that.numTurn(4);
					}
				} else {
					return;
				}
			}
		};
		this.findPath = function(x, y) {
			var close = [];
			var path = [];
			var tmpX = that.x;
			var tmpY = that.y;
			var min = {
				x: tmpX,
				y: tmpY,
				len: len(tmpX, tmpY, x, y)
			};
			close.push({
				x: tmpX,
				y: tmpY
			});
			for (var i in boxNodes) {
				if (boxNodes[i].wall) {
					close.push({
						x: boxNodes[i].x,
						y: boxNodes[i].y
					});
				}
			}
			find(tmpX, tmpY, x, y);
			this.goPath(path);

			function find(x, y, targetX, targetY) {
				var tmpArr = [];
				tmpArr.push({
					x: x + 1,
					y: y,
					len: len(x + 1, y, targetX, targetY)
				});
				tmpArr.push({
					x: x - 1,
					y: y,
					len: len(x - 1, y, targetX, targetY)
				});
				tmpArr.push({
					x: x,
					y: y + 1,
					len: len(x, y + 1, targetX, targetY)
				});
				tmpArr.push({
					x: x,
					y: y - 1,
					len: len(x, y - 1, targetX, targetY)
				});
				for (var i in tmpArr) {
					if (!tmpArr[i].len && tmpArr[i].len !== 0) {
						continue;
					}
					close.push(tmpArr[i]);
					if (min.len > tmpArr[i].len) {
						min.len = tmpArr[i].len;
						min.x = tmpArr[i].x;
						min.y = tmpArr[i].y;
						tmpX = min.x;
						tmpY = min.y;
						path.push({
							x: min.x,
							y: min.y
						});
						if (min.len === 0) {
							return;
						} else {
							find(tmpX, tmpY, targetX, targetY);
						}
					}
				}

			}

			function len(x, y, targetX, targetY) {
				for (var i in close) {
					if (close[i].x == x && close[i].y == y) {
						return;
					}
				}
				if (x <= 0 || y <= 0 || x > 20 | y > 20) {
					return;
				} else {
					return Math.sqrt((targetX - x) * (targetX - x) + (targetY - y) * (targetY - y));
				}
			}

		};
		this.goPath = function(path) {
			if (that.count >= path.length) {
				that.count = 0;
				return;
			} else {
				setTimeout(function() {
					that.goTo(path[that.count].x, path[that.count].y);
					that.count++;
					that.goPath(path);
				}, 500);
			}
		};
		this.color = function(color) {
			var check = false;
			for (var i in boxNodes) {
				if (this.nextX === boxNodes[i].x && this.nextY === boxNodes[i].y && boxNodes[i].wall) {
					boxNodes[i].element.style.backgroundColor = color;
					check = true;
				} else {
					continue;
				}
			}
			if (!check) {
				window.console.log("error");
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
		} else if (val.match(/^(goto)\s*\S+$/)) {
			val = val.replace(/goto/i, "");
			val = val.replace(/\s*/, "");
			var x = val.split(",")[0];
			var y = val.split(",")[1];
			car.findPath(x, y);
		} else if (val.match(/^color/i)) {
			val = val.replace(/color/i, "");
			val = val.replace(/\s/, "");
			car.color(val);
		}
	});

	document.getElementById("left").addEventListener("click", function() {
		car.turn("left");
	});


	document.getElementById("right").addEventListener("click", function() {
		car.turn("right");
	});


	document.getElementById("back").addEventListener("click", function() {
		car.turn("back");
	});


	document.getElementById("color").addEventListener("click", function() {
		var color = ["#DC143C", "#DA70D6", "#7B68EE", "#6495ED", "#B0C4DE", "#F5FFFA", "#FAFAD2", "#FFD700", "#FFE4B5", "#F4A460", "#CD5C5C"];
		car.color(color[Math.ceil(Math.random() * color.length)]);
	});


	document.getElementById("go").addEventListener("click", function() {
		car.go();
	});
	document.getElementById("randomWall").addEventListener("click", function() {
		for (var i in boxNodes) {
			if ((!boxNodes[i].wall)&&boxNodes[i].x!==car.x||boxNodes[i].y!==car.y) {
				if (Math.ceil(Math.random() * 100) < 5) {
					boxNodes[i].wall = true;
					boxNodes[i].element.className = "boxNodes wall";
				}
			}
		}
	});
	document.getElementById("clearWall").addEventListener("click", function() {
		for (var i in boxNodes) {
			if (boxNodes[i].wall) {
				boxNodes[i].wall = false;
				boxNodes[i].element.className = "boxNodes";
			}
		}
	});



	//屏蔽右键菜单
	document.addEventListener("contextmenu", function(e) {
		e.preventDefault();
	});



	for (var i = 1; i <= 20; i++) {
		for (var j = 1; j <= 20; j++) {
			boxNodes.push(new Box(box, j, i));
		}
	}
}());