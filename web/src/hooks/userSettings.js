import { authentication, gun, user } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useUserSettings = () => {
  let [userSettings, setUserSettings] = createStore({});

  onMount(() => {
    if (user.is && user.is.pub)
      return gun
        .user()
        .get('settings')
        .on((data, _) => {
          setUserSettings('theme', () => data.theme);
        });

    authentication.isAuthenticated.subscribe((value) => {
      if (value)
        return gun
          .user()
          .get('info')
          .on((data, _) => {
            setUserSettings('displayName', () => data.displayName);
            setUserSettings('about', () => data.about);
          });
    });
  });

  let settings = () => userSettings;

  let setSettings = (settings) => {
    setUserSettings({ ...userSettings, ...settings });

    if (user.is && user.is.pub)
      return gun.user().get('settings').put(userSettings);

    authentication.isAuthenticated.subscribe((value) => {
      if (value) return gun.user().get('info').put(userSettings);
    });
  };

  let loadSettings = (callback) => {
    return gun
      .user()
      .get('settings')
      .once((data, _) => {
        if (data) {
          setUserSettings('theme', () => data.theme);

          callback();
        } else {
          setUserSettings('theme', () => 'light');

          callback();
        }
      });
  };

  return [settings(), setSettings, loadSettings];
};

export default useUserSettings;
