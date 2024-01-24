sap.ui.define([
	"sap/ui/core/Control",
	"./TimerRenderer"
], function (Control, TimerRenderer) {
	"use strict";

	// helper function to format time
	function timerString(remTime){
		let iSeconds = Math.floor(remTime/1000 + .9);
		let sMin = ((iSeconds - (iSeconds % 60))/60).toString();
		let sSec = (iSeconds % 60).toString();
		sSec = (sSec.length ==1)? "0" + sSec: sSec;
		sMin = (sMin.length ==1)? "0" + sMin: sMin;
		return sMin + ":" + sSec;
	};

	const mX = 600;
	const mY = 100;
	const r = 500;
	let remTime = 0;
	let intervallIndex=0;

	let Timer = Control.extend("com.sap.workout.control.Timer", {
		metadata : {
			properties : {
				width : 			{type: "sap.ui.core.CSSSize", defaultValue: "100%"},
				height : 			{type: "sap.ui.core.CSSSize", defaultValue: "100%"},
				graphicsWidth : 	{type: "int", defaultValue: 1200},
				graphicsHeight : 	{type: "int", defaultValue: 1200},
				workoutName: 		{type: "string", defaultValue : "" },
				exercises: 			{type: "object[]", defaultValue : [] }
			}
		},

		isRunnung : false,
		
		init : function () {  
			//this.tires = {};
		},


		onBeforeRendering : function () {  
			//let oModel = this.getModel("workoutsModel");
		},
		
		onAfterRendering : function () {

			const timerDom = this.getDomRef(); 

			timerDom.querySelector("#clockCircle").setAttribute("cx",mX);
			timerDom.querySelector("#clockCircle").setAttribute("cy",mY + r);
			timerDom.querySelector("#clockCircle").setAttribute("r",r);
			timerDom.querySelector("#bgCircle").setAttribute("cx",mX);
			timerDom.querySelector("#bgCircle").setAttribute("cy",mY + r);
			timerDom.querySelector("#bgCircle").setAttribute("r",r);

			let exercises = this.getExercises();
			
			if (exercises.length > 0){
				this.getDomRef().querySelector("#timer").innerHTML = timerString(exercises.reduce((a,e)=>a+parseInt(e.duration),0)*1000);
			}
		},

		startClock : function (start){

			const dt = 50; //timer intervall for clock path
			const timerDom = this.getDomRef(); 

			let aExercises = this.getExercises();
			let seconds = aExercises[intervallIndex].duration;
			let milliSeconds = aExercises[intervallIndex].duration * 1000;
			//console.log(`remTime: ${remTime} intervallIndex ${intervallIndex}`)
			if (start) {
				remTime = milliSeconds;
				//intervallIndex=0;
			}
			let endTime = Date.now() + remTime;
	
			this.interval = setInterval(function(){
				remTime = endTime - Date.now();
				//console.log(`remTime: ${remTime} intervallIndex ${intervallIndex}`)
				timerDom.querySelector("#timer").innerHTML = timerString(remTime);
				timerDom.querySelector("#exerciseName").innerHTML = aExercises[intervallIndex].name;
	
				timerDom.querySelector("#clockCircle").setAttribute("stroke","transparent");
				timerDom.querySelector("#clockPath").setAttribute("stroke",
					(intervallIndex % 2)? "orange" : "green");
				let alpha = (milliSeconds - remTime)/milliSeconds*2*Math.PI;
				let dx = r * Math.sin(alpha);
				let dy = r * Math.cos(alpha);
				let laf = (remTime > milliSeconds/2)? 1 : 0;
				let sArc = `M ${mX - dx} ${mY + r - dy} A ${r} ${r} 0 ${laf} 0 ${mX} ${mY}`
				timerDom.querySelector("#clockPath").setAttribute("d",sArc);
				if (remTime < 5000 && aExercises[intervallIndex].id == 0 ){
					timerDom.querySelector("#exerciseName").innerHTML = "Next: " + aExercises[intervallIndex+1].name;
				}
				if (remTime <= 0 && intervallIndex < aExercises.length-1){
					if (intervallIndex % 2){
						//bellTriple.play();
					}else{
						//bellSingle.play();
					}
					timerDom.querySelector("#clockPath").setAttribute("stroke","transparent");
					this.isRunnung = true;
					//clearInterval(interval);
					timerDom.querySelector("#timer").innerHTML = timerString(0);
					intervallIndex = intervallIndex + 1;
					seconds = Number(aExercises[intervallIndex].duration);
					milliSeconds = (seconds)? seconds * 1000 : 0;
					remTime = milliSeconds;
					endTime = Date.now() + remTime;
	
			   }else if (remTime <= 0 && intervallIndex == aExercises.length-1){
					//bellTriple.play();
					timerDom.querySelector("#clockPath").setAttribute("stroke","transparent");
					this.isRunnung = false;
					clearInterval(this.interval);
					timerDom.querySelector("#timer").innerHTML = timerString(0);                
				}
			}, dt);           
	
		},

		stopClock : function(){
			//const timerDom = this.getDomRef(); 
			clearInterval(this.interval);
			this.isRunnung = false;
		},

		resetClock : function(){
			const timerDom = this.getDomRef(); 
			timerDom.querySelector("#clockCircle").setAttribute("stroke",(intervallIndex % 2)? "orange" : "green");
			let exercises = this.getExercises();
			remTime = exercises[intervallIndex].duration * 1000;
			timerDom.querySelector("#timer").innerHTML = timerString(remTime);
			this.isRunnung = false;
		},
			
		renderer : TimerRenderer
	});

	return Timer;

});

