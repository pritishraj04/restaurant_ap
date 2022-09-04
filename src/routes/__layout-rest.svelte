<script context="module">
  export const load = ({ session }) => {
    if (!session.user) {
      return {
        status: 302,
        redirect: "/auth/login",
      };
    }
    return {
      status: 200,
      props: {
        user: session.user,
      },
    };
  };
</script>

<script>
  import "../app.scss";
  import SidePanel from "../lib/components/Side-Panel.svelte";
  import Header from "../lib/components/Header.svelte";
</script>

<Header />

<main>
  <SidePanel />
  <slot />
</main>

<!--/footer-->
<style>
  main {
    display: flex;
    margin-block: 2rem;
  }
</style>
