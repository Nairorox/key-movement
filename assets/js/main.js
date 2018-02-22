/*
	Designed and Coded by Damian Nowakowski (Nairorox)
	https://github.com/Nairorox
	face: https://www.pexels.com/photo/adult-business-businessman-close-up-428339/
*/

const body = document.querySelector('body');
const wrapper = document.querySelector('.wrapper');
const pages = document.querySelectorAll('.page');
const mainPage = document.querySelector('.page__main');
const mainPagePhoto = mainPage.querySelector('.photo__me');
//voice recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US'
recognition.interimResults = true;

const msg = new SpeechSynthesisUtterance();

recognition.addEventListener('result', e =>{
	const arr = Array.from(e.results).map(arr => arr[0]).map(speechRec => speechRec.transcript).join(' ').toLowerCase().split(' ')
	console.log(arr);
	let executeVoiceCommand = true;
		if(arr.indexOf('up')!== -1 || arr.indexOf('app') !== -1 || arr.indexOf('top')!== -1){
			movement.top();
		}
		else if(arr.indexOf('down')!== -1 || arr.indexOf('dumb')!== -1 || arr.indexOf('done') !== -1  || arr.indexOf("don't")!== -1){
			movement.bottom();
		}
		else if(arr.indexOf('left')!== -1){
			movement.left();
		}
		else if(arr.indexOf('right')!== -1){
			movement.right();
		}
		else if(arr.indexOf('metal') !== -1){
			movement.curSite.style.backgroundColor = "#010101";
	}
	else if(arr.indexOf('standard')!== -1){
			movement.curSite.style.backgroundColor = "#212121";
			mainPagePhoto.style.backgroundImage = "url('face.jpeg')";
			mainPagePhoto.style.animation = "";
			mainPagePhoto.style.width = "20vw";
			mainPagePhoto.style.height = "20vw";
	}

	else if(arr.indexOf('time')!== -1){
		const time = new Date();
		const hours = time.getHours();
		const minutes = time.getMinutes();
		msg.text = `${hours}:${minutes}`
		speechSynthesis.speak(msg);
	}

	else{
		executeVoiceCommand = false;
	}

	if(executeVoiceCommand){
		recognition.abort();
		return;
	}
})
recognition.addEventListener('end', recognition.start);

recognition.start();

//end of recognition
//init siteMap has to be updated on change
const movement = {
	ready: true,
	curX: 1,
	curY: 2,
	siteMap:[	// 1 represents field for page
	[false, 1, false],
	[false,1,false],
	[1,1,1],
	[false,1,false]
	],
	left(){
		if(this.siteMap[this.curY][this.curX-1]){
			this.curX -= 1;
			this.update();
		}
	},
	right(){
		if(this.siteMap[this.curY][this.curX+1]){
			this.curX += 1;
			this.update();
		}
	},
	top(){
	if(this.siteMap[this.curY-1]){
		if(this.siteMap[this.curY-1][this.curX]){
			this.curY -= 1;
			this.update();
		}
	}
	},
	bottom(){
		if(this.siteMap[this.curY+1]){
			if(this.siteMap[this.curY+1][this.curX]){
				this.curY += 1;
				this.update();
			}
		}
	},
 setSiteMap(){
	let sites = Array.from(pages);
	let i=0;
	this.siteMap.forEach(row =>{
		let j=0;
		row.forEach(item =>{
			if(item === 1){
				this.siteMap[i][j] = sites.shift();
				if(this.siteMap[i][j] == mainPage){
					this.mainPageYpos = i;
					this.mainPageXpos = j;
				}
			}
			j++;
		})
		i++;
	})
	this.curSite = this.siteMap[this.curY][this.curX]
},
transitions(){
			if(this.curSite === mainPage){
				mainPage.classList.add('main-active')
				mainPage.classList.add('active')
			}
},

	update(){
			movement.ready = false;
			pages.forEach(page =>{
			body.classList.add('animating');
			page.style.transform = `translate(${-(this.curX-this.mainPageXpos)*100}vw, ${-(this.curY-this.mainPageYpos)*100}vh)`
			this.curSite.classList.remove('active');
			mainPage.classList.remove('main-active');
			this.curSite = this.siteMap[this.curY][this.curX];
		})	
			this.curSite.classList.add('active');
			this.transitions();
	}
}

function keyboardMove(e){
	if(movement.ready){
		let pressedKey = e.key.toLowerCase();
		if(pressedKey === "w" || pressedKey === "arrowup"){
			movement.top();
		}
		else if(pressedKey === "s" || pressedKey === "arrowdown"){
			movement.bottom();
		}
		else if(pressedKey === "a" || pressedKey === "arrowleft"){
			movement.left();
		}
		else if(pressedKey === "d" || pressedKey === "arrowright"){
			movement.right();
		}

	}
}

document.addEventListener('keyup', keyboardMove);

mainPage.addEventListener('transitionend', function(e){
	if(e.propertyName === "transform"){
	movement.ready = true;
	body.classList.remove('animating');
	}
});

function prepareMovementOption(verhoz, direction){	//controls creating function
	let movementOption = document.createElement('div');
	movementOption.classList.add('controls');
	movementOption.classList.add(`controls__${verhoz}`);
	movementOption.classList.add(`controls__${verhoz}--${direction}`);
	movementOption.dataset.direction = direction;

	switch(direction){
	case 'bottom':
		movementOption.innerText = '⇩';
	break;
	case 'top':
		movementOption.innerText = '⇧'
	break;
	case 'left':
		movementOption.innerText = '⇦'
	break;
	case 'right':
		movementOption.innerText = '⇨';
	}

	return movementOption;
}

window.addEventListener('load', function(){
	movement.setSiteMap();
	movement.transitions();

	for(var i = 0; i < movement.siteMap.length; i++){	//using site map to create controls for each page
		for(var j = 0; j < movement.siteMap[i].length; j++){
			if(movement.siteMap[i][j]){
				if(movement.siteMap[i+1] && movement.siteMap[i+1][j]){
					movement.siteMap[i][j].appendChild(prepareMovementOption('vertical', 'bottom'));
				}
				if(movement.siteMap[i-1] && movement.siteMap[i-1][j]){
					movement.siteMap[i][j].appendChild(prepareMovementOption('vertical', 'top'));
				}
				if(movement.siteMap[i] && movement.siteMap[i][j-1]){
					movement.siteMap[i][j].appendChild(prepareMovementOption('horizontal', 'left'));
				}
				if(movement.siteMap[i] && movement.siteMap[i][j+1]){
					movement.siteMap[i][j].appendChild(prepareMovementOption('horizontal', 'right'));
				}
			}
		}
	}

	document.querySelectorAll('.controls').forEach(control =>{
	control.addEventListener('click', function(){
		movement[this.dataset.direction]();
	});
});

});
//transitionend movement.ready