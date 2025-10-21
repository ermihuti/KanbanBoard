<script>
	import Board from '$lib/components/Board.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div class="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-200 text-gray-800">
	<Header />

	<main class="flex flex-1 justify-center p-8" aria-label="Kanban Board">
		<div class="w-full max-w-7xl">
			<Board />
		</div>
	</main>

	<Footer />
</div>
