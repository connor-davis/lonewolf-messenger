import { gunAvatar } from 'gun-avatar';
import AddFriendButton from '../../components/buttons/addFriend';
import FloatingButtonBottomRight from '../../components/buttons/floating';
import useFriendRequests from '../../hooks/friendRequests';
import useModals from '../../hooks/models';

let FriendsTabPage = () => {
  let [modals, editModals] = useModals();
  let friendRequests = useFriendRequests();

  return (
    <div class="relative flex flex-col w-full h-full">
      <div class="flex flex-col w-full h-full p-2 overflow-y-auto overflow-x-hidden space-y-2">
        {friendRequests.length > 0 && (
          <div class="flex flex-col w-full h-auto max-h-64 overflow-y-auto space-y-2">
            <div class="flex justify-start items-center uppercase text-md text-gray-400">
              Friend Requests
            </div>
            {friendRequests.map((friendRequest) => {
              return (
                <div class="flex items-center p-2 transition-radius duration-100 ease space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:rounded-md cursor-pointer border-b border-gray-200 dark:border-gray-800">
                  <img
                    src={gunAvatar(friendRequest.pub, 40)}
                    class="flex w-auto h-auto rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"
                  />

                  <div class="flex flex-col">
                    <div class="text-sm text-gray-900 dark:text-white overflow-ellipsis">
                      {friendRequest.displayName}
                    </div>
                    <div class="text-xs text-gray-400 overflow-ellipsis">
                      @{friendRequest.alias}
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
          <AddFriendButton onClick={() => editModals({ addFriend: true })} />
        }
      />
    </div>
  );
};

export default FriendsTabPage;
