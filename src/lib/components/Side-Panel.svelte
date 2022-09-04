<script>
  import FaHome from "svelte-icons/fa/FaHome.svelte";
  import FaHotel from "svelte-icons/fa/FaHotel.svelte";
  // import FaStethoscope from "svelte-icons/fa/FaStethoscope.svelte";
  // import FaPeopleCarry from "svelte-icons/fa/FaPeopleCarry.svelte";
  // import FaChild from "svelte-icons/fa/FaChild.svelte";
  // import FaReceipt from "svelte-icons/fa/FaReceipt.svelte";
  // import FaBed from "svelte-icons/fa/FaBed.svelte";
  import TiArrowLeftThick from "svelte-icons/ti/TiArrowLeftThick.svelte";
  import { page } from "$app/stores";
  import { spOpen } from "$lib/stores";
  let innerWidth;

  const toggleSp = () => {
    $spOpen = !$spOpen;
  };
</script>

<svelte:window bind:innerWidth />

<aside class={$spOpen ? "side-panel" : "side-panel close"}>
  <ul>
    <li on:click={innerWidth <= 576 && toggleSp}>
      <a
        class="{$page.url.pathname == '/dashboard'
          ? 'side-panel__button active'
          : 'side-panel__button'} {!$spOpen ? 'close' : ''}"
        href="/dashboard"
        ><div class="icon"><FaHome /></div>
        Dashboard</a
      >
    </li>
    <li on:click={innerWidth <= 576 && toggleSp}>
      <a
        class="{$page.url.pathname == '/restaurants'
          ? 'side-panel__button active'
          : 'side-panel__button'} {!$spOpen ? 'close' : ''}"
        href="/restaurants"
        ><div class="icon"><FaHotel /></div>
        restaurants</a
      >
    </li>
    <!-- <li on:click={innerWidth <= 576 && toggleSp}>
      <a
        class="{$page.url.pathname == '/admin/doctors'
          ? 'side-panel__button active'
          : 'side-panel__button'} {!$spOpen ? 'close' : ''}"
        href="/admin/doctors"
        ><div class="icon"><FaStethoscope /></div>
        doctors</a
      >
    </li>
    <li on:click={innerWidth <= 576 && toggleSp}>
      <a
        class="{$page.url.pathname == '/admin/staff'
          ? 'side-panel__button active'
          : 'side-panel__button'} {!$spOpen ? 'close' : ''}"
        href="/admin/staff"
        ><div class="icon"><FaPeopleCarry /></div>
        staff</a
      >
    </li>
    <li on:click={innerWidth <= 576 && toggleSp}>
      <a
        class="{$page.url.pathname == '/admin/patients'
          ? 'side-panel__button active'
          : 'side-panel__button'} {!$spOpen ? 'close' : ''}"
        href="/admin/patients"
        ><div class="icon"><FaChild /></div>
        patients</a
      >
    </li>
    <li on:click={innerWidth <= 576 && toggleSp}>
      <a
        class="{$page.url.pathname == '/admin/billing'
          ? 'side-panel__button active'
          : 'side-panel__button'} {!$spOpen ? 'close' : ''}"
        href="/admin/billing"
        ><div class="icon"><FaReceipt /></div>
        billing</a
      >
    </li>
    <li on:click={innerWidth <= 576 && toggleSp}>
      <a
        class="{$page.url.pathname == '/admin/room'
          ? 'side-panel__button active'
          : 'side-panel__button'} {!$spOpen ? 'close' : ''}"
        href="/admin/room"
        ><div class="icon"><FaBed /></div>
        room allotment</a
      >
    </li> -->
  </ul>

  <div class={$spOpen ? "opener" : "opener close"}>
    <button on:click={toggleSp}
      ><div class={$spOpen ? "icon" : "icon rotate"} style="margin-left: 0;">
        <TiArrowLeftThick />
      </div></button
    >
  </div>
</aside>

<style lang="scss">
  .side-panel {
    display: inline-block;
    background-color: $bg-gray;
    width: 280px;
    min-height: 100vh;
    margin-top: -71px;
    padding-top: 71px;
    transition: max-width 300ms;
    @include border-radius;
    &.close {
      width: 65px;
    }
    @include breakpoint(mobile) {
      position: fixed;
      top: 71px;
      margin-top: 0;
      padding-top: 0;
      width: 100%;
      text-align: center;
      &.close {
        max-width: 0px;
      }
    }
    &__button {
      background-color: $btn-gray;
      font-size: 1.1rem;
      font-weight: 600;
      text-align: center;
      cursor: pointer;
      @include border-radius;
      display: flex;
      gap: 0.6rem;
      text-transform: capitalize;
      margin: 0.4rem 0.3rem;
      padding: 1rem 0.8rem;
      transition: transform 500ms, font-size 200ms;
      &.close {
        font-size: 0;
        @include breakpoint(mobile) {
          display: none;
        }
      }
      &:hover {
        text-decoration: none;
        background-color: $accent;
        color: $white;
        transform: scale(1.02);
      }
      &.active {
        box-shadow: 0px 0px 5px 2px $btn-gray;
        background-color: $accent;
        color: $white;
      }
    }
  }
  .icon {
    width: 1.2rem;
    margin-left: 8px;
    transition: transform 200ms;
  }

  .opener {
    position: fixed;
    bottom: 0;
    width: inherit;
    background: $gray;
    @include border-radius;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    transition: width 300ms;
    @include breakpoint(mobile) {
      width: 100%;
    }
    &.close {
      width: 65px;
      @include breakpoint(mobile) {
        width: 40px;
      }
    }
    button {
      padding: 10px;
      float: right;
      border-radius: 50%;
      border: 1px solid $gray;
      cursor: pointer;
    }
  }
  .rotate {
    transform: rotate(180deg);
  }
</style>
