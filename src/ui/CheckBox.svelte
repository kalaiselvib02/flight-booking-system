<script>

export let value
export let group = undefined;
export let customCheckBox = false;


</script>

{#if customCheckBox}
<div class="pill-checkbox-wrapper">
    <label class="pill-list-item">
        <input type="checkbox" name="feature" value="1">
        <span class="pill-list-label">{value}
        <span class="Icon Icon--checkLight"></span>
        </span>
      </label>
</div>
{:else}
<div class="checkbox-wrapper">
    <label>
        <input type="checkbox"  value={value} bind:group/>
        {value}
    </label>
</div>
{/if}



<style type="text/scss">
    @import "../scss/fonts/_fonts.scss";
    @import "../scss/mixins/_mixins.scss";
    @import "../scss/variables/_variables.scss";
    @import "../scss/style.scss";
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
    .checkbox-wrapper{
        display: block;
        margin-bottom: 0.25rem;
        label{
            font-size: 0.85rem;
            color: $text-grey;
            font-family: $light-pb;
          
            input[type="checkbox"] {
              margin-right: 0.25rem;
            }
        }
    }
</style>