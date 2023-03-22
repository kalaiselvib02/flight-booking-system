export const APP_CONSTANTS = {
    TRIP_DATA:{
        ONE_WAY:"one-way",
        ROUND_TRIP:"round-trip"
    },
    SELECT_CITY: {
        FROM:"From",
        TO:"To",
        URL:"https://run.mocky.io/v3/8b1d2b79-0b1f-4f9f-bd56-17c5aad99ac5"
    },
    FLIGHTS:{
        URL:"https://run.mocky.io/v3/6229c6e5-4d44-4d1b-8060-78a5160e13f6"
    },
    TABLE:{
        TABLE_HEAD_COLUMNS:[
            "Departure",
            "Duration",
            "Arrival",
            "Price",
            ""
        ]
    },
    FILTER_SECTION:{
        RETURN_DEPARTURE_OPTIONS:[
            {
                name: "Before 11am",
                value:{
                    range1:11,
                    range2:""
                },
               
            },
            {
                name: "11am - 5pm",
                value:{
                    range1:11,
                    range2:17
                },
            },
            {
                name: "5pm - 9pm",
                value:{
                    range1:17,
                    range2:21
                },
            },
            {
                name: "After 9pm",
                value:{
                    range1:21,
                    range2:""
                },
            },
        ],
        AIRLINES_OPTIONS:[
           {
            name: "Indigo",
            value:"Indigo"
           },
           {
            name: "Spicejet",
            value:"Spicejet"
           },
           {
            name: "Air India",
            value:"Air India"
           },
           {
            name: "Air Asia India",
            value:"Air Asia"
           },

        ]
    },
    OFFER_DATA:{
        TITLE:"One Time Offer !!",
        BODY:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
    ERROR_MESSAGES:{
        SAME_CITY_ERROR:"From and To Cities cannot be same"
    }
}