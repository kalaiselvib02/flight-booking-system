<script>
    export let value;
    export let isDisabled;
</script>


    <input type="date" class="input-item" on:input value={value} disabled={isDisabled}>


<style  type="text/scss">

@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";
.input-item{
    padding: 1rem;
    width: 250px;
    font-size: 1rem;
    border: none;;
    border-right: 1px solid #ccc;
    overflow: hidden;
    background-color: #fff;
    font-family: $regular-pb;
    color: $text-primary;
}
.input-item:disabled{
    cursor: not-allowed;
    opacity: 0.9;
}
input[value=""]::-webkit-datetime-edit{ color: transparent; }
</style>