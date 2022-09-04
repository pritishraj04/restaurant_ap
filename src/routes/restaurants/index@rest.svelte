<script context="module">
  export async function load({ fetch }) {
    const url = `/api/restaurants`;
    const response = await fetch(url);

    return {
      status: response.status,
      props: {
        restaurants: response.ok && (await response.json()),
      },
    };
  }
</script>

<script>
  export let restaurants;
</script>

<div class="container">
  <h1>Restaurant</h1>

  <div class="restaurants">
    <a href="/restaurants/add" class="btn-primary add-rest">+</a>
    {#each restaurants as restaurant}
      <div class="restaurant">
        <!-- <div class="img-box">
          <img
            src={restaurant.about.pic == null
              ? "https://picsum.photos/200/300"
              : restaurant.about.pic}
            alt="Restaurant Pic"
          />
        </div> -->
        <div class="info-box">
          <h4>Name: {restaurant.about.name}</h4>
          <p>Type: {restaurant.about.type}</p>
          <p>address: {restaurant.about.address}</p>
          <p>offer: {restaurant.about.offer}</p>
          <p>locale: {restaurant.about.locale}</p>
          <p>desc: {restaurant.about.desc}</p>
          <a class="btn-primary" href={`/restaurants/${restaurant.about.code}`}
            >View Restaurant</a
          >
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- /main -->
<style lang="scss">
  .restaurants {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    @include breakpoint(desktop) {
      grid-template-columns: repeat(2, 1fr);
    }
    @include breakpoint(tablet) {
      grid-template-columns: repeat(1, 1fr);
    }
    .restaurant {
      background-color: $bg-gray;
      padding: 10px 15px;
      @include border-radius;
      max-width: 280px;
    }
    // .img-box {
    //   width: 100%;
    //   img {
    //     display: block;
    //     width: 100%;
    //     max-width: 250px;
    //     @include border-radius;
    //     margin: 10px auto;
    //   }
    // }
    .info-box {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
  .add-rest {
    font-weight: 700;
    text-align: center;
    align-self: center;
  }
</style>
