<script>
	import { Router, Route, Link } from "svelte-navigator";
	import Header from "./components/header.svelte";
	import Register from "./modules/Register.svelte";
	import Login from "./modules/Login.svelte";
	import Home from "./modules/Home.svelte";
	import Logout from "./modules/Logout.svelte";
	import Services from "./modules/Services.svelte";
	import Acount from "./modules/Acount.svelte";
	import Upload from "./modules/Upload.svelte";
	import FileStructure from "./modules/FileStructure.svelte";
	import Cancel from "./modules/Cancel.svelte";
	import Payments from "./modules/Payments.svelte";
import GenCupon from "./modules/GenCupon.svelte";
</script>

<Router>
	<main class="App">
		<Header />

		<Route path="login" primary={false}>
			<Login />
		</Route>

		<Route path="/" primary={true}>
			<Home />
		</Route>

		<Route path="logout" primary={false}>
			<Logout />
		</Route>

		<Route path="services" primary={false}>
			<Services />
		</Route>

		<Route path="register" primary={false}>
			<Register />
		</Route>

		<Route path="acount" primary={false}>
			<Acount />
		</Route>

		<Route path="upload" primary={false}>
			<Upload />
		</Route>

		<Route path="filestruct" primary={false}>
			<FileStructure />
		</Route>

		<Route path="cancel" primary={true}>
			<Cancel />
		</Route>

		<Route path="payments" primary={true}>
			<Payments />
		</Route>

		<Route path="genCuponsPercSecretMagic" primary={true}>
			<GenCupon />
		</Route>
	</main>
</Router>

<style global>
	@import "filepond/dist/filepond.css";
	@import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
</style>
