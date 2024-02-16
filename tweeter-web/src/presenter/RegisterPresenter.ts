import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";

export interface RegisterView {
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    navigate: NavigateFunction;
}

export class RegisterPresenter {
    private service: UserService;
    private view: RegisterView;

    //private imageBytes: Uint8Array = new Uint8Array();
    //private _imageUrl: string = "";

    public constructor(view: RegisterView) {
        this.view = view;
        this.service = new UserService();
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        rememberMeRef: React.MutableRefObject<boolean>,
        imageBytes: Uint8Array
    ) {
        try {
            let [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes
            );

            this.view.updateUserInfo(
                user,
                user,
                authToken,
                rememberMeRef.current
            );
            this.view.navigate("/");
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        }
    }

    public handleImageFile(
        file: File | undefined,
        setImageUrl: React.Dispatch<React.SetStateAction<string>>,
        setImageBytes: React.Dispatch<React.SetStateAction<Uint8Array>>
    ) {
        if (file) {
            setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                setImageBytes(bytes);
            };
            reader.readAsDataURL(file);
        } else {
            setImageUrl("");
            setImageBytes(new Uint8Array());
        }
    }

    // public get imageUrl() {
    //     return this._imageUrl;
    // }
}
