let pointerIsMoving = false;
let directionAngle, ringCenterX, ringCenterY;
let directionElement, pointerElement, directionRect;
const AMBIENT_RATIO = 0.9
let audioPlayer, audioContext = null, panNode, gainNode;

function setDirectionRingCordinates() {
    directionRect = directionElement.getBoundingClientRect();
    ringCenterX = (directionRect.left + directionRect.right) / 2;
    ringCenterY = directionRect.y + (directionRect.height / 2);
}

function setAudioRatio() {
    const RAD = directionAngle * Math.PI / 180
    const BALANCE = Math.sin(RAD) * AMBIENT_RATIO;
    const COS = Math.abs(Math.cos(RAD));
    const BACK_DIRECTION_REDUCTION = 1 - 0.35 * COS;
    let gain = 1;
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
        gain = BACK_DIRECTION_REDUCTION;
    }

    return {balance: BALANCE, gain: gain};
}

function updateDirection(e) {
    directionAngle = 180 - (Math.atan2(e.clientX - ringCenterX, e.clientY - ringCenterY) * (180/Math.PI));
    directionElement.style.transform = `rotate(${directionAngle}deg)`
}

function modifyAudio() {
    let audio = setAudioRatio();
    panNode.pan.value = audio.balance;
    gainNode.gain.value = audio.gain;
}

// once the document is loaded
document.addEventListener('DOMContentLoaded', () => {

    //#####################################################
    // set-up direction ring
    //#####################################################
    // get ring elments
    directionElement = document.querySelector('#direction');
    pointerElement = directionElement.lastElementChild;
    
    audioPlayer = document.querySelector('#player');
    
    audioPlayer.addEventListener('play', () => {
        if (audioContext === null) {
            audioContext = new window.AudioContext();
            const AUDIO_SOURCE = audioContext.createMediaElementSource(audioPlayer);
            panNode = new StereoPannerNode(audioContext, { pan: 0});
            gainNode = new GainNode(audioContext, {gain: 1})
            AUDIO_SOURCE.connect(panNode);
            panNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
        }
    })

    // get cordinates
    setDirectionRingCordinates();
    // initialize sterio ratios
    setAudioRatio();
    
    // listen to dragging the pointer
    const POINTER_MOVER = (e) => {
        pointerIsMoving = true;
        updateDirection(e);
        modifyAudio();
    };
    directionElement.querySelector('#direction_ring').addEventListener('mousedown', () => POINTER_MOVER);
    directionElement.addEventListener('mousedown', POINTER_MOVER);

    document.addEventListener('mouseup', () => {
        if (pointerIsMoving) {
            pointerIsMoving = false;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (pointerIsMoving) {
            updateDirection(e);
            modifyAudio();
        }
    });

    // listen to resizing the window, update ring cordinates
    window.addEventListener('resize', setDirectionRingCordinates);
});