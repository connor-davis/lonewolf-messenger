import { createSignal, onCleanup, onMount } from 'solid-js';
import Header from '../../components/header/header';

let SystemsStatusSettingsPage = ({ backEnabled = false }) => {
  let [ipfsOnline, setIpfsOnline] = createSignal(window.ipfs.isOnline());
  let [swarmConnectivity, setSwarmConnectivity] = createSignal(
    window.swarmConnectivity
  );

  let ipfsOnlineChecker = setInterval(() => {
    setIpfsOnline(window.ipfs.isOnline());
  }, 2000);

  let swarmConnectivityChecker = setInterval(() => {
    setSwarmConnectivity(window.swarmConnectivity);
  }, 2000);

  onMount(() => {});

  onCleanup(() => {
    clearInterval(ipfsOnlineChecker);
    clearInterval(swarmConnectivityChecker);
  });

  return (
    <div class="flex flex-col w-full h-full animate-fade-in">
      <Header title="Systems Status" />

      <div class="flex flex-col lg:flex-row w-full h-full p-3 lg:px-10 space-y-4 lg:space-y-0 space-x-0 lg:space-x-4 overflow-y-auto">
        <div class="flex flex-col space-y-4 w-full">
          <div class="flex items-center space-x-3">
            <div class="w-full uppercase">IPFS</div>

            <div class="relative">
              <div
                class={`flex-none w-3 h-3 rounded-full ${
                  ipfsOnline() ? 'bg-green-400' : 'bg-red-500'
                } animate-ping`}
              ></div>
              <div
                class={`absolute flex-none top-0 left-0 w-3 h-3 rounded-full ${
                  ipfsOnline() ? 'bg-green-400' : 'bg-red-500'
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemsStatusSettingsPage;
