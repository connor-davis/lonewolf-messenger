import { gunAvatar } from 'gun-avatar';
import moment from 'moment';
import { useNavigate } from 'solid-app-router';
import AddChatButton from '../../components/buttons/addChat';
import ChatButton from '../../components/buttons/chat';
import FloatingPopUpBottomRight from '../../components/buttons/floatingPopUpBottomRight';
import GroupChatButton from '../../components/buttons/groupChat';
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
                <div class="flex w-full h-full space-x-2">
                  <img
                    src={gunAvatar(chat.pub, 40)}
                    class="flex w-auto h-auto rounded-full bg-gray-300 dark:bg-gray-600"
                  />

                  <div class="flex flex-col justify-center w-full h-full overflow-hidden">
                    <div class="flex justify-between items-center w-full h-auto">
                      <div class="text-sm text-gray-900 dark:text-white overflow-ellipsis">
                        {chat.displayName || `@${chat.alias}`}
                      </div>
                    </div>
                    {chat.latestMessage && (
                      <div class="flex space-x-2 items-center w-full overflow-hidden">
                        <div class="text-xs text-gray-400 w-full truncate">
                          {chat.latestMessage.type === undefined && (
                            <>
                              {chat.latestMessage.sender === chat.pub
                                ? `${chat.latestMessage.content}`
                                : `You: ${chat.latestMessage.content}`}
                            </>
                          )}

                          {chat.latestMessage.type === 'text' && (
                            <>
                              {chat.latestMessage.sender === chat.pub
                                ? `${chat.latestMessage.content}`
                                : `You: ${chat.latestMessage.content}`}
                            </>
                          )}

                          {chat.latestMessage.type === 'voice' && (
                            <>
                              {chat.latestMessage.sender === chat.pub
                                ? `Voice Recording`
                                : `You: Voice Recording`}
                            </>
                          )}
                        </div>
                        <div class="text-xs text-gray-400 flex-none">
                          {moment(chat.latestMessage.timeSent).format(
                            'hh:mm A'
                          )}
                        </div>{' '}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <FloatingPopUpBottomRight main={<AddChatButton />}>
        <ChatButton />
        <GroupChatButton />
      </FloatingPopUpBottomRight>
    </div>
  );
};

export default ChatsTabPage;
