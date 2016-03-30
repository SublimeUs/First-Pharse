"use strict";
var data=[
	{
		elementType:"select",
		label: 'Select',                                     
    valiator: "/^.{2,12}$",
    rules: '必选',
    success: '格式正确',
    fail: '格式不正确' ,
    value:"",
    nodes:[
	    {
	    		status:"node",
	  			elementType:"option",                              
	  	    value:"aaaaaa",
	  	    innerText:"aaaaaa"
	    },
	    {
	    		status:"node",
	  			elementType:"option",                              
	  	    value:"bbbbbb",
	  	    innerText:"bbbbbb"
	    },
	    {
	    		status:"node",
	  			elementType:"option",                              
	  	    value:"ccccccc",
	  	    innerText:"ccccccc"
	    }
    ]
	},
	{
		elementType:"input",
		label: 'Input',                   
    type: 'text',                   
    validator: "^.{2,12}$",
    rules: '必填，长度为2~12个字符',
    success: '格式正确',
    fail: '格式不正确' ,
    value:""
	},
	{
		elementType:"label",  
		label: 'Radio',                              
    rules: '必选',
    success: '格式正确',
    fail: '格式不正确' ,
    value:"",
    nodes:[
  	  {
  	  				elementType:"input",
  	  				type: 'radio',  
  	  				label: 'aaa',
  	  				name:"radio" ,                                
  	  		    success: '格式正确',
  	  		    fail: '格式不正确' ,
  	  		    value:"aaa"
  	  },
  	  {
  	  				elementType:"input",
  	  				type: 'radio',  
  	  				label: 'bbb',
  	  				name:"radio" ,                                
  	  		    success: '格式正确',
  	  		    fail: '格式不正确' ,
  	  		    value:"bbb"
  	  },
  	  {
  	  				elementType:"input",
  	  				type: 'radio',  
  	  				label: 'ccc',
  	  				name:"radio" ,                                
  	  		    success: '格式正确',
  	  		    fail: '格式不正确' ,
  	  		    value:"ccc"
  	  }
    ]
	},
	{
		elementType:"input",
		label: 'Password',                   
    type: 'password',                   
    validator: "^.{2,12}$",
    rules: '必填，长度为2~12个字符',
    success: '格式正确',
    fail: '格式不正确' ,
    value:""
	},
	{
		label: 'Button',
		elementType:"button",                   
    type: 'button',                   
    value:"提交",
    innerText:"提交"
	}
];


function Form(data,parent){
	this.data=data;
	this.parent=parent||document.body;
	this.build();
	this.check();
	
}
Form.prototype = {
	init:function(data){
		var wrap=document.createElement("div");
		var element=document.createElement(data.elementType);
		var message=document.createElement("p");
		var label=document.createElement("label");
		if(data.type){
			element.setAttribute("type",data.type);
		}
		if(data.value){
			element.setAttribute("value",data.value);
		}
		if(data.innerText){
			element.innerText=data.innerText;
		}
		if(data.label){
			label.innerText=data.label+": ";
		}
		if(data.name){
			element.setAttribute("name",data.name);
		}
		if(!data.status){
			
			wrap.appendChild(label);
			wrap.appendChild(element);
			if(data.rules){
				message.innerText=data.rules;
				wrap.appendChild(message);

			}
			this.parent.appendChild(wrap);
			this.message=message;
		}
		
		else if(data.status==="node"){
			this.parent.appendChild(element);
		}
		this.element=element;
	},
	build:function(){
		if(this.data instanceof Object){
			this.init(this.data);
			var that=this;
			if(this.data.nodes){
				if(!this.data.nodes.length){
					new Form(this.data.nodes,this.element);
				}
				else{
					for(var i=0;i<this.data.nodes.length;i++){
						(function(num){
							new Form(that.data.nodes[num],that.element);
						}(i));
					}
				}
			}
		}
		else{
			return;
		}
	},
	check:function(){
		var that=this;
		if(this.data.validator){
			this.element.addEventListener("change",function(){
				if(that.element.value.match(that.data.validator)){
					that.message.innerText=that.data.success;
				}
				else{
					if(!that.element.value){
						that.message.innerText=that.data.rules;
					}
					else{
						that.message.innerText=that.data.fail;
					}
				}
			});
		}
		else{
			return;
		}
	}
}


//遍历数据
if(!data.length){
	new Form(data,document.getElementById('form'));
}
else{
	for(var i=0;i<data.length;i++){
		(function(index){
			new Form(data[index],document.getElementById('form'))
		}(i));
	}
}