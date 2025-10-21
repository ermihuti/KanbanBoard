<script>
	import { format } from 'date-fns';

	let { show = $bindable() } = $props();

	let title = $state('');
	let description = $state('');
	let dueDate = $state('');
	let storyPoints = $state(1);
	let priority = $state('Medium');
	let creationDate = $state(new Date().toISOString().split('T')[0]);

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
			status: 'To Do',
			storyPoints,
			priority,
			creationDate,
			due: dueDate
		};

		let saved = JSON.parse(localStorage.getItem('savedIssues')) || [];
		saved.push(newIssue);
		localStorage.setItem('savedIssues', JSON.stringify(saved));

		show = false;
		location.reload();
	}
</script>

{#if show}
	<dialog
		bind:this={dialogRef}
		class="fixed top-1/2 left-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-xl"
	>
		<h2 class="mb-4 text-center text-lg font-semibold">New Issue</h2>

		<label for="title-input" class="mb-1 block text-sm font-medium">Title</label>
		<input
			id="title-input"
			bind:value={title}
			placeholder="Title"
			class="mb-3 w-full rounded border p-2"
		/>

		<label for="description-input" class="mb-1 block text-sm font-medium">Description</label>
		<textarea
			id="description-input"
			bind:value={description}
			placeholder="Description"
			class="mb-3 w-full rounded border p-2"
		></textarea>

		<label for="creation-date-input" class="mb-1 block text-sm font-medium">Creation Date</label>
		<input
			id="creation-date-input"
			type="date"
			bind:value={creationDate}
			class="mb-3 w-full rounded border bg-gray-100 p-2 text-gray-600"
			readonly
		/>

		<label for="due-date-input" class="mb-1 block text-sm font-medium">Due Date</label>
		<input
			id="due-date-input"
			type="date"
			bind:value={dueDate}
			class="mb-3 w-full rounded border p-2"
		/>

		<label for="story-points-input" class="mb-1 block text-sm font-medium">Story Points</label>
		<input
			id="story-points-input"
			type="number"
			bind:value={storyPoints}
			min="1"
			class="mb-3 w-full rounded border p-2"
		/>

		<label for="priority-select" class="mb-1 block text-sm font-medium">Priority</label>
		<select id="priority-select" bind:value={priority} class="mb-3 w-full rounded border p-2">
			<option>Low</option>
			<option>Medium</option>
			<option>High</option>
		</select>

		<div class="mt-4 flex justify-end space-x-2">
			<button
				onclick={() => (show = false)}
				class="rounded bg-gray-300 px-3 py-1 transition duration-200 hover:scale-105 hover:bg-gray-400"
				>Cancel</button
			>
			<button
				onclick={createIssue}
				class="rounded bg-purple-600 px-3 py-1 text-white transition duration-200 hover:scale-105 hover:bg-purple-700"
				>Save</button
			>
		</div>
	</dialog>
{/if}
