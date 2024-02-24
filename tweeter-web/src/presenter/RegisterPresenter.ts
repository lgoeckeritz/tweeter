import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { AuthenticationView, Presenter } from "./Presenter";

// export interface RegisterView {
//     displayErrorMessage: (message: string) => void;
//     authenticated: (user: User, authToken: AuthToken) => void;
//     navigateTo: (url: string) => void;
// }

export class RegisterPresenter extends Presenter<AuthenticationView> {
    private service: UserService;

    public constructor(view: AuthenticationView) {
        super(view);
        this.service = new UserService();
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array
    ) {
        this.doFailureReportingOperation(async () => {
            let [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes
            );

            this.view.authenticated(user, authToken);
            this.view.navigateTo("/");
        }, "register user");
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
}
