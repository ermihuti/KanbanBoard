<script>
	import { format } from "date-fns";

	let { show = $bindable() } = $props();

	let title = $state("");
	let description = $state("");
	let dueDate = $state("");
	let storyPoints = $state(1);
	let priority = $state("Medium");
	let creationDate = $state(new Date().toISOString().split("T")[0]);

	let dialogRef = $state();

	$effect(() => {
		if (show) dialogRef?.showModal();
		else dialogRef?.close();
	});

	function createIssue() {
		const newIssue = {
			id: Date.now(),
			title,
			description,
			status: "To Do",
			storyPoints,
			priority,
			creationDate,
			due: dueDate
		};

        let saved = JSON.parse(localStorage.getItem("savedIssues")) || [];
		saved.push(newIssue);
		localStorage.setItem("savedIssues", JSON.stringify(saved));
	
    	show = false;
		location.reload();
    }
</script>

{#if show}
	<dialog bind:this={dialogRef} class="rounded-lg p-6 w-[320px] shadow-xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
		<h2 class="text-lg font-semibold mb-4 text-center">New Issue</h2>

		<label for="title-input" class="block text-sm font-medium mb-1">Title</label>
		<input id="title-input" bind:value={title} placeholder="Title" class="border p-2 w-full mb-3 rounded" />

		<label for="description-input" class="block text-sm font-medium mb-1">Description</label>
		<textarea id="description-input" bind:value={description} placeholder="Description" class="border p-2 w-full mb-3 rounded"></textarea>

		<label for="creation-date-input" class="block text-sm font-medium mb-1">Creation Date</label>
		<input id="creation-date-input" type="date" bind:value={creationDate} class="border p-2 w-full mb-3 rounded bg-gray-100 text-gray-600" readonly />

		<label for="due-date-input" class="block text-sm font-medium mb-1">Due Date</label>
		<input id="due-date-input" type="date" bind:value={dueDate} class="border p-2 w-full mb-3 rounded" />

		<label for="story-points-input" class="block text-sm font-medium mb-1">Story Points</label>
		<input id="story-points-input" type="number" bind:value={storyPoints} min="1" class="border p-2 w-full mb-3 rounded" />

		<label for="priority-select" class="block text-sm font-medium mb-1">Priority</label>
		<select id="priority-select" bind:value={priority} class="border p-2 w-full mb-3 rounded">
			<option>Low</option>
			<option>Medium</option>
			<option>High</option>
		</select>

		<div class="flex justify-end space-x-2 mt-4">
            <button onclick={() => (show = false)} class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 hover:scale-105 transition duration-200">Cancel</button>
			<button onclick={createIssue} class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 hover:scale-105 transition duration-200">Save</button>
		</div>
	</dialog>
{/if}