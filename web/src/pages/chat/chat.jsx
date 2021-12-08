import { gunAvatar } from 'gun-avatar';
import { gun, messaging, user } from 'lonewolf-protocol';
import moment from 'moment';
import { useNavigate, useParams } from 'solid-app-router';
import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import BackButton from '../../components/buttons/back';
import Header from '../../components/header/header';
import useMessageList from '../../hooks/messageList';
import useOtherUserInfo from '../../hooks/otherUserInfo';

let ChatPage = () => {
  let navigate = useNavigate();
  let params = useParams();

  let [state, setState] = createStore(
    { alias: '', pub: '' },
    { name: 'chatprofile-state' }
  );

  let info = useOtherUserInfo(params.pub);

  let [message, setMessage] = createSignal('');

  let messages = useMessageList(params.roomId, params.pub);

  onMount(() => {
    if (!params.pub) return;

    gun.user(params.pub).on((data) => {
      setState('pub', (_) => data.pub);
      setState('alias', (_) => data.alias);
    });
  });

  return (
    <div class="flex flex-col w-full h-full flex-none overflow-hidden">
      {state.alias && (
        <Header
          title={() => (
            <div class="flex items-center space-x-2">
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
          )}
          start={() => <BackButton onClick={() => navigate('/')} />}
        />
      )}

      {messages.filter((message) => message.id !== undefined).length > 0 && (
        <div
          class="flex flex-col w-full h-full overflow-y-auto space-y-1 p-2"
          id="messages"
        >
          {messages.map((message) => {
            return (
              <div
                key={message.id}
                id={message.id}
                class={`flex flex-col space-y-1 ${
                  message.sender === user.is.pub ||
                  message.sender === ('' || undefined)
                    ? 'pl-1/6'
                    : 'mr-1/6'
                }`}
              >
                <div
                  class={`w-auto h-full space-x-2 break-words bg-gray-200 dark:bg-gray-900 rounded p-1 select-text ${
                    message.sender === user.is.pub ||
                    message.sender === ('' || undefined)
                      ? 'self-end'
                      : 'self-start'
                  }`}
                >
                  {message.content}
                </div>
                <div
                  class={`flex text-gray-400 space-x-2 rounded p-1 text-xs ${
                    message.sender === user.is.pub ||
                    message.sender === ('' || undefined)
                      ? 'self-end'
                      : 'self-start'
                  }`}
                >
                  <div
                    class={`flex items-center text-xs ${
                      message.encrypted ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {message.encrypted ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>•</div>
                  <div>{moment(message.timeSent).format('DD/MM h:mm a')}</div>
                </div>
              </div>
            );
          })}

          <div id="scrollHere"></div>
        </div>
      )}

      <div class="flex items-center space-x-2 p-2">
        <div
          class="relative w-full h-auto max-h-32 border-l border-t border-r border-b rounded-md border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 outline-none p-2 overflow-y-auto"
          placeholder="Type a message..."
          contenteditable="true"
          id="message"
          onInput={(event) => {
            setMessage(event.currentTarget.innerText);
          }}
          onKeyPress={(event) => {
            if (event.keyCode === 13) {
              event.preventDefault();

              messaging.sendMessage(
                params.roomId,
                params.pub,
                message(),
                ({ errMessage, success }) => {
                  if (errMessage) return console.log(errMessage);
                  else {
                    setMessage('');
                    return console.log(success);
                  }
                }
              );

              event.currentTarget.innerText = '';
            }
          }}
        ></div>

        <div
          class="flex flex-col justify-center items-center p-2 text-white bg-blue-600 hover:text-gray-200 cursor-pointer rounded-full rotate-90 mt-auto mb-1"
          onClick={() => {
            messaging.sendMessage(
              params.roomId,
              params.pub,
              message(),
              ({ errMessage, success }) => {
                if (errMessage) return console.log(errMessage);
                else {
                  setMessage('');

                  let messageDiv = document.getElementById('message');

                  if (messageDiv) messageDiv.innerText = message();

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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;