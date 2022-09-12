<script>
    import { Link, useNavigate } from "svelte-navigator";

    let loaded = false;
    const session = window.sessionStorage;
    const id = session.getItem("SessionId");
    const nickname = session.getItem("Nickname");
    const auth = session.getItem("AuthToken");

    let arrayOfKeyPresses = [];

    let check = false;

    let cuponsLeft = 0;

    if (id !== null) {
        if (nickname !== null) {
            const body = {
                session_id: id,
                nickname,
                AuthToken: auth,
            };

            fetch(
                "http://localhost:8000/subscriptions/compleate-transaction",
                {
                    method: "POST",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );

            session.removeItem("SessionId");
            session.removeItem("Nickname");
        }
    }

    const fetchCuponsLeft = async() => {
        const request = await fetch("http://localhost:8000/cupons/left", {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
        });

        const response = await request.json();

        cuponsLeft = response.cupons_left
    }

    let navigate = useNavigate();

    document.onkeyup = function (event) {
        let char = event.key;

        // queue structure: keep latest 5 key presses
        if (arrayOfKeyPresses.length > 4) {
            [, ...arrayOfKeyPresses] = arrayOfKeyPresses;
        }

        arrayOfKeyPresses = [...arrayOfKeyPresses, char];

        // check cheat
        if (
            arrayOfKeyPresses.toString() ===
            "Control,Shift,ArrowDown,ArrowDown,ArrowDown"
        ) {
            if (check) {
                navigate("");
                check = false;
            } else {
                navigate("payments");
                check = true;
            }
        }
    };

    const scrollToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }

    fetchCuponsLeft();
    loaded = true;
</script>

<main>
    {#if !loaded}
        <div class="loading">
            <img src="Blocks-1s-200px.svg" alt="" srcset="" />
        </div>
    {:else}
        <div class="container">
            <div class="home">
                <img src="logowhitecontur.png" alt="logo" class="logo">
                <div class="button-div">
                    <button on:click={scrollToBottom} class="button button mt-4 font-mono text-sm antialiased hover:subpixel-antialiased no-italic bg-blue-300 hover:bg-blue-300 border-2 text-white rounded-md border-blue-300 hover:border-indigo-500 border-solid">Show Tutorial</button>
                    {#if auth}
                        <button on:click={() => navigate("genCuponsPercSecretMagic")} class="button button mt-4 font-mono text-sm antialiased hover:subpixel-antialiased no-italic bg-blue-300 hover:bg-blue-300 border-2 text-white rounded-md border-blue-300 hover:border-indigo-500 border-solid"><Link to="/genCuponsPercSecretMagic">Cupons Left: {cuponsLeft}</Link></button>
                    {/if}
                </div>
            </div>
            <div class="blank_space">
            </div>
            <div class="test">
                <div class="tut">
                    <label for="img">Step 1: Go to Subscriptions page.</label>
                    <img src="cloud.png" class="resize" alt="aaaa" />
                </div>
    
                <div class="tut">
                    <label for="img"
                        >Step 2: Then buy a subscription <br /> Example:
                    </label>
                    <img src="plan.png" class="resize-small" alt="aaaa" />
                </div>
    
                <div class="tut">
                    <label for="img"
                        >Step 3: After buying a subscription go to your account.</label
                    >
                    <img src="account.png" class="resize" alt="aaaa" />
                </div>
    
                <div class="tut">
                    <label for="img">Step 4: Select the upload option:</label>
                    <img
                        src="account_upload.png"
                        class="resize-medium"
                        alt="aaaaa"
                    />
                </div>
    
                <div class="tut">
                    <label for="img"
                        >Step 5: Drag the folder containing your code</label
                    >
                    <img
                        src="folder'drop.png"
                        class="resize-very-small"
                        alt="aaaa"
                    />
                </div>
    
                <div class="tut">
                    <label for="img">Step 6: Wait for the uploader to finish</label>
                    <img src="uploaded.png" class="resize-small" alt="aaaa" />
                </div>
            </div>
        </div>
    {/if}
</main>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }
    .loading {
        display: flex;
        height: 90vh;
        align-content: center;
        justify-content: center;
    }

    .home {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 95vh;
        background-image: url(../Clouds-21.7s-1872px.svg);
    }

    .blank_space {
        padding: 100px;
        background-color: #f5f5f5;
    }

    .button {
        border: 0.5px solid steelblue;
        background-color: steelblue;
        color: whitesmoke;
        height: 5vh;
        width: 150%;
    }
    .button:active {
        background-color: lightblue;
        border: 0.5px dotted #dedede;
        color: black;
        box-shadow: 0px 0px 0px 0px #dedede;
    }

    .loading > img {
        padding: 350px;
    }

    .resize {
        width: 100px;
        height: auto;
    }

    .test {
        display: grid;
        /* in short we can also use repeat function */
        grid-template-columns: repeat(2, 4fr);
        grid-template-columns: 30% repeat(2, 5fr);
        background-color: #f5f5f5;
    }

    .tut {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        justify-items: center;
        align-items: center;
    }

    .resize {
        width: auto;
        height: 200px;
        border: 1px solid #dedede;
        box-shadow: 2px 4px 5px 3px #dedede;
    }

    .resize-small {
        width: 200px;
        height: auto;
    }

    .resize-small {
        width: auto;
        height: 300px;
        border: 1px solid #dedede;
        box-shadow: 2px 4px 5px 3px #dedede;
    }

    .resize-very-small {
        width: 125px;
        height: auto;
    }

    .resize-very-small {
        width: auto;
        height: 155px;
        border: 1px solid #dedede;
        box-shadow: 2px 4px 5px 3px #dedede;
    }

    .resize-medium {
        width: 300px;
        height: auto;
    }

    .resize-medium {
        width: auto;
        height: 400px;
        border: 1px solid #dedede;
        box-shadow: 2px 4px 5px 3px #dedede;
    }
</style>
