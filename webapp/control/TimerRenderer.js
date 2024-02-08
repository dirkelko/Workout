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
            oRm.style("height", oTimer.getHeight());
            //oRm.style("width", oTimer.getWidth());
            oRm.class("graphics");
            oRm.openEnd();
            oRm.openStart("svg");
            oRm.attr("id", "svgArea");
            oRm.class("svg");
            oRm.attr("viewBox", "0 0 " + graphicsWidth + " " + graphicsHeight);
            oRm.openEnd();
            /*oRm.openStart("rect");
            oRm.attr("width", graphicsWidth);
            oRm.attr("height", graphicsHeight);
            oRm.attr("fill", "blue");
            oRm.openEnd();
            oRm.close("rect")*/
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
            oRm.attr("y", "180");
            oRm.attr("width", "1200");
            oRm.attr("height", "1000");
            oRm.openEnd();
          
                oRm.openStart("div");
                oRm.attr("xmlns", "http://www.w3.org/1999/xhtml");
                oRm.class("HtmlIsland");
                oRm.openEnd();

                    oRm.openStart("div");
                    oRm.attr("id", "nextName");
                    oRm.class("exerciseText");
                    oRm.openEnd();
                        oRm.text("");
                    oRm.close("div")
                    oRm.openStart("div");
                    oRm.attr("id", "exerciseName");
                    oRm.class("exerciseText");
                    oRm.openEnd();
                        oRm.text("Duration");
                    oRm.close("div")

                    oRm.openStart("div");
                    oRm.attr("id", "timer");
                    oRm.class("timerText");
                    oRm.openEnd();
                        oRm.text("00:00");
                    oRm.close("div")

                    oRm.openStart("div");
                    oRm.attr("id", "exerciseInfo");
                    oRm.class("exerciseInfo");
                    oRm.openEnd();
                        oRm.text("Exercise");
                    oRm.close("div")

                    oRm.openStart("div");
                    oRm.attr("id", "roundInfo");
                    oRm.class("roundInfo");
                    oRm.openEnd();
                        oRm.text("Round");
                    oRm.close("div")


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

