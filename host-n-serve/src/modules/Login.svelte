<script>
    import { useNavigate } from "svelte-navigator";

    let navigate = useNavigate();

    let message = {
        message: "",
        status: ""
    };

    let domain = "";
    let pass = "";

    const session = window.sessionStorage

    const login = async(e) => {
        e.preventDefault()
        
        const body = {
            domain,
            password: pass
        }

        const response = await fetch("http://localhost:8000/auth/sign-in", {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        const parsed_response = await response.json();

        if(parsed_response.token === undefined){
            message = {
                message: "Wrong password or email",
                status: "error"
            };
        }else{
            session.setItem("AuthToken", parsed_response.token)
            navigate("/");
            location.reload();
        }
    }
</script>

<main>
    <div class="component" >
        <div class="register-form bg-white" on:submit={login}>
            <form class="register-input-div flex justify-items-center flex-col bg-transparent">
                <h1 class="text-xl mb-6 font-mono" >Virtual Machinne</h1>
                <div class="back">
                    <!-- svelte-ignore a11y-img-redundant-alt -->
                    <img src="logowhitecontur.png" alt="image not found1" />
                </div>
                <h2 class="text-3xl mb-6 font-mono">Login</h2>
                <div class="form flex justify-items-center flex-col">
                    <input class="text-center bg-gray-100 m-2 border-2 border-gray-200 border-solid rounded-md w-12/12" type="text" bind:value={domain} name="domain" id="domain" placeholder="domain" required/>
                    <input class="text-center bg-gray-100 m-2 border-2 border-gray-200 border-solid rounded-md w-12/12" type="password" bind:value={pass} name="pass" id="pass" placeholder="password" required/>
                    <input class="mt-4 font-mono text-sm antialiased hover:subpixel-antialiased no-italic bg-blue-300 hover:bg-blue-300 border-2 text-white rounded-md border-blue-300 hover:border-indigo-500 border-solid" type="submit" value="Login"/>
                </div>
                <div class="message-padding">
                    <div class="message-canvas-{message.status}">
                        <p class="font-mono text-lg underline decoration-indigo-600 antialiased hover:subpixel-antialiased italic" >{message.message}</p>
                    </div>
                </div>
            </form>
        </div>
    </div>
</main>

<style scoped>
    .component {
        width: 100%;
        height: 100%;
        display: flex;
        /* justify-content: center;
    align-items: center; */
    }

    .back {
        padding: 0;
        margin: 0;
        width: 30%;
        object-fit: cover;
    }
    .back > img {
        max-width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 50%;
    }

    .register-form {
        display: flex;
        justify-content: center;
        padding-left: 10%;
        margin-top: 10%;
        /* align-items: center; */
        /* border: 1px solid #dedede; */
        width: 100%;
        height: 100%;
    }

    .form {
        width: 100%;
    }

    .register-input-div > h1 {
        padding-bottom: 1%;
        padding-top: 0;
        margin-top: 0;
    }

    .register-input-div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    input {
        margin-bottom: 2%;
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