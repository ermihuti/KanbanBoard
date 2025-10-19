<script>
	import { format } from "date-fns";
	import { de } from "date-fns/locale";

	const { issue } = $props();

	async function share() {
		try {
			await navigator.share({
				title: issue.title,
				text: `${issue.description}\nDue on: ${format(new Date(issue.due), "dd.MM.yyyy", { locale: de })}`
			});
		} catch (err) {
			console.log("Sharing failed:", err);
		}
	}
</script>

<article
	class="p-3 bg-purple-400 cursor-grab rounded text-white space-y-1 shadow"
	draggable="true"
>
	<h3 class="font-semibold">{issue.title}</h3>
	<p class="text-xs line-clamp-2">{issue.description}</p>
	<p class="text-[10px]">{format(new Date(issue.due), "dd.MM.yyyy", { locale: de })}</p>
	<p class="text-[10px]">{issue.storyPoints} SP | {issue.priority}</p>

	<div class="flex gap-2 pt-2">
		<button
			class="px-3 py-1 rounded bg-white text-purple-700 text-xs hover:bg-gray-100 transition"
			onclick={share}
		>
			Share
		</button>
	</div>
</article>