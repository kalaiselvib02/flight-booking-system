<script>
export let modalText
export let showModal
import Icon from 'svelte-awesome'; 
import close from 'svelte-awesome/icons/close';
import { createEventDispatcher } from "svelte";

export let ticketBookedData;



const dispatch = createEventDispatcher();

function closeModal() {
	dispatch('close-modal', false);
}
</script>


{#if showModal}
<div id="myModal" class="modal" >
    <!-- Modal content -->
    <div class="modal-content">
      <button class="close" on:click={closeModal}>&times;</button>
      <p>   Your Ticket has been sucessfully booked</p>
     <div class="text-center">
      <div class="row d-flex ">
        <p>From : {ticketBookedData.from.city_name}</p>
        <p class="ml-3">To : {ticketBookedData.to.city_name}</p>
      </div>
      <div class="row d-flex ">
        <p>Departure : {ticketBookedData.departureTimeVal}</p>
        <p class="ml-3">Arriving Time : {ticketBookedData.arrivalTimeVal}</p>
      </div>
      <i class="fa-solid fa-circle-check fa-2x text-center"></i>
     </div>
    </div>
  </div>
  {/if}


<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";

.modal {
  //display: none; 
  position: fixed; 
  z-index: 10000;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%; 
  overflow: auto; 
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: $p-4;
  border: 1px solid #888;
  width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50% , -50%);
  .justify-content-between
  {
    justify-content: space-between;
  }
  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 20px;
  }
  p{
    font-family: $regular-pb;
    font-size: 1.1rem;
  }
}


</style>