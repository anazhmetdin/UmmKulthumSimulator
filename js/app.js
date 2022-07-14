let POINTER_MOVING = false;
let directionAngle, ringCenterX, ringCenterY, pointer0X, pointer0Y;
let directionElement, pointerElement;

// once the document is loaded
document.addEventListener('DOMContentLoaded', () => {

    directionElement = document.querySelector('#direction')
    
    const DIRECTION_RECT = directionElement.getBoundingClientRect();  
    
    ringCenterX = (DIRECTION_RECT.left + DIRECTION_RECT.right) / 2;
    ringCenterY = DIRECTION_RECT.y + (DIRECTION_RECT.height / 2);

    pointerElement = directionElement.lastElementChild;

    const POINTER_RECT = pointerElement.getBoundingClientRect();

    pointer0X = (POINTER_RECT.left + POINTER_RECT.right) / 2;
    pointer0Y = POINTER_RECT.y + (POINTER_RECT.height / 2);

    pointerElement.addEventListener('mousedown', () => POINTER_MOVING = true);

    document.addEventListener('mouseup', () => {
        if (POINTER_MOVING) {
            POINTER_MOVING = false;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (POINTER_MOVING) {
            directionAngle = 180 - (Math.atan2(e.clientX - ringCenterX, e.clientY - ringCenterY) * (180/Math.PI));
            directionElement.style.transform = `rotate(${directionAngle}deg)`
        }
    });

    console.log(directionAngle);
});