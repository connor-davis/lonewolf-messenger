import { messaging } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useMessageList = (roomId, pub) => {
  let [state, setState] = createStore([]);

  onMount(async () => {
    messaging.messageList(roomId, pub).subscribe(({ initial, individual }) => {
      if (initial) {
        let messagesDiv = document.querySelector('#messages');

        if (messagesDiv) {
          messagesDiv.scrollTop =
            messagesDiv.scrollHeight - messagesDiv.clientHeight;
        }

        setState(
          initial.sort((a, b) => {
            if (a.timeSent > b.timeSent) return 1;
            if (a.timeSent < b.timeSent) return -1;
            return 0;
          })
        );

        scroll();

        return;
      }

      if (individual) {
        if (!state.includes(individual)) {
          setState(
            [...state, individual].sort((a, b) => {
              if (a.timeSent > b.timeSent) return 1;
              if (a.timeSent < b.timeSent) return -1;
              return 0;
            })
          );

          scroll();
        }

        return;
      }
    });
  });

  let scroll = () => {
    let scrollTo = document.querySelector('#scrollHere');

    if (scrollTo) scrollTo.scrollIntoView({ behavior: 'smooth' });
  };

  return state;
};

export default useMessageList;
