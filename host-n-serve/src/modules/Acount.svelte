<script>
    import { useNavigate } from "svelte-navigator";

    const session = window.sessionStorage;
    const auth = session.getItem("AuthToken");

    $: plan = false;

    let domain = "";

    let navigate = useNavigate();

    const activeSub = async () => {
        const body = {
            AuthToken: auth,
        };

        const response = await fetch(
            "http://localhost:8000/subscriptions/active",
            {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );

        const parsed_response = await response.json();

        if (parsed_response.subs.length > 0) {
            plan = parsed_response.subs;
        } else {
            plan = false;
        }
    };

    const unsubscribe = async (id) => {
        const user = prompt(
            "Would you like to unsubscribe? \n \n If Yes type 'unsubscribe'"
        ).toLowerCase();
        const body = {
            AuthToken: auth,
            subscription_id: id,
        };

        if (user !== "unsubscribe") {
            return;
        }

        if (id == null || id == undefined) {
            return;
        }

        await fetch("http://localhost:8000/subscriptions/unsubscribe", {
            method: "DELETE",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        plan = false;
    };

    const getAccountInfo = async () => {
        const body = {
            AuthToken: auth,
        };

        const response = await fetch(
            "http://localhost:8000/auth/accountinfo",
            {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );

        const parsed_response = await response.json();

        domain = parsed_response.domain;
    };

    const navigateToFileStructure = () => {
        navigate("/filestruct");
    };

    const navigateToUpload = () => {
        navigate("/upload");
    };

    activeSub();
    getAccountInfo();
</script>

<main>
    {#if plan}
        {#each plan as plan}
            <div class="acount-canvas">
                <img
                    src="./account-svgrepo-com.svg"
                    width="150px"
                    height="50px"
                    alt=""
                />
                <div class="acount-card">
                    <h1>{domain}</h1>
                    <h1>{plan.plan}</h1>
                    <button
                        class="button mt-4 font-mono text-sm antialiased hover:subpixel-antialiased no-italic bg-blue-300 hover:bg-blue-300 border-2 text-white rounded-md border-blue-300 hover:border-indigo-500 border-solid"
                        on:click={unsubscribe(plan.subscription_id)}
                        >Unsubscribe</button
                    >
                    <button
                        class="button mt-4 font-mono text-sm antialiased hover:subpixel-antialiased no-italic bg-blue-300 hover:bg-blue-300 border-2 text-white rounded-md border-blue-300 hover:border-indigo-500 border-solid"
                        on:click={navigateToUpload}>Upload!</button
                    >

                    <button
                        class="button mt-4 font-mono text-sm antialiased hover:subpixel-antialiased no-italic bg-blue-300 hover:bg-blue-300 border-2 text-white rounded-md border-blue-300 hover:border-indigo-500 border-solid"
                        on:click={navigateToFileStructure}
                        >Show File structure</button
                    >
                </div>
            </div>
        {/each}
    {:else}
        <div class="acount-canvas">
            <img
                src="./account-svgrepo-com.svg"
                width="150px"
                height="50px"
                alt=""
            />
            <div class="acount-card">
                <h1>{domain}</h1>
            </div>
        </div>
    {/if}
</main>

<style scoped>
    main {
        background-color: #f5f5f5;
    }
    .acount-canvas {
        width: 100%;
        height: 95vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .acount-canvas > button {
        width: 15rem;
    }

    img {
        height: 10vw;
        background-color: var(--primary-color);
        border-radius: 1rem 1rem 0 0;
    }

    .acount-card {
        margin-top: 0px;
        background-color: snow;
        width: 45%;
        height: 250px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border: 2px solid #dedede;
        box-shadow: 9px 7px 8px 1px #d4d4d4;
    }

    .button {
        border: 0.5px solid steelblue;
        background-color: steelblue;
        color: whitesmoke;
        box-shadow: 12px 11px 10px 0px #dedede;
        width: 60%;
    }
    .button:active {
        background-color: lightblue;
        border: 0.5px dotted #dedede;
        color: black;
        box-shadow: 0px 0px 0px 0px #dedede;
    }
</style>
