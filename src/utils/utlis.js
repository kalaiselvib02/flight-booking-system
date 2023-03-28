async function fetchFlights(url){
     
    fetch(url)
   .then(response => response.json())
   .then(data => {
       return data.map((flight) => {
               if(flight && flight.from.city_name === $ticketSelection.selectedFromCity && flight.to.city_name === $ticketSelection.selectedToCity){
                   if(airlinesOptionsValues && airlinesOptionsValues.length) {
                     
                    filterBasedOnSelection()
                   }
                   else {
                     
                       resultsData =  [...resultsData , flight];
                   }
                   return resultsData;
                  
               }
           })
          
   }).catch(error => {
       console.log(error);
       return [];
   });
   }