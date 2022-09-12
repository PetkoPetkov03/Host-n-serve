import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from "fs";
import { exec } from 'child_process';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import * as rimraf from "rimraf"
import { uploadModel } from "./uploader.model"

@Injectable()
export class UploaderService {
    async installNodePackages(motherFolder: string, fullFolderName: string, relPath: string) {
        

        if (!fs.existsSync(`${motherFolder}/${fullFolderName}/${relPath}/package.json`)) {
            
            return;
        }

        exec(`cd ${motherFolder}/${fullFolderName}/${relPath}; npm install`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(stdout);

        });
    }

    async installVendors(motherFolder: string, fullFolderName: string, relPath: string) {
        
        if (!fs.existsSync(`${motherFolder}/${fullFolderName}/${relPath}/composer.json`)) {
            return;
        }

        exec(`cd ${motherFolder}/${fullFolderName}/${relPath}; composer install`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(stdout);
        });
    }

    reloadrestartApache(domain) {
        exec(`a2ensite ${domain}.conf`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(stdout);
        });
        exec("systemctl reload apache2", (error, stdout, stderr) => {if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(stdout);
        })
    }

    async uploadFiles(filename, filepath, data, auth: string, picturename, picture64, picturerelfilepath) {
        const jwt_decoded: any = jwt.decode(auth);
        const email: string = jwt_decoded.email;
        const domain: string = jwt_decoded.domain;
        const motherFolder: string = "/var/www/";
        const fullFolderName: string = domain;
        if (!fs.existsSync(motherFolder)) {
            fs.mkdirSync(motherFolder);
        }

        if (!fs.existsSync(`${motherFolder}/${fullFolderName}`)) {
            fs.mkdirSync(`${motherFolder}/${fullFolderName}`);
        }

        // console.log(filename, filepath, data);


        data.forEach(async (file, i) => {
            const filePathArray: string[] = filepath[i].split("/");
            const fileName: string = filePathArray.pop();
            // @ts-ignore
            const filePathArrayString: string = filePathArray.toString().replaceAll(",", "/")!;
            if (!fs.existsSync(`${motherFolder}/${fullFolderName}${filePathArrayString}`)) {
                const folders: string[] = filepath[i].split("/");
                folders.pop();
                folders.shift();

                const filePathArray: string[] = filepath[i].split("/");
                const fileName: string = filePathArray.pop();
                // @ts-ignore
                const filePathArrayString: string = filePathArray.toString().replaceAll(",", "/")!;
                fs.mkdir(`${motherFolder}/${fullFolderName}${filePathArrayString}`, (err) => {
                    if (err) {
                        return HttpErrorByCode[500];
                    }
                });
            }


            const decryptedfile: string = Buffer.from(file, 'base64').toString();

            fs.writeFile(`${motherFolder}/${fullFolderName}${filePathArrayString}/${fileName}`, decryptedfile, (err) => {
                if (err) {
                    return HttpErrorByCode[500];
                }
            });
        });

        picture64.forEach(async (picture, i) => {
            const picturePathArray: string[] = picturerelfilepath[i].split("/");
            const pictureName: string = picturePathArray.pop();
            // @ts-ignore
            const picturePathArrayString: string = picturePathArray.toString().replaceAll(",", "/");

            if (!fs.existsSync(`${motherFolder}/${fullFolderName}${picturePathArrayString}`)) {
                fs.mkdirSync(`${motherFolder}/${fullFolderName}${picturePathArrayString}`);
            }

            fs.writeFile(`${motherFolder}/${fullFolderName}${picturePathArrayString}/${pictureName}`, picture, "base64", (err) => {
                if (err) {
                    return { status: HttpErrorByCode[500] };
                }
            });
            // console.log(`${motherFolder}/${fullFolderName}${picturePathArrayString}/${pictureName}`);
        });

        console.log(filename);
        // fs.writeFileSync(`./${motherFolder}/${fullFolderName}/${folderpath}`, data);

        
        const Apache = "/etc/apache2/sites-available"
        const filePathArray = filepath[0].split("/");
        const APACHE_LOG_DIR = "${APACHE_LOG_DIR}";
        const filePathArrayFolder  = filePathArray[1]
        const content: string = `<VirtualHost *:80>
        # The ServerName directive sets the request scheme, hostname and port that
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.
        #ServerName www.example.com

        ServerAdmin webmaster@localhost
        ServerName ${domain}
        ServerAlias www.${domain}
        DocumentRoot ${motherFolder}${fullFolderName}/${filePathArrayFolder}

        # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
        # error, crit, alert, emerg.
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined

        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        #Include conf-available/serve-cgi-bin.conf
</VirtualHost>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
`;
        const fileName: string = filePathArray.pop();
        const upload = new uploadModel({
            user_email: email,
            domain: domain,
            folder: filePathArrayFolder
        });

        await upload.save();

        
        // @ts-ignore
        fs.writeFile(`${Apache}/${domain}.conf`, content, "utf-8", (err) => {
            if (err) {
                return {
                    status: HttpErrorByCode[500]
                };
            }
        });
        
        await this.installNodePackages(motherFolder, fullFolderName, filePathArrayFolder);

        await this.installVendors(motherFolder, fullFolderName, filePathArrayFolder);

        // this.reloadrestartApache(domain);

        return { state: "done" };
    }

    showUserFolder(auth) {
        const jwt_decoded: any = jwt.decode(auth);
        const motherFolder: string = "/var/www"
        const fullFolderName: string = jwt_decoded.domain;
        console.log(fullFolderName);
        
        const projectStructure: string = `${motherFolder}/${fullFolderName}`
        const data = fs.readdirSync(projectStructure);

        return { data: data };
    }

    async removeFolder(folder, auth) {
        const jwt_decoded: any = jwt.decode(auth);
        const motherFolder: string = "/var/www";
        const fullFolderName: string = jwt_decoded.domain;
        const projectStructure: string = `${motherFolder}/${fullFolderName}/${folder}`;

        const findConfFile: any = await uploadModel.findOne({  
            email: fullFolderName,
            folder: folder
        });

        const pathToConfFile = `/etc/apache2/sites-available/${findConfFile.domain}.conf`
        const enabledPathToConfFile = `/etc/apache2/sites-enabled/${findConfFile.domain}.conf`

        fs.rm(pathToConfFile, (err) => {
            if(err) {
                console.error(err.message);
            }
        });

        exec(`a2dissite ${findConfFile.domain}.conf`);

        const removeConfFile = await uploadModel.findOneAndRemove(findConfFile);
        exec("systemctl reload apache2", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(stdout);
        })

        rimraf(projectStructure, () => {
        })
    }
}
