<script>

    import {Select } from 'svelte-materialify';
    import { ticketSelection , flightData, filteredValues} from '../store/store';
    import DateInput from "../ui/DateInput.svelte";
    import Radio from "../ui/Radio.svelte";
    import Button from "../ui/Button.svelte";
    import {APP_CONSTANTS} from "../constants/constants";
    import { onMount , onDestroy} from "svelte";
    import Tooltip from '../ui/Tooltip.svelte';

  
    export let changeFormLayout;
    export let btnText;
    export let updateSearch;
    export let changeBtnStyle;
    export let isDarkMode;
    


    let timeValue;
    let isDisabled;
    

    const citiesUrl = APP_CONSTANTS.SELECT_CITY.URL;
    const flightsUrl = APP_CONSTANTS.FLIGHTS.URL
    let selectedFromCity = $ticketSelection.fromCity;
    let selectedToCity = $ticketSelection.toCity;

   let selectedTripOption = $ticketSelection && $ticketSelection.isRoundTrip ? APP_CONSTANTS.TRIP_DATA.ROUND_TRIP : APP_CONSTANTS.TRIP_DATA.ONE_WAY
   $:selectedTripOption === APP_CONSTANTS.TRIP_DATA.ROUND_TRIP ?   $ticketSelection.isRoundTrip = true :  $ticketSelection.isRoundTrip = false 

    let sameCityError = false;

    //  Show Same City Error
    $:$ticketSelection.selectedFromCity && 
    ($ticketSelection.selectedFromCity === $ticketSelection.selectedToCity) ? sameCityError = true 
    : sameCityError = false;


   


    
    let items = [];
    let city = {
        name : "",
        value : ""
    }; 

  

    let fromCityRequired = false;
    let toCityRequired = false;
    let departureDateRequired = false;
    let arrivalDateRequired = false;

  
       
    function validateForm() {
   
        fromCityRequired = !$ticketSelection.selectedFromCity.length ? true : false;
        toCityRequired = !$ticketSelection.selectedToCity.length ? true : false;
        departureDateRequired = !$ticketSelection.selectedDepartureDate ? true : false;
        arrivalDateRequired = !$ticketSelection.selectedReturnDate && !$ticketSelection.isRoundTrip ? false : true;
        
        isDisabled =   (fromCityRequired || toCityRequired || departureDateRequired) ? true : false 
          
       if(!isDisabled){ 
        window.location.href="#/search-results"
       }
    }

 
    //  Storing ticket in local storage //
    $:window.localStorage.setItem("ticket" , JSON.stringify($ticketSelection)) || {};
   
   
   

  

   
   
   
    let showLoaderText;
   
 

    // $:$ticketSelection , fetchCities(flightsUrl)

    async function fetchFlights (flightsUrl)   {
   

    showLoader();
    try{
    const res = await fetch(flightsUrl);
   
    const jsonResult = await res.json();
    if(jsonResult.length) {
        showLoaderText = true
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
    function hideLoader(){ showLoaderText = false ;}

    async function fetchCities(url){
        await fetch(url)
        .then(response => response.json())
        .then(data => {
            items = data;
            items = items.map(item => {
                city = {
                    name : item.IATA_code + "(" +item.city_name +")",
                    value : item.city_name
                }
                return city
            });

            
        }).catch(error => {
            console.log(error);
            return [];
        });
    }


    function getTime(timeval) {
            let time = new Date(timeval);
            timeValue = (time.getUTCHours() < 10 ? "0"+time.getUTCHours() : time.getUTCHours()) 
            + ':' 
            + (time.getUTCMinutes() < 10 ? "0"+time.getUTCMinutes() : time.getUTCMinutes());
            return timeValue
    }

    onMount(() => {
        fetchCities(citiesUrl);
       //  fetchFlights(flightsUrl)
    });

 
 


 
    const swapCities = (fromCity , toCity) => { 
            $ticketSelection.selectedFromCity = fromCity;
            $ticketSelection.selectedToCity = toCity;
    }

</script>
        <div class="form-wrapper">
            <div class="radiogroup-wrapper d-flex">
                <Radio
                type='radio'
                name="tripOption"
                value={APP_CONSTANTS.TRIP_DATA.ONE_WAY}
                id="one-way"
                label="One - way"
                groupName={selectedTripOption}
                on:input={(event) => { selectedTripOption = event.target.value
                }}
                bind:isDarkMode
                />
                <Radio
                type='radio'
                name="tripOption"
                value={APP_CONSTANTS.TRIP_DATA.ROUND_TRIP}
                id="round-trip"
                label="Round trip"
                groupName={selectedTripOption}
                on:input={(event) => { selectedTripOption = event.target.value;
                }}
                bind:isDarkMode
                />
            </div>
            <div class="ticket-selection-wrapper" class:d-flex={changeBtnStyle} class:dark-mode={isDarkMode}>
                <div class="input-group-wrapper d-flex" class:dark-mode={isDarkMode}>
                <div class="d-flex w-100 p-relative" >
                  <div class="d-flex flex-column w-100">
                    <Select items={items} bind:value={$ticketSelection.selectedFromCity}  >
                        From
                    </Select>
                    {#if fromCityRequired}
                    <Tooltip tooltipText={APP_CONSTANTS.ERROR_MESSAGES.FROM_CITY_ERROR}/>
                    {/if}
                  </div>
                    <div class="round-trip" >
                        <button on:click={() => 
                    {
                    return swapCities($ticketSelection.selectedToCity , $ticketSelection.selectedFromCity)
                    }
                        }><i class="fa-solid fa-right-left"></i></button>
                    </div>
                </div>
                <div class="d-flex flex-column w-100 p-relative">
                    <Select items={items} bind:value={$ticketSelection.selectedToCity}  id="test">
                        To
                    </Select>
                    {#if toCityRequired}
                    <Tooltip tooltipText={APP_CONSTANTS.ERROR_MESSAGES.FROM_CITY_ERROR}/>
                    {/if}
                   
                </div>
                <div class="date-input-wrapper d-flex">
                   <div class="d-flex flex-column">
                    <DateInput  bind:isDarkMode value={$ticketSelection.selectedDepartureDate} on:input={(event) => $ticketSelection.selectedDepartureDate = event.target.value}/>
                        {#if departureDateRequired}
                        <Tooltip tooltipText={APP_CONSTANTS.ERROR_MESSAGES.DEPARTURE_DATE_ERROR}/>
                        {/if}
                   </div>
                    <div class="d-flex flex-column">
                        <DateInput bind:isDarkMode 
                        value={$ticketSelection.selectedReturnDate} 
                        on:input={(event) => $ticketSelection.selectedReturnDate = event.target.value}
                        isDisabled={selectedTripOption === APP_CONSTANTS.TRIP_DATA.ONE_WAY}/>
                        {#if arrivalDateRequired}
                        <Tooltip tooltipText={APP_CONSTANTS.ERROR_MESSAGES.RETURN_DATE_ERROR}/>
                        {/if}
                    </div>
                </div>
                </div>
                        {#if updateSearch} 
                       <div>
                        <Button darkMode={isDarkMode} btnClass="btn btn-lg" caption={btnText} changeBtnStyle=true 
                        disabled={isDisabled}
                         on:click={ async  () =>  fetchFlights(flightsUrl)}/>
                       </div>
                        {:else}
                        <div class="d-flex flex-end">
                            <a>
                                <Button btnClass="btn btn-md mt-4" 
                                caption={btnText} 
                                disabled={isDisabled}
                                on:click={validateForm}
                                darkMode={isDarkMode} 
                                changeBtnStyle=true/>
                            </a>
                        </div>                      
                        {/if}
            </div>
        </div>

        <style type="text/scss">
        @import "../scss/fonts/_fonts.scss";
        @import "../scss/mixins/_mixins.scss";
        @import "../scss/variables/_variables.scss";
        @import "../scss/style.scss";

            :global(.dark-mode .s-select){
                background-color: $bg-primary-dark ;
            }
           
            .form-wrapper{
                width: 80%;
            }
            .ticket-selection-wrapper {
                margin: 1.5rem 0rem;
                &.dark-mode {
                    button.btn{
                        background-color: $bg-primary-dark !important;
                    }
                }
            }
            .flex-row-layout{
                display: flex;
                align-items: center;
            }
            .round-trip{
                position: absolute;
                right: -20px;
                left: auto;
                z-index: 1;
                top: 10px;

                button{
                    background-color: $text-primary;
                    padding: 0.25rem;
                    border-radius: 100%;
                    height: 45px;
                    width: 45px;
                    text-align: center;
                    color: $text-white;
                }
            }
            :global(.dark-mode .round-trip button){
                background-color: $bg-white !important;
                color: $text-primary !important;;
            }
            :global(.dark-mode .date-input-wrapper .input-item) {
                background-color: $bg-primary-dark;
                color: $text-white;
            }
            :global(.dark-mode .date-input-wrapper .input-item:disabled) {
                background-color: #ccc;
                color: $text-white;
            }
            :global(.dark-mode button) {
                background-color: $bg-white !important;
                color: $text-primary !important;
            }
            
        </style>