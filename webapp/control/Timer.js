sap.ui.define([
	"sap/ui/core/Control",
	"./TimerRenderer"
], function (Control, TimerRenderer) {
	"use strict";

	// helper function to format time
	function timerString(remTime){
		let iSeconds = Math.floor(remTime/1000 + .9);
		if (iSeconds > 60){
			let sMin = ((iSeconds - (iSeconds % 60))/60).toString();
			let sSec = (iSeconds % 60).toString();
			sSec = (sSec.length ==1)? "0" + sSec: sSec;
			sMin = (sMin.length ==1)? "0" + sMin: sMin;
			return sMin + ":" + sSec;
		}else{
			return iSeconds.toString();
		}
	};

	const mX = 600;
	const mY = 100;
	const r = 500;
	let remTime = 0;
	let intervallIndex=0;
	let noSleep;
    const bellSingle = new Audio('./sounds/BellSingle.m4a');
    const bellTriple = new Audio('./sounds/BellTriple.m4a');

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
			noSleep = new NoSleep();
		},

		reset : function(){
			remTime = 0;
			intervallIndex=0;
			this.invalidate();		
		},


		onBeforeRendering : function () {  
			//let oModel = this.getModel("workoutsModel");
			for (let i = 0; i < this.getExercises().length; i ++){
				this.getModel("workoutsModel").setProperty( this.getBinding('exercises').getContext().getPath() + "/exercises/" + i + "/current","None");
			}						
		},
		
		onAfterRendering : function () {

			const timerDom = this.getDomRef(); 

			timerDom.querySelector("#clockCircle").setAttribute("cx",mX);
			timerDom.querySelector("#clockCircle").setAttribute("cy",mY + r);
			timerDom.querySelector("#clockCircle").setAttribute("r",r);
			timerDom.querySelector("#bgCircle").setAttribute("cx",mX);
			timerDom.querySelector("#bgCircle").setAttribute("cy",mY + r);
			timerDom.querySelector("#bgCircle").setAttribute("r",r);

			//timerDom.querySelector("#svgArea").setAttribute("width",Math.min(document.body.clientHeight*0.4,document.body.clientWidth));

			let aExercises = this.getExercises();
			
			if (aExercises.length > 0){
				this.getDomRef().querySelector("#timer").innerHTML = timerString(aExercises.reduce((a,e)=>a+parseInt(e.duration),0)*1000);
				this.getDomRef().querySelector("#exerciseInfo").innerHTML = `Exercises ${aExercises.filter(ex=>{ return  ex.vis}).length}`;
				this.getDomRef().querySelector("#roundInfo").innerHTML = `Rounds ${aExercises[aExercises.length-1].round}`;
			}
		},

		startClock : function (start){

			const dt = 50; //timer intervall for clock path
			const timerDom = this.getDomRef(); 
			const sPath = this.getBinding('exercises').getContext().getPath();
			let formerIntervallIndex = 0;

			noSleep.enable();

			let aExercises = this.getExercises();
			let seconds = aExercises[intervallIndex].duration;
			let milliSeconds = aExercises[intervallIndex].duration * 1000;
			//console.log(`remTime: ${remTime} intervallIndex ${intervallIndex}`)
			if (start) {
				intervallIndex=0;
				milliSeconds = aExercises[intervallIndex].duration * 1000;
				remTime = milliSeconds;
			}
			let endTime = Date.now() + remTime;

			let that = this;
	
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
					timerDom.querySelector("#nextName").innerHTML = "Next:";
					timerDom.querySelector("#exerciseName").innerHTML = aExercises[intervallIndex+1].name;
				}
				if (remTime <= 0 && intervallIndex < aExercises.length-1){
					if (intervallIndex % 2){
						bellTriple.play();
					}else{
						bellSingle.play();
					}
					timerDom.querySelector("#clockPath").setAttribute("stroke","transparent");
					this.isRunnung = true;
					timerDom.querySelector("#timer").innerHTML = timerString(0);

					timerDom.querySelector("#nextName").innerHTML = "";
					intervallIndex = intervallIndex + 1;
					if (aExercises[intervallIndex].vis){
						//aExercises[intervallIndex].current = "Warning";
						that.getModel("workoutsModel").setProperty( sPath + "/exercises/" + formerIntervallIndex + "/current","Success");
						that.getModel("workoutsModel").setProperty( sPath + "/exercises/" + intervallIndex + "/current","Warning");
						formerIntervallIndex = intervallIndex;
						sap.ui.getCore().byId("__component0---workout--exercisesList").scrollToIndex((intervallIndex+1)/2+1);
						let e = that.getExercises();

						//this.setExercises(aExercises);
						timerDom.querySelector("#exerciseInfo").innerHTML = 
						`Exercise ${aExercises[intervallIndex].ex}/${aExercises.filter(ex=>{ return ex.round == aExercises[intervallIndex].round && ex.vis}).length}`;
						timerDom.querySelector("#roundInfo").innerHTML = 
						`Round ${aExercises[intervallIndex].round}/${aExercises[aExercises.length-1].round}`;
					}else{
						that.getModel("workoutsModel").setProperty( sPath + "/exercises/" + formerIntervallIndex + "/current","Success");
					}
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
			noSleep.disable();
		},

		resetClock : function(){
			const timerDom = this.getDomRef(); 
			timerDom.querySelector("#clockCircle").setAttribute("stroke",(intervallIndex % 2)? "orange" : "green");
			let exercises = this.getExercises();
			remTime = exercises[intervallIndex].duration * 1000;
			timerDom.querySelector("#timer").innerHTML = timerString(remTime);
			this.isRunnung = false;
		},
		nextExercise : function(){
			intervallIndex = (intervallIndex % 2)? intervallIndex + 2 : intervallIndex + 1;
			const timerDom = this.getDomRef(); 
			let exercises = this.getExercises();
			timerDom.querySelector("#clockPath").setAttribute("stroke","transparent");
			timerDom.querySelector("#clockCircle").setAttribute("stroke",(intervallIndex % 2)? "orange" : "green");
			timerDom.querySelector("#exerciseName").innerHTML = exercises[intervallIndex].name;
			timerDom.querySelector("#exerciseInfo").innerHTML = 
			`Exercise ${exercises[intervallIndex].ex}/${exercises.filter(ex=>{ return ex.round == exercises[intervallIndex].round && ex.vis}).length}`;
			timerDom.querySelector("#roundInfo").innerHTML = 
			`Round ${exercises[intervallIndex].round}/${exercises[exercises.length-1].round}`;
			remTime = exercises[intervallIndex].duration * 1000;
			timerDom.querySelector("#timer").innerHTML = timerString(remTime);
			this.isRunnung = false;
		},
			
		renderer : TimerRenderer
	});

	return Timer;

});

