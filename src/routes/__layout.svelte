<script>
  import "../app.scss";
  import Header from "../lib/components/Header.svelte";
</script>

<Header />
<!-- /header -->
<main>
  <slot />
</main>

<!--/footer-->
<style lang="scss">
  main {
    display: flex;
    margin-block: 2rem;
  }
</style>
