// Global variables
let map;
let infoWindow;
let ko;


function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 55.7423536,
      lng: 37.624814,
    },
      zoom: 13,
      scrollwheel: false,
      zoomControl: true,
      styles: styles,
      mapTypeControl: false
    });

    infoWindow = new google.maps.InfoWindow();
}

    // Init our ViewModel
    ko.applyBindings(new MapViewModel());


// This is our main viewmodel
function MapViewModel() {
    const self = this;

    // DATA
    this.locations = ko.observableArray([]);

    // Push our default locations to the 'locations' array
    defaultLocations.forEach(function(location) {
        self.locations.push(new Location(location));
    });

    // BEHAVIOURS
    this.searchQuery = ko.observable('');
    this.isFocused = ko.observable(true);
    this.isMenuClosed = ko.observable(false);

    // Close navigation if window width is < 768px
    const w = window.innerWidth;
    w < 768 ? this.isMenuClosed(true) : this.isMenuClosed(false);
    // Opens/Closes menu
    this.toggleMenu = function() {
        self.isMenuClosed(!this.isMenuClosed());
    };

    // Filter list
    this.filteredLocations = ko.computed(() => {
        const filter = self.searchQuery();
        if (!filter) {
            self.locations().forEach((location) => location.isVisible(true));
            return self.locations();
        } else {
            const search = self.searchQuery().toLowerCase();
            return ko.utils.arrayFilter(self.locations(), (location) => {
                const selectedLocation = location.title.toLowerCase().indexOf(search) >= 0;
                location.isVisible(selectedLocation);
                return selectedLocation;
            });
        }
    }, this);

}


// Google map error handler
function goggleRequestError() {
    alert("Oops! This page didn’t load Google Maps correctly. Please try again later.");
}
