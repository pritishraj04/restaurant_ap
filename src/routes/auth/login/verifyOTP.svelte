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
  export let error;
  export let success;
  let otp = "";
  async function verifyOtp() {
    const otpData = {
      otp,
    };
    const response = await fetch("/api/auth/verifyOTP", {
      method: "POST",
      body: JSON.stringify(otpData),
    });
    if (!response.ok) {
      const errorMessage = await response.json();
      error = errorMessage.error;
    }
    if (response.ok) {
      const successMessage = await response.json();
      success = successMessage.success;
      setTimeout(() => goto("/auth/login"), 3000);
    }
  }
  async function resendOtp() {
    const response = await fetch("/api/auth/verifyOTP/sendOTP", {
      method: "POST",
      body: JSON.stringify({ resend: true }),
    });
    if (response.ok) {
      const successMessage = await response.json();
      success = successMessage.success;
    }
    if (!response.ok) {
      const errorMessage = await response.json();
      error = errorMessage.error;
    }
  }
</script>

<div class="container" id="register">
  <div class="main-content">
    <h3 class="title">Verify Email</h3>
    <form autocomplete="off">
      <div class="field">
        <label for="">OTP</label>
        <input
          class="form-control"
          type="number"
          min="1000"
          max="9999"
          bind:value={otp}
          on:focus={() => {
            error = "";
          }}
          required
        />
      </div>
      <div class="field">
        <p class="subText">OTP will expire after 5 minutes.</p>
      </div>
      {#if error}
        <div class="field">
          <strong class="error">{@html error}</strong>
        </div>
      {/if}
      <div class="field">
        <button on:click|preventDefault={verifyOtp} class="btn-primary"
          >Verify OTP</button
        >
        <button on:click|preventDefault={resendOtp} class="btn-primary"
          >Resend OTP</button
        >
      </div>

      {#if success}
        <div class="field">
          <strong class="success">{@html success}</strong>
        </div>
      {/if}
    </form>
    <div class="copy">© 2020 Home</div>
  </div>
</div>

<!-- /login -->
<style lang="scss">
  .subText {
    font-size: 8px;
  }
  // .divider {
  //   text-align: center;
  //   height: 1px;
  //   margin: 30px 0;
  //   background-color: #bdbdbd;
  // }
  // .divider span {
  //   position: relative;
  //   top: -20px;
  //   background-color: #a9a9a9;
  //   display: inline-block;
  //   padding: 10px;
  //   font-style: italic;
  //   @include border-radius;
  // }
  // a.social_bt {
  //   -webkit-border-radius: 3px;
  //   -moz-border-radius: 3px;
  //   -ms-border-radius: 3px;
  //   border-radius: 3px;
  //   text-align: center;
  //   min-width: 200px;
  //   margin-bottom: 5px;
  //   display: block;
  //   padding: 12px;
  //   line-height: 1;
  //   position: relative;
  //   -moz-transition: all 0.3s ease-in-out;
  //   -o-transition: all 0.3s ease-in-out;
  //   -webkit-transition: all 0.3s ease-in-out;
  //   -ms-transition: all 0.3s ease-in-out;
  //   transition: all 0.3s ease-in-out;
  //   cursor: pointer;
  // }
  // a.social_bt:hover {
  //   -webkit-filter: brightness(115%);
  //   filter: brightness(115%);
  // }
</style>
