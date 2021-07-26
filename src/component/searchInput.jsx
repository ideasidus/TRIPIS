import { useEffect } from "react";


const SearchInput = (props) => {

    const google = props.google
    console.log('in searchInput google : ',google)

    const initializeSearchInput = (locator, google) => {
        const geocodeCache = new Map();
        const geocoder = new google.maps.Geocoder();
    
        const searchInputEl = document.getElementById('location-search-input')
        const searchButtonEl = document.getElementById('location-search-button');
    
        const updateSearchLocation = function(address, location) {
            if (locator.searchLocationMarker) {
                locator.searchLocationMarker.setMap(null);
            }
            if (!location) {
                location.searchLocation = null;
                return;
            }
    
            locator.searchLocation = {'address': address, 'location': location};
            locator.searchLocationMarker = new google.map.Marker({
                position: location,
                map: locator.map,
                title: 'My location',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: '#3367D6',
                    fillOpacity: 0.5,
                    strokeOpacity: 0,
                }
            });
    
            const addressParts = address.split(' ');
            locator.userCountry = addressParts[addressParts.length - 1];
    
            locator.updateBounds();
            locator.renderResultsList();
            locator.updateTravelTimes();
            locator.clearDirections();
        }
    
    
        const geocodeSearch = (query) => {
            if (!query) {
                return;
            }
    
            const handleResult = (geocodeResult) => {
                searchInputEl.value = geocodeResult.formatted_address;
                updateSearchLocation(geocodeResult.formatted_address, geocodeResult.geometry.location);
            }
    
            if (geocodeCache.has(query)) {
                handleResult(geocodeCache.get(query));
                return;
            }
    
            const request = {address: query, bounds: locator.map.getBounds()};
            geocoder.geocode(request, (results, status) => {
                if (status === 'OK') {
                    if (results.length > 0) {
                        const result = results[0]
                        geocodeCache.set(query, result);
                        handleResult(result)
                    }
                }
            });
        }
    
    
        searchButtonEl.addEventListener('click', () => {
            geocodeSearch(searchInputEl.value.trim());
        })
    
        initializeSearchInputAutoComplete(locator, searchInputEl, geocodeSearch, updateSearchLocation);
    
        const initializeSearchInputAutoComplete = (locator, searchInputEl, fallbackSearch, searchLocationUpdater) => {
            const autocomplete = new google.maps.places.Autocomplete(searchInputEl, {
                types: ['geocode'],
                fields: ['place_id', 'formatted_address', 'geometry.location']
            });
    
            autocomplete.bindTo('bounds', locator.map);
            autocomplete.addListener('place_changed', () => {
                const placeResult = autocomplete.getPlace();
                if (!placeResult.geometry) {
                    fallbackSearch(placeResult.name)
                    return;
                }
                searchLocationUpdater(placeResult.formatted_address, placeResult.geometry.location)
            })
        }
    }

    useEffect(() => {

    }, [])

    return (
        <div class="search-input">
            <input id="location-search-input" placeholder="Enter your address or zip code"/>
            <button id="location-search-button"/>
        </div>
    )
}

export default SearchInput;