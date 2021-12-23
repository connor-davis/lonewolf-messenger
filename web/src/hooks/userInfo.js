import { gun } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useUserInfo = () => {
  let [userInfo, setUserInfo] = createStore({});

  onMount(() => {
    gun
      .user()
      .get('info')
      .on((data, _) => {
        setUserInfo('displayName', () => data.displayName);
        setUserInfo('about', () => data.about);
      });
  });

  let info = () => userInfo;

  let setInfo = (info) => {
    setUserInfo({ ...userInfo, ...info });

    gun.user().get('info').put(userInfo);
  };

  return [info(), setInfo];
};

export default useUserInfo;
