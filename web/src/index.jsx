import { Router } from 'solid-app-router';
import { render } from 'solid-js/web';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';

if (typeof global === 'undefined') {
  window.global = window;
}

let RoutedApp = () => (
  <Router>
    <App />
  </Router>
);

render(RoutedApp, document.getElementById('root'));

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

if (typeof window !== 'undefined') {
  import('./sw');
}
