<script>
export let name;
export let id;
export let type;
export let value;
export let label;
export let groupName;
export let isDarkMode;


</script>


    {#if type === "radio"}
   <div class:dark-mode={isDarkMode}>
    <div class="radio-group">
      <input type="radio" name={name} id={id} on:change on:input value={value} bind:group={groupName} >
      <label for={name} >{label}</label>
  </div>
   </div>
    {/if}

<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";

:global(.dark-mode .radio-group input[type="radio"]:checked + label) {
    background-color: $bg-primary-dark !important;
}
 .radio-group{
  width: 150px;
  height: 45px;
  position: relative;
  font-family: $regular-pb;
  border-radius: 0.375rem;
  }
.radio-group label,
.radio-group input {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.radio-group input[type="radio"] {
  opacity: 0.011;
  z-index: 100;
  
}

.radio-group input[type="radio"]:checked + label {
  background: #295589;
  border-radius: 4px;
  border-radius: 5px 0px 0px 5px;
  color: #fff;
}




.radio-group label {
  cursor: pointer;
  z-index: 90;
  line-height: 1.8em;
  background-color: #fff;
  color: #295589;
  padding: 0.5rem;
  text-align: center;

}

</style>