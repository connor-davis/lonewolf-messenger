import { gunAvatar } from 'gun-avatar';
import { gun } from 'lonewolf-protocol';
import { useLocation, useNavigate } from 'solid-app-router';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import useUserInfo from '../../hooks/userInfo';

let MiniProfile = () => {
  let navigate = useNavigate();
  let location = useLocation();

  let [state, setState] = createStore(
    { alias: '', pub: '' },
    { name: 'miniprofile-state' }
  );

  let [info, setInfo] = useUserInfo();

  onMount(() => {
    gun.user().on((data) => {
      setState('pub', (_) => data.pub);
      setState('alias', (_) => data.alias);
    });
  });

  return (
    <div
      class="flex items-center space-x-2 cursor-pointer"
      onClick={() => navigate('/profile', { state: { previousPage: '/' } })}
    >
      <img src={gunAvatar(state.pub, 32)} class="rounded-full" />

      <div class="flex flex-col">
        <div class="text-sm text-gray-900 dark:text-white overflow-ellipsis">
          {info.displayName}
        </div>
        <div class="text-xs text-gray-400 overflow-ellipsis">
          @{state.alias}
        </div>
      </div>
    </div>
  );
};

export default MiniProfile;
