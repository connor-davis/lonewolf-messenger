import { certificates, friends } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useFriendsList = () => {
  let [state, setState] = createStore([]);

  onMount(() => {
    friends.friendsList.subscribe((request) => {
      setState(
        [
          ...state.filter(
            (current) =>
              request &&
              request.pub !== undefined &&
              current.pub !== request.pub
          ),
          request,
        ].sort((a, b) => {
          if (a.alias.toLowerCase() > b.alias.toLowerCase()) return 1;
          if (a.alias.toLowerCase() < b.alias.toLowerCase()) return -1;

          return 0;
        })
      );

      certificates.createChatsCertificate(
        request.pub,
        ({ errMessage, success }) => {
          if (errMessage) return console.log(errMessage);
          else return console.log(success);
        }
      );
      certificates.createMessagesCertificate(
        request.pub,
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
