<script>
export let caption;
export let changeBtnStyle;
export let btnClass;

</script>

<div>
    <button class={btnClass} on:click>{caption}</button>
</div>



<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";

    .btn{
        border: none;
        font-family: $regular-pb;
        background-color: $text-primary;
        color:$text-white;
    }
    .btn.dark-mode{
        background-color: $bg-primary-dark;
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