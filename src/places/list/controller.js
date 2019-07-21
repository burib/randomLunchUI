export default function($routeParams, PlacesAPIDataService) {
  this.text = {
    'page.title.header': 'Places',
    'table.header.title': 'Title',
    'table.header.startDate': 'Start Date',
    'facets.error.message': `Facet data couldn't be loaded...`,
    'view.details': 'View Details',
    'list.empty.title': `You don't have any places.`,
    'list.empty.subtitle': `Try coming back next week to check for a place.`
  };

  this.onCreatePlaceSuccess = (newPlace) => {
    this.data.items.unshift(newPlace);
  };

  this.$onInit = () => {
    PlacesAPIDataService.query.call(this, $routeParams.id);
  };
};
