<script>
  import { session } from "$app/stores";
</script>

<div class="container">Hello, {$session.user.username}</div>
