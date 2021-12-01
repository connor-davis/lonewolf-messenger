import { friends } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useFriendRequests = () => {
  let [state, setState] = createStore([]);

  onMount(() => {
    friends.loadFriendRequests();

    friends.friendRequests.subscribe((request) => {
      setState([
        ...state.filter((current) => current.pub !== request.pub),
        request,
      ]);
    });
  });

  return state;
};

export default useFriendRequests;
