<script>
	import { format } from "date-fns";
	import { de } from "date-fns/locale";

	const { issue } = $props();

	let borderColors = {
		"To Do": "border-blue-400",
		"Doing": "border-yellow-400",
		"Done": "border-green-400",
		"Archive": "border-gray-400"
	};

	let now = $state(new Date());
	let isOverdue = $derived(new Date(issue.due) < now);

	async function share() {
		try {
			await navigator.share({
				title: issue.title || "Untitled Issue",
				text: `${issue.title}\n${issue.description}\nDue on: ${format(new Date(issue.due), "dd.MM.yyyy", { locale: de })}`,
				url: location.href
			});
		} catch (err) {
			console.log("Sharing failed:", err);
		}
	}

	function exportICS() {
		const startDate = new Date(issue.due);
		startDate.setHours(0, 0, 0, 0);

		const endDate = new Date(startDate);
		endDate.setHours(24, 0, 0, 0);

		const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KanbanBoard//Issue//EN
BEGIN:VEVENT
UID:${issue.id}@kanban.local
DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss")}
DTSTART:${format(startDate, "yyyyMMdd'T'HHmmss")}
DTEND:${format(endDate, "yyyyMMdd'T'HHmmss")}
SUMMARY:${issue.title}
DESCRIPTION:${issue.description}
END:VEVENT
END:VCALENDAR
`.trim();

		const blob = new Blob([icsContent], { type: "text/calendar" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${issue.title.replace(/\s+/g, "_") || "issue"}.ics`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<article
	class={`p-3 cursor-grab rounded text-white space-y-1 shadow transition duration-300 
		${isOverdue ? 'bg-red-500 animate-pulse' : 'bg-purple-400'}`}
	draggable="true"
>
	<h3 class="font-semibold">{issue.title}</h3>
	<p class="text-xs line-clamp-2">{issue.description}</p>
	<p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
		<span>Created: {format(new Date(issue.creationDate), "dd.MM.yyyy", { locale: de })}</span>
	</p>
	<p class="text-[10px]">{format(new Date(issue.due), "dd.MM.yyyy", { locale: de })}
		{#if isOverdue}
			<span class="ml-1 text-yellow-200 font-semibold">(Overdue)</span>
		{/if}
	</p>
	<p class="text-[10px]">{issue.storyPoints} SP | {issue.priority}</p>

	<div class="flex gap-2 pt-2">
		<button
			class="px-3 py-1 rounded bg-white text-purple-700 text-xs hover:bg-gray-100 transition"
			onclick={share}
		>
			Share
		</button>

		<button
			class="px-3 py-1 rounded bg-white text-purple-700 text-xs hover:bg-gray-100 transition"
			onclick={exportICS}
		>
			Export .ics
		</button>
	</div>
</article>