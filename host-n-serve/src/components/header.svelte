<script>
    import {Router, Link, useNavigate} from "svelte-navigator"

    let navigate = useNavigate();
    const session = window.sessionStorage;
    let auth = session.getItem("AuthToken");
</script>

<main>
    <div class="header flex justify-around p-3 border-b-2 shadow-lg shadow-gray-3
		00/50">
        <Router>
			<div class="logo">
				<Link to="/"><img class="svg-logo" src="./logowhitecontur.svg" width="150px" height="150px" alt=""></Link>
			</div>
			<div class="links flex">
                {#if auth == null}
                    <Link class="svg-link mr-4" to="register"><img src="add-people-interface-symbol-of-black-person-close-up-with-plus-sign-in-small-circle-svgrepo-com.svg" alt=""></Link>
                    <Link class="svg-link mr-4" to="login"><img src="login-svgrepo-com.svg" alt=""></Link>
                {:else}
                    <Link to="acount"><img class="svg-link mr-4"src="account-svgrepo-com.svg" alt=""></Link>
                    <Link to="services"><img class="svg-link mr-4" src="cloud-services-svgrepo-com.svg" alt=""></Link>
                    <Link to="logout"><img class="svg-link mr-4"src="logout-svgrepo-com.svg" alt=""></Link>
                {/if}
			</div>
        </Router>
	</div>
</main>

<style scoped>
    .header {
        width: 100%;
    }
    .svg-logo {
        width: 80px;
        height: auto;
    }

    img {
        width: 30px;
        height: 30px;
    }

    .links {
        display: flex;
        align-content: center;
        height: 100%;
    }
</style>