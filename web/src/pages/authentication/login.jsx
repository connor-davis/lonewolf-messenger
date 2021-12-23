import { authentication } from 'lonewolf-protocol';
import { createSignal } from 'solid-js';
import LoneWolfLogo from '../../assets/LoneWolfLogo';

let LoginCard = ({ showRegister }) => {
  let [success, setSuccess] = createSignal('');
  let [error, setError] = createSignal('');

  let [username, setUsername] = createSignal('');
  let [password, setPassword] = createSignal('');

  let login = async () => {
    await authentication.loginUser(
      { username: username(), password: password() },
      ({ errMessage, success }) => {
        if (errMessage) return setError(errMessage) && setSuccess('');
        else return setError('') && setSuccess(success);
      }
    );
  };

  return (
    <div class="flex flex-col w-auto h-auto p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm space-y-5 max-w-sm">
      <div class="flex justify-center items-center w-full h-auto">
        <LoneWolfLogo />
      </div>

      <div class="flex flex-col w-full h-auto">
        <div class="flex justify-center w-full h-auto text-gray-900 dark:text-white text-lg">
          Authenticate
        </div>
        <div class="flex w-full h-auto text-gray-400 text-sm text-center">
          Please login using your authentication details.
        </div>
      </div>

      {success() !== '' && (
        <div class="flex justify-center items-center text-center text-green-600">
          {success()}
        </div>
      )}

      {error() !== '' && (
        <div class="flex justify-center items-center text-center text-red-500">
          {error()}
        </div>
      )}

      <div class="flex flex-col w-full h-auto space-y-2">
        <input
          type="text"
          placeholder="Your username"
          value={username()}
          onChange={(event) => setUsername(event.target.value)}
          class="w-full h-auto p-3 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white outline-none"
        />
        <input
          type="password"
          placeholder="Your password"
          value={password()}
          onChange={(event) => setPassword(event.target.value)}
          class="w-full h-auto p-3 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white outline-none"
        />
      </div>

      <div class="flex flex-col justify-center items-center w-full h-auto space-y-2">
        <div
          class="flex w-auto h-auto px-4 py-2 bg-blue-600 rounded-md cursor-pointer text-white"
          onClick={() => login()}
        >
          Login
        </div>
        <div class="flex w-full justify-center text-center text-gray-900 dark:text-white space-x-2">
          <div>Don't have an account?</div>
          <div
            class="cursor-pointer text-blue-600"
            onClick={() => showRegister()}
          >
            Register
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
