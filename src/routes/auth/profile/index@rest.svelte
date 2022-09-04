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
  import { goto } from "$app/navigation";
  export let error;
  export let success;
  export let user;
  let isEditing = false;
  let password = "",
    confirmPass = "";
  const updatePassword = async () => {
    if (password == confirmPass) {
      const response = await fetch(`/api/auth/users/${user.username}`, {
        method: "PATCH",
        body: JSON.stringify({ username: user.username, password }),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        error = errorMessage.error;
      }
      if (response.ok) {
        const successMessage = await response.json();
        success = successMessage.success;
        await goto("/auth/profile");
      }
    } else {
      error = "Password do not match.";
    }
  };
</script>

<div class="container">
  {#if !isEditing}
    <div class="main-content">
      <h2 class="title">Profile</h2>
      <div class="field">
        <label for="lastName">Username:</label>
        {user.username}
      </div>
      <div class="field">
        <label for="speciality">Email:</label>
        {user.email}
      </div>
      <div class="field">
        <button class="btn-primary" on:click={() => (isEditing = true)}
          >Change Password</button
        >
      </div>
    </div>
  {:else}
    <div class="main-content">
      <h2 class="title">Change Password</h2>
      <form autocomplete="off">
        <div class="field">
          <label for="">Password</label>
          <input
            class="form-control"
            type="password"
            bind:value={password}
            on:focus={() => {
              error = "";
            }}
            required
          />
        </div>
        <div class="field">
          <label for="">Confirm Password</label>
          <input
            class="form-control"
            type="password"
            bind:value={confirmPass}
            on:focus={() => {
              error = "";
            }}
            required
          />
        </div>
        {#if error}
          <div class="field">
            <strong class="error">{@html error}</strong>
          </div>
        {/if}
        <div class="field">
          <button on:click|preventDefault={updatePassword} class="btn-primary"
            >Update Password</button
          >
        </div>

        {#if success}
          <div class="field">
            <strong class="success">{@html success}</strong>
          </div>
        {/if}
      </form>
      <div class="field">
        <button class="btn-primary" on:click={() => (isEditing = false)}
          >Cancel</button
        >
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .main-content {
    background-color: $bg-gray;
    width: 100%;
    padding: 20px;
    @include border-radius;
  }
  .field {
    display: flex;
    gap: 10px;
    margin: 1rem;
    justify-content: space-between;
    input {
      width: 100%;
      max-width: 15rem;
    }
    // &:nth-child(2) {
    //   display: block;
    //   h4 {
    //     margin-block: 5px;
    //   }
    // }
  }
  // #profilePic {
  //   width: 100%;
  //   max-width: 150px;
  //   @include border-radius;
  // }
</style>
