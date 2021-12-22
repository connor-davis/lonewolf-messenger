import { gunAvatar } from 'gun-avatar';
import { friends, gun } from 'lonewolf-protocol';
import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import CloseButton from '../buttons/close';

let AddFriendModal = ({ onClose = () => {} }) => {
  let [usernameOrPublicKey, setUsernameOrPublicKey] = createSignal('');
  let [searchResult, setSearchResult] = createStore({});

  let searchUser = () => {
    let searchTerm = usernameOrPublicKey();

    if (searchTerm.startsWith('@')) {
      gun.get(`~${searchTerm}`).once((data) => {
        for (let key in data) {
          if (key.startsWith('~')) {
            gun.get(key).once((user) => {
              if (user.info) {
                gun.get(user.info['#']).once((info) => {
                  setSearchResult('pub', user.pub);
                  setSearchResult('alias', user.alias);
                  setSearchResult('displayName', info.displayName);
                  setSearchResult('about', info.about);
                });
              } else {
                setSearchResult('pub', user.pub);
                setSearchResult('alias', user.alias);
              }
            });
          }
        }
      });
    } else {
      gun.get(`~@${searchTerm}`).once((data) => {
        for (let key in data) {
          if (key.startsWith('~')) {
            gun.get(key).once((user) => {
              if (user.info) {
                gun.get(user.info['#']).once((info) => {
                  setSearchResult('pub', user.pub);
                  setSearchResult('alias', user.alias);
                  setSearchResult('displayName', info.displayName);
                  setSearchResult('about', info.about);
                });
              } else {
                setSearchResult('pub', user.pub);
                setSearchResult('alias', user.alias);
              }
            });
          }
        }
      });
    }
  };

  return (
    <div class="absolute z-40 flex flex-col justify-center items-center w-screen h-screen select-none text-gray-900 dark:text-white p-3">
      <div
        class="absolute w-full h-full bg-black opacity-60"
        onClick={() => onClose()}
      ></div>
      <div class="z-50 flex flex-col w-auto h-auto p-3 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2 max-w-md animate-fade-in">
        <div class="flex justify-end items-center">
          <CloseButton onClick={() => onClose()} />
        </div>
        <div class="flex items-center uppercase text-lg">Add Friend</div>
        <div class="flex items-center text-sm text-justify text-gray-400">
          You can add a friend using their @username
        </div>

        {searchResult.alias && (
          <>
            <div class="relative flex flex-col w-full h-auto bg-gray-200 dark:bg-gray-900 rounded-lg">
              <div class="flex w-full h-24 bg-blue-500 rounded-t-lg"></div>
              <div class="flex flex-col w-full h-auto bg-gray-200 dark:bg-gray-900 p-2 pt-16 px-6 space-y-3 rounded-b-lg">
                <div class="absolute left-5 top-16">
                  <div class="flex justify-center p-1 rounded-full bg-gray-200 dark:bg-gray-900">
                    <img
                      src={gunAvatar(searchResult.pub, 86)}
                      class="rounded-full"
                    />
                  </div>
                </div>

                <div class="flex flex-col">
                  <div class="text-lg text-gray-900 dark:text-white">
                    {searchResult.displayName}
                  </div>
                  <div class="text-lg text-gray-400">@{searchResult.alias}</div>
                </div>

                {searchResult.about && searchResult.about !== '' && (
                  <div>
                    <div class="border-b border-gray-200 dark:border-gray-800 w-full mb-3"></div>
                    <div class="flex flex-col space-y-3">
                      <div class="uppercase text-gray-400 dark:text-gray-300">
                        About Me
                      </div>

                      <div class="w-full h-auto break-words text-gray-900 dark:text-white pb-3">
                        {searchResult.about}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              class="flex w-full h-auto justify-center items-center px-3 py-2 bg-blue-600 text-white uppercase rounded-md cursor-pointer"
              onClick={() =>
                friends.addFriendRequest(
                  searchResult.pub,
                  ({ errMessage, success }) => {
                    if (errMessage) return console.log(errMessage);
                    else {
                      onClose();
                      return console.log(success);
                    }
                  }
                )
              }
            >
              Send Friend Request
            </div>
          </>
        )}
        {!searchResult.alias && (
          <>
            <input
              type="text"
              placeholder="Enter @username"
              class="relative w-full h-auto border-l border-t border-r border-b rounded-md border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 outline-none p-2 overflow-y-auto"
              value={usernameOrPublicKey()}
              onInput={(event) => {
                setUsernameOrPublicKey(event.target.value);
              }}
            />
            <div
              class="flex w-full h-auto justify-center items-center px-3 py-2 bg-blue-600 text-white uppercase rounded-md cursor-pointer"
              onClick={() => searchUser()}
            >
              Search
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddFriendModal;
