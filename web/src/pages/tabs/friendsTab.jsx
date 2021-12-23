import { gunAvatar } from 'gun-avatar';
import { friends, messaging } from 'lonewolf-protocol';
import { useNavigate } from 'solid-app-router';
import AddFriendButton from '../../components/buttons/addFriend';
import CrossButton from '../../components/buttons/cross';
import FloatingButtonBottomRight from '../../components/buttons/floatingBottomRight';
import TickButton from '../../components/buttons/tick';
import useFriendRequests from '../../hooks/friendRequests';
import useFriendsList from '../../hooks/friendsList';
import useModals from '../../hooks/models';

let FriendsTabPage = () => {
  let navigate = useNavigate();

  let [modals, editModals] = useModals();
  let friendRequests = useFriendRequests();
  let friendsList = useFriendsList();

  return (
    <div class="relative flex flex-col w-full h-full">
      <div class="flex flex-col w-full h-full p-2 overflow-y-auto overflow-x-hidden space-y-2">
        {friendRequests.filter(
          (friendRequest) => friendRequest.pub !== undefined
        ).length > 0 && (
          <div class="flex flex-col w-full h-auto flex-none max-h-96 overflow-y-auto space-y-2">
            <div class="flex justify-start items-center uppercase text-md text-gray-400">
              Friend Requests
            </div>
            {friendRequests.map((friendRequest) => {
              return (
                <div
                  key={friendRequest.key}
                  class="flex justify-between items-center p-2 transition-radius duration-100 ease space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:rounded-md border-b border-gray-200 dark:border-gray-800"
                >
                  <div class="flex w-auto h-full space-x-2">
                    <img
                      src={gunAvatar(friendRequest.pub, 40)}
                      class="flex w-auto h-auto rounded-full bg-gray-300 dark:bg-gray-600"
                    />

                    <div class="flex flex-col justify-center w-auto h-full">
                      <div class="text-sm text-gray-900 dark:text-white overflow-ellipsis">
                        {friendRequest.displayName}
                      </div>
                      <div class="text-xs text-gray-400 overflow-ellipsis">
                        @{friendRequest.alias}
                      </div>
                    </div>
                  </div>

                  <div class="flex space-x-2">
                    <div class="flex flex-col justify-center items-center p-2 border-l border-t border-r border-b border-gray-300 dark:border-gray-800 cursor-pointer rounded-full">
                      <TickButton
                        extraClass={'hover:text-green-600'}
                        onClick={() =>
                          friends.acceptFriendRequest(
                            {
                              key: friendRequest.key,
                              publicKey: friendRequest.pub,
                            },
                            ({ errMessage, success }) => {
                              if (errMessage) return console.log(errMessage);
                              else return console.log(success);
                            }
                          )
                        }
                      />
                    </div>
                    <div class="flex flex-col justify-center items-center p-2 border-l border-t border-r border-b border-gray-300 dark:border-gray-800 cursor-pointer rounded-full">
                      <CrossButton
                        extraClass={'hover:text-red-600'}
                        onClick={() =>
                          friends.rejectFriendRequest(
                            friendRequest.key,
                            ({ errMessage, success }) => {
                              if (errMessage) return console.log(errMessage);
                              else return console.log(success);
                            }
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {friendsList.filter((friend) => friend.pub !== undefined).length >
          0 && (
          <div class="flex flex-col w-full h-full overflow-y-auto space-y-2">
            <div class="flex justify-start items-center uppercase text-md text-gray-400">
              Friends
            </div>
            {friendsList.map((friend) => {
              return (
                <div
                  key={friend.key}
                  class="flex justify-between items-center p-2 transition-radius duration-100 ease space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:rounded-md border-b border-gray-200 dark:border-gray-800"
                >
                  <div class="flex w-auto h-full space-x-2">
                    <img
                      src={gunAvatar(friend.pub, 40)}
                      class="flex w-auto h-auto rounded-full bg-gray-300 dark:bg-gray-600"
                    />

                    <div class="flex flex-col justify-center w-auto h-full">
                      <div class="text-sm text-gray-900 dark:text-white overflow-ellipsis">
                        {friend.displayName}
                      </div>
                      <div class="text-xs text-gray-400 overflow-ellipsis">
                        @{friend.alias}
                      </div>
                    </div>
                  </div>

                  <div class="flex space-x-2">
                    <div
                      class="flex flex-col justify-center items-center p-2 border-l border-t border-r border-b border-gray-300 dark:border-gray-800 hover:text-gray-400 cursor-pointer rounded-full"
                      onClick={async () => {
                        await messaging.createChat(
                          friend.pub,
                          ({ errMessage, errCode, chat, success }) => {
                            if (errCode) {
                              if (errCode === 'chat-already-exists') {
                                navigate('/');

                                return navigate(
                                  `/chat/${chat.roomId}/${chat.pub}`,
                                  { replace: true }
                                );
                              } else return console.log(errMessage);
                            } else {
                              navigate('/');

                              navigate(`/chat/${chat.roomId}/${chat.pub}`, {
                                replace: true,
                              });

                              return console.log(success);
                            }
                          }
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FloatingButtonBottomRight
        content={
          <AddFriendButton
            onClick={() => editModals({ addFriend: true })}
            shadow="blue"
          />
        }
      />
    </div>
  );
};

export default FriendsTabPage;
