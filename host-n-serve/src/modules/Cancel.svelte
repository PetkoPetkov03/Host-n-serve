<script>
    import { useNavigate } from "svelte-navigator"
    
    let navigate = useNavigate();

    const session = window.sessionStorage;

    session.removeItem("SessionId");
    session.removeItem("Nickname");
    navigate('/');
    location.reload();
</script>

<main>
    Lmaooooo
</main>