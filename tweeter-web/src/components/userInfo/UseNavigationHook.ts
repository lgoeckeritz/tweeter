import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

const useNavigation = () => useContext(UserInfoContext);

export default useNavigation;
