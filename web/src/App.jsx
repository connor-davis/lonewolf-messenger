import { authentication, certificates, user } from 'lonewolf-protocol';
import { Route, Routes } from 'solid-app-router';
import { createSignal, onMount } from 'solid-js';
import LogoutButton from './components/buttons/logout';
import SettingsButton from './components/buttons/settings';
import Content from './components/content/content';
import AddFriendModal from './components/modals/addFriend';
import Navbar from './components/navbar/navbar';
import NavbarContent from './components/navbar/navbarContent';
import NavbarHeader from './components/navbar/navbarHeader';
import MiniProfile from './components/profile/miniProfile';
import Sidebar from './components/sidebar/sidebar';
import SidebarContent from './components/sidebar/sidebarContent';
import SidebarFooter from './components/sidebar/sidebarFooter';
import SidebarHeader from './components/sidebar/sidebarHeader';
import Tabs from './components/tabs/tabs';
import useFriendsList from './hooks/friendsList';
import useModals from './hooks/models';
import useUserSettings from './hooks/userSettings';
import AuthenticationPage from './pages/authentication/authentication';
import ChatPage from './pages/chat/chat';
import ProfilePage from './pages/profile/profile';
import AppearanceSettingsPage from './pages/settings/appearanceSettings';
import SettingsPage from './pages/settings/settings';
import ChatsTabPage from './pages/tabs/chatsTab';
import FriendsTabPage from './pages/tabs/friendsTab';
import WelcomePage from './pages/welcome/welcome';
import LoadingProvider from './providers/loadingProvider';
import NotificationProvider from './providers/notificationProvider';

function App() {
  let [isAuthenticated, setIsAuthenticated] = createSignal(user.is);

  let [loadingMessage, setLoadingMessage] = createSignal(undefined);
  let [isLoading, setIsLoading] = createSignal(true);

  let [settings, setSettings, loadSettings] = useUserSettings();

  let [modals, editModals] = useModals();

  let friendsList = useFriendsList();

  onMount(() => {
    setLoadingMessage('Loading the application.');

    authentication.isAuthenticated.subscribe((value) => {
      if (value) {
        setIsLoading(true);

        setLoadingMessage('Loading Settings');

        loadSettings(() => setTimeout(() => setIsLoading(false), 500));
      } else {
        setIsLoading(false);
      }

      setIsAuthenticated(value);

      if (user.is && value) {
        certificates.generateFriendRequestsCertificate(
          ({ errMessage, success }) => {
            if (errMessage) return console.log(errMessage);
            else return console.log(success);
          }
        );

        let friendsPublicKeys = friendsList
          .filter((friend) => friend !== undefined)
          .map((friend) => friend.pub);

        certificates.createChatsCertificate(
          friendsPublicKeys,
          ({ errMessage, success }) => {
            if (errMessage) return console.log(errMessage);
            else return console.log(success);
          }
        );
        certificates.createMessagesCertificate(
          friendsPublicKeys,
          ({ errMessage, success }) => {
            if (errMessage) return console.log(errMessage);
            else return console.log(success);
          }
        );
      }
    });

    setTimeout(() => {
      setLoadingMessage('Checking authentication status.');

      authentication.checkAuth();
    }, 1000);
  });

  return (
    <div class={settings.theme}>
      {modals.addFriend && (
        <AddFriendModal onClose={() => editModals({ addFriend: false })} />
      )}

      <div class="z-10 w-screen h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white select-none outline-none">
        <NotificationProvider />

        <LoadingProvider message={loadingMessage} busy={isLoading}>
          {isAuthenticated() && (
            <div class="flex flex-col md:flex-row w-full h-full">
              <Sidebar>
                <SidebarHeader title="LoneWolf" />
                <SidebarContent>
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
                </SidebarContent>
                <SidebarFooter
                  start={() => <MiniProfile />}
                  end={() => (
                    <div class="flex space-x-3">
                      <SettingsButton />
                      <LogoutButton />
                    </div>
                  )}
                />
              </Sidebar>

              <Navbar>
                <NavbarHeader title="LoneWolf" />
                <NavbarContent>
                  <div class="flex justify-between">
                    <MiniProfile />

                    <div class="flex space-x-3">
                      <SettingsButton />
                      <LogoutButton />
                    </div>
                  </div>
                </NavbarContent>
              </Navbar>

              <Content>
                <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/chat/:roomId/:pub" element={<ChatPage />} />
                  <Route
                    path="/profile"
                    element={<ProfilePage backEnabled={true} />}
                  />
                  <Route path="/settings" element={<SettingsPage />}>
                    <Route path="/" element={<ProfilePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route
                      path="/appearance"
                      element={<AppearanceSettingsPage />}
                    />
                  </Route>
                </Routes>
              </Content>
            </div>
          )}

          {!isAuthenticated() && <AuthenticationPage />}
        </LoadingProvider>
      </div>
    </div>
  );
}

export default App;
