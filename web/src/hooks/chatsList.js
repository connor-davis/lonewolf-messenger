import { gun, messaging } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useChatsList = () => {
  let [state, setState] = createStore([]);

  onMount(() => {
    messaging.chatsList.subscribe(async (chat) => {
      let detailedChat = { ...chat };

      let userPair = await gun.user()._.sea;
      let _user = await gun.user(chat.pub);

      if (_user && _user.info) {
        let info = await gun.get(_user.info['#']).once();

        detailedChat.displayName = info.displayName || undefined;
      }

      detailedChat.alias = _user.alias || undefined;

      let latestMessage = await gun
        .user()
        .get('chats')
        .get(detailedChat.roomId)
        .get('latestMessage');

      let latestMessageSecret = await SEA.secret(_user.epub, userPair);
      let decryptedLatestMessage = await SEA.decrypt(
        latestMessage,
        latestMessageSecret
      );

      detailedChat.latestMessage = decryptedLatestMessage;

      setState([
        ...state.filter(
          (current) =>
            chat && chat.pub !== undefined && current.pub !== chat.pub
        ),
        detailedChat,
      ]);
    });
  });

  return state;
};

export default useChatsList;
