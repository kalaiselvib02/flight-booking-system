<script>
import Icon from 'svelte-awesome';
import ticket from 'svelte-awesome/icons/ticket';
</script>

<header>
    <h5 class="logo-text d-flex"><Icon scale="2" data={ticket}/> 
         <span class="ml-2">Udaan</span></h5>
 </header>

<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";
.logo-text{
        color: $text-white;
        font-family: $reg-italic-pb;
        font-size: $_header-logo-lg;
        letter-spacing: 1.2px;
    }
</style>