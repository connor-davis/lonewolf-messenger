import { gun, messaging } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useMessageList = (roomId, pub) => {
  let [state, setState] = createStore([]);

  onMount(async () => {
    messaging.messageList(roomId, pub).subscribe((messages) => {
      if (state.length === 0) {
        let messagesDiv = document.querySelector('#messages');

        if (messagesDiv) {
          let elementHeight = messagesDiv.scrollHeight;
          messagesDiv.scrollTop = elementHeight;
        }
      }

      setState(
        messages.sort((a, b) => {
          if (a.timeSent > b.timeSent) return 1;
          if (a.timeSent < b.timeSent) return -1;
          return 0;
        })
      );

      scroll();
    });
  });

  let scroll = () => {
    let scrollTo = document.querySelector('#scrollHere');

    if (scrollTo) scrollTo.scrollIntoView({ behavior: 'smooth' });
  };

  return state;
};

export default useMessageList;
