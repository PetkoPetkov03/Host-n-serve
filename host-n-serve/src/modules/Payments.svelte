<script>
    import {useNavigate} from "svelte-navigator"
    let password = "";

    $: monthly = 0;

    let arrayOfKeyPresses = [];
    const navigate = useNavigate();

    const query = async (e) => {
        e.preventDefault();

        const body = {
            password: password,
        };

        const response = await fetch(
            "http://localhost:8000/subscriptions/calc_monthly",
            {
                mode: "cors",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );

        const parsed_response = await response.json();


        monthly = parsed_response.data;
    };
</script>

<main>
    <h1>Payments</h1>

    <form on:submit={query}>
        <input
            type="password"
            placeholder="password"
            on:change={(e) => (password = e.target.value)}
        />
        <button type="submit">Submit</button>
    </form>

    {monthly}
</main>
