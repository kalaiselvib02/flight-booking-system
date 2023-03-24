import { writable , derived} from 'svelte/store';
import {APP_CONSTANTS} from "../constants/constants";


export const ticketSelection = writable({
    selectedFromCity: '',
    selectedToCity: '',
    selectedDepartureDate: '',
    isRoundTrip:false,
    selectedReturnDate: ''
  });

export const flightData = writable([]);
export const selectedAirlineOptions = writable([]);
export const selectedDepartureOptions = writable([]);
export const selectedReturnOptions = writable([]);
export const filteredValues = writable([]);
export const isDarkModeValue = writable("false");



