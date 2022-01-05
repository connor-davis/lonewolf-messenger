import { SEA } from 'gun/gun';
import { gun, messaging } from 'lonewolf-protocol';
import moment from 'moment';
import { v4 } from 'uuid';

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

        let userPub = await gun.user().pair().pub;
        let userPair = await gun.user()._.sea;
        let friend = await gun.user(publicKey);

        let messageId = v4();
        let timeSent = Date.now();
        let end = moment(Date.now());

        let secret = await SEA.secret(friend.epub, userPair);
        let encryptedMessage = await SEA.encrypt(
          JSON.stringify({
            id: messageId,
            content: base64data,
            duration: end.diff(start),
            timeSent,
            sender: userPub,
            type: 'voice',
          }),
          secret
        );

        let upload = await ipfs.add(encryptedMessage);

        messaging.sendVoiceMessage(
          roomId,
          publicKey,
          encryptedMessage,
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
