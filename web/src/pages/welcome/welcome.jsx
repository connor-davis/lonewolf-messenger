import Tabs from '../../components/tabs/tabs';
import ChatsTabPage from '../tabs/chatsTab';
import FriendsTabPage from '../tabs/friendsTab';

let WelcomePage = () => {
  return (
    <div class="w-full h-full overflow-hidden">
      <div class="hidden md:flex flex-col w-full h-full justify-center items-center px-16 md:px-12 space-y-2 animate-fade-in">
        <div class="text-2xl text-center">LoneWolf</div>
        <div class="text-sm text-center text-gray-400">
          Welcome to LoneWolf user. This is a distributed messaging application.
          Your data is yours.
        </div>
      </div>

      <div class="md:hidden block w-full h-full overflow-hidden">
        <Tabs
          tabs={[
            {
              label: 'Chats',
              content: <ChatsTabPage />,
            },
            {
              label: 'Friends',
              content: <FriendsTabPage />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default WelcomePage;
