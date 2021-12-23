import { certificates, friends } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useFriendsList = () => {
  let [state, setState] = createStore([]);

  onMount(() => {
    friends.friendsList.subscribe((friend) => {
      setState(
        [
          ...state.filter(
            (current) =>
              friend &&
              friend.pub !== undefined &&
              current.pub !== friend.pub
          ),
          friend,
        ].sort((a, b) => {
          if (a.alias.toLowerCase() > b.alias.toLowerCase()) return 1;
          if (a.alias.toLowerCase() < b.alias.toLowerCase()) return -1;

          return 0;
        })
      );

      certificates.createChatsCertificate(
        friend.pub,
        ({ errMessage, success }) => {
          if (errMessage) return console.log(errMessage);
          else return console.log(success);
        }
      );
      certificates.createMessagesCertificate(
        friend.pub,
        ({ errMessage, success }) => {
          if (errMessage) return console.log(errMessage);
          else return console.log(success);
        }
      );
    });
  });

  return state;
};

export default useFriendsList;
