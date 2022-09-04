<script context="module">
  export async function load({ params, fetch }) {
    const url = `/api/restaurants/${params.code}`;
    const response = await fetch(url);

    return {
      status: response.status,
      props: {
        restaurant: response.ok && (await response.json()),
      },
    };
  }
</script>

<script>
  import { goto } from "$app/navigation";
  export let restaurant;

  let menuTypes =
    restaurant.menus == undefined
      ? []
      : new Set(restaurant.menus.map((el) => el.type));
  menuTypes = [...menuTypes];

  let y;
  let isEditingMenu = "none";
  let name = restaurant.about.name,
    type = restaurant.about.type,
    address = restaurant.about.address,
    offer = restaurant.about.offer,
    locale = restaurant.about.locale,
    desc = restaurant.about.desc,
    code = restaurant.about.code;

  async function updateRestaurant() {
    const restaurant = {
      name,
      type,
      address,
      offer,
      locale,
      desc,
      code,
    };
    await fetch("/api/restaurants", {
      method: "PUT",
      body: JSON.stringify(restaurant),
    });
    isEditing = false;
  }
  async function deleteRestaurant() {
    const restaurant = {
      code,
    };
    await fetch("/api/restaurants", {
      method: "DELETE",
      body: JSON.stringify(restaurant),
    });
    goto("/restaurants");
  }
  //addmenu
  let menuName = "",
    menuDesc = "",
    menuPrice,
    menuType = "starters" || "main course" || "desserts" || "drinks";
  let menus = [
    { name: menuName, desc: menuDesc, price: menuPrice, type: menuType },
  ];
  function addMenuItem() {
    menus.push({
      name: menuName,
      desc: menuDesc,
      price: menuPrice,
      type: menuType,
    });
    menus = menus;
  }

  async function addmenu() {
    await fetch(`/api/restaurants/${restaurant.about.code}`, {
      method: "PUT",
      body: JSON.stringify(menus),
    });
    goto(`/restaurants`);
  }
</script>

<svelte:window bind:scrollY={y} />

<div class="container">
  <div class="main-content">
    {#if isEditingMenu == "none"}
      <h3 class="title">Restaurant Details</h3>
      <div class="field"><h4>{restaurant.about.name}</h4></div>
      <div class="field"><p>Type: {restaurant.about.type}</p></div>
      <div class="field"><p>address: {restaurant.about.address}</p></div>
      <div class="field"><p>offer: {restaurant.about.offer}</p></div>
      <div class="field"><p>locale: {restaurant.about.locale}</p></div>
      <div class="field"><p>desc: {restaurant.about.desc}</p></div>
      <div class="field">
        <button
          class="btn-primary"
          on:click={() => {
            isEditingMenu = "edit";
          }}>Edit</button
        >
        <button
          class="btn-primary"
          on:click={() => {
            isEditingMenu = "addMenu";
          }}>Add Menu</button
        >
        <button
          class="btn-primary"
          on:click|preventDefault={() => {
            isEditingMenu = "delete";
          }}>Delete</button
        >
        <a href="/restaurants" class="btn-primary">Go Back</a>
      </div>
    {:else if isEditingMenu == "addMenu"}
      <h3 class="title">Add a Menu</h3>
      {#each menus as menu}
        <div class="field">
          <label for="name">name</label>
          <input type="text" id="name" bind:value={menu.name} required />
        </div>
        <div class="field">
          <label for="desc">desc</label>
          <input type="text" id="desc" bind:value={menu.desc} required />
        </div>
        <div class="field">
          <label for="price">price</label>
          <input type="number" id="price" bind:value={menu.price} required />
        </div>
        <div class="field">
          <label for="type">type</label>
          <select type="text" id="type" bind:value={menu.type} required>
            <option value="starters">starters</option>
            <option value="main course">main course</option>
            <option value="desserts">desserts</option>
            <option value="drinks">drinks</option>
          </select>
        </div>
        <hr />
      {/each}
      <div class="field">
        <button class="btn-primary" on:click|preventDefault={addMenuItem}
          >Add more menu +</button
        >
        <button class="btn-primary" on:click|preventDefault={addmenu}
          >Add</button
        >
        <button
          class="btn-primary btn-red"
          on:click={() => (isEditingMenu = "none")}>cancel</button
        >
      </div>
    {:else if isEditingMenu == "delete"}
      <h3 class="title">
        Are You Sure want to delete this restaurant: {restaurant.about.name}
      </h3>
      <p>This action is irreversible.</p>
      <div class="field">
        <button class="btn-primary" on:click|preventDefault={deleteRestaurant}
          >Yes. Delete!</button
        >
        <button
          class="btn-primary btn-red"
          on:click={() => (isEditingMenu = "none")}>cancel</button
        >
      </div>
    {:else}
      <h3 class="title">Edit</h3>
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
        <button class="btn-primary" on:click|preventDefault={updateRestaurant}
          >Update</button
        >
        <button
          class="btn-primary btn-red"
          on:click={() => (isEditingMenu = "none")}>cancel</button
        >
      </div>
    {/if}
  </div>
  {#if isEditingMenu == "none"}
    <div class="main-content space-top">
      <h3 class="title">Menus</h3>
      {#if restaurant.menus}
        {#each restaurant.menus as menu}
          <div class="field">
            <h5>name: {menu.name}</h5>
          </div>
          <div class="field">
            <p>desc: {menu.desc}</p>
          </div>
          <div class="field">
            <p>price: {menu.price}</p>
          </div>
          <div class="field">
            <p>type: {menu.type}</p>
          </div>
          <hr />
        {/each}
      {:else}
        <h5>
          No menus found. <button
            class="btn-primary"
            on:click={() => {
              isEditingMenu = "addMenu";
            }}>Add Menu</button
          >
        </h5>
      {/if}
    </div>
  {/if}
</div>
