import { createStore } from 'solid-js/store';
import Notification from '../components/notification/notification';

let NotificationProvider = () => {
  let [state, setState] = createStore(
    {
      notifications: [],
    },
    { name: 'notifications-provider' }
  );

  return (
    <div class="flex flex-col absolute top-4 right-4 w-auto h-auto max-h-96 overflow-y-auto space-y-2 justify-end items-end">
      {state.notifications.map((notification) => (
        <Notification
          type={notification.type}
          header={notification.header}
          text={notification.text}
          footer={notification.footer}
        />
      ))}
    </div>
  );
};

export default NotificationProvider;
