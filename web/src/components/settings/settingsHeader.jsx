import { useNavigate } from 'solid-app-router';
import BackButton from '../buttons/back';
import MenuButton from '../buttons/menu';
import Header from '../header/header';

let SettingsHeader = ({ activateMenu = () => {} }) => {
  let navigate = useNavigate();

  return (
    <>
      <div class="hidden md:block flex-none">
        <Header
          title="Settings"
          start={() => <BackButton onClick={() => navigate('/')} />}
        />
      </div>

      <div class="md:hidden block flex-none">
        <Header
          title="Settings"
          start={() => <BackButton onClick={() => navigate('/')} />}
          end={() => <MenuButton onClick={() => activateMenu()} />}
        />
      </div>
    </>
  );
};

export default SettingsHeader;
