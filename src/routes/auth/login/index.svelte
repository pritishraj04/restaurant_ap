<script context="module">
  export const load = ({ session, props }) => {
    if (session.user) {
      return {
        status: 302,
        redirect: "/",
      };
    }
    return {
      status: 200,
      props,
    };
  };
</script>

<script>
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";
  export let success;
  export let error;
  let acccountVerified = true;
  let email = "",
    password = "";

  async function loginUser() {
    const user = {
      email,
      password,
    };
    const response = await fetch("/api/auth/users/login", {
      method: "POST",
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const errorMessage = await response.json();
      acccountVerified = !errorMessage.accountNotVerified;
      error = errorMessage.error;
    }
    $session.user = await response.json();
  }
  async function sendOTP() {
    const response = await fetch("/api/auth/verifyOTP/sendOTP", {
      method: "POST",
      body: JSON.stringify({ email: email, resend: false }),
    });
    if (response.ok) {
      const successMessage = await response.json();
      success = successMessage.success;
      await goto("/auth/register/verifyOTP");
    }
    if (!response.ok) {
      const errorMessage = await response.json();
      error = errorMessage.error;
    }
    // await goto("/auth/register/verifyOTP");
  }
</script>

<div class="container" id="register">
  <div class="main-content">
    <h3 class="title">Login</h3>
    <form autocomplete="off">
      <div class="field">
        <label for="">Email/Username</label>
        <input
          class="form-control"
          type="text"
          bind:value={email}
          on:focus={() => {
            error = "";
          }}
        />
      </div>
      <div class="field">
        <label for="">Password</label>
        <input
          class="form-control"
          type="password"
          bind:value={password}
          on:focus={() => {
            error = "";
          }}
        />
      </div>
      {#if error}
        <div class="field">
          <strong class="error">{@html error}</strong>
        </div>
      {/if}
      {#if !acccountVerified}
        <div class="field">
          <span class="verify">
            <a href="#0" on:click|preventDefault={sendOTP} style="color: blue;"
              >Click here</a
            >
            <p>to verify Email.</p></span
          >
        </div>
      {/if}
      <div class="field">
        <button on:click|preventDefault={loginUser} class="btn-primary"
          >Login</button
        >
      </div>
      <div class="field">
        <small
          >Does not have an acccount? <strong
            ><a href="/auth/register">Register</a></strong
          ></small
        >
      </div>
      <!-- <div class="field">
        <small
          >Forgot Password? <strong
            ><a href="/auth/login/forgotPassword">Reset Password</a></strong
          ></small
        >
      </div> -->
    </form>
    <div class="copy">© 2020 Home</div>
  </div>
</div>

<!-- /login -->
<style lang="scss">
  .verify {
    display: flex;
    gap: 6px;
  }
</style>
