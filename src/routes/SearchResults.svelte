<script>
    import {APP_CONSTANTS} from "../constants/constants"
    import TicketBooking from "./TicketBooking.svelte";
    import Icon from 'svelte-awesome';
    import ticket from 'svelte-awesome/icons/ticket';
    import close from 'svelte-awesome/icons/close';
    import Table from "../ui/Table.svelte";
    import Modal from "../ui/Modal.svelte";
    import Button from "../ui/Button.svelte";
    import {ticketSelection , flightData ,  isDarkModeValue,  selectedAirlineOptions  , filteredValues , selectedDepartureOptions, selectedReturnOptions
    } from "../store/store.js";
    import { onMount , onDestroy} from "svelte";
    import Chart from "../ui/Chart.svelte";
    import { createEventDispatcher } from "svelte";
    import DoubleRangeSlider from '../ui/DoubleRange.svelte';
    import Header from "../__layout/Header.svelte";
    


    const flightsUrl = APP_CONSTANTS.FLIGHTS.URL
    let timeValue;
    let noResults
    let ticketBookedData;
    export let isDarkMode
    $ : isDarkMode = $isDarkModeValue;
  
    let showLoaderText;
    /**CONSTANTS*/
    const tableHeadColumns = APP_CONSTANTS.TABLE.TABLE_HEAD_COLUMNS;
    const departureReturn = APP_CONSTANTS.FILTER_SECTION.RETURN_DEPARTURE_OPTIONS;
    const airlinesOptions = APP_CONSTANTS.FILTER_SECTION.AIRLINES_OPTIONS;

    const dispatch =  createEventDispatcher();
   
  

   
    let hideOfferPopup = false;
    export let showModal = false

    $:if($selectedAirlineOptions.length || $selectedReturnOptions.length || $selectedDepartureOptions.length) {
        updateResults() ;
    }
    else {
        $filteredValues = $flightData
    }
  
   
    function updateResults () {
        let dataArr = $flightData
        if($selectedAirlineOptions.length) {
            dataArr =   dataArr.filter((el) => {
                return $selectedAirlineOptions.some((f) => {
                    if(f === el.airlines.name){
                        return el
                    }
                });  
            });
        }
         if($selectedReturnOptions.length)
            {
                dataArr =   dataArr.filter((el) => {
                let timeVal = new Date(el.arrival);
                let hoursValue = timeVal.getUTCHours();
                return $selectedReturnOptions.some((f) => {
                    return  !f.range2 ? hoursValue < f.range1 :  (hoursValue > f.range1 && hoursValue <= f.range2);
                });  
            });  
        }
        $filteredValues = dataArr
         if($selectedDepartureOptions.length)
            {
                dataArr =   dataArr.filter((el) => {
                let timeVal = new Date(el.departure);
                let hoursValue = timeVal.getUTCHours();
                return $selectedDepartureOptions.some((f) => {
                    return  !f.range2 ? hoursValue < f.range1 :  (hoursValue > f.range1 && hoursValue <= f.range2);
                });  
            });  
        }
        $filteredValues = dataArr
         return [...$filteredValues];
    }
   

   
    
 

    $:!$filteredValues.length ? noResults = true : noResults = false; 
     
    async function fetchFlights (flightsUrl)   {
     
    showLoader();
    try{
    const res = await fetch(flightsUrl);
    const jsonResult = await res.json();
    if(jsonResult.length) {
       flightData.set([])
    }

   
   
    return jsonResult.map((flight) => {
                        if(flight && 
                        flight.from.city_name === $ticketSelection.selectedFromCity && 
                        flight.to.city_name === $ticketSelection.selectedToCity 
                        // && 
                        // departureDateaVal === $ticketSelection.selectedDepartureDate && 
                        // returnDateVal === $ticketSelection.selectedReturnDate
                        ){
                            
                            flightData.update((currentData) => {
                            // Extracting Departure and Arrival Time from data // 
                            flight.departureTimeVal = getTime(flight.departure);
                            flight.arrivalTimeVal = getTime(flight.arrival);
                            if(flight.airlines.name === "Go Air") {
                            flight.airlines.logo = "https://m.economictimes.com/thumb/msid-80049437,width-1200,height-900,resizemode-4,imgsize-38409/goair-agencies.jpg"
                            }
                            return [...currentData, flight];
                            });
                            return flightData;                   
                        }  
            })
      }catch(error){
        console.log(error);
        return [];
      }finally{
        hideLoader();
      }
    }
  
  
    function showLoader(){showLoaderText = true ; }
    function hideLoader(){ showLoaderText = false}
    onMount(() => {
  

    if($ticketSelection && $ticketSelection.selectedFromCity && $ticketSelection.selectedToCity) {
        fetchFlights(flightsUrl);
    }
     
        
    });

    onDestroy(() => {

    })
 
   


    function getTime(timeval) {
            let time = new Date(timeval);
            timeValue = (time.getUTCHours() < 10 ? "0"+time.getUTCHours() : time.getUTCHours()) 
            + ':' 
            + (time.getUTCMinutes() < 10 ? "0"+time.getUTCMinutes() : time.getUTCMinutes());
            return timeValue
    }

    function resetFilterSelection() {
        selectedAirlineOptions.set([]);
        selectedDepartureOptions.set([]);
        selectedReturnOptions.set([])
    }
    
  

 
     
   
  
  
   
        
    

function onTicketBooked(ticket){
    ticketBookedData = ticket
    showModal = true;
} 
function handleCloseModal(event) {
    showModal = event.detail
}


$: roundTrip = $ticketSelection.isRoundTrip;

let start
let end
let minFlightPrice;
let mathFlightPrice;
$:if($flightData.length) {
let priceData = $flightData.map(flight => flight.price);

 minFlightPrice = Math.min(...priceData);
 mathFlightPrice = Math.max(...priceData);
start = minFlightPrice;
end = mathFlightPrice


}

	const nice = d => {
		if (!d && d !== 0) return '';
		return d
	}
</script>

<div class="search-results-wrapper" class:dark-mode={isDarkMode}>
    <Header bind:$isDarkModeValue  showHeaderBg = {true}/>
    <div class="light-bg ticket-booking-wrapper">
        <TicketBooking  btnText="Update Search"  darkMode={isDarkMode} updateSearch={true} changeBtnStyle={true}/>
    </div>
    <div class="results-container h-100">
        <div class="filter-section-wrapper d-flex flex-column" class:dark-mode={isDarkMode}>    
                <div class="filter-section">
                    <div class="filter-heading reset-selection">
                        <h4 class:text-white={isDarkMode}>Filters</h4>
                        <div class="text-gray text-xsm">
                            <Button caption="Reset All" on:click={resetFilterSelection} darkMode={isDarkMode}/>
                        </div>
                    </div>
                    
                </div>
                <div class="filter-section">
                    <div class="filter-heading">
                        <h4 class:text-white={isDarkMode}>Departure</h4>
                    </div>
                    <div class="filter-details grid-2-col w-80">
                        {#each departureReturn as option }
                        <div class="pill-checkbox-wrapper">
                            <label class="pill-list-item">
                                <input type="checkbox" name="feature" value={option.value} bind:group={$selectedDepartureOptions}>
                                <span class="pill-list-label">{option.name}
                                <span class="Icon Icon--checkLight"></span>
                                </span>
                            </label>
                        </div>
                        {/each}
                    </div>
                </div>
                <div class="filter-section">
                    <div class="filter-heading">
                        <h4 class:text-white={isDarkMode}> Return</h4>
                    </div>
                    <div class="filter-details grid-2-col w-80">
                        {#each departureReturn as option }
                        <div class="pill-checkbox-wrapper">
                            <label class="pill-list-item">
                                <input type="checkbox" name="feature" value={option.value} bind:group={$selectedReturnOptions}>
                                <span class="pill-list-label">{option.name}
                                <span class="Icon Icon--checkLight"></span>
                                </span>
                            </label>
                        </div>
                        {/each}
                    </div>
                </div>
                <div class="filter-section">
                    <div class="filter-heading">
                        <h4 class:text-white={isDarkMode}>Price</h4>
                    </div>
                    <div class="filter-details range-slider">
                        <DoubleRangeSlider bind:start bind:end/>
                        <div class="labels">
                            <div class="label" class:text-white={isDarkMode}>{nice(start)}</div>
                            <div class="label" class:text-white={isDarkMode}>{nice(end)}</div>
                        </div>
                      
                    </div>
                </div>
                <div class="filter-section">
                    <div class="filter-heading">
                        <h4 class:text-white={isDarkMode}>Preferred Airlines</h4>
                    </div>
                    <div class="filter-details air-line-options d-flex flex-column">
                        {#each airlinesOptions as option}
                    <label class:text-white={isDarkMode}>  <input type="checkbox"  value={option.value} bind:group={$selectedAirlineOptions}/>{option.name}</label>
                        {/each}

                    </div>
                </div>
                <div class="offer-wrapper fadeOut" class:remove-popup={hideOfferPopup} class:dark-mode={isDarkMode}>
                    <button on:click={() => hideOfferPopup = true} class="hide-popup-btn"><Icon data={close}/></button>
                    <div class="popup-heading" class:text-white={isDarkMode}>
                        <p>{APP_CONSTANTS.OFFER_DATA.TITLE}</p>
                    </div>
                    <div class="popup-description" class:text-white={isDarkMode}>
                        <p>{APP_CONSTANTS.OFFER_DATA.BODY}</p>
                    </div>
                </div>
        </div>
            {#if showLoaderText}
            <div id="loader" class:text-white={isDarkMode}>Loading...</div>
            {:else}
            {#if noResults}
            <div id="no-results-container" class:text-white={isDarkMode}>Sorry , No Data Found</div>
            {:else}
            <div class="flight-results-wrapper">
                <div class="chart-wrapper">
                    <div class="chart-wrapper">
                        <h4 class="chart-heading">Flight Prices</h4>
                        <Chart />
                    </div>
              
                </div>
                <!-- <Table thItems={tableHeadColumns} items={items} /> -->
                <div class="table-wrapper" class:dark-mode={isDarkMode}>
                    <table class="table">
                        <thead>
                            <tr>
                                {#each tableHeadColumns as thItem}
                                    <th>{thItem}</th>
                                {/each} 
                            </tr>
                        </thead>
                        <tbody>
                            {#each $filteredValues as item}
                            <tr class="flight-details-row">
                                <td>
                                    <div class="d-flex align-items-center">
                                    <img src={item.airlines.logo} alt={item.airlines.name} height="25" width="25">
                                    <p class="text-md mb-0_2 ml-2">{item.airlines.name}</p>
                                    </div>
                                    <p class="city-name mb-0_2">{item.from.IATA_code} , {item.from.city_name}</p>
                                    <p class="text-sm text-bold mb-0_2">{item.departureTimeVal}</p>
                                </td>
                
                                <td>
                                    2h 40m 
                                </td>
                
                                <td>
                                    <p class="city-name mb-0_2">{item.to.IATA_code} , {item.to.city_name}</p>
                                    <p class="text-sm text-bold">{item.arrivalTimeVal}</p>
                                </td>
                                <td>
                                    <p class="text-lg text-bold">&#8377 {item.price}</p>
                                </td>
                                <td>
                                    <Button darkMode={isDarkMode} caption="Book" btnClass="btn btn-md btn-rounded-md" changeBtnStyle={true} 
                                    on:click={onTicketBooked(item)}></Button>
                                </td>
                            </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
            {/if}
            
            {/if}
        </div>
        {#if showModal}
        <Modal 
        showModal={true}
        on:close-modal={handleCloseModal}
        bind:ticketBookedData
        />
        {/if}
    </div>

<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";

   
@-webkit-keyframes fadeOut {
            0% {opacity: 1;}
            100% {opacity: 0;}
         }
         
         @keyframes fadeOut {
            0% {opacity: 1;}
            100% {opacity: 0;}
         }
         .fadeOut {
            -webkit-animation-name: fadeOut;
            animation-name: fadeOut;
         }
.search-results-wrapper{
    
     header{
        background-color: $text-primary;
        padding: 0.8rem 2rem;
        h5{
            color: $text-white;
            font-size: $_header-logo-sm;
            font-family: $reg-italic-pb;
            letter-spacing: 1.2px;
        }
    }
    .ticket-booking-wrapper{
        padding: $container-padding-sm;
    
    }
    .results-container{
            display: flex;
           
            .filter-section-wrapper{
                width: 20%;
                border-right: 1px solid #ccc;
                padding: 1rem 1.7rem;

                .filter-section{
                    padding-bottom: $pb_1;
                    h4{
                        font-size: 1rem;
                        font-family: $regular-pb;
                    }
                    .reset-selection{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                }

                .offer-wrapper{
                    background-color: $bg-light-blue;
                    padding: 1rem;
                    margin: 2rem auto;
                    
                    .hide-popup-btn{
                        float: right;
                        color: $text-grey;
                    }
                    .fadeOut {
                        animation: fadeInAnimation ease 3s;
                        animation-iteration-count: 1;
                        animation-fill-mode: forwards;
                    }
                   &.remove-popup{
                  
                   }
                    .popup-heading {
                        p{
                            font-family: $regular-pb;
                            font-size: 0.9rem;
                        }
                    }
                    .popup-description{
                        p{
                            font-family: $regular-pb;
                            font-size: 0.8rem;
                        }
                    }
                    &.dark-mode{
                        background-color: $bg-dark-dark;
                    }
                }
                &.dark-mode{
                    background-color: $bg-primary-dark;
                }
            }


            .flight-results-wrapper{
                padding: 1.5rem;
                width: 80%;
            }
        }

        &.dark-mode{
                background-color: $bg-dark-dark;
        }

}
.chart-wrapper{
    height: 350px !important;
    background-color: $bg-light-blue;
    padding: 0.5rem 1rem;

    .chart-heading{
        font-size: 1rem;
        font-family: $regular-pb;
    }
}
canvas{

  width:1000px !important;
  height:600px !important;

}
.pill-checkbox-wrapper{
        .pill-list-item {
          cursor: pointer;
          display: inline-block;
          font-size: 0.8rem;
          font-weight: normal;
          line-height: 20px;
          text-transform: capitalize;
}

.pill-list-item input[type="checkbox"] {
  display: none;
}
.pill-list-item input[type="checkbox"]:checked + .pill-list-label {
  background-color: $text-primary;
  color: #fff;
 padding: 0.25rem;
}
.pill-list-label {
  
  color: $text-grey;
  padding: 0.25rem 0.35rem;
  text-decoration: none;
  background-color: $bg-light;
  font-family: $light-pb;
  display: inline-block;
  margin-bottom: 0.35rem;
  border-radius: 0.35rem;
}
.pill-list-item
  input[type="checkbox"]:checked
  + .pill-list-label
  {
  display: inline-block;

}
.pill-list-item input[type="checkbox"]:checked + .pill-list-label .Icon--addLight,
.pill-list-label .Icon--checkLight,
.pill-list-children {
  display: none;
}


    }
.table-wrapper{
    padding: 1rem;
    table{
        width: 100%;
        max-width: 100%;
        margin-bottom: 1rem;
        background-color: transparent;
        border-collapse:separate; 
        border-spacing: 0 1.5em;

        thead{
            th{
                vertical-align: bottom;
                padding: 0.75rem;
                width: 150px;
                font-family: $regular-pb;
                font-size: $table-head;
                color: $text-th;
                text-align: left;
            }
        }
        tbody{
            tr{
               background-color: $bg-light-blue;
                td{
                    padding: 0.5rem 0.75rem;
                    .city-name{
                        font-family: $light-pb;
                        font-size: 0.9rem;
                        color: $text-light;
                    }
                }
            }
        }
    }
    &.dark-mode{
        background-color: $bg-dark-dark;
        thead{
            th {
                color: $text-white;
            }
        }
       tbody{
        tr{
            background-color: $bg-primary-dark;
            td {
            color: $text-white;

            .city-name , .flight-name{
                color: $text-white;
            }
           
        }
        }
       }
       
    }
}

.range-slider{
    .label:first-child {
		float: left;
	}
	.label:last-child {
		float: right;
	}
	.slider{
		margin-top:100px
	}
}

#loader , #no-results-container{
    font-size: 30px;
    text-align: center;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
@keyframes fadeInAnimation {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

</style>