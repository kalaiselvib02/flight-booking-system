<script>
export let caption;
export let changeBtnStyle;
</script>

<button class="{changeBtnStyle === 'true' ? 'btn btn-md btn-blue' : 'btn btn-sm btn-blue btn-rounded-md'}" on:click>{caption}</button>


<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";
    .btn{
        border: none;
        font-family: $regular-pb;
    }
    .btn-lg{
        padding: 1.5rem 3.5rem;
        font-size: 1.1rem;
    }
    .btn-md{
        padding: 1rem 3.5rem;
    }
    .btn-sm{
        padding: 0.5rem 2.5rem;
    }
    .btn-blue{
        background: #295589;
        color: #fff;
    }
    .btn-rounded-md{
        border-radius: 0.2rem;
    }
</style>