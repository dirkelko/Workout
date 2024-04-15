sap.ui.define([
	"./BaseController",
	 "sap/ui/model/Filter"
	], function (BaseController, Filter) {
	"use strict";
	this.selectedLevel = "All";

	return BaseController.extend("com.sap.workout.controller.Main", {

		onInit: function () {
			//calculate overall duration of each workout;
			this.selectedLevel = "All";
			let oModel = this.getOwnerComponent().getModel("workoutsModel");
			oModel.oData.workouts.forEach( workout =>{
				workout.duration = Math.round(workout.exercises.reduce((a,e)=>a+parseInt(e.duration)+parseInt(e.pause),0)/60);
			})
		},

		formatIconColor: function(level){
			switch (level) {
				case 1:
					return "Neutral";
				case 2:
					return "Positive";
				case 3:
					return "#4db1ff";
				case 4:
					return "Critical";
				default:
					return "white";
			}
		},

		_getSelectedLevel: function (key) {

			if (key == this.selectedLevel){
				this.selectedLevel = "All";
				return this.selectedLevel
			} else {
				this.selectedLevel = key;
				return this.selectedLevel
			}


		},

		onLevelSelect: function (oEvent) {
			var param = oEvent.getParameter("key");
			var selectedLevel = this._getSelectedLevel(param)

			console.log( "selL: " + selectedLevel + " " + oEvent.getParameter("key") );
			this._aCustomerFilters = [];
			this._aStatusFilters = [];

			this.getView().byId("iconTabBar").setSelectedKey(selectedLevel);

			var oBinding = this.getView().byId("workoutsList").getBinding("items");
			var dings = (selectedLevel === "All")?[]:[new Filter("level", "EQ", selectedLevel, false)];
			oBinding.filter((selectedLevel == "All")? [] : [new Filter("level", "EQ", selectedLevel, false),new Filter("level", "EQ", "ALL", false)]);
			//oBinding.filter((oEvent.getParameter("key") == "All")?[]:[new Filter("level", "EQ", oEvent.getParameter("key"), false),new Filter("level", "EQ", "ALL", false)]);
		},

		navToWorkout: function(oEvent) {
			var iWorkoutId = oEvent.getSource().getBindingContext("workoutsModel").getProperty("id");
			this.getOwnerComponent().getRouter().navTo("RouteWorkout", {id: iWorkoutId});
		}	
	});
});
