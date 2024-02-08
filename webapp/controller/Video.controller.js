sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    var iWorkoutIndex = 0;
    var idWorkout

    return Controller.extend("com.sap.controller.Video", {

        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("RouteVideo").attachMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {
            idWorkout = oEvent.getParameter("arguments").id;
            iWorkoutIndex = this.getView().getModel("workoutsModel").getProperty("/").workouts.findIndex( wo=>{
                return wo.id == idWorkout;
            });            

            let eInd = oEvent.getParameter("arguments").exerciseIndex;
            let iExInWo = this.getView().getModel("workoutsModel").getProperty("/workouts/" + iWorkoutIndex).exercises.findIndex( ex=>{
                return ex.id == eInd
            });
            let exerciseName = this.getView().getModel("workoutsModel").getProperty("/workouts/" + iWorkoutIndex + "/exercises/" + iExInWo ).name;            

            let iEx = this.getView().getModel("workoutsModel").getProperty("/exercises/").findIndex( ex=>{
                return ex.name.toUpperCase() == exerciseName.toUpperCase();
            });

            this.getView().bindElement({
                path: "/exercises/" + iEx,
                model: "workoutsModel"
            });
        },

        navToMain: function () {
			this.getOwnerComponent().getRouter().navTo("RouteWorkout", {id: idWorkout});
        }

    });
});