<script>
export let items;
export let labelText;
let selected;
</script>

<div class="select-wrapper">
    <select name="" id="" bind:value={selected}>
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
}
</style>