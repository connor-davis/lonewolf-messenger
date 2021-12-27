import { gunAvatar } from 'gun-avatar';
import { gun, messaging, user } from 'lonewolf-protocol';
import moment from 'moment';
import { useNavigate, useParams } from 'solid-app-router';
import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import BackButton from '../../components/buttons/back';
import Header from '../../components/header/header';
import useChatMeta from '../../hooks/chatMeta';
import useMessageList from '../../hooks/messageList';
import useOtherUserInfo from '../../hooks/otherUserInfo';
import createAudioRecording from '../../utils/createAudioRecording';

let ChatPage = () => {
  let navigate = useNavigate();
  let params = useParams();

  let [state, setState] = createStore(
    { alias: '', pub: '' },
    { name: 'chatprofile-state' }
  );
  let [message, setMessage] = createSignal('');
  let [show, setShow] = createSignal(20);
  let [typing, setTyping] = createSignal(false);
  let [recordingAudio, setRecordingAudio] = createSignal(false);

  let info = useOtherUserInfo(params.pub);

  let [meta, setMeta] = useChatMeta(params.chatId, params.pub);

  let messages = useMessageList(params.chatId, params.pub);

  onMount(() => {
    if (!params.pub) return;

    gun.user(params.pub).on((data) => {
      setState('pub', (_) => data.pub);
      setState('alias', (_) => data.alias);
    });
  });

  let recorder;

  let startRecording = () => {
    createAudioRecording(params.chatId, params.pub, (mediaRecorder) => {
      recorder = mediaRecorder;

      recorder.start();
      setRecordingAudio(true);
    });
  };

  let endRecording = () => {
    recorder.stop();
    setRecordingAudio(false);
  };

  var hasMouse = false;

  window.onmousemove = function () {
    hasMouse = true;
  };

  return (
    <div class="flex flex-col w-full h-full overflow-hidden animate-fade-in">
      {state.alias && (
        <Header
          title={() => (
            <div class="flex items-center space-x-2">
              <img src={gunAvatar(state.pub, 32)} class="rounded-full" />

              <div class="flex flex-col">
                <div class="text-sm text-gray-900 dark:text-white overflow-ellipsis">
                  {info.displayName || `@${state.alias}`}
                </div>
                <div class="text-xs text-gray-400 overflow-ellipsis">
                  {meta.typing && meta.typing !== state.pub && 'Typing'}
                  {recordingAudio() && 'You are recording audio.'}
                </div>
              </div>
            </div>
          )}
          start={() => <BackButton onClick={() => navigate('/')} />}
        />
      )}

      <div
        class="flex flex-col w-full h-full overflow-y-auto space-y-1 p-2"
        id="messages"
        onScroll={(event) => {
          let total = messages.length - 1;
          let messagesDiv = event.currentTarget;

          if (show >= total) return;

          if (messagesDiv.scrollTop === 0) {
            setShow(show() + 5);

            messagesDiv.scrollTop = 1;
          }
        }}
      >
        {messages.filter((message) => message.id !== undefined).length > 0 ? (
          messages
            .slice(Math.max(0, messages.length - show()), messages.length)
            .map(
              (message) =>
                message && (
                  <div
                    key={message.id}
                    id={message.id}
                    class={`flex flex-col w-full space-y-1 flex-none ${
                      message.sender === user.is.pub ||
                      message.sender === ('' || undefined)
                        ? 'pl-2/6'
                        : 'mr-2/6'
                    }`}
                  >
                    <div
                      class={`w-auto ${
                        message.type !== 'voice' && 'max-w-xs md:max-w-3xl'
                      } h-full space-x-2 break-words rounded p-2 select-text ${
                        message.sender === user.is.pub ||
                        message.sender === ('' || undefined)
                          ? 'self-end bg-gray-100 dark:bg-gray-700'
                          : 'self-start bg-gray-300 dark:bg-gray-900'
                      }`}
                    >
                      {message.type === undefined && message.content}
                      {message.type === 'text' && message.content}

                      {message.type === 'voice' && (
                        <>
                          <audio
                            class="hidden w-0"
                            id={message.id + '-audio'}
                            controls
                            type="audio/mp3"
                            onTimeUpdate={(event) => {
                              let _this = event.target;

                              let progressBar = document.getElementById(
                                message.id + '-progressbar'
                              );

                              if (
                                _this.duration === NaN ||
                                _this.duration === Infinity
                              ) {
                                let progress = Math.round(
                                  (_this.currentTime /
                                    moment
                                      .duration(message.duration)
                                      .asSeconds()) *
                                    100
                                );

                                progressBar.style.width = `${progress}%`;
                              } else {
                                let progress = Math.round(
                                  (_this.currentTime /
                                    parseFloat(_this.duration)) *
                                    100
                                );

                                progressBar.style.width = `${progress}%`;
                              }
                            }}
                          >
                            <source
                              src={`${
                                message.content.startsWith('data')
                                  ? message.content
                                  : `data:audio/mp3;codec=opus;base64,${message.content}`
                              }`}
                              type="audio/mp3"
                            />
                          </audio>
                          <div class="flex items-center w-80 lg:w-96 h-auto m-0 p-2">
                            <div class="flex">
                              {moment.utc(message.duration).format('mm:ss')}
                            </div>
                            <div class="flex w-full h-2 mx-2 bg-gray-300 rounded">
                              <div
                                id={message.id + '-progressbar'}
                                class="h-full bg-blue-600 rounded"
                              ></div>
                            </div>
                            <div
                              class="flex justify-center items-center w-10 h-10 cursor-pointer hover:text-gray-400"
                              onClick={(event) => {
                                let audioRecording = document.getElementById(
                                  message.id + '-audio'
                                );

                                if (
                                  audioRecording instanceof HTMLAudioElement
                                ) {
                                  if (!audioRecording.paused) {
                                    audioRecording.pause();
                                    event.target.classList.remove(
                                      'text-green-600'
                                    );
                                  } else {
                                    audioRecording.play();
                                    event.target.classList.add(
                                      'text-green-600'
                                    );
                                  }

                                  audioRecording.onended = () => {
                                    event.target.classList.remove(
                                      'text-green-600'
                                    );
                                  };
                                }
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
                                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                />
                              </svg>
                            </div>
                          </div>
                        </>
                      )}
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
                      <div>
                        {moment(message.timeSent).format('DD/MM h:mm a')}
                      </div>
                    </div>
                  </div>
                )
            )
        ) : (
          <div class="flex flex-col justify-center items-center w-full h-full text-gray-400 bg-white dark:bg-gray-800 space-y-3">
            <div
              style="border-top-color:transparent"
              class="w-6 h-6 border-4 border-green-400 border-dotted rounded-full animate-spin"
            ></div>
            <div>Loading Messages</div>
          </div>
        )}
        <div id="scrollHere" class="flex flex-col w-full"></div>
      </div>

      <div class="flex items-center space-x-2 p-2">
        <div
          class="relative w-full h-auto max-h-32 border-l border-t border-r border-b rounded-md border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 outline-none p-2 overflow-y-auto"
          placeholder="Type a message..."
          contenteditable="true"
          id="message"
          onInput={(event) => {
            if (event.currentTarget.innerText !== '') setTyping(true);
            else setTyping(false);

            setMessage(event.currentTarget.innerText);
          }}
          onBlur={() => setMeta({ typing: null })}
          onKeyPress={(event) => {
            setMeta({ typing: state.pub });

            if (event.keyCode === 13) {
              event.preventDefault();

              setMeta({ typing: null });

              if (message() === '') {
                setTyping(false);
                return;
              }

              event.currentTarget.innerText = '';

              setTyping(false);

              messaging.sendMessage(
                params.chatId,
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
            }
          }}
        ></div>

        {typing() ? (
          <div
            class="flex flex-col justify-center items-center p-2 text-white bg-blue-600 hover:text-gray-200 cursor-pointer rounded-full rotate-90 mt-auto mb-1"
            onClick={() => {
              if (message() === '') {
                setTyping(false);
                return;
              }

              let messageDiv = document.getElementById('message');

              if (messageDiv) messageDiv.innerText = '';

              setTyping(false);

              messaging.sendMessage(
                params.chatId,
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
        ) : (
          <div
            class={`flex flex-col justify-center items-center p-2 text-white bg-blue-600 ${
              recordingAudio() && 'bg-red-600'
            } hover:text-gray-200 cursor-pointer rounded-full mt-auto mb-1`}
            onTouchStart={() => startRecording()}
            onTouchEnd={() => endRecording()}
            onMouseDown={() => {
              if (!hasMouse) return;
              startRecording();
            }}
            onMouseUp={() => {
              if (!hasMouse) return;
              endRecording();
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
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
