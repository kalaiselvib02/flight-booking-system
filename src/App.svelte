<script>

import Router from "svelte-spa-router"
import Home from "./routes/Home.svelte";
import SearchResults from "./routes/SearchResults.svelte";


let routes = {
    "/" : Home,
    "/search-results" : SearchResults

}

</script>




<Router {routes}></Router>
