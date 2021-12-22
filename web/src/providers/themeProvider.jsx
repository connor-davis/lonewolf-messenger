import { onMount } from 'solid-js';
import useUserSettings from '../hooks/userSettings';

let ThemeProvider = ({ setIsLoading, setLoadingMessage, children }) => {
  let [settings, setSettings, loadSettings] = useUserSettings();

  onMount(() => {
    setIsLoading(true);

    setLoadingMessage('Loading Settings');

    loadSettings(() =>
      setTimeout(() => {
        setLoadingMessage('Loaded Settings');

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }, 1000)
    );
  });

  return <div class={`${settings.theme}`}>{children}</div>;
};

export default ThemeProvider;
