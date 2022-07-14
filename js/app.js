let POINTER_MOVING = false;
let directionAngle, ringCenterX, ringCenterY;
let leftRatio, rightRatio;
let directionElement, pointerElement;

function setDirectionRingCordinates() {
    const DIRECTION_RECT = directionElement.getBoundingClientRect();  
    ringCenterX = (DIRECTION_RECT.left + DIRECTION_RECT.right) / 2;
    ringCenterY = DIRECTION_RECT.y + (DIRECTION_RECT.height / 2);
}

function setAudioRatio() {
    const AMBIENT = 0.1
    const RAD = directionAngle * Math.PI / 180
    const SIN = Math.sin(RAD) + AMBIENT;
    const COS = Math.abs(Math.cos(RAD))  + AMBIENT;
    
    if (directionAngle <= 180) {
        leftRatio = COS;
        rightRatio = 1 + SIN;
    } else {
        leftRatio = 1 - SIN + 2*AMBIENT;
        rightRatio = COS;
    }

    if (directionAngle > 90 && directionAngle < 270) {
        const BACK_DIRECTION_REDUCTION = 1 - 0.25 * Math.sin(RAD - Math.PI/2);
        leftRatio *= BACK_DIRECTION_REDUCTION;
        rightRatio *= BACK_DIRECTION_REDUCTION;
    }
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
    // initialize sterio ratios
    setAudioRatio();
    // listen to dragging the pointer
    directionElement.querySelector('#direction_ring').addEventListener('mousedown', () => POINTER_MOVING = true);

    document.addEventListener('mouseup', () => {
        if (POINTER_MOVING) {
            POINTER_MOVING = false;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (POINTER_MOVING) {
            directionAngle = 180 - (Math.atan2(e.clientX - ringCenterX, e.clientY - ringCenterY) * (180/Math.PI));
            directionElement.style.transform = `rotate(${directionAngle}deg)`
            setAudioRatio();
        }
    });

    // listen to resizing the window, update ring cordinates
    window.addEventListener('resize', setDirectionRingCordinates);
});