import { messaging } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useMessageList = (roomId) => {
  let [state, setState] = createStore([]);

  onMount(() => {
    messaging.messageList(roomId).subscribe((message) => {
      setState([
        ...state.filter(
          (current) =>
            message && message.id !== undefined && current.id !== message.id
        ),
        message,
      ]);
    });
  });

  return state.sort((a, b) => {
    if (a.timeSent > b.timeSent) return 1;
    if (a.timeSent < b.timeSent) return -1;
    return 0;
  });
};

export default useMessageList;
