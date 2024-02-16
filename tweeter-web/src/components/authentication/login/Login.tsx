import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
//import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
    originalUrl?: string;
}

const Login = (props: Props) => {
    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const { updateUserInfo } = useUserInfo();
    const { displayErrorMessage } = useToastListener();

    const rememberMeRef = useRef(rememberMe);
    rememberMeRef.current = rememberMe;

    const checkSubmitButtonStatus = (): boolean => {
        return !alias || !password;
    };

    const doLogin = async () => {
        presenter.doLogin(alias, password, rememberMeRef, props.originalUrl);
    };

    const listener: LoginView = {
        displayErrorMessage: displayErrorMessage,
        updateUserInfo: updateUserInfo,
        navigate: navigate,
    };

    //might not need useState but have it just in case
    const [presenter] = useState(new LoginPresenter(listener));

    const inputFieldGenerator = () => {
        return (
            <AuthenticationFields
                setAlias={setAlias}
                setPassword={setPassword}
            />
        );
    };

    const switchAuthenticationMethodGenerator = () => {
        return (
            <div className="mb-3">
                Not registered? <Link to="/register">Register</Link>
            </div>
        );
    };

    return (
        <AuthenticationFormLayout
            headingText="Please Sign In"
            submitButtonLabel="Sign in"
            oAuthHeading="Sign in with:"
            inputFieldGenerator={inputFieldGenerator}
            switchAuthenticationMethodGenerator={
                switchAuthenticationMethodGenerator
            }
            setRememberMe={setRememberMe}
            submitButtonDisabled={checkSubmitButtonStatus}
            submit={doLogin}
        />
    );
};

export default Login;
