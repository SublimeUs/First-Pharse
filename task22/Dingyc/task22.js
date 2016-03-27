var time=500;
(function(){
	var box=document.getElementById('box');
	init(box,3);
	DLR(box);


}())
function init(obj,len){
	var count=len;
	if(count>=0){
		count--;
		for(var i=0;i<2;i++){
			(function(){
				var oDiv=document.createElement("div");
				oDiv.className="child";
				obj.appendChild(oDiv);
				init(oDiv,count);
			}())
			
		}

	}
	else{
		return;
	}
}

