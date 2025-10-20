<script>
	import { onMount } from "svelte";
	import IssueFormDialog from "./IssueFormDialog.svelte";

	const appName = "Kanban Board";
	let showForm = $state(false);
	let flag = $state("");
	let error = null;
	const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;

	const savedUserInfo = localStorage.getItem("userInfo");
	if (savedUserInfo) {
		const info = JSON.parse(savedUserInfo);
		flag = info.flag || "";
	}

	async function showPosition(pos) {
		const { latitude, longitude } = pos.coords;

		try {
			const response = await fetch(
				`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`
			);
			const result = await response.json();

			const countryName =
				result.features?.[0]?.properties?.country || "Unknown";

			const countryResponse = await fetch(
				`https://restcountries.com/v3.1/name/${countryName}`
			);
			const data = await countryResponse.json();
			const newFlag = data[0]?.flags?.png || "";

			if (newFlag !== flag) {
				flag = newFlag;
				localStorage.setItem(
					"userInfo",
					JSON.stringify({ country: countryName, flag })
				);
			}
		} catch (err) {
			error = "Error: " + err.message;
			console.log(error);
		}
	}

	function showError(err) {
		error = err.message;
	}

	function getCurrentPosition() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError);
		} else {
			error = "Geolocation is not supported by this browser.";
		}
	}

	onMount(() => {
		getCurrentPosition();
	});
</script>

<header class="relative flex items-center justify-center px-6 py-3 bg-purple-600 text-white shadow-md">
	{#if flag}
		<img src={flag} alt="Country Flag" class="absolute left-6 w-8 h-6 rounded shadow" />
	{/if}

	<h1 class="text-xl font-semibold tracking-wide">{appName}</h1>

	<button
		onclick={() => showForm = true}
		class="absolute right-6 bg-white text-purple-600 px-3 py-1 rounded shadow"
	>
		Create Issue
	</button>
</header>

<IssueFormDialog bind:show={showForm} />