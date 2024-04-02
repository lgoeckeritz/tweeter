import { ImageDAO } from "../interface/ImageDAO";

export class S3ImageDAO implements ImageDAO {
    putImage(fileName: string, imageStringBase64: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}
