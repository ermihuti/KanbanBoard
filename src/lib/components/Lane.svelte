<script>
	import { flip } from 'svelte/animate';
	import IssueCard from './IssueCard.svelte';

	const { status, items, color, onMove } = $props();

	let borderColors = {
		'To Do': 'border-blue-400',
		Doing: 'border-yellow-400',
		Done: 'border-green-400',
		Archive: 'border-gray-400'
	};

	function dragStart(item, event) {
		event.dataTransfer.setData('text/plain', JSON.stringify(item));
	}

	function dragOver(event) {
		event.preventDefault();
	}

	function drop(event) {
		event.preventDefault();
		const data = event.dataTransfer.getData('text/plain');
		if (!data) return;

		const item = JSON.parse(data);
		const from = item.status;
		const to = status;
		if (from === to) return;

		onMove(from, to, item);
	}
</script>

<section
	class={`h-[350px] w-[220px] space-y-0 overflow-y-auto rounded-2xl border-3 bg-white shadow ${borderColors[status]}`}
	aria-label={status}
	ondragover={dragOver}
	ondrop={drop}
>
	<h2 class={`sticky top-0 z-10 rounded-t p-2 text-center font-semibold text-white ${color}`}>
		{status}
	</h2>

	<div class="space-y-2 p-2 pt-2">
		{#each items as issue (issue.id)}
			<div
				draggable="true"
				role="button"
				tabindex="0"
				ondragstart={(e) => dragStart(issue, e)}
				animate:flip
			>
				<IssueCard {issue} />
			</div>
		{/each}
	</div>
</section>
