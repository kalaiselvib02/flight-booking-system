<script>
export let caption;
export let changeBtnStyle;
</script>

<button class="{changeBtnStyle === 'true' ? 'btn btn-md btn-blue' : 'btn btn-lg btn-blue'}" on:click>{caption}</button>


<style>
   
    .btn{
        border: none;
        font-family: 'Poppins', sans-serif;
    }
    .btn-lg{
        padding: 1.5rem 3.5rem;
        font-size: 1.1rem;
    }
    .btn-md{
        padding: 1rem 3.5rem;
    }
    .btn-blue{
        background: #295589;
        color: #fff;
    }
</style>