sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.sap.controller.Workout", {

        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("RouteWorkout").attachMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {
            this.getView().bindElement({
                path: "/workouts/" + oEvent.getParameter("arguments").index,
                model: "workoutsModel"
            });
        },

        startWorkout: function(oContext) {
            this.byId("Timer").startClock(true);
            this.byId("startButton").setVisible(false);
            this.byId("stopButton").setVisible(true);
            this.byId("resetButton").setVisible(false);
            this.byId("continueButton").setVisible(false);
            //let sPath = this.getView().getBindingContext("workoutsModel").sPath;
            //let workout = this.getView().getModel("workoutsModel").getProperty(sPath);
        },
        continueWorkout: function(oContext) {
            this.byId("Timer").startClock(false);
            this.byId("startButton").setVisible(false);
            this.byId("stopButton").setVisible(true);
            this.byId("resetButton").setVisible(false);
            this.byId("continueButton").setVisible(false);
            //let sPath = this.getView().getBindingContext("workoutsModel").sPath;
            //let workout = this.getView().getModel("workoutsModel").getProperty(sPath);
        },
        resetWorkout: function(oContext) {
            this.byId("Timer").resetClock();
            //let sPath = this.getView().getBindingContext("workoutsModel").sPath;
            //let workout = this.getView().getModel("workoutsModel").getProperty(sPath);
        },

        stopWorkout: function(oContext) {
            this.byId("Timer").stopClock();
            this.byId("continueButton").setVisible(true);
            this.byId("resetButton").setVisible(true);
            this.byId("stopButton").setVisible(false);
            //let sPath = this.getView().getBindingContext("workoutsModel").sPath;
            //let workout = this.getView().getModel("workoutsModel").getProperty(sPath);
        },

		getRound: function(oContext) {
			return "Round " + oContext.getProperty('round');
		},

        navToMain: function () {
            this.getOwnerComponent().getRouter().navTo("main");
        }

    });
});