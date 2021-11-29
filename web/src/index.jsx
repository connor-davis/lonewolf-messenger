import { Router } from 'solid-app-router';
import { render } from 'solid-js/web';
import App from './App';
import './index.css';

let RoutedApp = () => (
  <Router>
    <App />
  </Router>
);

render(RoutedApp, document.getElementById('root'));
