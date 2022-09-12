<script>
    import { useNavigate } from "svelte-navigator";

    let navigate = useNavigate();
    const session = window.sessionStorage;

    const logout = () => {
        session.removeItem("AuthToken");
        navigate("/");
        location.reload();
    }

    window.onload = logout();
</script>

<main>
    <h1>WORK</h1>
</main>
