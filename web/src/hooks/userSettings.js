import { gun } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useUserSettings = () => {
  let [userSettings, setUserSettings] = createStore(
    {
      theme: 'light'
    },
    { name: 'user-settings' }
  );

  onMount(() => {
    gun
      .user()
      .get('settings')
      .on((data, _) => {
        setUserSettings('theme', () => data.theme || 'light');
      });
  });

  let settings = () => userSettings;

  let setSettings = (settings) => {
    setUserSettings({ ...userSettings, ...settings });

    gun.user().get('settings').put(userSettings);
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
