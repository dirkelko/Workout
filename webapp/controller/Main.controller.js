sap.ui.define(["./BaseController", "sap/m/MessageBox"], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("com.sap.workout.controller.Main", {
		sayHello: function () {
			MessageBox.show("Hello World!");
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
