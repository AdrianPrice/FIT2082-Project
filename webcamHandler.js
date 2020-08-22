
/**
 * Sets videoElem to display the webcam
 * @param {*} videoElem the html element in which to display the webcam
 */
function setVideoStream(videoElem) {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                videoElem.srcObject = stream;
            })
            .catch(function (err0r) {
            console.log(err0r);
            });
        }
}

/*
    ADD WEBCAM TO SCENE
*/
export function startWebcam() {
    setVideoStream(document.querySelector("#webcamDisplay"));
}  