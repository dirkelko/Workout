sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    var iWorkoutIndex = 0;

    return Controller.extend("com.sap.controller.Video", {

        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("RouteVideo").attachMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {
            iWorkoutIndex = oEvent.getParameter("arguments").index;
            var eInd = oEvent.getParameter("arguments").exerciseIndex;
            var iEx = this.getView().getModel("workoutsModel").getProperty("/workouts/" + oEvent.getParameter("arguments").index).exercises.findIndex( ex=>{
                return ex.id == eInd
            });            
            this.getView().bindElement({
                path: "/workouts/" + oEvent.getParameter("arguments").index + "/exercises/" + iEx,
                model: "workoutsModel"
            });
        },

        navToMain: function () {
			this.getOwnerComponent().getRouter().navTo("RouteWorkout", {index: iWorkoutIndex});
            //this.getOwnerComponent().getRouter().navTo("main");
        }

    });
});