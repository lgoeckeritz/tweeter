import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { AuthenticationView, Presenter } from "./Presenter";

export interface RegisterView extends AuthenticationView {
    setImageUrl: (url: string) => void;
    setImageBytes: (bytes: Uint8Array) => void;
}

/*
TODO: This and login have similar things to factor out
do something similar tro doFailureReportingOperation to pull out
duplicated code from doRegister and doLogin
put that AuthenticationView in there too


*/

export class RegisterPresenter extends Presenter<RegisterView> {
    private service: UserService;

    public constructor(view: RegisterView) {
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

    public handleImageFile(file: File | undefined) {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));

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

                this.view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);
        } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
        }
    }
}
