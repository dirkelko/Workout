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
	let milliSeconds = 0;
	let remTime = 0;
	let intervalIndex=0;
	let bPause = true;
	let noSleep;
	let interval;
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
			intervalIndex=0;
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
				this.getDomRef().querySelector("#timer").innerHTML = timerString(aExercises.reduce((a,e)=>a+parseInt(e.duration)+parseInt(e.pause),0)*1000);
				this.getDomRef().querySelector("#exerciseInfo").innerHTML = `Exercises ${aExercises.length}`;
				this.getDomRef().querySelector("#roundInfo").innerHTML = `Rounds ${aExercises[aExercises.length-1].round}`;
			}
		},

		startClock : function (start){

			const dt = 50; //timer intervall for clock path
			const timerDom = this.getDomRef(); 
			const sPath = this.getBinding('exercises').getContext().getPath();
			// mark current exercise as active (Warning = yellow) in table
			//this.getModel("workoutsModel").setProperty( sPath + "/exercises/" + intervalIndex + "/current","Warning");

			noSleep.enable();

			let aExercises = this.getExercises();
			//let milliSeconds = (bPause)? aExercises[intervalIndex].pause * 1000 : aExercises[intervalIndex].duration * 1000;
			//remTime = milliSeconds;
			//console.log(`remTime: ${remTime} intervalIndex ${intervalIndex}`)
			if (start) {
				bPause = true;
				intervalIndex=0;
				milliSeconds = (bPause)? aExercises[intervalIndex].pause * 1000 : aExercises[intervalIndex].duration * 1000;
				remTime = milliSeconds;
			}
			let endTime = Date.now() + remTime;

			let that = this;
	
			interval = setInterval(function(){
				remTime = endTime - Date.now();
				//console.log(`remTime: ${remTime} intervalIndex ${intervalIndex}`)
				timerDom.querySelector("#timer").innerHTML = timerString(remTime);
				let pauseText = (aExercises[intervalIndex].id == 1)? "Start In" : "Recovery";
				timerDom.querySelector("#exerciseName").innerHTML = (bPause)? pauseText : aExercises[intervalIndex].name;
	
				timerDom.querySelector("#clockCircle").setAttribute("stroke","transparent");
				timerDom.querySelector("#clockPath").setAttribute("stroke",
					(!bPause)? "orange" : "green");
				let alpha = (milliSeconds - remTime)/milliSeconds*2*Math.PI;
				let dx = r * Math.sin(alpha);
				let dy = r * Math.cos(alpha);
				let laf = (remTime > milliSeconds/2)? 1 : 0;
				let sArc = `M ${mX - dx} ${mY + r - dy} A ${r} ${r} 0 ${laf} 0 ${mX} ${mY}`
				timerDom.querySelector("#clockPath").setAttribute("d",sArc);
				//if ((aExercises[intervalIndex].id == 1 && remTime < 5000 || aExercises[intervalIndex].id != 1 && remTime < 10000) && bPause ){
				if ( remTime < aExercises[intervalIndex].pause * 1000 - 5000  && bPause ){
						timerDom.querySelector("#nextName").innerHTML = "Next:";
					timerDom.querySelector("#exerciseName").innerHTML = aExercises[intervalIndex].name;
				}
				if (remTime <= 0 && intervalIndex >= aExercises.length -1 && !bPause){
					bellTriple.play();
					timerDom.querySelector("#clockPath").setAttribute("stroke","transparent");
					this.isRunnung = false;
					clearInterval(interval);
					timerDom.querySelector("#timer").innerHTML = timerString(0);
					that.getModel("workoutsModel").setProperty( sPath + "/exercises/" + intervalIndex + "/current","Success");
				} else if (remTime <= 0 && intervalIndex < aExercises.length){
					if (bPause){
						bellSingle.play();
						that.getModel("workoutsModel").setProperty( sPath + "/exercises/" + intervalIndex + "/current","Warning");
						bPause = false;
						milliSeconds = Number(aExercises[intervalIndex].duration) * 1000;		
						//console.log("bPause to false " + milliSeconds);
					}else{
						bellTriple.play();
						bPause = true;
						that.getModel("workoutsModel").setProperty( sPath + "/exercises/" + intervalIndex + "/current","Success");
						intervalIndex = intervalIndex + 1;
						milliSeconds = Number(aExercises[intervalIndex].pause) * 1000;
						//console.log("bPause to true " + milliSeconds + " index " +  intervalIndex);
					}
					timerDom.querySelector("#clockPath").setAttribute("stroke","transparent");
					this.isRunnung = true;
					timerDom.querySelector("#timer").innerHTML = timerString(0);
					timerDom.querySelector("#nextName").innerHTML = "";
					sap.ui.getCore().byId("__component0---workout--exercisesList").scrollToIndex(intervalIndex+1);
					let e = that.getExercises();
					timerDom.querySelector("#exerciseInfo").innerHTML = 
					`Exercise ${aExercises[intervalIndex].ex}/${aExercises.filter(ex=>{ return ex.round == aExercises[intervalIndex].round}).length}`;
					timerDom.querySelector("#roundInfo").innerHTML = 
					`Round ${aExercises[intervalIndex].round}/${aExercises[aExercises.length-1].round}`;
					remTime = milliSeconds;
					endTime = Date.now() + remTime;
	
			   }
			}, dt);           
	
		},

		stopClock : function(){
			//const timerDom = this.getDomRef(); 
			clearInterval(interval);
			this.isRunnung = false;
			noSleep.disable();
		},

		resetClock : function(){
			const timerDom = this.getDomRef(); 
			timerDom.querySelector("#clockCircle").setAttribute("stroke",(!bPause)? "orange" : "green");
			let exercises = this.getExercises();
			remTime = (bPause)? exercises[intervalIndex].pause * 1000 : exercises[intervalIndex].duration * 1000;
			timerDom.querySelector("#timer").innerHTML = timerString(remTime);
			this.isRunnung = false;
		},
		nextExercise : function(){
			if (intervalIndex >= this.getExercises().length-1){
				return;
			};
			intervalIndex = (bPause)? intervalIndex : intervalIndex + 1;
			bPause = false;
			const timerDom = this.getDomRef(); 
			let exercises = this.getExercises();
			milliSeconds = exercises[intervalIndex].duration * 1000;
			remTime = milliSeconds;
			timerDom.querySelector("#clockPath").setAttribute("stroke","transparent");
			timerDom.querySelector("#clockCircle").setAttribute("stroke", "orange");
			timerDom.querySelector("#exerciseName").innerHTML = exercises[intervalIndex].name;
			timerDom.querySelector("#exerciseInfo").innerHTML = 
			`Exercise ${exercises[intervalIndex].ex}/${exercises.filter(ex=>{ return ex.round == exercises[intervalIndex].round}).length}`;
			timerDom.querySelector("#roundInfo").innerHTML = 
			`Round ${exercises[intervalIndex].round}/${exercises[exercises.length-1].round}`;
			remTime = exercises[intervalIndex].duration * 1000;
			timerDom.querySelector("#timer").innerHTML = timerString(remTime);
			this.isRunnung = false;
		},
			
		renderer : TimerRenderer
	});

	return Timer;

});

