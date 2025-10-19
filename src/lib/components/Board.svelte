<script>
	import Lane from "./Lane.svelte";
	import IssueFormDialog from "./IssueFormDialog.svelte";

	const allLanes = $state({
		"To Do": [],
		"Doing": [],
		"Done": [],
		"Archive": []
	});

	const issues = $state(JSON.parse(localStorage.getItem("savedIssues")) || [
		{ id: 1, title: "Beispiel-Task", status: "To Do", storyPoints: 2, due: "2025-10-10" }
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
			new Notification(title, { body: notif });
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

<div class="flex justify-between items-center p-4">
	<h2 class="text-xl font-semibold">Board Overview</h2>
	<button
		onclick={exportCSV}
		class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
	>
		Export CSV
	</button>
</div>

<main class="p-8 w-full bg-gray-200 min-h-[500px] flex justify-between items-start space-x-4">
	{#each lanesArray as lane}
		<div class="flex flex-col items-center">
			<Lane status={lane} items={allLanes[lane]} onMove={moveTask} />
			<p class="mt-2 text-sm font-medium text-gray-700">
				Story Points: {getStoryPoints(lane)}
			</p>
		</div>
	{/each}
</main>