import { useContext } from "react";
import { AuthToken, User } from "tweeter-shared";
import { UserInfoContext } from "./UserInfoProvider";

interface UserInfoListener {
    currentUser: User | null;
    authToken: AuthToken | null;
    displayedUser: User | null;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    clearUserInfo: () => void;
    setDisplayedUser: (user: User) => void;
}

const useUserInfo = (): UserInfoListener => {
    const {
        currentUser,
        authToken,
        displayedUser,
        updateUserInfo,
        clearUserInfo,
        setDisplayedUser,
    } = useContext(UserInfoContext);

    return {
        currentUser: currentUser,
        authToken: authToken,
        displayedUser: displayedUser,
        updateUserInfo: updateUserInfo,
        clearUserInfo: clearUserInfo,
        setDisplayedUser: setDisplayedUser,
    };
};

export default useUserInfo;
