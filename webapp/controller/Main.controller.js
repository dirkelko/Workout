sap.ui.define([
	"./BaseController",
	 "sap/ui/model/Filter"
	], function (BaseController, Filter, IconPool) {
	"use strict";

	return BaseController.extend("com.sap.workout.controller.Main", {

		onInit: function () {
			// attach onRouteMatched event to the RouteWorkout route
			this.getOwnerComponent().getRouter().getRoute("main").attachMatched(this.onRouteMatched, this);

			//calculate overall duration of each workout;
			this.selectedLevel = "0";
			let oModel = this.getOwnerComponent().getModel("workoutsModel");
			let favourites = localStorage.getItem("favourites") || [];
			oModel.oData.workouts.forEach( workout =>{
				workout.duration = Math.round(workout.exercises.reduce((a,e)=>a+parseInt(e.duration)+parseInt(e.pause),0)/60);
				workout.favourite = favourites.indexOf(workout.id) != -1;
			})
		},

        onRouteMatched: function (oEvent) {
			let key = this.getView().byId("iconTabBar").getSelectedKey();
			if (key == "F"){
				let oBinding = this.getView().byId("workoutsList").getBinding("items");
				oBinding.filter([new Filter("favourite", "EQ", true, false)]);
			}
        },


		onAfterRendering: function(){
			this.getView().byId("iconTabBar").setSelectedKey("0");
			//var itf0 = this.getView().byId("iconTabFilter0");
			//this.getView().byId("iconTabBar").setSelectedItem(itf0);
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

		onLevelSelect: function (oEvent) {
			var param = oEvent.getParameter("key");

				this.selectedLevel = (param == this.selectedLevel)? "0" : param;
				this.getView().byId("iconTabBar").setSelectedKey(this.selectedLevel);
				var oBinding = this.getView().byId("workoutsList").getBinding("items");
				if (param != "F"){
					oBinding.filter((this.selectedLevel == "0")? [] : [new Filter("level", "EQ", this.selectedLevel, false),new Filter("level", "EQ", "ALL", false)]);
				}else{
					oBinding.filter((this.selectedLevel == "0")? [] : [new Filter("favourite", "EQ", true, false)]);
				}
		},

		navToWorkout: function(oEvent) {
			var iWorkoutId = oEvent.getSource().getBindingContext("workoutsModel").getProperty("id");
			this.getOwnerComponent().getRouter().navTo("RouteWorkout", {id: iWorkoutId});
		}	
	});
});
