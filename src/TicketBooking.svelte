<script>
    import { Row, Select, MaterialApp } from 'svelte-materialify';
    import DateInput from "./ui/DateInput.svelte";
    import Radio from "./ui/Radio.svelte";
    import Button from "./ui/Button.svelte";
    import {APP_CONSTANTS} from "./constants/constants"
    import { onMount } from "svelte";
    export let changeFormLayout;
    export let btnText;
   
    let selectedTripOption="one-way";
    let citiesUrl = APP_CONSTANTS.SELECT_CITY.URL;
    let items = [];
    let test = "airport_name"
    let value = test;

    async function fetchCities(url){
    await fetch(url)
    .then(response => response.json())
    .then(data => {
           items = data;
            console.log(items);
    }).catch(error => {
        console.log(error);
        return [];
    });
    }

  onMount(() => {
  fetchCities(citiesUrl)
});
</script>
<div class="form-wrapper">
    <div class="radiogroup-wrapper d-flex">
        <Radio
        type='radio'
        name="tripOption"
        value="one-way"
        id="one-way"
        label="One - way"
        groupName={selectedTripOption}
        on:input={(event) => selectedTripOption = event.target.value}
        />
        <Radio
        type='radio'
        name="tripOption"
        value="round-trip"
        id="round-trip"
        label="Round trip"
        groupName="tripOption"
        on:input={(event) => selectedTripOption = event.target.value}
        />
    </div>
    <div class:flex-row-layout={changeFormLayout}>
        <div class="input-group-wrapper d-flex">

            <Select {items} bind:value>{APP_CONSTANTS.SELECT_CITY.FROM}</Select>
            <Select {items} bind:value>{APP_CONSTANTS.SELECT_CITY.TO}</Select>

            <div class="date-input-wrapper d-flex">
                <DateInput/>
                <DateInput/>
            </div>
           
        </div>
        <div class="button-wrapper d-flex flex-end">
            <Button btnClass="btn-blue" caption={btnText} changeBtnStyle=true/>
        </div>
    </div>
  
      
       
         
  
  
</div>

<style type="text/scss">
@import "./scss/fonts/_fonts.scss";
@import "./scss/mixins/_mixins.scss";
@import "./scss/variables/_variables.scss";
@import "./scss/style.scss";

    :global(.s-select){
        background-color: #fff;
        width: 100%;
        padding: 1rem;
        border-right: 1px solid #ccc;
    }
    :global( .s-menu){
        top: 56px ;
        left: 0px;
        transform-origin: left top;
        z-index: 8;
        background-color: #fff !important;
        width: 100%;
    }
    :global(.s-input label) {
         color: $text-primary !important;
         font-family: $regular-pb;
    }
    :global(.s-text-field__wrapper>[slot=append]){
        display: none;
    }
    
    .form-wrapper{
        width: 80%;
    }
    .radiogroup-wrapper , .input-group-wrapper {
        padding: 1.5rem 0rem;
    }
     .flex-row-layout{
        display: flex;
        align-items: center;
     }
  
</style>