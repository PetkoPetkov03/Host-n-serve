<script>
    import { useNavigate } from "svelte-navigator";

    let navigate = useNavigate();

    $: message = "";
    let cupon = "";
    const session = window.sessionStorage;
    const auth = session.getItem("AuthToken");

    let subscribed = null;

    let data = [];

    const fetchPlans = async () => {
        const body = {
            AuthToken: auth,
        };

        const response = await fetch("http://localhost:8000/subscriptions", {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const parsed_response = await response.json();

        data = parsed_response.data;
    };

    const checkIfSubscribed = async () => {
        const body = {
            AuthToken: auth,
        };

        const response = await fetch(
            "http://localhost:8000/subscriptions/active",
            {
                mode: "cors",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );

        const parsed_response = await response.json();

        if (parsed_response.subs[0] === undefined) {
            subscribed = false;
            fetchPlans();
            return;
        }
        subscribed = true;
        message = "This account already has an active subscription!";
    };

    const verifyUser = async() => {
        const body = {
            AuthToken: auth
        };

        const request = await fetch("http://localhost:8000/auth/verify_user", {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(body)
        });

        const response = await request.json();

        return response;
    }

    const navigateToAccount = () => {
        navigate('/acount')
    }

    const purchise = async (id, nickname) => {
        if (subscribed === false) {
            const body = {
                AuthToken: auth,
                price_id: id,
                cupon_id: cupon
            };

            const stripe_session = await fetch(
                "http://localhost:8000/subscriptions/session",
                {
                    mode: "cors",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );

            session.setItem("Nickname", nickname);

            const parsed_session = await stripe_session.json();
            session.setItem("SessionId", parsed_session.id);

            window.location.assign(parsed_session.url);

            return;
        }
        message = "This account already has an active subscription!";
    };

    const fetchCupon = async() => {
        const id = await verifyUser();

        const body = {
            user_id: id.id
        };

        const request = await fetch("http://localhost:8000/cupons/cupon", {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(body)
        });

        const response = await request.json();

        cupon = response.cupon.cupon_id;
    }

    checkIfSubscribed();
    fetchCupon();
</script>

<main>
    {#if subscribed}
            <div class="message-div">
                <div class="button-div">
                    <h1 class="font-serif antialiased not-italic font-bold text-xl">{message}</h1>
                    <button class="font-serif antialiased not-italic font-bold text-lg" on:click={navigateToAccount}>Navigate to Acount</button>
                </div>
            </div>
    {:else if !subscribed}
        <div class="canvas">
            {#each data as sub}
                <div class="card">
                    <div class="acount-canvas">
                        <h1
                            class="font-serif antialiased not-italic font-bold text-xl "
                        >
                            {sub.nickname}
                        </h1>
                        <p key={sub.unit_amount}>
                            {sub.unit_amount / 100}
                            {sub.currency !== undefined
                                ? sub.currency.toUpperCase()
                                : ""}{sub.recurring ? "/m" : ""}
                        </p>
                    </div>

                    <div class="button-canvas">
                        <input
                            key={sub.id}
                            type="button"
                            value="Chose a plan"
                            class="button"
                            on:click={purchise(sub.id, sub.nickname)}
                        />
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <h1>Error!</h1>
    {/if}
</main>

<style scoped>

    main {
        background-color: #f5f5f5;
    }
    .acount-canvas {
        width: 100%;
        /* height: 95vh; */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .canvas {
        padding-top: 3vh;
        padding-left: 5vh;
        padding-right: 5vh;
        width: 100%;
        height: 80%;
        display: grid;
        grid: 100% / 35% 35% 35%;
        grid-row: 3;
        grid-column: 3;
    }

    .button-canvas {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .card {
        margin-top: 10px;
        max-width: 45%;
        min-width: min-content;
        height: 250px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border: 2px solid #dedede;
    }
    .button {
        border: 0.5px solid steelblue;
        background-color: steelblue;
        color: whitesmoke;
        box-shadow: 12px 11px 10px 0px #dedede;
        width: 80%;
        max-width: 80%;
        min-width: fit-content;
    }
    .button:active {
        background-color: lightblue;
        border: 0.5px dotted #dedede;
        color: black;
        box-shadow: 0px 0px 0px 0px #dedede;
    }
    .info {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    .message-div {
        display: flex;
        width: 100%;
        height: 100vh;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .button-div {
        width: 100%;
        max-width: max-content;
        min-width: fit-content;
        max-height: max-content;
        min-height: fit-content;
    }

    .button-div > button {
        margin-top: 5rem;
        color: white;
        border: 1px solid #dedede;
        background-color: steelblue;
        width: 100%;
        align-self: center;
        box-shadow: 1px 1px 8px 5px #dedede;
    }
    .button-div > button:active {
        background-color: lightblue;
        border: 0.5px dotted #dedede;
        color: black;
        box-shadow: 0px 0px 0px 0px #dedede;
    }
</style>
