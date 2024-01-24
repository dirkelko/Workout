/*!
 * ${copyright}
 */

sap.ui.define([],

    function () {
        "use strict";

        var TimerRenderer = { apiVersion: 2 };

        TimerRenderer.render = function (oRm, oTimer) {

			let graphicsWidth = oTimer.getGraphicsWidth();
			let graphicsHeight = oTimer.getGraphicsHeight();

            oRm.openStart("div", oTimer);
            oRm.class("graphics");
            oRm.openEnd();
            oRm.openStart("svg");
            oRm.attr("viewBox", "0 0 " + graphicsWidth + " " + graphicsHeight);
            oRm.attr("xmlns", "http://www.w3.org/2000/svg")
            oRm.openEnd();
            oRm.openStart("circle");
            oRm.attr("id", "bgCircle");
            oRm.attr("stroke", "#303030");
            oRm.attr("fill", "transparent");
            oRm.attr("stroke-width", "20");
            oRm.openEnd();
            oRm.close("circle")
            oRm.openStart("circle");
            oRm.attr("id", "clockCircle");
            oRm.attr("stroke", "orange");
            oRm.attr("fill", "transparent");
            oRm.attr("stroke-width", "20");
            oRm.openEnd();
            oRm.close("circle")
            oRm.openStart("path");
            oRm.attr("id", "clockPath");
            //oRm.attr("d", "M 300 100 A 200 200 0 1 0 500 300");
            //oRm.attr("stroke", "transparent");
            oRm.attr("fill", "transparent");
            oRm.attr("stroke-width", "20");
            oRm.attr("stroke-linecap", "round");
            oRm.openEnd();
            oRm.close("path")

            oRm.openStart("foreignObject");
            oRm.attr("x", "000");
            oRm.attr("y", "320");
            oRm.attr("width", "1200");
            oRm.attr("height", "600");
            oRm.openEnd();
          
                oRm.openStart("div");
                oRm.attr("xmlns", "http://www.w3.org/1999/xhtml");
                oRm.class("HtmlIsland");
                oRm.openEnd();

                    oRm.openStart("div");
                    oRm.attr("id", "exerciseName");
                    oRm.class("exerciseText");
                    oRm.openEnd();
                        oRm.text("DURATION");
                    oRm.close("div")

                    oRm.openStart("div");
                    oRm.attr("id", "timer");
                    oRm.class("timerText");
                    oRm.openEnd();
                        oRm.text("00:00");
                    oRm.close("div")

                    /*oRm.openStart("div");
                    oRm.class("buttonArea");
                    oRm.openEnd();

                        oRm.openStart("div");
                        oRm.attr("id", "startButton");
                        oRm.class("button");
                        oRm.openEnd();
                            oRm.text("START");
                        oRm.close("div")

                        oRm.openStart("div");
                        oRm.attr("id", "stopButton");
                        oRm.class("button");
                        oRm.openEnd();
                            oRm.text("STOP");
                        oRm.close("div")

                        oRm.openStart("div");
                        oRm.attr("id", "resetButton");
                        oRm.class("button");
                        oRm.openEnd();
                            oRm.text("RESET");
                        oRm.close("div")

                    oRm.close("div")*/

                oRm.close("div")

            oRm.close("foreignObject")

            //<video src="https://youtu.be/mYX-NSG2CaQ?si=F_P_g3jqLoD-XDeK" playsinline muted autoplay loop height=60></video>
            oRm.close("svg");
            /*oRm.openStart("video");
            oRm.attr("src", "movie/myMovie.mp4");
            oRm.attr("playsinline");
            oRm.attr("muted");
            oRm.attr("autoplay");
            oRm.attr("loop");
            oRm.attr("height","60");

            oRm.openEnd();
            oRm.close("video");*/
            oRm.close("div");
        };


        return TimerRenderer;

    }, true);

