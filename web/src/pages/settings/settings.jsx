import { Outlet, useNavigate } from 'solid-app-router';
import { createSignal } from 'solid-js';
import SettingsHeader from '../../components/settings/settingsHeader';

let SettingsPage = () => {
  let navigate = useNavigate();

  let [menuActive, setMenuActive] = createSignal(true);

  return (
    <div class="absolute left-0 top-0 flex flex-col w-screen h-screen animate-fade-in bg-gray-200 dark:bg-gray-900 overflow-y-auto">
      <SettingsHeader activateMenu={() => setMenuActive(!menuActive())} />

      <div class="flex w-full h-full bg-gray-200 dark:bg-gray-900 overflow-hidden">
        <div
          class={`flex flex-col flex-none transition-wp duration-500 ease ${
            menuActive() ? 'w-5/6 max-w-lg p-3 space-y-3' : 'w-0 space-y-3'
          } md:w-1/3 md:p-3 lg:space-y-3 h-full bg-gray-200 dark:bg-gray-900 overflow-y-auto overflow-x-hidden`}
        >
          <div class="flex flex-col md:hidden space-y-2">
            <div
              class="flex justify-start items-center p-3 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md overflow-x-hidden cursor-pointer"
              onClick={() => {
                navigate('/settings/profile');
                setMenuActive(false);
              }}
            >
              <div></div>
              <div>Profile</div>
            </div>

            <div
              class="flex justify-start items-center p-3 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md overflow-x-hidden cursor-pointer"
              onClick={() => {
                navigate('/settings/appearance');
                setMenuActive(false);
              }}
            >
              <div></div>
              <div>Appearance</div>
            </div>

            <div
              class="flex justify-start items-center p-3 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md overflow-x-hidden cursor-pointer"
              onClick={() => {
                navigate('/settings/systems-status');
                setMenuActive(false);
              }}
            >
              <div></div>
              <div>Systems Status</div>
            </div>
          </div>

          <div class="hidden md:flex md:flex-col md:space-y-2">
            <div
              class="flex justify-start items-center p-3 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md overflow-x-hidden cursor-pointer"
              onClick={() => {
                navigate('/settings/profile');
                // setMenuActive(false);
              }}
            >
              <div></div>
              <div>Profile</div>
            </div>

            <div
              class="flex justify-start items-center p-3 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md overflow-x-hidden cursor-pointer"
              onClick={() => {
                navigate('/settings/appearance');
                // setMenuActive(false);
              }}
            >
              <div></div>
              <div>Appearance</div>
            </div>

            <div
              class="flex justify-start items-center p-3 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md overflow-x-hidden cursor-pointer"
              onClick={() => {
                navigate('/settings/systems-status');
                // setMenuActive(false);
              }}
            >
              <div></div>
              <div>Systems Status</div>
            </div>
          </div>

          {/* <div
            class="flex justify-start items-center p-3 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-md overflow-x-hidden cursor-pointer"
            onClick={() => {
              navigate('/settings/security');
              setMenuActive(false);
            }}
          >
            <div></div>
            <div>Security</div>
          </div> */}
        </div>
        <div
          class={`flex flex-col w-full h-full bg-gray-100 dark:bg-gray-800 ${
            menuActive() ? 'rounded-tl-lg' : 'rounded-t-lg'
          } lg:rounded-tr-none lg:rounded-tl-lg overflow-x-hidden`}
        >
          <div class="w-screen md:w-full h-full overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
