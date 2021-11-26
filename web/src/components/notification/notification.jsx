import ErrorNotification from './errorNotification';
import SuccessNotification from './successNotification';

let Notification = ({ type, header, text, footer }) => {
  let notification = () => {
    switch (type) {
      case 'success':
        return (
          <SuccessNotification header={header} text={text} footer={footer} />
        );
      case 'error':
        return (
          <ErrorNotification header={header} text={text} footer={footer} />
        );
      default:
        return null;
    }
  };

  return <div class="flex w-auto h-auto">{notification}</div>;
};

export default Notification;
