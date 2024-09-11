sap.ui.define([
	"./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("com.sap.controller.Workout", {

        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("RouteWorkout").attachMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {
            var idWorkOut = oEvent.getParameter("arguments").id;
            var indexWorkOut = this.getView().getModel("workoutsModel").getProperty("/").workouts.findIndex( wo=>{
                return wo.id == idWorkOut;
            });
            const allExercises = this.getView().getModel("workoutsModel").getProperty("/exercises");
            const exercises = this.getView().getModel("workoutsModel").getProperty("/workouts/" + indexWorkOut + "/exercises");
            for (let i = 0; i < exercises.length; i++) {
                let exerciseName = this.getView().getModel("workoutsModel").getProperty("/workouts/" + indexWorkOut + "/exercises/" + i).name
                let exercise = allExercises.find( e=>{
                    return e.name == exerciseName;
                });
                if (exercise) this.getView().getModel("workoutsModel").setProperty("/workouts/" + indexWorkOut + "/exercises/" + i + "/youtubeId", exercise.youtubeId );
            };
            this.getView().bindElement({
                path: "/workouts/" + indexWorkOut,
                model: "workoutsModel"
            });
            let path = this.getView().getBindingContext("workoutsModel").sPath;            
            this.byId("favouriteIcon").setSrc( this.getView().getModel("workoutsModel").getProperty(path + "/favourite")? "sap-icon://heart" : "sap-icon://heart-2");
        },

        startWorkout: async function(oContext) {
            this.byId("Timer").startClock(true);
            this.byId("startButton").setVisible(false);
            this.byId("stopButton").setVisible(true);
            this.byId("resetButton").setVisible(false);
            this.byId("continueButton").setVisible(false);
            let screenLock = await navigator.wakeLock.request('screen');
        },
        continueWorkout: function(oContext) {
            this.byId("Timer").startClock(false);
            this.byId("startButton").setVisible(false);
            this.byId("stopButton").setVisible(true);
            this.byId("resetButton").setVisible(false);
            this.byId("nextButton").setVisible(false);
            this.byId("continueButton").setVisible(false);
        },
        resetWorkout: function(oContext) {
            this.byId("Timer").resetClock();
        },
        nextExercise: function(oContext) {
            this.byId("Timer").nextExercise();
        },

        stopWorkout: function(oContext) {
            this.byId("Timer").stopClock();
            this.byId("continueButton").setVisible(true);
            this.byId("resetButton").setVisible(true);
            this.byId("nextButton").setVisible(true);
            this.byId("stopButton").setVisible(false);
            //let sPath = this.getView().getBindingContext("workoutsModel").sPath;
            //let workout = this.getView().getModel("workoutsModel").getProperty(sPath);
        },

		getRound: function(oContext) {
			return "Round " + oContext.getProperty('round');
		},

        navToMain: function () {
            this.byId("Timer").stopClock();
            this.byId("Timer").resetClock();
            this.byId("Timer").reset();
            this.byId("startButton").setVisible(true);
            this.byId("stopButton").setVisible(false);
            this.byId("resetButton").setVisible(false);
            this.byId("nextButton").setVisible(false);
            this.byId("continueButton").setVisible(false);

            this.getOwnerComponent().getRouter().navTo("main", {id: "test"});
        },

        handleLinkPress: function(oEvent){
            let iWorkoutIndex = this.getView().getBindingContext("workoutsModel").getProperty(this.getView().getBindingContext("workoutsModel").getPath()).id;
            let iExerciseIndex = oEvent.getSource().getBindingContext("workoutsModel").getProperty("id");        
            //let exerciseLink = oEvent.getSource().getBindingContext("workoutsModel").getProperty("link");        
			this.getOwnerComponent().getRouter().navTo("RouteVideo", {id: iWorkoutIndex, exerciseIndex: iExerciseIndex,});
        },

        setFavourite: function(){
            let path = this.getView().getBindingContext("workoutsModel").sPath;
            let isFavourite =  this.getView().getModel("workoutsModel").getProperty(path + "/favourite");
            this.getView().getModel("workoutsModel").setProperty(path + "/favourite",!isFavourite);
            this.byId("favouriteIcon").setSrc(isFavourite? "sap-icon://heart-2" : "sap-icon://heart");
            let favourites = this.getView().getModel("workoutsModel").getProperty("/workouts").filter( wo=>{ 
                return wo.favourite
            }).map( wo=>{
                return wo.id
            }); 
            localStorage.setItem("favourites", favourites);
        }

    });
});