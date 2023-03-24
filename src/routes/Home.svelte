<script>
import Icon from 'svelte-awesome';
import ticket from 'svelte-awesome/icons/ticket';
import Header from '../__layout/Header.svelte';
import TicketBooking from "./TicketBooking.svelte";
import {isDarkModeValue} from "../store/store"


</script>

<div class="home-page-wrapper" >
    <div class="overlay">
         <Header bind:$isDarkModeValue/>
         <div class="d-flex flex-column flex-center align-items-center h-100">
            <TicketBooking  btnText="Search" isDarkMode={$isDarkModeValue}/>
         </div>
    </div>
</div>

<slot></slot>

<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";

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