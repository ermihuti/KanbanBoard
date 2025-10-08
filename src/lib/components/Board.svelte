<script>
	import Lane from "./Lane.svelte";

	const allLanes = $state({
		"To Do": [],
		"Doing": [],
		"Done": [],
		"Archiv": []
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
			...allLanes["Archiv"]
		];
		localStorage.setItem("savedIssues", JSON.stringify(all));
	}

	function moveTask(from, to, item) {
		allLanes[from] = allLanes[from].filter((i) => i.id !== item.id);
		item.status = to;
		allLanes[to].push(item);
		updateBoard(item);
	}

	const getStoryPoints = (status) =>
		allLanes[status].reduce((s, i) => s + (i.storyPoints || 0), 0);
</script>

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