<script>
	import { flip } from "svelte/animate";

	const { status, items, onMove } = $props();

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
	class="bg-white h-[350px] w-[220px] p-2 space-y-2 rounded shadow"
	ondragover={dragOver}
	ondrop={drop}
>
	<h2 class="text-center font-semibold">{status}</h2>

	{#each items as item (item.id)}
		<article
			class="p-3 bg-purple-400 cursor-grab rounded"
			draggable="true"
			ondragstart={(e) => dragStart(item, e)}
			animate:flip
		>
			{item.title}
		</article>
	{/each}
</section>