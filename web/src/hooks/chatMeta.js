import { gun, user } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useChatMeta = (chatId, pub) => {
  let [chatMeta, setChatMeta] = createStore({});

  onMount(() => {
    gun
      .user()
      .get('chats')
      .get(chatId)
      .get('meta')
      .on((data, _) => {
        setChatMeta('typing', data.typing);
      });
  });

  let meta = () => chatMeta;

  let setMeta = async (info) => {
    setChatMeta({ ...chatMeta, ...info });

    gun.user().get('chats').get(chatId).get('meta').put(chatMeta);

    let updateMetaCertificate = await gun
      .user(pub)
      .get('certificates')
      .get(user.is.pub)
      .get('chats');

    if (!updateMetaCertificate)
      return callback({
        errMessage: 'Could not find friend certificate to add meta to chat',
        errCode: 'failed-to-find-friend-chats-certificate',
        success: undefined,
      });

    gun
      .user(pub)
      .get('chats')
      .get(chatId)
      .get('meta')
      .put(
        chatMeta,
        ({ err }) => {
          if (err) return console.log(err);
        },
        { opt: { cert: updateMetaCertificate } }
      );
  };

  return [meta(), setMeta];
};

export default useChatMeta;
