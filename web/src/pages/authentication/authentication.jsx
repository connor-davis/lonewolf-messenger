import { createSignal } from "solid-js"
import LoginCard from "./login";
import RegisterCard from "./register";

let AuthenticationPage = () => {
    let [loginPage, setLoginPage] = createSignal(true);

    return (<div class="flex flex-col justify-center items-center w-full h-full bg-gray-200 dark:bg-gray-900">
        {loginPage() && <LoginCard showRegister={() => setLoginPage(false)} />}
        {!loginPage() && <RegisterCard showLogin={() => setLoginPage(true) }/>}
    </div>)
}

export default AuthenticationPage;