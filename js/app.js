let POINTER_MOVING = false;
let directionAngle, ringCenterX, ringCenterY;
let directionElement, pointerElement;

function setDirectionRingCordinates() {
    const DIRECTION_RECT = directionElement.getBoundingClientRect();  
    ringCenterX = (DIRECTION_RECT.left + DIRECTION_RECT.right) / 2;
    ringCenterY = DIRECTION_RECT.y + (DIRECTION_RECT.height / 2);
}

// once the document is loaded
document.addEventListener('DOMContentLoaded', () => {

    //#####################################################
    // set-up direction ring
    //#####################################################
    // get ring elments
    directionElement = document.querySelector('#direction');
    pointerElement = directionElement.lastElementChild;
    // get cordinates
    setDirectionRingCordinates();
    // listen to dragging the pointer
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

    // listen to resizing the window, update ring cordinates
    window.addEventListener('resize', setDirectionRingCordinates);
});