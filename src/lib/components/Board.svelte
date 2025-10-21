<script>
	import Lane from './Lane.svelte';
	import notificationIcon from '$lib/assets/notification-icon.png';

	const allLanes = $state({
		'To Do': [],
		Doing: [],
		Done: [],
		Archive: []
	});

	let laneColors = {
		'To Do': 'bg-blue-400',
		Doing: 'bg-yellow-400',
		Done: 'bg-green-400',
		Archive: 'bg-gray-400'
	};

	let focusColors = {
		'To Do': 'focus-within:ring-blue-400',
		Doing: 'focus-within:ring-yellow-400',
		Done: 'focus-within:ring-green-400',
		Archive: 'focus-within:ring-gray-400'
	};

	const issues = $state(
		JSON.parse(localStorage.getItem('savedIssues')) || [
			{
				id: 1,
				title: 'Example Task',
				description: 'This is an example task',
				status: 'To Do',
				storyPoints: 2,
				priority: 'Medium',
				creationDate: '2025-10-10',
				due: '2025-10-20'
			}
		]
	);

	for (const i of issues) {
		allLanes[i.status]?.push(i);
	}

	const lanesArray = $derived(Object.keys(allLanes));

	function updateBoard(itemMoved) {
		const all = [
			...allLanes['To Do'],
			...allLanes['Doing'],
			...allLanes['Done'],
			...allLanes['Archive']
		];
		localStorage.setItem('savedIssues', JSON.stringify(all));

		if (itemMoved?.status === 'Done') {
			notify(itemMoved.title, 'This task is finished!');
		}
	}

	async function notify(title, notif) {
		let permission = Notification.permission;
		if (permission !== 'granted') {
			permission = await Notification.requestPermission();
		}
		if (permission === 'granted') {
			new Notification(title, { body: notif, icon: notificationIcon });
		}
	}

	function moveTask(from, to, item) {
		allLanes[from] = allLanes[from].filter((i) => i.id !== item.id);
		item.status = to;
		allLanes[to].push(item);
		updateBoard(item);
	}

	const getStoryPoints = (status) => allLanes[status].reduce((s, i) => s + (i.storyPoints || 0), 0);

	function exportCSV() {
		const all = [
			...allLanes['To Do'],
			...allLanes['Doing'],
			...allLanes['Done'],
			...allLanes['Archive']
		];

		if (!all.length) return alert('No issues to export!');

		const header = Object.keys(all[0]).join(',');
		const rows = all.map((i) =>
			Object.values(i)
				.map((v) => `"${String(v).replace(/"/g, '""')}"`)
				.join(',')
		);
		const csvContent = [header, ...rows].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'issues.csv';
		link.click();
	}
</script>

<div class="mb-4 flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
	<h2 class="text-2xl font-semibold tracking-tight text-gray-900">Board Overview</h2>
	<button
		onclick={exportCSV}
		class="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white transition-all hover:bg-purple-700 focus:ring-4 focus:ring-purple-300"
	>
		Export CSV
	</button>
</div>

<main
	class="flex min-h-[600px] w-full items-start justify-between gap-6 overflow-x-auto rounded-2xl bg-gray-50 p-8"
>
	{#each lanesArray as lane}
		<div
			class={`flex w-80 flex-col items-center rounded-2xl border border-gray-200 p-4 shadow-sm focus-within:ring-2 ${focusColors[lane]} transition-all`}
			role="region"
			aria-label={`Lane ${lane}`}
		>
			<Lane status={lane} items={allLanes[lane]} onMove={moveTask} color={laneColors[lane]} />
			<p class="mt-3 text-sm font-medium text-gray-600">
				Story Points: {getStoryPoints(lane)}
			</p>
		</div>
	{/each}
</main>
