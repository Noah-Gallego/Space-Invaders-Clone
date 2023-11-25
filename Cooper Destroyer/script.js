"use strict"

let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersID;
let goingRight = true;
let aliensRemoved = [];

const grid = document.querySelector(".grid");

for (let i = 0; i < 225; i++) { //Iterate over every square
    const square = document.createElement('div'); //Store the newly created 225 elements ("div") in a variable: square
    grid.appendChild(square) //Append the Grid to the Squares
};

const squares = Array.from(document.querySelectorAll('.grid div')); //Store all of the Divs in the grid in squares
console.log(squares);

const alienInvaders = [ //Store all of the invaders in a array
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
];

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) { //Iterate over every alien
        if(!aliensRemoved.includes(i)) { //If the alien does not include
            squares[alienInvaders[i]].classList.add('invader'); //Add the invader class to the square specified in the array
        }
    }
}

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) { //Iterate over every alien
        squares[alienInvaders[i]].classList.remove('invader'); // Remove the alien class from the square
    }
}

draw() // Call the draw function

squares[currentShooterIndex].classList.add('shooter'); //Add the shooter to a square div

function moveShooter(e) { //Function that takes in the parameter e (for event)
    switch(e.key) { //Switch statement taking in the key event
        case 'ArrowLeft': //If left arrow is pressed
            if (currentShooterIndex % width !== 0) { //If the remainder of the currentShooterIndex does not equal 0 
                currentShooterIndex -= 1; // Subtract the shooter index by 1
                squares[currentShooterIndex + 1].classList.remove('shooter'); //Remove the shooter class from the old shooter location
            }
            break;
        
        case 'ArrowRight': //If right arrow is pressed
            if (currentShooterIndex % width < width - 1) { // If the remainder of currentShooterIndex / width is less than the width of the grid - 1
                currentShooterIndex +=1 //Move the shooter right (add 1 to its position)
                squares[currentShooterIndex - 1].classList.remove('shooter'); // Remove shooter from old locaiton
            }
            break;
    } 
    squares[currentShooterIndex].classList.add('shooter'); // Add the shooter class to the current shooter position
}

document.addEventListener("keydown", moveShooter); //If keydown is true, call the moveShooter function


function moveInvaders() { //Function
    const leftEdge = alienInvaders[0] % width == 0 // TODO COMMENT EXPLANATION ON THE CODE HERE AND TO THE END OF SCRIPT NOTICE
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width == width - 1
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            goingRight = false;
            alienInvaders[i] += width +1;
            direction = - 1;
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            goingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw()

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        document.querySelector('.results').classList.remove('hide');
        clearInterval(invadersID);
    }
    
    for (let i = 0; i < alienInvaders.length; i++) {
        if(alienInvaders[i] > squares.length) {
            document.querySelector('.results').classList.remove('hide');
            clearInterval(invadersID);
        }
    }
    if (aliensRemoved.length === alienInvaders.length) {
        clearInterval(invadersID);
        document.querySelector('.winner').classList.remove('hide');
    }
}

invadersID = setInterval(moveInvaders, 100)

function shoot(e) {
    let laserID;
    let currentLaserIndex = currentShooterIndex;
    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add('laser');

        if(squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserID)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            document.querySelector('.current-score').textContent++
            console.log(aliensRemoved);
        }

    }
    switch(e.key) {
        case 'ArrowUp':
            laserID = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keyup', shoot);