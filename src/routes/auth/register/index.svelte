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
  let username = "",
    email = "",
    password = "",
    confirmPass = "";
  // const isFieldsValid = { username: false, email: true, password: true };
  // const checkFieldValidity = () => {
  //   if (username.length >= 3) {
  //     isFieldsValid.username = true;
  //   } else {
  //     isFieldsValid.username = false;
  //   }
  //   if (email.length >= 5) {
  //     isFieldsValid.email = true;
  //   } else {
  //     isFieldsValid.email = false;
  //   }
  //   if (password.length >= 6) {
  //     isFieldsValid.password = true;
  //   } else {
  //     isFieldsValid.password = false;
  //   }
  // };
  async function addUser() {
    if (password == confirmPass) {
      const user = {
        username,
        email: String(email).toLowerCase(),
        password,
      };
      const response = await fetch("/api/auth/users", {
        method: "POST",
        body: JSON.stringify(user),
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
    } else {
      error = "Passwod did not match.";
    }
  }
</script>

<div class="container" id="register">
  <div class="main-content">
    <h3 class="title">Register</h3>
    <!-- <div class="social_register field">
      <a href="#0" class="social_bt facebook">Register with Facebook</a>
      <a href="#0" class="social_bt google">Register with Google</a>
    </div>
    <div class="divider"><span>Or</span></div> -->
    <form autocomplete="off">
      <div class="field">
        <label for="">Username</label>
        <input
          class="form-control"
          type="text"
          bind:value={username}
          on:focus={() => {
            error = "";
          }}
          required
        />
      </div>
      <div class="field">
        <label for="">Email</label>
        <input
          class="form-control"
          type="email"
          bind:value={email}
          on:focus={() => {
            error = "";
          }}
          required
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
        <button on:click|preventDefault={addUser} class="btn-primary"
          >Register Now!</button
        >
      </div>
      {#if success}
        <div class="field">
          <strong class="success">{@html success}</strong>
        </div>
      {/if}
      <div class="field">
        <small
          >Already have an acccount? <strong
            ><a href="/auth/login">Sign In</a></strong
          ></small
        >
      </div>
    </form>
    <div class="copy">© 2020 Home</div>
  </div>
</div>

<!-- /login -->
<style lang="scss">
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
