// activate strict mode for JavaScript with restricted & "safer" syntax and different runtime behaviour
"use strict";

// add click event listener to the mission description (dropwdown) button
document.getElementById('dropdown-button').addEventListener('click', function() 
{
    // get mission description HTML element reference
    const description = document.getElementById('mission-description');
    
    // toggle the 'mission-description-expanded' class on the description HTML element
    description.classList.toggle('mission-description-expanded');
    
    // if description element has a maxHeight style applied...
    if (description.style.maxHeight) 
    {
      // ...remove maxHeight style attribute (collapse)
      description.style.maxHeight = null;
    } 
    else 
    {
      // ... or otherwise, set maxHeight to scrollHeight of mission description
      // scrollHeight describes an element's total content height, including the overflow
      description.style.maxHeight = description.scrollHeight + "px";
    }
});
