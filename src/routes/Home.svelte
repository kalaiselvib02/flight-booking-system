<script>
import Icon from 'svelte-awesome';
import ticket from 'svelte-awesome/icons/ticket';
import Header from '../__layout/Header.svelte';
import TicketBooking from "./TicketBooking.svelte";
import {isDarkModeValue} from "../store/store"


</script>
<!--Start of Home page wrapper-->
<div class="home-page-wrapper" >
    <!--Start of overlay-->
    <div class="overlay">
        <!--Start of Header-->
         <Header bind:$isDarkModeValue/>
         <div class="d-flex flex-column flex-center align-items-center h-100">
            <!--Start of TicketBooking-->
            <TicketBooking  btnText="Search" isDarkMode={$isDarkModeValue}/>
         </div>
         <!--Start of Home page wrapper-->
    </div>
    <!--End of overlay-->
</div>
<!--End of Home page wrapper-->


<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";
/** Start of home pager wrapper */
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
    
    /** Start of overlay */
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
    /** End of overlay */
}
/** End of home pager wrapper */

   /** Start of logo text */
    .logo-text{
        color: $text-white;
        font-family: $reg-italic-pb;
        font-size: $_header-logo-lg;
        letter-spacing: 1.2px;
    }
    /** End of logo text*/

</style>