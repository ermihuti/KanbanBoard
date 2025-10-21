<script>
	import { format } from 'date-fns';
	import { de } from 'date-fns/locale';

	const { issue } = $props();

	let borderColors = {
		'To Do': 'border-blue-400',
		Doing: 'border-yellow-400',
		Done: 'border-green-400',
		Archive: 'border-gray-400'
	};

	let now = $state(new Date());
	let isOverdue = $derived(new Date(issue.due) < now);

	async function share() {
		try {
			await navigator.share({
				title: issue.title || 'Untitled Issue',
				text: `${issue.title}\n${issue.description}\nDue on: ${format(new Date(issue.due), 'dd.MM.yyyy', { locale: de })}`,
				url: location.href
			});
		} catch (err) {
			console.log('Sharing failed:', err);
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

		const blob = new Blob([icsContent], { type: 'text/calendar' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${issue.title.replace(/\s+/g, '_') || 'issue'}.ics`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<article
	class={`cursor-grab space-y-1 rounded border-l-8 p-3 text-white shadow transition duration-300 ${borderColors[issue.status]} hover:scale-[1.02] hover:shadow-lg
		${isOverdue && (issue.status === 'To Do' || issue.status === 'Doing') ? 'animate-pulse bg-red-300' : 'bg-white'} `}
	draggable="true"
	role="group"
	aria-label={`Issue: ${issue.title}`}
>
	<h3 class="text-base font-semibold text-purple-700">{issue.title}</h3>
	<p class="line-clamp-2 text-xs text-gray-700">{issue.description}</p>
	<p class="mt-1 flex items-center gap-1 text-xs text-gray-500">
		<span>Created: {format(new Date(issue.creationDate), 'dd.MM.yyyy', { locale: de })}</span>
	</p>
	<p class="mt-1 flex items-center gap-1 text-xs text-gray-500">
		<span>Due: {format(new Date(issue.due), 'dd.MM.yyyy', { locale: de })}</span>
		{#if isOverdue && (issue.status === 'To Do' || issue.status === 'Doing')}
			<span class="font-semibold text-red-600">(Overdue)</span>
		{/if}
	</p>
	<p class="mt-1 text-xs text-gray-600">
		<strong>{issue.storyPoints} SP</strong> • {issue.priority}
	</p>

	<div class="flex gap-2 pt-3">
		<button
			class="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 transition-all hover:bg-purple-100 focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 focus:outline-none"
			onclick={share}
		>
			Share
		</button>

		<button
			class="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow transition-all hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 focus:outline-none"
			onclick={exportICS}
		>
			Export .ics
		</button>
	</div>
</article>
