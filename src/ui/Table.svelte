<script>
export let thItems;
export let items;
import Button from "./Button.svelte";


</script>

<div class="table-wrapper">
    <table class="table">
        <thead>
            <tr>
                {#each thItems as thItem}
                    <th>{thItem}</th>
                {/each} 
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <p class="text-grey text-md mb-0_2">Spicejet</p>
                    <p class="city-name mb-0_2">MAA , Chennai</p>
                    <p class="text-sm text-bold mb-0_2">10:30</p>
                </td>

                <td>
                    2h 40m 
                </td>

                <td>
                    <p class="city-name mb-0_2">DEL , New Delhi</p>
                    <p class="text-sm text-bold">13:10</p>
                </td>
                <td>
                    <p class="text-lg text-bold">5654</p>
                </td>
                <td>
                    <Button  caption="Book" btnClass="btn btn-md  btn-rounded-md" changeBtnStyle={true}></Button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";
.table-wrapper{
    table{
        width: 100%;
        max-width: 100%;
        margin-bottom: 1rem;
        background-color: transparent;
        border-collapse:separate; 
        border-spacing: 0 1.5em;

        thead{
            th{
                vertical-align: bottom;
                padding: 0.75rem;
                width: 150px;
                font-family: $regular-pb;
                font-size: $table-head;
                color: $text-th;
                text-align: left;
            }
        }
        tbody{
            tr{
               background-color: $bg-light-blue;
                td{
                    padding: 0.5rem 0.75rem;
                    .city-name{
                        font-family: $light-pb;
                        font-size: 0.9rem;
                        color: $text-light;
                    }
                }
            }
        }
    }
}
</style>