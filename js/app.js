let POINTER_MOVING = false;
let directionAngle, ringCenterX, ringCenterY;
let leftRatio, rightRatio;
let directionElement, pointerElement, directionRect;
const AMBIENT_RATIO = 0.1

function setDirectionRingCordinates() {
    ringCenterX = (directionRect.left + directionRect.right) / 2;
    ringCenterY = directionRect.y + (directionRect.height / 2);
}

function setAudioRatio() {
    const RAD = directionAngle * Math.PI / 180
    const SIN = Math.sin(RAD) + AMBIENT_RATIO;
    const COS = Math.abs(Math.cos(RAD))  + AMBIENT_RATIO;
    const BACK_DIRECTION_REDUCTION = 1 - 0.25 * (COS - AMBIENT_RATIO);
    
    if (directionAngle <= 180) {
        leftRatio = COS;
        rightRatio = 1 + SIN;
    } else {
        leftRatio = 1 - SIN + 2*AMBIENT_RATIO;
        rightRatio = COS;
    }

    if (directionAngle > 90 && directionAngle < 270) {
        leftRatio *= BACK_DIRECTION_REDUCTION;
        rightRatio *= BACK_DIRECTION_REDUCTION;
    }
}

function updateDirection(e) {
    directionAngle = 180 - (Math.atan2(e.clientX - ringCenterX, e.clientY - ringCenterY) * (180/Math.PI));
    directionElement.style.transform = `rotate(${directionAngle}deg)`
}

// once the document is loaded
document.addEventListener('DOMContentLoaded', () => {

    //#####################################################
    // set-up direction ring
    //#####################################################
    // get ring elments
    directionElement = document.querySelector('#direction');
    directionRect = directionElement.getBoundingClientRect();
    pointerElement = directionElement.lastElementChild;
    // get cordinates
    setDirectionRingCordinates();
    // initialize sterio ratios
    setAudioRatio();
    // listen to dragging the pointer
    const POINTER_MOVER = (e) => {
        POINTER_MOVING = true;
        updateDirection(e);
    };
    directionElement.querySelector('#direction_ring').addEventListener('mousedown', () => POINTER_MOVER);
    directionElement.addEventListener('mousedown', POINTER_MOVER);

    document.addEventListener('mouseup', () => {
        if (POINTER_MOVING) {
            POINTER_MOVING = false;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (POINTER_MOVING) {
            updateDirection(e);
            setAudioRatio();
        }
    });

    // listen to resizing the window, update ring cordinates
    window.addEventListener('resize', setDirectionRingCordinates);
});