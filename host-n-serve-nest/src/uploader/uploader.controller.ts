import { Body, Controller, Delete, Post } from '@nestjs/common';
import { UploaderService } from './uploader.service';

@Controller('uploader')
export class UploaderController {
    constructor(private readonly uploaderService: UploaderService) { }

    @Post("/")
    uploader(@Body("filename") filename: string, @Body("filepath") filepath: string, 
    @Body("data") data: string, @Body("AuthToken") auth: string, @Body("picturename") picturename: string,
    @Body("picture64") picture64: string, @Body("picturerelfilepath") picturerelfilepath: string) {
        return this.uploaderService.uploadFiles(filename, filepath, data, auth, picturename, picture64, picturerelfilepath);
    }

    @Post("show")
    showFileStructure(@Body("AuthToken") auth: string){
        return this.uploaderService.showUserFolder(auth);
    }

    @Delete("delete")
    removeFolder(@Body("AuthToken") auth: string, @Body("folder") folder: string) {
        return this.uploaderService.removeFolder(folder, auth);
    }
}
