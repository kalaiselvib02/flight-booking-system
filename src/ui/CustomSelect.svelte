<script>
export let items;
export let selectedValue;
export let placeholder;
</script>

<div class="select-wrapper">
    <select name="" id="" bind:value={selectedValue} on:change placeholder={placeholder}>
        {#each items as item}
        <option value={item.city_name}>{item.city_name}</option>
        {/each}
    </select>
</div>

<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";
.select-wrapper{
    background-color: #fff;
    border-right: 1px solid #ccc;
    width: 100%;

    select{
        padding: 1rem;
        width: 100%;
        border: none;
        box-shadow: none;
        outline: none;
    }
}
</style>