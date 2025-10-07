<script>
    import { flip } from "svelte/animate";
    let { children, status } = $props();

    let listA = $state([1, 2, 3]);
    let listB = $state([4, 5, 6]);

    function startFromA(item, event) {
        event.dataTransfer.setData("text/plain", item);
    }

    function startFromB(item, event) {
        event.dataTransfer.setData("text/plain", item);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function dropToA(event) {
        let item = event.dataTransfer.getData("text/plain");
        listB = listB.filter(i => i != item);
        listA.push(item);
        listA.sort();
        listB.sort();
    }

    function dropToB(event) {
        let item = event.dataTransfer.getData("text/plain");
        listA = listA.filter(i => i != item);
        listB.push(item);
        listA.sort();
        listB.sort();
    }
</script>

<section class="bg-white h-[350px] w-[200px] space-y-2" ondragover={dragOver} ondrop={dropToA} aria-label="Lane">
    <p>{status}</p>
    {#each listA as item (item) }
    <article ondragstart={(event) => startFromA(item, event)} class="p-4 bg-purple-400 cursor-grab" draggable="true" animate:flip>{item}</article>
    {/each}
</section>