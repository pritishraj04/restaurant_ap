<script>
  import { goto } from "$app/navigation";
  let name = "",
    type = "",
    address = "",
    offer = 0,
    locale = "",
    desc = "";

  async function addRestaurant() {
    const restaurant = {
      name,
      type,
      address,
      offer,
      locale,
      desc,
    };
    await fetch("/api/restaurants", {
      method: "POST",
      body: JSON.stringify(restaurant),
    });
    name = "";
    type = "";
    address = "";
    offer = 0;
    locale = "";
    desc = "";
    goto("/restaurants");
  }
</script>

<div class="container">
  <div class="main-content">
    <h1>Add a Restaurant</h1>
    <div>
      <div class="field">
        <label for="name">name</label>
        <input type="text" id="name" bind:value={name} required />
      </div>
      <div class="field">
        <label for="type">type</label>
        <input type="text" id="type" bind:value={type} required />
      </div>
      <div class="field">
        <label for="address">address</label>
        <input type="text" id="address" bind:value={address} required />
      </div>
      <div class="field">
        <label for="offer">offer</label>
        <input
          type="number"
          min="0"
          max="100"
          id="offer"
          bind:value={offer}
          required
        />
      </div>
      <div class="field">
        <label for="locale">locale</label>
        <input type="text" id="locale" bind:value={locale} required />
      </div>
      <div class="field">
        <label for="desc">desc</label>
        <textarea id="desc" bind:value={desc} required />
      </div>
      <div class="field">
        <button class="btn-primary" on:click|preventDefault={addRestaurant}
          >Add</button
        >
      </div>
    </div>
  </div>
</div>
