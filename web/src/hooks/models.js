import { Subject } from 'rxjs';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

let modalsSubject = new Subject();

let useModals = () => {
  let [modals, setModals] = createStore({ addFriend: false });

  onMount(() => {
    modalsSubject.subscribe((packet) => {
      setModals(packet);
    });
  });

  let editModals = (packet) => {
    modalsSubject.next({ ...modals, ...packet });
  };

  return [modals, editModals];
};

export default useModals;
