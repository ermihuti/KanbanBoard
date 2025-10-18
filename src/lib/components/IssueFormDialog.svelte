<script>
	import { format } from "date-fns";

	let title = $state("");
	let description = $state("");
	let dueDate = $state("");
	let storyPoints = $state(1);
	let priority = $state("Medium");

	function createIssue() {
		const newIssue = {
			id: Date.now(),
			title,
			description,
			status: "To Do",
			storyPoints,
			priority,
			creationDate: format(new Date(), "yyyy-MM-dd"),
			due: dueDate
		};

        let saved = JSON.parse(localStorage.getItem("savedIssues")) || [];
		saved.push(newIssue);
		localStorage.setItem("savedIssues", JSON.stringify(saved));
	}
</script>

{#if show}
	<dialog class="rounded-lg p-6 w-[320px] shadow-xl">
		<h2 class="text-lg font-semibold mb-3">New Issue</h2>

		<input bind:value={title} placeholder="Title" class="border p-2 w-full mb-2 rounded" />
		<textarea bind:value={description} placeholder="Description" class="border p-2 w-full mb-2 rounded"></textarea>
		<input type="date" bind:value={dueDate} class="border p-2 w-full mb-2 rounded" />
		<input type="number" bind:value={storyPoints} min="1" class="border p-2 w-full mb-2 rounded" />
		<select bind:value={priority} class="border p-2 w-full mb-2 rounded">
			<option>Low</option>
			<option>Medium</option>
			<option>High</option>
		</select>

		<div class="flex justify-end space-x-2 mt-4">
			<button onclick={createIssue} class="px-3 py-1 bg-purple-600 text-white rounded">Save</button>
		</div>
	</dialog>
{/if}