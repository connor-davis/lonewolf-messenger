import { gunAvatar } from 'gun-avatar';
import { gun } from 'lonewolf-protocol';
import { useNavigate } from 'solid-app-router';
import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import BackButton from '../../components/buttons/back';
import EditButton from '../../components/buttons/edit';
import TickButton from '../../components/buttons/tick';
import Header from '../../components/header/header';
import useUserInfo from '../../hooks/userInfo';

let ProfilePage = ({ backEnabled = false }) => {
  let navigate = useNavigate();

  let [state, setState] = createStore(
    { alias: '', pub: '' },
    { name: 'miniprofile-state' }
  );

  let [info, setInfo] = useUserInfo();

  let [editingDisplayName, setEditingDisplayName] = createSignal(false);
  let [editingAbout, setEditingAbout] = createSignal(false);

  let [displayName, setDisplayName] = createSignal('');
  let [about, setAbout] = createSignal('');

  onMount(() => {
    gun.user().once((data) => {
      setState('pub', (_) => data.pub);
      setState('alias', (_) => data.alias);
    });

    setDisplayName(info.displayName || '');
    setAbout(info.about);

    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  });

  return (
    <div class="flex flex-col w-full h-full animate-fade-in">
      <Header
        title="Profile"
        start={() =>
          backEnabled && <BackButton onClick={() => navigate('/')} />
        }
      />

      <div class="flex flex-col lg:flex-row w-full h-full p-3 lg:px-10 space-y-4 lg:space-y-0 space-x-0 lg:space-x-4 overflow-y-auto">
        <div class="flex flex-col space-y-4 w-full lg:w-3/5">
          <div class="flex flex-col space-y-3">
            <div class="uppercase text-gray-400 dark:text-gray-300">
              Profile Image Test
            </div>

            <div class="text-gray-900 dark:text-white">
              Feature coming soon...
            </div>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="uppercase text-gray-400 dark:text-gray-300">
              Display Name
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="text"
                class="relative w-full h-auto border-l border-t border-r border-b rounded-md border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 outline-none p-2 overflow-y-auto"
                placeholder="What would you like to be called?"
                value={info.displayName}
                disabled={!editingDisplayName()}
                onInput={(event) => {
                  setDisplayName(event.target.value);
                }}
              />

              <div class="flex flex-col justify-center items-center w-10 h-10">
                {editingDisplayName() ? (
                  <TickButton
                    extraClass={'hover:text-green-600'}
                    onClick={() => {
                      setInfo({ displayName: displayName() });
                      setEditingDisplayName(false);
                    }}
                  />
                ) : (
                  <EditButton
                    extraClass={'hover:text-blue-600'}
                    onClick={() => setEditingDisplayName(true)}
                  />
                )}
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="uppercase text-gray-400 dark:text-gray-300">
              About Me
            </div>

            <div class="flex items-start space-x-2">
              <div
                class="relative w-full h-32 border-l border-t border-r border-b rounded-md border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 outline-none p-2 overflow-y-auto"
                placeholder="Tell everyone a bit about yourself."
                contenteditable={editingAbout()}
                id="about"
              >
                {info.about}
              </div>

              <div class="flex flex-col justify-center items-center w-10 h-10">
                {editingAbout() ? (
                  <TickButton
                    extraClass={'hover:text-green-600'}
                    onClick={() => {
                      setInfo({
                        about: document.getElementById('about').innerText,
                      });
                      setEditingAbout(false);
                    }}
                  />
                ) : (
                  <EditButton
                    extraClass={'hover:text-blue-600'}
                    onClick={() => setEditingAbout(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-4 w-full lg:w-2/5">
          <div class="flex flex-col space-y-3">
            <div class="uppercase text-gray-400 dark:text-gray-300">
              Preview
            </div>

            <div class="relative flex flex-col w-full h-auto bg-gray-200 dark:bg-gray-900 rounded-lg">
              <div class="flex w-full h-24 bg-blue-600 rounded-t-lg"></div>
              <div class="flex flex-col w-full h-auto bg-gray-200 dark:bg-gray-900 p-2 pt-16 px-6 space-y-3 rounded-b-lg">
                <div class="absolute left-5 top-16">
                  <div class="flex justify-center p-1 rounded-full bg-gray-200 dark:bg-gray-900">
                    <img src={gunAvatar(state.pub, 86)} class="rounded-full" />
                  </div>
                </div>

                <div class="flex flex-col">
                  <div class="text-lg text-gray-900 dark:text-white">
                    {info.displayName}
                  </div>
                  <div class="text-lg text-gray-400">@{state.alias}</div>
                </div>

                {info.about && info.about !== '' && (
                  <div>
                    <div class="border-b border-gray-200 dark:border-gray-800 w-full mb-3"></div>
                    <div class="flex flex-col space-y-3">
                      <div class="uppercase text-gray-400 dark:text-gray-300">
                        About Me
                      </div>

                      <div class="w-full h-auto break-words text-gray-900 dark:text-white pb-3">
                        {info.about}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
