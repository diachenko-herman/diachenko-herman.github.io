// activate strict mode for JavaScript with restricted & "safer" syntax and different runtime behaviour
"use strict";

/* --------------------------------------------------------------------------------- */
/* script for sharpening of blurry HTML canvas display due to default bitmap scaling */
/* --------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------- */
/* adopted from "Understanding and Fixing Blurry HTML Canvases" by Alexander Jhin on "Medium"  */
/* https://medium.com/@doomgoober/understanding-html-canvas-scaling-and-sizing-c04925d9a830    */
/* ------------------------------------------------------------------------------------------- */

const canvas = document.querySelector("#playground");

// fetch initial canvas width and height (number of pixels in canvas bitmap)
const initialCanvasWidth = canvas.width;
const initialCanvasHeight = canvas.height;

// computes canvas' bitmap dimensions to match responsive CSS dimensions
function getObjectFitSize (contains, containerWidth, containerHeight, width, height)
{
    // compute aspect ratio of canvas bitmap
    let canvasRatio = width / height;

    // compute aspect ratio of currently blurry & distorted CSS display
    let containerRatio = containerWidth / containerHeight;
    
    // "contains == true" means "fit canvas into CSS dimensions, while maintaining bitmap aspect ratio" 
    // does not resolve distortion yet, due to canvas bitmap scaling !!!
    let test = contains ? canvasRatio >= containerRatio : canvasRatio < containerRatio;
  
    // new dimensions for canvas bitmap to allow 1:1 rendering (bitmap vs. CSS) 
    let targetWidth = 0;
    let targetHeight = 0;

    if (test) 
    {
      targetWidth = containerWidth;
      targetHeight = targetWidth / canvasRatio;
    } 
    else 
    {
      targetHeight = containerHeight;
      targetWidth = targetHeight * canvasRatio;
    }
  
    return {width: targetWidth, height: targetHeight, 
            x: (containerWidth - targetWidth) / 2, y: (containerHeight - targetHeight) / 2};
}

// sets up sharp canvas for Bézier mini-game playground (with consistently scaled drawing context for convenience)
function render () 
{
    let newDimensions = getObjectFitSize(true, canvas.clientWidth, canvas.clientHeight, canvas.width, canvas.height);

    // takes into account additional scaling for high-density pixel devices (e.g. Retina Display) !!!
    // window.devicePixelRation returns resolution ratio between physical pixels and CSS pixels for current display device
    const dpr = window.devicePixelRatio || 1;

    canvas.width = newDimensions.width * dpr;
    canvas.height = newDimensions.height * dpr;

    // also scales rendering context for consistent appearance of drawn shapes (same scaling as done for canvas bitmap)
    // thus no change of drawing code required !!!
    let context = canvas.getContext("2d");
    let ratio = Math.min(canvas.clientWidth / initialCanvasWidth, canvas.clientHeight / initialCanvasHeight);

    context.scale(ratio * dpr, ratio * dpr);
}

render();
