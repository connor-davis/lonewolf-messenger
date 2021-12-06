import { messaging } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useChatsList = () => {
  let [state, setState] = createStore([]);

  onMount(() => {
    messaging.chatsList.subscribe((chat) => {
      setState([
        ...state.filter(
          (current) =>
            chat && chat.pub !== undefined && current.pub !== chat.pub
        ),
        chat,
      ]);
    });
  });

  return state;
};

export default useChatsList;
