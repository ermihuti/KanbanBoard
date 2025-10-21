<script>
	import { flip } from "svelte/animate";
	import IssueCard from "./IssueCard.svelte";

	const { status, items, color, onMove } = $props();

	function dragStart(item, event) {
		event.dataTransfer.setData("text/plain", JSON.stringify(item));
	}

	function dragOver(event) {
		event.preventDefault();
	}

	function drop(event) {
		event.preventDefault();
		const data = event.dataTransfer.getData("text/plain");
		if (!data) return;

		const item = JSON.parse(data);
		const from = item.status;
		const to = status;
		if (from === to) return;

		onMove(from, to, item);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
	class="bg-white h-[350px] w-[220px] space-y-0 rounded shadow overflow-y-auto"
	aria-label={status}
	ondragover={dragOver}
	ondrop={drop}
>
	<h2 class={`sticky top-0 z-10 text-center font-semibold text-white p-2 rounded-t ${color}`}>{status}</h2>

	<div class="p-2 pt-2 space-y-2">
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