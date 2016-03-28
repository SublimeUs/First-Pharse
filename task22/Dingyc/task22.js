"use strict";
(function() {
	var box = document.getElementById('box');
	init(box, 3);
	check(box);
}());

function init(obj, len) {
	var count = len;
	if (count >= 0) {
		count--;
		for (var i = 0; i < 2; i++) {
			(function() {
				var oDiv = document.createElement("div");
				oDiv.className = "child";
				obj.appendChild(oDiv);
				init(oDiv, count);
			}());

		}

	} else {
		return;
	}
}

function check(obj) {
	if (!obj.length) {
		toggleClass(obj, "check");
		if (obj.childNodes && obj.childNodes.length > 0) {
			check(obj.childNodes);
		}
	} else if (obj.length > 1) {
		for (var i = 0; i < obj.length; i++) {
			(function(num) {
				check(obj[num]);
			}(i));
		}
	} else {
		return;
	}


}

function toggleClass(obj, newClassName) {
	var className = obj.className;
	if (className.indexOf(newClassName) >= 0) {
		obj.className = className.replace(newClassName, "");
	} else {
		obj.className = className + " " + newClassName;
	}
}