<script>
  import TiUser from "svelte-icons/ti/TiUser.svelte";
  import { clickOutside } from "$lib/clickOutside";
  import { session } from "$app/stores";
  let y;
  let accMenuOpen = false;
  const accMenuToggle = () => {
    accMenuOpen = !accMenuOpen;
  };

  const accMenuClose = () => {
    accMenuOpen = false;
  };
</script>

<svelte:window bind:scrollY={y} />

<header class={y >= 30 ? "fixed-header" : ""}>
  <nav class="container">
    <a href="/"><h2>Home</h2></a>
    <ul class="menu">
      {#if $session.user}
        <li
          class="user"
          on:click={accMenuToggle}
          use:clickOutside
          on:click_outside={accMenuOpen && accMenuClose}
        >
          <div class="icon"><TiUser /></div>
          <ul class="sub-menu" style={accMenuOpen ? "display: flex;" : ""}>
            <li><a href="/auth/profile">Profile</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li>
              <a href="/api/auth/logout" class="btn-primary logout">Log Out</a>
            </li>
          </ul>
        </li>
      {:else}
        <li><a href="/auth/login">login</a></li>
        <li><a href="/auth/register">register</a></li>
      {/if}
    </ul>
  </nav>
</header>
{#if y >= 30}
  <div class="filler" />
{/if}
