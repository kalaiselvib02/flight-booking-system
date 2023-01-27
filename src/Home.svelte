<script>
import SearchResults from "./SearchResults.svelte";
import TicketBooking from "./TicketBooking.svelte";


</script>

<div class="home-page-wrapper">
<TicketBooking 
btnText="Search"/>
</div>

<SearchResults/>

<style>
.home-page-wrapper{
    background: url("/assets/images/flight-background.jpg") center no-repeat;
    background-size: cover;
    height: 100vh;
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* opacity: 0.5; */
}
</style>