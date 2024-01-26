sap.ui.define(["./BaseController", "sap/m/MessageBox"], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("com.sap.workout.controller.Main", {
		onInit: function () {
			//calculate overall duration of each workout;
			let oModel = this.getOwnerComponent().getModel("workoutsModel");
			oModel.oData.workouts.forEach( workout =>{
				workout.duration = Math.round(workout.exercises.reduce((a,e)=>a+parseInt(e.duration),0)/60);
			})
		},

		formatIconColor: function(level){
			switch (level) {
				case 1:
					return "lightgrey";
				case 2:
					return "lightgreen";
				case 3:
					return "green";
				case 4:
					return "darkgreen";
				default:
					return "#000000";
			}
		},
		navToWorkout: function(oEvent) {
			var iWorkoutIndex = oEvent.getSource().getBindingContext("workoutsModel").getProperty("id");
			this.getOwnerComponent().getRouter().navTo("RouteWorkout", {index: iWorkoutIndex});
		}	
	});
});
