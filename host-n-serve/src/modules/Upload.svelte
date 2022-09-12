<script>
    import FilePond, { registerPlugin } from "svelte-filepond";

    // Import the Image EXIF Orientation and Image Preview plugins
    // Note: These need to be installed separately
    // `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
    import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
    import FilePondPluginImagePreview from "filepond-plugin-image-preview";
    import FilePondPluginFileEncode from "filepond-plugin-file-encode";
    import { useNavigate } from "svelte-navigator";

    const session = window.sessionStorage;
    let navigate = useNavigate();
    const auth = session.getItem("AuthToken");

    if (auth === "") {
        navigate("/");
    }

    // Register the plugins
    registerPlugin(
        FilePondPluginImageExifOrientation,
        FilePondPluginImagePreview,
        FilePondPluginFileEncode
    );

    let message = {
        message: "",
        status: ""
    };

    // a reference to the component, used to call FilePond methods
    let pond;

    // pond.getFiles() will return the active files

    // the name to use for the internal file input
    let name = "filepond";

    // handle filepond events
    function handleInit() {
        console.log("FilePond has initialised");
    }

    const ArrayOfPictures = [];
    const ArrayOfPicturesNames = [];
    const ArrayOfPicturesRelativePaths = [];

    const ArrayOfEncriptedFiles = [];
    const ArrayOfNamesOfEncriptedFiles = [];
    const ArrayOfRelativePaths = [];

    let continueToProces;

    $: buttonState = true;

    async function handleAddFile(err, fileItem) {
        const body = {
            AuthToken: auth
        }

        const existingFiles = await fetch("http://localhost:8000/uploader/show", {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        const parsed_existingFile = await existingFiles.json();
        
        if (fileItem.filename === "node_modules") {
            message = {
                message: "remove node_moudles!",
                status: "error"
            };
            continueToProces = false;
            return;
        }
        // if(existingFiles.data.length > 0 && existingFiles.data[0] !==){}
        const file = fileItem.relativePath;
        const folder = file.split("/");

        console.log(parsed_existingFile);

        if(parsed_existingFile.data.length > 0 && parsed_existingFile.data[0] !== folder[1]) {
            message = {
                message: "You can only have one mother folder inside the domain if you have renamed the folder simply remove the old one from your account settings and then try to upload the renamed one",
                status: "error"
            };
            continueToProces = false;
            return;
        }
        if (fileItem.relativePath == "") {
            message = {
                message: "Upload only whole folders",
                status : "error"
            };
            continueToProces = false;
            return;
        }

        continueToProces = true;
    }

    const onProcessFiles = () => {
        
        if (continueToProces) {
            pond.getFiles().forEach((file, i) => {
                if (
                    file.fileExtension === "js" ||
                    file.fileExtension === "css" ||
                    file.fileExtension === "map" ||
                    file.fileExtension === "php" ||
                    file.fileExtension === "json" ||
                    file.fileExtension === "html" ||
                    file.fileExtension === "cjs" ||
                    file.fileExtension === "txt" ||
                    file.fileExtension === "env" ||
                    file.fileExtension === "py" ||
                    file.fileExtension === "hbs" ||
                    file.fileExtension === "yaml"
                ) {
                    ArrayOfEncriptedFiles.push(
                        file.getFileEncodeBase64String()
                    );
                    ArrayOfNamesOfEncriptedFiles.push(file.filename);
                    ArrayOfRelativePaths.push(file.relativePath);
                } else if (
                    file.fileExtension === "png" ||
                    file.fileExtension === "jpeg" ||
                    file.fileExtension === "jpg" ||
                    file.fileExtension === "svg"
                ) {
                    ArrayOfPicturesNames.push(file.filename);
                    ArrayOfPictures.push(file.getFileEncodeBase64String());
                    ArrayOfPicturesRelativePaths.push(file.relativePath);
                }
            });
            message = {
                message: "Files uploaded",
                status: "success"
            };
            console.log(ArrayOfRelativePaths);
            buttonState = !buttonState;
            return;
        }
    };

    const sendFiles = async () => {
        const body = {
            filename: ArrayOfNamesOfEncriptedFiles,
            filepath: ArrayOfRelativePaths,
            data: ArrayOfEncriptedFiles,
            picturename: ArrayOfPicturesNames,
            picture64: ArrayOfPictures,
            picturerelfilepath: ArrayOfPicturesRelativePaths,
            AuthToken: auth,
        };

        const response =  await fetch("http://localhost:8000/uploader", {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const parsed_response = response.json();

        if(parsed_response.status === 500) {
            return ;
        }
        navigate("/");
    };
</script>

<div class="app">
    <FilePond
        class=""
        bind:this={pond}
        {name}
        server="/"
        allowMultiple={true}
        oninit={handleInit}
        onaddfile={handleAddFile}
        onprocessfiles={onProcessFiles}
    />

    <div class="button-canvas">
        <button class={buttonState ? "mt-4 font-mono text-sm antialiased hover:subpixel-antialiased no-italic bg-gray-300 hover:bg-gray-300 border-2 text-black rounded-md border-gray-300 hover:border-gray-500 border-solid" : "mt-4 font-mono text-sm antialiased hover:subpixel-antialiased no-italic bg-blue-300 hover:bg-blue-300 border-2 text-white rounded-md border-blue-300 hover:border-indigo-500 border-solid"} on:click={sendFiles} disabled={buttonState}>Submit</button>
    </div>
    <div class="message-padding">
        <div class="message-canvas-{message.status}">
            {message.message}
        </div>
    </div>
</div>

<style>
    .button-canvas {
        padding: 20px;
        width: 100%;
        padding-bottom: 0px;
    }
    .button-canvas > button {
        width: 100%;
    }

    .message-padding {
        padding: 20px;
        padding-top: 4px;
    }

    .message-canvas-success {
        display: flex;
        background-color: greenyellow;
        color: green;
        justify-content: center;
        align-content: center;
        border: 2px solid green;
        border-radius: 12px;
    }

    .message-canvas-error {
        display: flex;
        background-color: lightcoral;
        color: red;
        justify-content: center;
        align-content: center;
        border: 2px solid red;
        border-radius: 12px;
    }
</style>
