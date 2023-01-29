<script>
import Icon from 'svelte-awesome';
import ticket from 'svelte-awesome/icons/ticket';
import SearchResults from "./SearchResults.svelte";
import TicketBooking from "./TicketBooking.svelte";
</script>

<!-- <div class="home-page-wrapper">
    <div class="overlay">
         <header>
            <h5 class="logo-text d-flex"><Icon scale="2" data={ticket}/> 
                 <span class="ml-2">Udaan</span></h5>
         </header>
         <div class="d-flex flex-column flex-center align-items-center h-100">
            <TicketBooking btnText="Search"/>
         </div>
    </div>
</div> -->

<SearchResults/>

<style type="text/scss">
@import "./scss/fonts/_fonts.scss";
@import "./scss/mixins/_mixins.scss";
@import "./scss/variables/_variables.scss";
@import "./scss/style.scss";

.home-page-wrapper{
    background: url("/assets/images/flight-background.jpg") center no-repeat;
    background-size: cover;
    height: 100vh;
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    .overlay{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
    height: 100%;
    width: 100%;
    padding: $container-padding;
    }
}
   
    .logo-text{
        color: $text-white;
        font-family: $reg-italic-pb;
        font-size: $_header-logo-lg;
        letter-spacing: 1.2px;
    }
</style>