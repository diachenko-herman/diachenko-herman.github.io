window.addEventListener("load", function() {
    const inputs = document.querySelectorAll('#resulting-image .matrix-input');
    const matrixInputs = document.querySelectorAll('#resulting-matrix .matrix-input');
    const gameArea = document.querySelector('.game-area');
    const popupOverlay = document.getElementById('popupOverlay');
    const gotItButton = document.getElementById('got_it');
    const secondGame = document.querySelector('.second-game'); 
    const missionDescription = document.querySelector('.mission-description-text p');
    const helpImage = document.querySelector('.help-button-container .help-image');
    let popupText = this.document.querySelector('.hex_description');
    let finished = false;

    const correctValues = {
        'input1': 157,
        'input2': 190,
        'input3': 141,
        'input4': 0,
        'input5': -1,
        'input6': 0,
        'input7': -1,
        'input8': value => value === 5 || value === 4, // Allows both 5 and 4 for input8
        'input9': -1,  
        'input10': -1,
        'input11': 0
    };

    function checkInputsCorrect(inputs) {
        return Array.from(inputs).every(input => {
            const value = parseInt(input.value, 10);
            const condition = correctValues[input.id];
            return typeof condition === 'function' ? condition(value) : value === condition;
        });
    }

    inputs.forEach(input => {
        input.addEventListener('change', function() {
            const value = parseInt(this.value, 10);
            const condition = correctValues[this.id];
            if (typeof condition === 'function' ? condition(value) : value === condition) {
                this.style.backgroundColor = '#4DC970FF';
                this.style.borderColor = 'green';
                this.disabled = true;

                if (checkInputsCorrect(inputs)) {
                    popupOverlay.style.display = 'block';
                    gameArea.style.display = "none";
                }
            } else {
                this.style.backgroundColor = '#C91438FF';
                this.style.borderColor = 'red';
            }
        });
    });

    gotItButton.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
        if(finished){
            window.location.href = '../main_page.html'; // Adjust the path as necessary
        }

        missionDescription.innerHTML = `<p>Now that you have an understanding of the gaussian blur kernel, I suggest you familiarize yourself with the sharpening 
                                        matrix which is designed to enhance the edges and details within an image.</p>
                                        You can see 2 pictures: on the left blurred and in the center the same picture but with the use of a sharpening matrix.
                                        You need to guess what values in the matrix were used.
                                        <p>Note that this matrix works by subtracting a portion of the neighboring pixel values from the central pixel value, which 
                                        accentuates the differences or transitions in pixel values, effectively highlighting edges. </p>`;
        helpImage.src = '../../../assets/images/hints.png';
        secondGame.style.display = "flex"; 
        
        matrixInputs.forEach(input => {
            input.addEventListener('change', function() {
                const value = parseInt(this.value, 10);
                const condition = correctValues[this.id];
                if (typeof condition === 'function' ? condition(value) : value === condition) {
                    this.style.backgroundColor = '#4DC970FF';
                    this.style.borderColor = 'green';
                    this.disabled = true;
                    
                    if (checkInputsCorrect(matrixInputs)) {
                        popupText.innerHTML = `<p>You have done all games in the Filters section! </p>You will be redirected to the Homebase page.`;
                        popupOverlay.style.display = "block";
                        finished = true;
                    }
                } else {
                    this.style.backgroundColor = '#C91438FF';
                    this.style.borderColor = 'red';
                }
            });
        });
    });
});
