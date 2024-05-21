// activate strict mode for JavaScript with restricted & "safer" syntax and different runtime behaviour
"use strict";



/* ------------------------------------------------------------*/
/* script for playground's animated setup drawing & game logic */
/* ----------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* sources:                                                                                                   */
/*                                                                                                            */ 
/* "Canvas API" on "MDN Web Docs"                                                                             */
/* https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API                                                */
/*                                                                                                            */ 
/* "JavaScript animations" by Ilya Kantor on "The Modern JavaScript Tutorial"                                 */
/* https://javascript.info/js-animation                                                                       */
/*                                                                                                            */ 
/* "Bézier Curves" by Ilya Kantor on "The Modern JavaScript Tutorial"                                         */
/* https://javascript.info/bezier-curve                                                                       */
/*                                                                                                            */ 
/* "Bézier Curve" on "Wikipedia"                                                                              */
/* https://en.wikipedia.org/wiki/B%C3%A9zier_curve                                                            */
/*                                                                                                            */
/* "How to make a draggable Bézier curve in vanilla JavaScript" by Joost Jansen on "Medium"                   */
/* https://medium.com/@joostjansen.me/how-to-make-a-draggable-bezier-curve-in-vanilla-javascript-5c7fa51727db */
/* ---------------------------------------------------------------------------------------------------------- */

 // fetch HTML canvas element from DOM and initialise a 2D rendering context
 const playgroundCanvas = document.querySelector("#playground");
 const context = playgroundCanvas.getContext("2d");
 const canvasDim = playgroundCanvas.getBoundingClientRect();

// valid control points & success status of individual game stages
let stageAcp = {x: 27, y: 0};
let stageBcp = {x1: 158, y1: 143, x2: 135, y2: 13};
let stageCcp = {x: 208, y: 122};

let stageACompleted = false;
let stageBCompleted = false;
let stageCCompleted = false;

// colours associated to (un-)successful Bézier curve modelling
let failureColor = "#C91438FF";
let successColor = "#44A3C1FF";

let bezierAColor = failureColor;
let bezierBColor = failureColor;
let bezierCColor = failureColor;

// start, control and end points of individual Bézier curves
let startA = {x: 18, y: 142};
let cpA = {x: 60, y: 50};
let endA = {x: 100, y: 90};

let startB = {x: 100, y: 90};
let cp1B = {x: 140, y: 90};
let cp2B = {x: 160, y: 140};
let endB = {x: 180, y: 80};

let startC = {x: 180, y: 80};
let cpC = {x: 200, y: 10};
let endC = {x: 260, y:40};

// code for mouse coordinates tracking (relative to canvas HTML element)
let mousePosition = {x: 0, y: 0};
let isMouseDown = false;

playgroundCanvas.addEventListener("mousedown", (event) =>
{
    isMouseDown = true;
})

playgroundCanvas.addEventListener("mousemove", (event) =>
{
    mousePosition.x = (event.clientX - canvasDim.left) / (playgroundCanvas.clientWidth  / 300) - 10;
    mousePosition.y = (event.clientY - canvasDim.top)  / (playgroundCanvas.clientHeight / 150) + 4;
})

playgroundCanvas.addEventListener("mouseup", (event) =>
{
    isMouseDown = false;
})

// collision function for draggable control points with specific radius
let circleRadius = 4

function hitted (mouse, target)
{
    const hasHitted =
    mouse.x >= target.x - circleRadius &&
    mouse.x <= target.x + circleRadius &&
    mouse.y >= target.y - circleRadius &&
    mouse.y <= target.y + circleRadius;

    return hasHitted;
}

// drawing functions for Bézier curve control points
function drawCP (position)
{
    context.fillStyle = "#D8D8D8FF";
    context.shadowColor = "#00000000";
    context.shadowBlur = 0;

    context.beginPath();
    context.arc(position.x, position.y, circleRadius, 0, 2 * Math.PI);
    context.fill();
}

function drawCPLine (from, to) 
{
    context.strokeStyle = "#D8D8D833";
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }

// drawing functions for individual Bézier curves
function drawBezierA ()
{
    drawCP(cpA);
    drawCPLine(startA, cpA);
    drawCPLine(cpA, endA);

    context.strokeStyle = bezierAColor;
    context.shadowColor = bezierAColor;
    context.shadowBlur = 25;

    context.beginPath();
    context.moveTo(18, 142);
    context.quadraticCurveTo(cpA.x, cpA.y, endA.x, endA.y);
    context.stroke();

    if (isMouseDown && hitted(mousePosition, cpA))
    {
        cpA.x = mousePosition.x;
        cpA.y = mousePosition.y;

        if ((cpA.x >= stageAcp.x - 4) && (cpA.x <= stageAcp.x + 2) &&
            (cpA.y >= stageAcp.y - 4) && (cpA.y <= stageAcp.y + 2))
        {
            bezierAColor = successColor;
            stageACompleted = true;
        }
        else
        {
            bezierAColor = failureColor;
            stageACompleted = false;
        }
    }
}

function drawBezierB ()
{
    drawCP(cp1B);
    drawCP(cp2B);
    drawCPLine(startB, cp1B);
    drawCPLine(cp1B, cp2B);
    drawCPLine(cp2B, endB);

    context.strokeStyle = bezierBColor;
    context.shadowColor = bezierBColor;
    context.shadowBlur = 25;

    context.beginPath();
    context.moveTo(100, 90);
    context.bezierCurveTo(cp1B.x, cp1B.y, cp2B.x, cp2B.y, endB.x, endB.y);
    context.stroke();

    if (isMouseDown)
    {
        if (hitted(mousePosition, cp1B))
        {
            cp1B.x = mousePosition.x;
            cp1B.y = mousePosition.y;
        }
        if (hitted(mousePosition, cp2B))
        {
            cp2B.x = mousePosition.x;
            cp2B.y = mousePosition.y;
        }

        if ((cp1B.x >= stageBcp.x1 - 4) && (cp1B.x <= stageBcp.x1 + 4) &&
            (cp1B.y >= stageBcp.y1 - 4) && (cp1B.y <= stageBcp.y1 + 4) &&
            (cp2B.x >= stageBcp.x2 - 4) && (cp2B.x <= stageBcp.x2 + 4) &&
            (cp2B.y >= stageBcp.y2 - 4) && (cp2B.y <= stageBcp.y2 + 4))
        {
            bezierBColor = successColor;
            stageBCompleted = true;
        }
        else
        {
            bezierBColor = failureColor;
            stageBCompleted = false;
        }
    }
}

function drawBezierC ()
{
    drawCP(cpC);
    drawCPLine(startC, cpC);
    drawCPLine(cpC, endC);

    context.strokeStyle = bezierCColor;
    context.shadowColor = bezierCColor;
    context.shadowBlur = 25;

    context.beginPath();
    context.moveTo(180, 80);
    context.quadraticCurveTo(cpC.x, cpC.y, endC.x, endC.y);
    context.stroke();

    if (isMouseDown && hitted(mousePosition, cpC))
    {
        cpC.x = mousePosition.x;
        cpC.y = mousePosition.y;

        if ((cpC.x >= stageCcp.x - 4) && (cpC.x <= stageCcp.x + 4) &&
            (cpC.y >= stageCcp.y - 4) && (cpC.y <= stageCcp.y + 4))
        {
            bezierCColor = successColor;
            stageCCompleted = true;
        }
        else
        {
            bezierCColor = failureColor;
            stageCCompleted = false;
        }
    }
}

function drawBezierGame ()
{   
    context.setLineDash([]);

    drawBezierA();
    drawBezierB();
    drawBezierC();
}





/**
 * Draws straight line between two points into rendering context as a function of curve parameter (time) 
 * @param startX    x-coordinate of start point
 * @param startY    y-coordinate of start point
 * @param endX      x-coordinate of end point
 * @param endY      y-coordinate of end point
 * @param tPassed   elapsed "time" since path traversal departure
 */ 
function drawLineSubpath (startX, startY, endX, endY, tPassed) 
{
    // initialise new path in context
    context.beginPath();

    // if (sub-)path completely traversed, draw straight line from start to end point
    if (tPassed == 1)
    {
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
    }
    // during traversal, draw straight line between start and linearly interpolated next point
    else
    {
        // compute next point coordinates (via linear interpolation)
        let nextX = (1 - tPassed) * startX + tPassed * endX;
        let nextY = (1 - tPassed) * startY + tPassed * endY;

        // add subpaths to path initialised above
        context.moveTo(startX, startY);
        context.lineTo(nextX, nextY);
    }

    // draw line to context
    context.stroke();
};

/**
 * Draws multiple, animated lines into rendering context to set up game playground
 * @param duration        duration of animation (in milliseconds)
 * @param timing          animation timing/completion function
 */ 
function animatedSetup (duration, timing) 
{
    // fetch timestamp since page load (in ms), needed by callback function animationStep()
    let start = performance.now();

    // schedule anonymous callback function animationStep() to run in closest possible time (when the browser engine is ready)
    // requestAnimationFrame() may regroup several callbacks and even CSS animations together => more efficient !!!
    window.requestAnimationFrame (function animationStep (timestamp)
    {
        // compute elapsed time fraction
        let timeFraction = Math.min((timestamp - start) / duration, 1);

        // compute animation completion state via given timing function (mapped curve parameter)
        let progress = timing(timeFraction);

        // wipe out previously rendered drawing on canvas to show animation completion state properly
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        /* draw segments of final lines between respective endpoints in "animation step" */
        // draw "coordinate axes"
        context.strokeStyle = "#D8D8D899";
        context.lineWidth = 2.5;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.setLineDash([]);
        context.shadowColor = "#00000000";
        context.shadowBlur = 0;

        drawLineSubpath(18, 142, 18, 8, progress);
        drawLineSubpath(18, 142, 275, 142, progress);

        // draw "origin" (ScienTeens Lab)
        context.fillStyle = "#44A3C1FF";
        context.font = "6px Urbanist";

        let location = new Image();
        location.src = "../../../assets/icons/location.svg"
        context.drawImage(location, 12, 136, 12, 12);
        let lab = new Image();
        lab.src = "../../../assets/icons/lab.svg";
        context.drawImage(lab, 0, 122, 15, 15);
        context.fillText("ScienTeens Lab", 30, 138);

        // draw "game stage separators" and "intermediary targets"
        context.strokeStyle = "#D8D8D833";
        context.setLineDash([10, 10]);

        drawLineSubpath(100, 137, 100, 12, progress);
        drawLineSubpath(180, 137, 180, 12, progress);
        drawLineSubpath(260, 137, 260, 12, progress);


        context.drawImage(location, 94, 84, 12, 12);
        let food = new Image();
        food.src = "../../../assets/icons/food.svg";
        context.drawImage(food, 105, 70, 13, 13);
        context.fillText("Food", 105, 67)

        context.drawImage(location, 174, 74, 12, 12);
        let bed = new Image();
        bed.src = "../../../assets/icons/bed.svg";
        context.drawImage(bed, 185, 62.5, 13, 13);
        context.fillText("Nap", 185, 55);
        context.fillText("Time", 185, 62);

        context.drawImage(location, 254, 34, 12, 12);
        let gaming = new Image();
        gaming.src = "../../../assets/icons/gaming.svg";
        context.drawImage(gaming, 265, 44, 13, 13);
        context.fillText("Binge", 265, 63);
        context.fillText("Gaming", 265, 70);

        // draw obstacles and "forbidden areas"
        context.strokeStyle = "#C91438FF";
        context.lineWidth = 1.5;
        context.setLineDash([1, 3]);

        let obstacle = new Image();
        obstacle.src = "../../../assets/icons/forbidden.svg";
        context.drawImage(obstacle, 43, 58, 12, 12);
        drawLineSubpath(45.5, 130, 45.5, 69.75, progress);
        drawLineSubpath(49, 130, 49, 70, progress);
        drawLineSubpath(52.5, 130, 52.5, 69.75, progress);

        context.drawImage(obstacle, 123, 84.5, 12, 12);
        drawLineSubpath(125.5, 12, 125.5, 84.5, progress);
        drawLineSubpath(129, 12, 129, 83.5, progress);
        drawLineSubpath(132.5, 12, 132.5, 84.5, progress);

        context.drawImage(obstacle, 153, 66, 12, 12);
        drawLineSubpath(155.5, 138, 155.5, 77.5, progress);
        drawLineSubpath(159, 138, 159, 79, progress);
        drawLineSubpath(162.5, 138, 162.5, 77.5, progress);

        context.drawImage(obstacle, 203, 77, 12, 12);
        drawLineSubpath(205.5, 12, 205.5, 76.75, progress);
        drawLineSubpath(209, 12, 209, 76, progress);
        drawLineSubpath(212.5, 12, 212.5, 76.75, progress);

        context.drawImage(obstacle, 223, 85.5, 12, 12);
        drawLineSubpath(225.5, 138, 225.5, 97, progress);
        drawLineSubpath(229, 138, 229, 98.5, progress);
        drawLineSubpath(232.5, 138, 232.5, 97, progress);

        window.requestAnimationFrame(animationStep);

        // draw quadratic (stage A & C) and cubic (stage B) Bézier curves with control points
        drawBezierGame();

        window.requestAnimationFrame(drawBezierGame);
    });
}

// custom "ease-in" animation completion function (from source 2)
function overshoot (timeFraction) 
{
    // fixed parameter for overshoot distance
    let x = 1.1; 

    return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x);
}

// wrapper function to reverse animation, make it "ease-out" (from source 2)
function easeOut (timing)
{
    return function (timeFraction) { return 1 - timing(1 - timeFraction); };
}





// draw static playground & draggable Bézier curves on window load event
window.addEventListener ("load", function ()
{
    context.translate(10, 0);

    animatedSetup(2500, easeOut(overshoot));
});
