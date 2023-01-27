<script>
    import DateInput from "./ui/DateInput.svelte";
    import Radio from "./ui/Radio.svelte";
    import TextInput from "./ui/TextInput.svelte";
    import Button from "./ui/Button.svelte";
    export let changeFormLayout;
    export let btnText;
    let selectedTripOption = "one-way"
    let fromCity = "";
    let destinationCity = ""
    $:console.log(selectedTripOption)

</script>
<div class="form-wrapper">
    <div class="radiogroup-wrapper">
        <Radio
        type='radio'
        name="tripOption"
        bind:value={selectedTripOption}
        id="one-way"
        label="One - way"
        groupName="tripOption"
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
        <div class="input-group-wrapper">
            <TextInput name="fromCity"
            value={fromCity}
            on:input={(event) => fromCity = event.target.value}
            id="fromCity" 
            placeholder="From"/>
        
            <TextInput 
            name="destinationCity"
            value={destinationCity}
            on:input={(event) => destinationCity = event.target.value}
            id="destinationCity" 
            placeholder="Destination"/>
            <div class="date-input-wrapper">
                <DateInput/>
                <DateInput/>
            </div>
           
        </div>
        <div class="button-wrapper flex-end">
            <Button btnClass="btn-blue" caption={btnText} changeBtnStyle=true/>
        </div>
    </div>
   
</div>

<style>
    .form-wrapper{
        width: 80%;
    }
    .radiogroup-wrapper , .input-group-wrapper {
        display: flex;
        margin: 1.5rem 5rem;
    }
    .date-input-wrapper {
        display: flex;
    }
     .flex-row-layout{
        display: flex;
        align-items: center;
     }
    .flex-end{
        display: flex;
        justify-content: flex-end;
    }
</style>