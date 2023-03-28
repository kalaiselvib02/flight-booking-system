<script>
export let name;
export let id;
export let value;
export let placeholder;
</script>

<div class="input-wrapper">
    <input type="text" name={name} class="input-item" id={id} value={value} on:input placeholder={placeholder}>
</div>

<style>
.input-item{
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    border: none;;
    border-right: 1px solid #ccc;
}
</style>