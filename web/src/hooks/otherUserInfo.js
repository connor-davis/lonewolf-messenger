import { gun } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useOtherUserInfo = (pub) => {
  let [userInfo, setUserInfo] = createStore({});

  onMount(() => {
    gun
      .user(pub)
      .get('info')
      .on((data, _) => {
        setUserInfo('displayName', () => data.displayName);
        setUserInfo('about', () => data.about);
      });
  });

  let info = () => userInfo;

  return info();
};

export default useOtherUserInfo;
