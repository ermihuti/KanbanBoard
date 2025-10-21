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

<header class="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-lg">
	{#if flag}
		<img src={flag} alt="Country Flag" class="w-9 h-6 rounded-md shadow-sm border border-white/30 transition-transform hover:scale-105" />
	{/if}

	<h1 class="text-2xl font-semibold tracking-wide drop-shadow-sm select-none">{appName}</h1>

	<button
		onclick={() => showForm = true}
		class="bg-white text-purple-700 px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 transition-all"
		aria-label="Create Issue"
	>
		Create Issue
	</button>
</header>

<IssueFormDialog bind:show={showForm} />