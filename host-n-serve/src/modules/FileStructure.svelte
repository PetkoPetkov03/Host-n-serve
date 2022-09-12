<script>
    import { each } from "svelte/internal";

    $: fileStruct = [];

    const session = window.sessionStorage;

    const AuthToken = session.getItem("AuthToken");
    const fileStructGet = async () => {
        const body = {
            AuthToken: AuthToken,
        };
        const response = await fetch(
            "http://localhost:8000/uploader/show",
            {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );

        const parsed_response = await response.json();

        fileStruct = parsed_response.data;
    };

    const removeFolder = async (folder) => {
        const body = {
            AuthToken: AuthToken,
            folder: folder,
        };

        await fetch("http://localhost:8000/uploader/delete", {
            method: "DELETE",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        fileStruct = fileStruct.filter((folderName) => folderName !== folder);
    };

    fileStructGet();
</script>

<main>
    {#if fileStruct.length === 0}
        <div class="filesystem">
            <h1>No Projects</h1>
        </div>
    {:else}
        <div class="filesystem">
            <div class="filestruct">
                {#each fileStruct as file}
                    <h1>{file}</h1>
                    <button class="button button mt-4 font-mono text-sm antialiased hover:subpixel-antialiased no-italic bg-blue-300 hover:bg-blue-300 border-2 text-white rounded-md border-blue-300 hover:border-indigo-500 border-solid" on:click={removeFolder(file)}>Remove</button>
                {/each}
            </div>
        </div>
    {/if}
</main>

<style scoped>
    main {
        height: 90vh;
        width: 100%;
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
    }
    .filesystem {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vh;
        border: 1px solid #dedede;
        box-shadow: 2px 3px 5px 3px #dedede;
    }

    .filestruct {
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .button {
        border: 0.5px solid steelblue;
        background-color: steelblue;
        color: whitesmoke;
        box-shadow: 12px 11px 10px 0px #dedede;
        width: 250%;
    }
    .button:active {
        background-color: lightblue;
        border: 0.5px dotted #dedede;
        color: black;
        box-shadow: 0px 0px 0px 0px #dedede;
    }
</style>
