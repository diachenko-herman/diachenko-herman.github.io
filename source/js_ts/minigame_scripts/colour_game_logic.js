// activate strict mode for JavaScript with restricted & "safer" syntax and different runtime behaviour
"use strict";

// add click event listener to the mission description (dropwdown) button
document.getElementById('dropdown-button').addEventListener('click', function () {
  // get mission description HTML element reference
  const description = document.getElementById('mission-description');

  // toggle the 'mission-description-expanded' class on the description HTML element
  description.classList.toggle('mission-description-expanded');

  // if description element has a maxHeight style applied...
  if (description.style.maxHeight) {
    // ...remove maxHeight style attribute (collapse)
    description.style.maxHeight = null;
  }
  else {
    // ... or otherwise, set maxHeight to scrollHeight of mission description
    // scrollHeight describes an element's total content height, including the overflow
    description.style.maxHeight = description.scrollHeight + "px";
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  checkAllHexInputs();
  document.querySelectorAll('.HEX_input').forEach(function (input) {
    input.addEventListener('input', function () {
      input.value = input.value.replace(/[^a-f0-9]/gi, '').toUpperCase();
    });
  });
});



// Mix color based on sliders input
const r = document.getElementById('red_slider');
const g = document.getElementById('green_slider');
const b = document.getElementById('blue_slider');
const a = document.getElementById('alpha_slider');
const colorDisplay = document.getElementById('mixture_color_box');

const rValue = document.getElementById('r_value');
const gValue = document.getElementById('g_value');
const bValue = document.getElementById('b_value');
const aValue = document.getElementById('a_value');

const redContainer = document.querySelector('.red_value');
const greenContainer = document.querySelector('.green_value');
const blueContainer = document.querySelector('.blue_value');
const alphaContainer = document.querySelector('.alpha_value');

function standardizeColor(color) {
  if (!color) return ''; // Handle cases where the color is not set
  let [r, g, b, a = '1'] = color.match(/\d+\.?\d*/g);
  return `rgba(${r}, ${g}, ${b}, ${parseFloat(a).toFixed(2)})`;
}


function parseColor(rgba) {
  let [r, g, b, a = 1] = rgba.match(/\d+\.?\d*/g).map(Number);
  return { r, g, b, a };
}


function isColorWithinTolerance(mixedColor, targetColor, tolerance) {
  let mixed = parseColor(mixedColor);
  let target = parseColor(targetColor);

  return Object.keys(mixed).every(key => {
    let lowerBound = target[key] - (target[key] * tolerance);
    let upperBound = target[key] + (target[key] * tolerance);
    return mixed[key] >= lowerBound && mixed[key] <= upperBound;
  });
}


function updateColor() {
  const red = r.value;
  const green = g.value;
  const blue = b.value;
  const alpha = a.value;
  const rgbaColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  colorDisplay.style.backgroundColor = rgbaColor;


  // Update the text in the labels:
  rValue.textContent = red;
  gValue.textContent = green;
  bValue.textContent = blue;
  aValue.textContent = parseFloat(alpha).toFixed(2);

  // Update the border opacity
  redContainer.style.border = `solid 6px rgba(255, 0, 0, ${red / 255})`;
  greenContainer.style.border = `solid 6px rgba(0, 255, 0, ${green / 255})`;
  blueContainer.style.border = `solid 6px rgba(0, 0, 255, ${blue / 255})`;
  alphaContainer.style.border = `solid 6px rgba(0, 0, 0, ${alpha})`;

  const targetColorStyle = window.getComputedStyle(document.getElementById('target_color_box'));
  const targetColor = targetColorStyle.backgroundColor;


  if (isColorWithinTolerance(rgbaColor, targetColor, 0.04)) {
    document.querySelector('.input_fields').classList.remove('blocked');
    document.querySelector('.input_fields').classList.add('unblocked');

    document.querySelector('.circle_button_cover').classList.remove('blocked');
    document.querySelector('.circle_button_cover').classList.add('unblocked');

    let exactColor = parseColor(targetColor);
    document.getElementById('red_slider').value = exactColor.r;
    document.getElementById('green_slider').value = exactColor.g;
    document.getElementById('blue_slider').value = exactColor.b;
    document.getElementById('alpha_slider').value = exactColor.a.toFixed(2);


    // Update display and values accordingly
    rValue.textContent = exactColor.r;
    gValue.textContent = exactColor.g;
    bValue.textContent = exactColor.b;
    aValue.textContent = exactColor.a.toFixed(2);
    colorDisplay.style.backgroundColor = `rgba(${exactColor.r}, ${exactColor.g}, ${exactColor.b}, ${exactColor.a.toFixed(2)})`;
    disableSliders(true);
    setTimeout(popupFunction, 1000);
  } else {
    document.querySelector('.input_fields').classList.add('blocked');
    document.querySelector('.input_fields').classList.remove('unblocked');
    document.querySelector('.circle_button_cover').classList.add('blocked');
    document.querySelector('.circle_button_cover').classList.remove('unblocked');
    disableSliders(false);

  }
}

function disableSliders(disable) {
  // Get all slider elements
  const sliders = document.querySelectorAll('.slider');
  sliders.forEach(slider => {
    slider.disabled = disable;
    if (disable) {
      slider.style.opacity = 0.4;
      slider.parentElement.style.opacity = 0.4;
      slider.style.pointerEvents = 'none';
    }
    else {
      slider.style.opacity = 1;
      slider.parentElement.style.opacity = 1;
      slider.style.pointerEvents = 'auto';
    }
  });

}


function updateColorAfterErase(r, g, b, a) {
  const red = r;
  const green = g;
  const blue = b;
  const alpha = a;
  const rgbaColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  colorDisplay.style.backgroundColor = rgbaColor;


  // Update the text in the labels:
  rValue.textContent = red;
  gValue.textContent = green;
  bValue.textContent = blue;
  aValue.textContent = parseFloat(alpha).toFixed(2);

  // Update the border opacity
  redContainer.style.border = `solid 6px rgba(255, 0, 0, ${red / 255})`;
  greenContainer.style.border = `solid 6px rgba(0, 255, 0, ${green / 255})`;
  blueContainer.style.border = `solid 6px rgba(0, 0, 255, ${blue / 255})`;
  alphaContainer.style.border = `solid 6px rgba(0, 0, 0, ${alpha})`;

  const targetColorStyle = window.getComputedStyle(document.getElementById('target_color_box'));
  const targetColor = targetColorStyle.backgroundColor;


  if (isColorWithinTolerance(rgbaColor, targetColor, 0.04)) {
    document.querySelector('.input_fields').classList.remove('blocked');
    document.querySelector('.input_fields').classList.add('unblocked');


  } else {
    document.querySelector('.input_fields').classList.add('blocked');
    document.querySelector('.input_fields').classList.remove('unblocked');


  }

  function clearAllInputs() {
    var inputs = document.getElementsByClassName('HEX_input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
  }

  function clearInputsBorders() {
    document.getElementById('R').style.border = "8.5px solid rgba(217, 217, 217, 0.75)";
    document.getElementById('G').style.border = "8.5px solid rgba(217, 217, 217, 0.75)";
    document.getElementById('B').style.border = "8.5px solid rgba(217, 217, 217, 0.75)";
    document.getElementById('A').style.border = "8.5px solid rgba(217, 217, 217, 0.75)";

  }

  clearInputsBorders();

  clearAllInputs();

  checkAllHexInputs();


}



// HEX COMPUTATION

function parseColorForHEX(rgba) {
  let [r, g, b, a = 1] = rgba.replace(/rgba?\(|\s+|\)/g, '').split(',').map(Number);
  return { r, g, b, a };
}



function checkColorMatch(component) {
  const hexInput = document.getElementById(component).value;
  const decimalValue = parseInt(hexInput, 16);

  // Fetch the target color and parse its RGBA components
  const targetColor = window.getComputedStyle(document.getElementById('target_color_box')).backgroundColor;
  const { r, g, b, a } = parseColorForHEX(targetColor);

  let targetValue;
  switch (component) {
    case 'R':
      targetValue = r;
      break;
    case 'G':
      targetValue = g;
      break;
    case 'B':
      targetValue = b;
      break;
    case 'A':  // Alpha value assumed to be 0-255 scale
      targetValue = Math.round(a * 255);  // Convert from 0-1 scale if necessary
      break;
  }

  // Update the input field border based on comparison
  if (decimalValue === targetValue) {
    document.getElementById('passed' + component).style.display = "block"; // Show SVG// Correct match
    document.getElementById('failed' + component).style.display = "none"; // Hide SVG

  } else if (hexInput == "") {
    document.getElementById(component).style.border = "8.5px solid rgba(217, 217, 217, 0.75)"; // Empty input field
    document.getElementById('passed' + component).style.display = "none"; // Hide SVG
    document.getElementById('failed' + component).style.display = "none"; // Hide SVG


  }
  else {
    document.getElementById('passed' + component).style.display = "none"; // Show SVG// Correct match
    document.getElementById('failed' + component).style.display = "block"; // Hide SVG

  }
  checkAllHexInputs();
}



function checkAllHexInputs() {
  // const hexInputs = document.querySelectorAll('.HEX_input');
  // const allCorrect = Array.from(hexInputs).every(input => input.style.border.includes('green'));
  

  const passedElements = ['R', 'G', 'B', 'A'].map(component => document.getElementById('passed' + component));
  const allCorrect = passedElements.every(element => window.getComputedStyle(element).display !== 'none');

  const button = document.getElementById('circle_button');
  const acctualbutton = document.getElementById('circle_button_fonts');
  const container_border_color = document.getElementById('circle_button_container');
  if (allCorrect) {
    button.classList.remove('blocked');
    container_border_color.style.border = "4px solid #65cdec";
    container_border_color.classList.remove('tooltip_yes');
    acctualbutton.style.color = ''; // Reset to CSS default
    button.style.pointerEvents = 'auto'; // Re-enable clicking
    acctualbutton.style.cursor = 'pointer'; // Standard cursor
  } else {
    button.classList.add('blocked');
    container_border_color.style.border = "4px solid grey";
    container_border_color.classList.add('tooltip_yes');
    acctualbutton.style.color = 'grey';
    button.style.pointerEvents = 'none'; // Disable clicking
    acctualbutton.style.cursor = 'not-allowed'; // Cursor indicates button is disabled
  }
}




//////////////////////////  LOCAL STORAGE  //////////////////////////

// Function to save slider value to localStorage
function saveSliderValue(sliderId) {
  let slider = document.getElementById(sliderId);
  slider.addEventListener('change', function () {
    localStorage.setItem(sliderId + 'Value', slider.value);
  });
}

// Function to load slider value from localStorage
function loadSliderValue(sliderId) {
  let savedValue = localStorage.getItem(sliderId + 'Value');
  if (savedValue) {
    document.getElementById(sliderId).value = savedValue;
  }
}

function updateLevel(newLevel) {
  level = newLevel; // Update the level variable
  localStorage.setItem('currentLevel', level); // Save the new level to localStorage
}

// Use this function to update the level instead of directly modifying the level variable.
// Example usage within your existing level-up code:
let level = 0;

function initializeGame() {
  let savedLevel = localStorage.getItem('currentLevel');
  if (savedLevel) {
    level = parseInt(savedLevel, 10); // Make sure to parse the string as an integer
  } else {
    level = 0; // Default to the first level if nothing is saved
  }
  setTargetColorBasedOnLevel(level); // Set the initial target color based on the loaded level
}


function setTargetColorBasedOnLevel(level) {
  let tooltipText;
  let targetColor;
  switch (level) {
    case 0:
      targetColor = 'rgb(255, 0, 0, 0.5)'; // Red
      tooltipText = 'The color is red. Pay attention to alpha value!';
      break;
    case 1:
      targetColor = 'rgb(255, 255, 255)'; // White
      tooltipText = 'Mix color white. Remember the intesity of colors!';
      break;
    case 2:
      targetColor = 'rgb(255, 255, 0)'; // Yellow
      tooltipText = 'Mix of only two colors, one of them is red.';
      break;
    case 3:
      targetColor = 'rgb(0, 162, 255)'; //Blue
      tooltipText = 'R = 0';
      break;
    default:
      resetGame()
      showFinalLevelPopup(); // Handle levels beyond what's defined
      return;
  }
  document.getElementById('target_color_box').style.backgroundColor = targetColor;
  document.getElementById('help_button_fonts').setAttribute('data-tooltip', tooltipText);

}

function resetGame() {
  localStorage.removeItem('currentLevel'); // Clear the saved level
  updateLevel(0); // Reset to the first level
  // Additional reset operations...
}



// Set up event listeners and load values for all sliders on window load
window.onload = function () {

  initializeGame();

  const inputIds = ['R', 'G', 'B', 'A'];
  inputIds.forEach(function (inputId) {
    saveInputValue(inputId);
    loadInputValue(inputId);
  });
  const sliderIds = ['red_slider', 'green_slider', 'blue_slider', 'alpha_slider'];
  sliderIds.forEach(function (sliderId) {
    saveSliderValue(sliderId);
    loadSliderValue(sliderId);
    r.addEventListener('input', updateColor);
    g.addEventListener('input', updateColor);
    b.addEventListener('input', updateColor);
    a.addEventListener('input', updateColor);

    updateColor();
    checkColorMatch('R');
    checkColorMatch('G');
    checkColorMatch('B');
    checkColorMatch('A');
  });
};


// Function to save input value to localStorage
function saveInputValue(inputId) {
  let input = document.getElementById(inputId);
  input.addEventListener('input', function () {
    localStorage.setItem(inputId + 'Value', input.value);
  });
}

// Function to load input value from localStorage
function loadInputValue(inputId) {
  let savedValue = localStorage.getItem(inputId + 'Value');
  if (savedValue) {
    document.getElementById(inputId).value = savedValue;
  }
}


// Check circle button 
document.getElementById('circle_button').addEventListener('click', function () {
  // Hide all 'passed' SVG elements
  ['R', 'G', 'B', 'A'].forEach(component => {
    const passedElement = document.getElementById('passed' + component);
    if (passedElement) {
      passedElement.style.display = 'none';
    }
  });

  r.value = 0;
  g.value = 0;
  b.value = 0;
  a.value = 0;

  updateColorAfterErase(0, 0, 0, 0);
  disableSliders(false);
  updateLevel(level + 1);
  if (level == 4) {
    showFinalLevelPopup(); // Handle levels beyond what's defined
    localStorage.removeItem('red_sliderValue');
    localStorage.removeItem('green_sliderValue');
    localStorage.removeItem('blue_sliderValue');
    localStorage.removeItem('alpha_sliderValue');
    localStorage.removeItem('RValue');
    localStorage.removeItem('GValue');
    localStorage.removeItem('BValue');
    localStorage.removeItem('AValue');

  }
    
  initializeGame();
  nextLevelPopUp();


  function nextLevelPopUp() {
    const popupOverlay = document.getElementById('popupOverlay');
    const popupContent = document.getElementById('popup').querySelector('.popup-content');
    popupContent.innerHTML = `
      <p class="color_targeted">Good Job!</p>
      <p>You are on the next level, let's compute a different colour</p>
      <button id="gotITT" class="final-button">Got it!</button>
  `;
    const goToTheoryButton = document.getElementById('gotITT');
    goToTheoryButton.addEventListener('click', function () {
      popupOverlay.style.display = 'none';
    });

    goToTheoryButton.style.padding = '10px 17px';

    popupOverlay.style.display = 'block';
  }

  function showFinalLevelPopup() {
    const popupOverlay = document.getElementById('popupOverlay');
    const popupContent = document.getElementById('popup').querySelector('.popup-content');
    popupContent.innerHTML = `
      <p class="color_targeted">Good Job!</p>
      <p>You've completed all the levels.</p>
      <button id="goToTheory" class="final-button">Homebase</button>
  `;
    const goToTheoryButton = document.getElementById('goToTheory');
    goToTheoryButton.addEventListener('click', function () {
      window.location.href = '../main_page.html';
    });

    popupOverlay.style.backdropFilter = 'blur(20px)';

    goToTheoryButton.style.padding = '10px 17px';

    popupOverlay.style.display = 'block';
  }
  localStorage.removeItem('red_sliderValue');
  localStorage.removeItem('green_sliderValue');
  localStorage.removeItem('blue_sliderValue');
  localStorage.removeItem('alpha_sliderValue');
  localStorage.removeItem('RValue');
  localStorage.removeItem('GValue');
  localStorage.removeItem('BValue');
  localStorage.removeItem('AValue');


});



let isPopUpCalled = false;


function popupFunction() {


  const popupOverlay = document.getElementById('popupOverlay');

  const popup = document.getElementById('popup');


  const submitButton = document.getElementById('got_it');

  // Function to open the popup

  function openPopup() {

    popupOverlay.style.display = 'block';
    isPopUpCalled = true;

  }

  // Function to close the popup

  function closePopupFunc() {

    popupOverlay.style.display = 'none';

  }


  submitButton.addEventListener('click', function () {
    closePopupFunc();
  });
  // Event listeners

  if (!isPopUpCalled) {
    openPopup();
  } else { return }



  // Close the popup when clicking outside the popup content

  popupOverlay.addEventListener('click', function (event) {

    if (event.target === popupOverlay) {

      closePopupFunc();

    }

  });


}
