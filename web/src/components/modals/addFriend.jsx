import { createSignal } from 'solid-js';
import CloseButton from '../buttons/close';

let AddFriendModal = ({ onClose = () => {} }) => {
  let [usernameOrPublicKey, setUsernameOrPublicKey] = createSignal('');

  return (
    <div class="absolute z-40 flex flex-col justify-center items-center w-screen h-screen select-none text-gray-900 dark:text-white p-3">
      <div
        class="absolute w-full h-full bg-black opacity-60"
        onClick={() => onClose()}
      ></div>
      <div class="z-50 flex flex-col w-auto h-auto p-3 bg-gray-100 dark:bg-gray-900 rounded-lg space-y-2 max-w-md animate-fade-in">
        <div class="flex justify-end items-center">
          <CloseButton onClick={() => onClose()} />
        </div>
        <div class="flex items-center uppercase text-lg">Add Friend</div>
        <div class="flex items-center text-sm text-justify text-gray-400">
          You can add a friend using their @username or their publicKey
        </div>
        <input
          type="text"
          placeholder="Enter @username or publicKey"
          class="relative w-full h-auto border-l border-t border-r border-b rounded-md border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 outline-none p-2 overflow-y-auto"
          value={usernameOrPublicKey()}
          onInput={(event) => {
            setUsernameOrPublicKey(event.target.value);
          }}
        />
        <div class="flex w-full h-auto justify-center items-center px-3 py-2 bg-blue-600 text-white uppercase rounded-md cursor-pointer">
          Send Request
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
