'use strict';
(function(){
	var i,
		select=document.getElementsByClassName('js-select'),
		option=document.getElementsByClassName('js-option');
	if(option.length!==select.length){
		return;
	}
	for(i=0;i<select.length;i++){
		select[i].addEventListener("click",switchObj,false);
	}

	function switchObj(){
		var element=this.nextElementSibling;
		if(element.style.opacity==="1"){
			element.style.opacity="0";
		}
		else{
			element.style.opacity="1.0";
		}
	}
}());