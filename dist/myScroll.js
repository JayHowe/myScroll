class MyScroll{
	constructor(selector,options={}){
		this.eventQueue=[];
		// 处理默认参数
		function defaultValues(options,defaults){
			for(let name in defaults){
				if(typeof options[name] == 'undefined') {
					options[name]=defaults[name];
				}
			}
		}
		defaultValues(options,{
			bounce:true,
			bounceTime:600,
			scrollX:false,
			scrollY:true,
			freeScroll:false,
			startX:0,
			startY:0,
			directionLockThreshold:5
		});

		// 选出父级
		let aParent=Array.from(document.querySelectorAll(selector));
		aParent.forEach(parent=>{
			let children=parent.children[0];
			if(!children) return;
			// 加事件

			children.addEventListener('touchstart',start,false);
			children.addEventListener('touchmove',move,false);
			children.addEventListener('touchend',end,false);

			let startX=0,startY=0;
			let disX=0,disY=0;
			let translateX=options.startX,translateY=options.startY;

			let dir='';
			let _this=this;
			let firstMove;
			
			children.style.transform=`translateX(${translateX}px) translateY(${translateY}px)`;
			
			function start(ev){
				startX=ev.targetTouches[0].clientX;
				startY=ev.targetTouches[0].clientY;

				disX=startX-translateX;
				disY=startY-translateY;

				dir='';

				//有没有用户监听
				_this.eventQueue.forEach(json=>{
					if(json.type=='beforeScrollStart') {
						json.fn();
					}
				});

				firstMove=true;
			}
			function move(ev){
				if(firstMove) {
					firstMove=false;

					_this.eventQueue.forEach(json=>{
						if(json.type=='scrollStart') {
							json.fn();
						}
					});
				}

				if(!dir) {
					if(Math.abs(ev.targetTouches[0].clientX-startX)>=options.directionLockThreshold) {
						dir='x';
					}
					if(Math.abs(ev.targetTouches[0].clientY-startY)>=options.directionLockThreshold) {
						dir='y';
					}
				}else {
					//拖拽

					if(options.freeScroll || dir=='x') {
						translateX=ev.targetTouches[0].clientX-disX;
						
					}
					if(options.freeScroll || dir=='y') {
						translateY=ev.targetTouches[0].clientY-disY;
					}


					if(!options.bounce) {
						if(translateX >0 ) {
							translateX=0;
						}

						if(translateX < parent.offsetWidth-children.offsetWidth) {
							translateX=parent.offsetWidth-children.offsetWidth;
						}

						if(translateY >0 ) {
							translateY=0;
						}

						if(translateY < parent.offsetHeight-children.offsetHeight) {
							translateY=parent.offsetHeight-children.offsetHeight;
						}
					}
					
					_this.x=translateX;
					_this.y=translateY;


					_this.eventQueue.forEach(json=>{
						if(json.type=='scroll') {
							json.fn();
						}
					});

					children.style.transform=`translateX(${translateX}px) translateY(${translateY}px)`;

				}
			}
			function end(){
				if(translateX >0 ) {
					translateX=0;
				}

				if(translateX < parent.offsetWidth-children.offsetWidth) {
					translateX=parent.offsetWidth-children.offsetWidth;
				}

				if(translateY >0 ) {
					translateY=0;
				}

				if(translateY < parent.offsetHeight-children.offsetHeight) {
					translateY=parent.offsetHeight-children.offsetHeight;
				}

				children.style.transition=`all ${options.bounceTime}ms ease`;
				children.style.transform=`translateX(${translateX}px) translateY(${translateY}px)`;
				children.addEventListener('transitionend',tend,false);

				function tend(){
					children.style.transition='';
					children.removeEventListener('transitionend',tend,false);
				}

				_this.eventQueue.forEach(json=>{
					if(json.type=='scrollEnd') {
						json.fn();
					}
				});
			}
		});
	}

	on(name,fn) {
		this.eventQueue.push({type:name,fn});
	}
}