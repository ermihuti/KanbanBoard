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
	class={`p-3 cursor-grab rounded text-white space-y-1 shadow transition duration-300 border-l-8 ${borderColors[issue.status]} hover:shadow-lg hover:scale-[1.02]
		${isOverdue && (issue.status === 'To Do' || issue.status === 'Doing') ? 'bg-red-300 animate-pulse' : 'bg-white'} `}
	draggable="true"
	role="group"
	aria-label={`Issue: ${issue.title}`}
>
	<h3 class="font-semibold text-purple-700 text-base">{issue.title}</h3>
	<p class="text-xs text-gray-700 line-clamp-2">{issue.description}</p>
	<p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
		<span>Created: {format(new Date(issue.creationDate), "dd.MM.yyyy", { locale: de })}</span>
	</p>
	<p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
		<span>Due: {format(new Date(issue.due), "dd.MM.yyyy", { locale: de })}</span>
		{#if isOverdue && (issue.status === 'To Do' || issue.status === 'Doing')}
			<span class="text-red-600 font-semibold">(Overdue)</span>
		{/if}
	</p>
	<p class="text-xs text-gray-600 mt-1">
		<strong>{issue.storyPoints} SP</strong> • {issue.priority}
	</p>

	<div class="flex gap-2 pt-3">
		<button
			class="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 transition-all"
			onclick={share}
		>
			Share
		</button>

		<button
			class="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 transition-all"
			onclick={exportICS}
		>
			Export .ics
		</button>
	</div>
</article>