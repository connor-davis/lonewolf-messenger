import { authentication, certificates, user } from 'lonewolf-protocol';
import { Route, Router, Routes } from 'solid-app-router';
import { createSignal, onMount } from 'solid-js';
import Content from './components/content/content';
import Navbar from './components/navbar/navbar';
import NavbarContent from './components/navbar/navbarContent';
import NavbarHeader from './components/navbar/navbarHeader';
import Sidebar from './components/sidebar/sidebar';
import SidebarContent from './components/sidebar/sidebarContent';
import SidebarFooter from './components/sidebar/sidebarFooter';
import SidebarHeader from './components/sidebar/sidebarHeader';
import AuthenticationPage from './pages/authentication/authentication';
import WelcomePage from './pages/welcome/welcome';
import LoadingProvider from './providers/loadingProvider';
import NotificationProvider from './providers/notificationProvider';

function App() {
  let [isAuthenticated, setIsAuthenticated] = createSignal(user.is);

  let [loadingMessage, setLoadingMessage] = createSignal(undefined);
  let [isLoading, setIsLoading] = createSignal(true);

  onMount(() => {
    setLoadingMessage('Loading the application.');

    authentication.checkAuth();

    authentication.isAuthenticated.subscribe((value) => {
      setIsAuthenticated(value);

      if (user.is) {
        certificates.generateFriendRequestsCertificate(
          ({ errMessage, success }) => {
            if (errMessage) return console.log(errMessage);
            else return console.log(success);
          }
        );
      }
    });

    setTimeout(() => {
      setLoadingMessage('Checking authentication status.');

      setTimeout(() => {
        setIsLoading(false);

        if (user.is) {
          certificates.generateFriendRequestsCertificate(
            ({ errMessage, success }) => {
              if (errMessage) return console.log(errMessage);
              else return console.log(success);
            }
          );
        }
      }, 500);
    }, 1000);
  });

  return (
    <Router>
      <div class="dark">
        <div class="w-screen h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white select-none outline-none">
          <NotificationProvider />
          
          <LoadingProvider message={loadingMessage} busy={isLoading}>
            {isAuthenticated() && (
              <div class="flex flex-col md:flex-row w-full h-full">
                <Sidebar>
                  <SidebarHeader title="LoneWolf" subtitle="Chats" />
                  <SidebarContent></SidebarContent>
                  <SidebarFooter start="Start" end="End" />
                </Sidebar>

                <Navbar>
                  <NavbarHeader title="LoneWolf" />
                  <NavbarContent></NavbarContent>
                </Navbar>

                <Content>
                  <Routes>
                    <Route path="/" element={<WelcomePage />} />
                  </Routes>
                </Content>
              </div>
            )}

            {!isAuthenticated() && <AuthenticationPage />}
          </LoadingProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
