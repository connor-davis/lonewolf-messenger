import { messaging } from 'lonewolf-protocol';
import moment from 'moment';

let createAudioRecording = (roomId, publicKey, callback = () => {}) => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    let mediaRecorder = new MediaRecorder(stream);

    callback(mediaRecorder);

    let start = moment(Date.now());

    let chunks = [];

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = function (e) {
      const blob = new Blob(chunks, { type: 'audio/mp3; codecs=opus' });
      chunks = [];

      var reader = new window.FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async function () {
        var base64data = reader.result;

        let end = moment(Date.now());

        messaging.sendVoiceMessage(
          roomId,
          publicKey,
          {
            data: base64data.split(',')[1],
            duration: end.diff(start),
          },
          ({ errMessage, success }) => {
            if (errMessage) return console.log(errMessage);
            else return console.log(success);
          }
        );
      };

      stream.getTracks().forEach(function (track) {
        if (track.readyState == 'live' && track.kind === 'audio') {
          track.stop();
        }
      });

      return;
    };
  });
};

export default createAudioRecording;
