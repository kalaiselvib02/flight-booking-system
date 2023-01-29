<script>
    import {APP_CONSTANTS} from "./constants/constants"
    import TicketBooking from "./TicketBooking.svelte";
    import Icon from 'svelte-awesome';
    import ticket from 'svelte-awesome/icons/ticket';
    import close from 'svelte-awesome/icons/close';
    import Table from "./ui/Table.svelte";
    import CheckBox from "./ui/CheckBox.svelte";

    let tableHeadColumns = APP_CONSTANTS.TABLE.TABLE_HEAD_COLUMNS;
    let departureReturn = APP_CONSTANTS.FILTER_SECTION.RETURN_DEPARTURE_OPTIONS;
    let airlinesOptions = APP_CONSTANTS.FILTER_SECTION.AIRLINES_OPTIONS;
    let selectedAirlinesOptions = airlinesOptions.map(() => false);
    let selectedDepartureOptions = departureReturn.map(() => false);


    let hideOfferPopup = false;
    $:console.log(selectedAirlinesOptions);
    function test() {
        airlinesOptions.filter((o, i) => {
            console.log(o)
            return selectedAirlinesOptions[i];
        })
        selectedDepartureOptions.filter((o, i) => {
            console.log(o)
            return selectedDepartureOptions[i];
        })

    }
    test();
</script>

<div class="search-results-wrapper">
    <header>
        <h5 class="logo-text d-flex"><Icon scale="2" data={ticket}/> 
             <span class="ml-2">Udaan</span></h5>
     </header>
    <div class="light-bg ticket-booking-wrapper">
        <TicketBooking changeFormLayout={true} btnText="Update Search" />
    </div>
    <div class="results-container">
        <div class="filter-section-wrapper d-flex flex-column">
            <div class="filter-section">
                <div class="filter-heading">
                    <h4>Departure</h4>
                </div>
                <div class="filter-details grid-2-col w-80">
                    {#each departureReturn as option, index }
                         <CheckBox customCheckBox={true} 
                         value={option.value}
                         bind:checked={selectedDepartureOptions[index]}
                         />
                    {/each}
                   
                </div>
            </div>
            <div class="filter-section">
                <div class="filter-heading">
                    <h4>Return</h4>
                </div>
                <div class="filter-details grid-2-col w-80">
                    {#each departureReturn as option, index }
                         <CheckBox customCheckBox={true} 
                         value={option.value}
                         bind:checked={selectedDepartureOptions[index]}
                         />
                    {/each}
                </div>
            </div>
            <div class="filter-section">
                <div class="filter-heading">
                    <h4>Price</h4>
                </div>
            </div>
            <div class="filter-section">
                <div class="filter-heading">
                    <h4>Preferred Airlines</h4>
                </div>
                <div class="filter-details">
                    {#each airlinesOptions as option, index}
                    <CheckBox value={option.value} bind:checked={selectedAirlinesOptions[index]}/>
                    {/each}
                </div>
            </div>
            <div class="offer-wrapper fadeOut" class:remove-popup={hideOfferPopup}>
                <button on:click={() => hideOfferPopup = true} class="hide-popup-btn"><Icon data={close}/></button>
                <div class="popup-heading">
                    <p>{APP_CONSTANTS.OFFER_DATA.TITLE}</p>
                </div>
                <div class="popup-description">
                    <p>{APP_CONSTANTS.OFFER_DATA.BODY}</p>
                </div>
            </div>
        </div>
        <div class="flight-results-wrapper">
           <Table thItems={tableHeadColumns}/>
        </div>
    </div>
</div>

<style type="text/scss">
@import "./scss/fonts/_fonts.scss";
@import "./scss/mixins/_mixins.scss";
@import "./scss/variables/_variables.scss";
@import "./scss/style.scss";

   
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
            height: calc(100vh - 60px);
            .filter-section-wrapper{
                width: 20%;
                border-right: 1px solid #ccc;
                padding: 1rem 1.7rem;

                .filter-section{
                    h4{
                        font-size: 1rem;
                        font-family: $regular-pb;
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
                   &.remove-popup{
                    -webkit-animation-duration: 1s;animation-duration: 1s;
                    -webkit-animation-fill-mode: both;animation-fill-mode: both;
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
                }
            }
            .flight-results-wrapper{
                padding: 1.5rem;
                width: 80%;
            }
        }

}

</style>