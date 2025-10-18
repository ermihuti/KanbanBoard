<script>
	import Board from "$lib/components/Board.svelte";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";

</script>

<div class="min-h-screen flex flex-col bg-gray-100">
  <Header />
  <main class="flex-1 p-6">
    <Board />
  </main>
  <Footer />
</div>