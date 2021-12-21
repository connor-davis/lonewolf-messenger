import { useNavigate } from 'solid-app-router';
import { onMount } from 'solid-js';
import Header from '../../components/header/header';
import useUserSettings from '../../hooks/userSettings';

let AppearanceSettingsPage = ({ backEnabled = false }) => {
  let navigate = useNavigate();

  let [settings, setSettings] = useUserSettings();

  onMount(() => {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  });

  return (
    <div class="flex flex-col w-full h-full animate-fade-in">
      <Header title="Appearance" />

      <div class="flex flex-col lg:flex-row w-full h-full p-3 lg:px-10 space-y-4 lg:space-y-0 space-x-0 lg:space-x-4 overflow-y-auto">
        <div class="flex flex-col space-y-4 w-full lg:w-3/5">
          <div class="flex flex-col space-y-3">
            <div class="uppercase text-gray-400 dark:text-gray-300">Theme</div>

            <div class="flex flex-col space-y-3">
              <div class="flex justify-between items-center">
                <div class="flex">Light Theme</div>
                <div
                  class={`flex px-3 py-2 rounded-md ${
                    settings.theme === 'light'
                      ? 'bg-green-600'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } cursor-pointer`}
                  onClick={() => setSettings({ theme: 'light' })}
                >
                  Use
                </div>
              </div>

              <div class="flex justify-between items-center">
                <div class="flex">Dark Theme</div>
                <div
                  class={`flex px-3 py-2 rounded-md ${
                    settings.theme === 'dark'
                      ? 'bg-green-600'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } cursor-pointer`}
                  onClick={() => setSettings({ theme: 'dark' })}
                >
                  Use
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettingsPage;
