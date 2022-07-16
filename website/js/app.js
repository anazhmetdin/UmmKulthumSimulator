let directionPointerIsMoving = false;
let directionAngle = 0, ringCenterX, ringCenterY;
let directionElement, pointerElement, directionRect;
const BACK_ABSORPTION = 0.4;
const AMBIENT_RATIO = 0.9
let audioPlayer, audioContext = null, panNode, gainNode;
let distanceSlider;
const INITIAL_GAIN = 1;
let directionGain = INITIAL_GAIN, distanceGain = 0.5;

function setDirectionRingCordinates() {
    directionRect = directionElement.getBoundingClientRect();
    ringCenterX = (directionRect.left + directionRect.right) / 2;
    ringCenterY = directionRect.y + (directionRect.height / 2);
}

function setAudioRatio() {
    const RAD = directionAngle * Math.PI / 180;
    const BALANCE = Math.sin(RAD) * AMBIENT_RATIO;
    const COS = Math.abs(Math.cos(RAD));
    const BACK_DIRECTION_REDUCTION = 1 - BACK_ABSORPTION * COS;
    directionGain = INITIAL_GAIN;
    // let leftRatio, rightRatio;
    
    // if (directionAngle <= 180) {
    //     leftRatio = COS;
    //     rightRatio = 1 + blanace;
    // } else {
    //     leftRatio = 1 - blanace + 2*AMBIENT_RATIO;
    //     rightRatio = COS;
    // }

    if (directionAngle > 90 && directionAngle < 270) {
        // leftRatio *= BACK_DIRECTION_REDUCTION;
        // rightRatio *= BACK_DIRECTION_REDUCTION;
        directionGain = BACK_DIRECTION_REDUCTION;
    }

    return {balance: BALANCE, gain: directionGain * distanceGain};
}

function updateDirection(e = {clientX: ringCenterX+1, clientY: ringCenterY}) {
    directionAngle = 180 - (Math.atan2(e.clientX - ringCenterX, e.clientY - ringCenterY) * (180/Math.PI));
    directionElement.style.transform = `rotate(${directionAngle}deg)`
}

function modifyAudioDirection() {
    let audio;
    if (audioContext != null) {
        audio = setAudioRatio();
        panNode.pan.value = audio.balance;
        gainNode.gain.value = audio.gain;
    }
}

function modifyAudioDistance(e = {target: distanceSlider}) {
    distanceGain = (100-e.target.value)/100 + (1 - AMBIENT_RATIO);
}

function modifyAudioGain() {
    gainNode.gain.value = directionGain * distanceGain;
}

// once the document is loaded
document.addEventListener('DOMContentLoaded', () => {

    //#####################################################
    // set-up direction ring
    //#####################################################
    // get ring elments
    directionElement = document.querySelector('#direction');
    distanceSlider = document.querySelector('#distance');
    pointerElement = directionElement.lastElementChild;
    audioPlayer = document.querySelector('#player');
    
    audioPlayer.addEventListener('play', () => {
        if (audioContext === null) {
            audioContext = new window.AudioContext();
            const AUDIO_SOURCE = audioContext.createMediaElementSource(audioPlayer);
            panNode = new StereoPannerNode(audioContext, { pan: 0});
            gainNode = new GainNode(audioContext, {gain: 1})
            directionGain = 1;
            AUDIO_SOURCE.connect(panNode);
            panNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
            modifyAudioDirection();
            modifyAudioDistance();
            modifyAudioGain();
        }
    })

    // get cordinates
    setDirectionRingCordinates();
    // initialize sterio ratios
    updateDirection();
    setAudioRatio();
    
    // listen to dragging the pointer
    const POINTER_MOVER = (e) => {
        directionPointerIsMoving = true;
        updateDirection(e);
        modifyAudioDirection();
    };
    
    directionElement.querySelector('#direction_ring').addEventListener('mousedown', () => POINTER_MOVER);
    directionElement.addEventListener('mousedown', POINTER_MOVER);

    distanceSlider.addEventListener('input', (e) => {
        if (audioContext != null) {
            modifyAudioDistance(e);
            modifyAudioGain();
        }
    });

    document.addEventListener('mouseup', () => {
        if (directionPointerIsMoving) {
            directionPointerIsMoving = false;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (directionPointerIsMoving) {
            updateDirection(e);
            modifyAudioDirection();
        }
    });
    // listen to resizing the window, update ring cordinates
    window.addEventListener('resize', setDirectionRingCordinates);
});