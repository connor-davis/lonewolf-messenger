import toBuffer from 'it-to-buffer';
import { gun } from 'lonewolf-protocol';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let useMessageList = (chatId, pub) => {
  let [state, setState] = createStore([], { name: `${chatId}-messages` });

  onMount(async () => {
    let userPair = await gun.user()._.sea;
    let friend = await gun.user(pub);

    if (sessionStorage.getItem(`${chatId}-measages`) && state.length === 0) {
      setState(JSON.parse(sessionStorage.getItem(`${chatId}-measages`)));

      return (async () => {
        let messagesDiv = document.querySelector('#messages');

        if (messagesDiv) {
          messagesDiv.scrollTop =
            messagesDiv.scrollHeight - messagesDiv.clientHeight;
        }

        gun
          .user()
          .get('messages')
          .get(chatId)
          .map()
          .once(async (message) => {
            if (message.path !== undefined) {
              try {
                let buffer = await toBuffer(window.ipfs.cat(message.path));
                let encryptedMessage = new TextDecoder().decode(buffer);

                let decryptSecretFriend = await SEA.secret(
                  friend.epub,
                  userPair
                );
                let decryptedMessageFriend = await SEA.decrypt(
                  encryptedMessage,
                  decryptSecretFriend
                );

                if (decryptedMessageFriend) {
                  let individual = {
                    ...decryptedMessageFriend,
                    encrypted: true,
                  };

                  let exists =
                    state.filter(
                      (current) => current.id === individual.id
                    )[0] !== undefined;

                  if (!exists) {
                    setState(
                      [...state, individual].sort((a, b) => {
                        if (a.timeSent > b.timeSent) return 1;
                        if (a.timeSent < b.timeSent) return -1;
                        return 0;
                      })
                    );

                    sessionStorage.setItem(
                      `${chatId}-measages`,
                      JSON.stringify(state)
                    );

                    return scroll();
                  }
                }
              } catch (error) {}

              return;
            }

            if (message.toString().startsWith('SEA')) {
              let decryptSecretFriend = await SEA.secret(friend.epub, userPair);
              let decryptedMessageFriend = await SEA.decrypt(
                message,
                decryptSecretFriend
              );

              if (decryptedMessageFriend) {
                let individual = {
                  ...decryptedMessageFriend,
                  encrypted: true,
                };

                let exists =
                  state.filter((current) => current.id === individual.id)[0] !==
                  undefined;

                if (!exists) {
                  setState(
                    [...state, individual].sort((a, b) => {
                      if (a.timeSent > b.timeSent) return 1;
                      if (a.timeSent < b.timeSent) return -1;
                      return 0;
                    })
                  );

                  sessionStorage.setItem(
                    `${chatId}-measages`,
                    JSON.stringify(state)
                  );

                  return scroll();
                }
              }
            } else {
              let individual = {
                ...message,
                encrypted: false,
              };

              let exists =
                state.filter((current) => current.id === individual.id)[0] !==
                undefined;

              if (!exists) {
                setState(
                  [...state, individual].sort((a, b) => {
                    if (a.timeSent > b.timeSent) return 1;
                    if (a.timeSent < b.timeSent) return -1;
                    return 0;
                  })
                );

                sessionStorage.setItem(
                  `${chatId}-measages`,
                  JSON.stringify(state)
                );

                return scroll();
              }
            }
          });
      })();
    } else {
      gun
        .user()
        .get('messages')
        .get(chatId)
        .once((messages) => {
          try {
            (async () => {
              let initial = [];

              for (let key in messages) {
                let message = messages[key].toString();

                if (message.path !== undefined) {
                  try {
                    let buffer = await toBuffer(window.ipfs.cat(message.path));
                    let encryptedMessage = new TextDecoder().decode(buffer);

                    let decryptSecretFriend = await SEA.secret(
                      friend.epub,
                      userPair
                    );
                    let decryptedMessageFriend = await SEA.decrypt(
                      encryptedMessage,
                      decryptSecretFriend
                    );

                    if (decryptedMessageFriend) {
                      let individual = {
                        ...decryptedMessageFriend,
                        encrypted: true,
                      };

                      let exists =
                        state.filter(
                          (current) => current.id === individual.id
                        )[0] !== undefined;

                      if (!exists) {
                        setState(
                          [...state, individual].sort((a, b) => {
                            if (a.timeSent > b.timeSent) return 1;
                            if (a.timeSent < b.timeSent) return -1;
                            return 0;
                          })
                        );

                        sessionStorage.setItem(
                          `${chatId}-measages`,
                          JSON.stringify(state)
                        );

                        return scroll();
                      }
                    }
                  } catch (error) {}

                  return;
                }

                let decryptSecretFriend = await SEA.secret(
                  friend.epub,
                  userPair
                );
                let decryptedMessageFriend = await SEA.decrypt(
                  message,
                  decryptSecretFriend
                );

                if (decryptedMessageFriend) {
                  let individual = {
                    ...decryptedMessageFriend,
                    encrypted: true,
                  };

                  let exists =
                    state.filter(
                      (current) => current.id === individual.id
                    )[0] !== undefined;

                  if (!exists) initial.push(individual);
                }
              }

              let messagesDiv = document.querySelector('#messages');

              if (messagesDiv) {
                messagesDiv.scrollTop =
                  messagesDiv.scrollHeight - messagesDiv.clientHeight;
              }

              setState(
                initial.sort((a, b) => {
                  if (a.timeSent > b.timeSent) return 1;
                  if (a.timeSent < b.timeSent) return -1;
                  return 0;
                })
              );

              scroll();

              sessionStorage.setItem(
                `${chatId}-measages`,
                JSON.stringify(state)
              );

              gun
                .user()
                .get('messages')
                .get(chatId)
                .map()
                .once(async (message) => {
                  if (message.path !== undefined) {
                    try {
                      let buffer = await toBuffer(
                        window.ipfs.cat(message.path)
                      );
                      let encryptedMessage = new TextDecoder().decode(buffer);

                      let decryptSecretFriend = await SEA.secret(
                        friend.epub,
                        userPair
                      );
                      let decryptedMessageFriend = await SEA.decrypt(
                        encryptedMessage,
                        decryptSecretFriend
                      );

                      if (decryptedMessageFriend) {
                        let individual = {
                          ...decryptedMessageFriend,
                          encrypted: true,
                        };

                        let exists =
                          state.filter(
                            (current) => current.id === individual.id
                          )[0] !== undefined;

                        if (!exists) {
                          setState(
                            [...state, individual].sort((a, b) => {
                              if (a.timeSent > b.timeSent) return 1;
                              if (a.timeSent < b.timeSent) return -1;
                              return 0;
                            })
                          );

                          sessionStorage.setItem(
                            `${chatId}-measages`,
                            JSON.stringify(state)
                          );

                          return scroll();
                        }
                      }
                    } catch (error) {}

                    return;
                  }

                  if (message.toString().startsWith('SEA')) {
                    let decryptSecretFriend = await SEA.secret(
                      friend.epub,
                      userPair
                    );
                    let decryptedMessageFriend = await SEA.decrypt(
                      message,
                      decryptSecretFriend
                    );

                    if (decryptedMessageFriend) {
                      let individual = {
                        ...decryptedMessageFriend,
                        encrypted: true,
                      };

                      let exists =
                        state.filter(
                          (current) => current.id === individual.id
                        )[0] !== undefined;

                      if (!exists) {
                        setState(
                          [...state, individual].sort((a, b) => {
                            if (a.timeSent > b.timeSent) return 1;
                            if (a.timeSent < b.timeSent) return -1;
                            return 0;
                          })
                        );

                        sessionStorage.setItem(
                          `${chatId}-measages`,
                          JSON.stringify(state)
                        );

                        return scroll();
                      }
                    }
                  } else {
                    let individual = {
                      ...message,
                      encrypted: false,
                    };

                    let exists =
                      state.filter(
                        (current) => current.id === individual.id
                      )[0] !== undefined;

                    if (!exists) {
                      setState(
                        [...state, individual].sort((a, b) => {
                          if (a.timeSent > b.timeSent) return 1;
                          if (a.timeSent < b.timeSent) return -1;
                          return 0;
                        })
                      );

                      sessionStorage.setItem(
                        `${chatId}-measages`,
                        JSON.stringify(state)
                      );

                      return scroll();
                    }
                  }
                });
            })();
          } catch (err) {}
        });
    }
  });

  let scroll = () => {
    let scrollTo = document.querySelector('#scrollHere');

    if (scrollTo) scrollTo.scrollIntoView({ behavior: 'smooth' });
  };

  return state;
};

export default useMessageList;
