<script>
    import { useNavigate } from "svelte-navigator";


    const session = window.sessionStorage;
    let token = typeof session.getItem("AuthToken") === "string" ? session.getItem("AuthToken") : "";
    $: cuponId = "";

    const navigate = useNavigate();
    
    const verifyUser = async () => {
        const body = {
            "AuthToken": token
        };

        const request = await fetch("http://localhost:8000/auth/verify_user", {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        const response = await request.json();
        
        return response.id;
        
    }
    const genCupon = async () => {
        const id = await verifyUser();

        const body = { 
            user_id: id
        };

        const request = await fetch("http://localhost:8000/cupons/create", {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        const response = await request.json();

        cuponId = response.cupon
    }

    
    genCupon();
</script>

<main>
    <div class="container">
        <div class="cupon-container">
            <h1>Cupon generated!</h1>
            <button on:click={() => navigate("/")} class="button button mt-4 font-mono text-sm antialiased hover:subpixel-antialiased no-italic bg-blue-300 hover:bg-blue-300 border-2 text-white rounded-md border-blue-300 hover:border-indigo-500 border-solid">Go back to home page</button>
        </div>
    </div>
</main>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 91vh;
        background-color: #f5f5f5;
    }

    .cupon-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 20vh;
        width: 50%;
        border: 1px solid #dedede;
        box-shadow: 9px 7px 8px 1px #d4d4d4;
        background-color: snow;
    }

    .button {
        border: 0.5px solid steelblue;
        background-color: steelblue;
        color: whitesmoke;
        height: 5vh;
        width: 50%;
    }
    .button:active {
        background-color: lightblue;
        border: 0.5px dotted #dedede;
        color: black;
        box-shadow: 0px 0px 0px 0px #dedede;
    }
</style>