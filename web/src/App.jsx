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
import useModals from './hooks/models';
import AuthenticationPage from './pages/authentication/authentication';
import ChatPage from './pages/chat/chat';
import ProfilePage from './pages/profile/profile';
import AppearanceSettingsPage from './pages/settings/appearanceSettings';
import SettingsPage from './pages/settings/settings';
import SystemsStatusSettingsPage from './pages/settings/systemsStatusSettings';
import ChatsTabPage from './pages/tabs/chatsTab';
import FriendsTabPage from './pages/tabs/friendsTab';
import WelcomePage from './pages/welcome/welcome';
import LoadingProvider from './providers/loadingProvider';
import NotificationProvider from './providers/notificationProvider';
import ThemeProvider from './providers/themeProvider';
import { initializeIpfs } from './utils/ipfs';

function App() {
  let [isAuthenticated, setIsAuthenticated] = createSignal(false);

  let [loadingMessage, setLoadingMessage] = createSignal(undefined);
  let [isLoading, setIsLoading] = createSignal(true);

  let [modals, editModals] = useModals();

  onMount(() => {
    setIsLoading(true);
    setLoadingMessage('Loading the application.');

    (async () => {
      setIsLoading(true);
      setLoadingMessage('Initializing Ipfs.');

      await initializeIpfs(window, () => {
        authentication.isAuthenticated.subscribe((value) => {
          if (value) {
            certificates.generateFriendRequestsCertificate(
              ({ errMessage, success }) => {
                if (errMessage) return console.log(errMessage);
                else return console.log(success);
              }
            );

            setIsLoading(false);
          } else {
            setIsLoading(false);
          }

          setIsAuthenticated(value);
        });

        authentication.checkAuth();
      });
    })();
  });

  return (
    <LoadingProvider message={loadingMessage} busy={isLoading}>
      {isAuthenticated() && (
        <ThemeProvider
          setIsLoading={setIsLoading}
          setLoadingMessage={setLoadingMessage}
        >
          <div class="z-10 w-screen h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white select-none outline-none">
            <NotificationProvider />

            {modals.addFriend && (
              <AddFriendModal
                onClose={() => editModals({ addFriend: false })}
              />
            )}

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
                  <Route path="/chat/:chatId/:pub" element={<ChatPage />} />
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
                    <Route
                      path="/systems-status"
                      element={<SystemsStatusSettingsPage />}
                    />
                  </Route>
                </Routes>
              </Content>
            </div>
          </div>
        </ThemeProvider>
      )}

      {!isAuthenticated() && <AuthenticationPage />}
    </LoadingProvider>
  );
}

export default App;
