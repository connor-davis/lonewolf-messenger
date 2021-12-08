import { gunAvatar } from 'gun-avatar';
import { useNavigate } from 'solid-app-router';
import useChatsList from '../../hooks/chatsList';

let ChatsTabPage = () => {
  let navigate = useNavigate();

  let chatsList = useChatsList();

  return (
    <div class="relative flex flex-col w-full h-full p-2 overflow-y-auto overflow-x-hidden space-y-2">
      {chatsList.filter((chat) => chat.pub !== undefined).length > 0 && (
        <div class="flex flex-col w-full h-full overflow-y-auto space-y-2">
          {chatsList.map((chat) => {
            return (
              <div
                key={chat.roomId}
                class="flex justify-between items-center p-2 transition-radius duration-100 ease space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:rounded-md border-b border-gray-200 dark:border-gray-800 cursor-pointer"
                onClick={() => {
                  navigate('/');
                  navigate('/chat/' + chat.roomId + '/' + chat.pub);
                }}
              >
                <div class="flex w-auto h-full space-x-2">
                  <img
                    src={gunAvatar(chat.pub, 40)}
                    class="flex w-auto h-auto rounded-full bg-gray-300 dark:bg-gray-600"
                  />

                  <div class="flex flex-col justify-center w-auto h-full">
                    <div class="flex justify-between items-center w-full h-auto">
                      <div class="text-sm text-gray-900 dark:text-white overflow-ellipsis">
                        {chat.displayName}
                      </div>
                    </div>
                    <div class="text-xs text-gray-400 overflow-ellipsis">
                      @{chat.alias}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* <FloatingButtonBottomRight content={<AddChatButton />} /> */}
    </div>
  );
};

export default ChatsTabPage;
