import { authentication, gun, user } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useUserInfo = () => {
  let [userInfo, setUserInfo] = createStore({});

  onMount(() => {
    if (user.is && user.is.pub)
      return gun
        .user()
        .get('info')
        .on((data, _) => {
          setUserInfo('displayName', () => data.displayName);
          setUserInfo('about', () => data.about);
        });

    authentication.isAuthenticated.subscribe((value) => {
      if (value)
        return gun
          .user()
          .get('info')
          .on((data, _) => {
            setUserInfo('displayName', () => data.displayName);
            setUserInfo('about', () => data.about);
          });
    });
  });

  let info = () => userInfo;

  let setInfo = (info) => {
    setUserInfo({ ...userInfo, ...info });

    if (user.is && user.is.pub) return gun.user().get('info').put(userInfo);

    authentication.isAuthenticated.subscribe((value) => {
      if (value) return gun.user().get('info').put(userInfo);
    });
  };

  return [info(), setInfo];
};

export default useUserInfo;
