// activate strict mode for JavaScript with restricted & "safer" syntax and different runtime behaviour
"use strict";

/* --------------------------------------- */
/* script for mission description dropdown */
/* --------------------------------------- */

// retrieve layout container (requires adjustment to new layout height when dropdown toggled)
const layout = document.querySelector(".layout-container");

// retrieve game container (adding/removing rounded corners of bottom edge when dropdown expanded/collapsed)
const gameContainer = document.querySelector(".game-container");

// retrieve mission description dropdown button
const dropdown = document.querySelector(".description-toggler");

// add click event listener to mission description dropdown button...
dropdown.addEventListener("click", function ()
{
    // ... to add new class "opened" to class list of <button> element inside mission description 
    this.classList.toggle("opened");

    // ... and to dynamically compute the height of the mission description panel <div> element
    const dropdownContent = this.nextElementSibling;
    let contentHeight = dropdownContent.style.maxHeight;

    // fetch "max-height" CSS property for clicked dropdown button's description panel AFTER WINDOW LOADING for variable initialisation
    window.addEventListener("load", function ()
    {
        // ... since external styling properties are only available after loading & applying external stylesheet(s)
        contentHeight = window.getComputedStyle(dropdownContent).getPropertyValue("max-height");
    });

    if (contentHeight)
    {
        // if content is expanded, click will cause the content to collapse (no height specified)
        dropdownContent.style.maxHeight = null;
        layout.style.height = "100%";
        layout.style.paddingBottom = "0";
        gameContainer.style.borderRadius = "20px 20px 0 0";
    }
    else
    {
        // if content is collapsed, click will cause the content to be expanded to full scroll height
        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
        layout.style.height = "fit-content";
        layout.style.paddingBottom = "2%";
        gameContainer.style.borderRadius = "20px";
    }
});
