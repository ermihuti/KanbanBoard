<script>
	import Lane from "./Lane.svelte";
	import notificationIcon from "$lib/assets/notification-icon.png";

	const allLanes = $state({
		"To Do": [],
		"Doing": [],
		"Done": [],
		"Archive": []
	});

	let laneColors = {
		"To Do": "bg-blue-400",
		"Doing": "bg-yellow-400",
		"Done": "bg-green-400",
		"Archive": "bg-gray-400"
	};

	const issues = $state(JSON.parse(localStorage.getItem("savedIssues")) || [
		{ id: 1, title: "Example Task", status: "To Do", storyPoints: 2, due: "2025-10-10" }
	]);

	for (const i of issues) {
		allLanes[i.status]?.push(i);
	}

	const lanesArray = $derived(Object.keys(allLanes));

	function updateBoard(itemMoved) {
		const all = [
			...allLanes["To Do"],
			...allLanes["Doing"],
			...allLanes["Done"],
			...allLanes["Archive"]
		];
		localStorage.setItem("savedIssues", JSON.stringify(all));

		if (itemMoved?.status === "Done") {
			notify(itemMoved.title, "This task is finished!");
		}
	}

	async function notify(title, notif) {
		let permission = Notification.permission;
		if (permission !== "granted") {
			permission = await Notification.requestPermission();
		}
		if (permission === "granted") {
			new Notification(title, { body: notif, icon: notificationIcon });
		}
	}

	function moveTask(from, to, item) {
		allLanes[from] = allLanes[from].filter((i) => i.id !== item.id);
		item.status = to;
		allLanes[to].push(item);
		updateBoard(item);
	}

	const getStoryPoints = (status) =>
		allLanes[status].reduce((s, i) => s + (i.storyPoints || 0), 0);

	function exportCSV() {
		const all = [
			...allLanes["To Do"],
			...allLanes["Doing"],
			...allLanes["Done"],
			...allLanes["Archive"]
		];

		if (!all.length) return alert("No issues to export!");

		const header = Object.keys(all[0]).join(",");
		const rows = all.map(i =>
			Object.values(i)
				.map(v => `"${String(v).replace(/"/g, '""')}"`)
				.join(",")
		);
		const csvContent = [header, ...rows].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "issues.csv";
		link.click();
	}
</script>

<div class="flex justify-between items-center p-6 bg-white shadow-sm rounded-2xl mb-4">
	<h2 class="text-2xl font-semibold text-gray-900 tracking-tight">Board Overview</h2>
	<button
		onclick={exportCSV}
		class="bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 text-white px-5 py-2.5 rounded-lg font-medium transition-all"
	>
		Export CSV
	</button>
</div>

<main class="p-8 w-full bg-gray-50 min-h-[600px] flex justify-between items-start gap-6 overflow-x-auto rounded-2xl">
	{#each lanesArray as lane}
		<div
			class="flex flex-col items-center shadow-sm rounded-2xl p-4 w-80 border border-gray-200 focus-within:ring-2 focus-within:ring-purple-400 transition-all"
			role="region"
			aria-label={`Lane ${lane}`}
		>
			<Lane status={lane} items={allLanes[lane]} onMove={moveTask} />
			<p class="mt-3 text-sm font-medium text-gray-600">
				Story Points: {getStoryPoints(lane)}
			</p>
		</div>
	{/each}
</main>