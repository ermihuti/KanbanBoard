<script>
	import Board from "$lib/components/Board.svelte";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";

</script>

<div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-200 text-gray-800">
  <Header />

  <main class="flex-1 p-8 flex justify-center" aria-label="Kanban Board">
    <div class="max-w-7xl w-full">
      <Board />
    </div>
  </main>
  
  <Footer />
</div>