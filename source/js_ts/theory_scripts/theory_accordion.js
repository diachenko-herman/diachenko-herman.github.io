// activate strict mode for JavaScript with restricted & "safer" syntax and different runtime behaviour
"use strict";

/* -------------------------------------------- */
/* script for dynamic accordion dropdown panels */
/* -------------------------------------------- */

// retrieve all dropdown buttons
const dropdowns = document.querySelectorAll(".concept-toggler");
let index;

// add click event listener to each dropdown button...
for (index = 0; index < dropdowns.length; ++index)
{
    dropdowns[index].addEventListener("click", function ()
    {
        // ... to add new class "opened" to class list of respective <button> element inside an accordion list item
        this.classList.toggle("opened");

        // ... and to dynamically compute the height of the respective concept panel <div> element
        const dropdownContent = this.nextElementSibling;
        let contentHeight = dropdownContent.style.maxHeight;

        // fetch "max-height" CSS property for clicked dropdown button's content panel AFTER WINDOW LOADING for variable initialisation
        window.addEventListener("load", function ()
        {
            // ... since external styling properties are only available after loading & applying external stylesheet(s)
            contentHeight = window.getComputedStyle(dropdownContent).getPropertyValue("max-height");
        });

        if (contentHeight)
        {
            // if content is expanded, click will cause the content to collapse (no height specified)
            dropdownContent.style.maxHeight = null;
        }
        else
        {
            // if content is collapsed, click will cause the content to be expanded to full scroll height
            dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
        }
    });
}
