<script>
    import TicketBooking from "./TicketBooking.svelte";


</script>
<div class="search-results-wrapper">
    <div class="light-bg">
        <TicketBooking changeFormLayout={true} btnText="Update Search" />
    </div>
    <div>
        <div class="filter-section-wrapper">

        </div>
        <div class="results-wrapper">
            
        </div>
    </div>
</div>

<style>
.light-bg{
    background-color: #E3EBF4;
}
</style>