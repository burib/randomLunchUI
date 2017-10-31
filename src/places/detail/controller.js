export default function($routeParams, PlacesAPIDataService) {
  this.text = {
    'page.title.header': 'Places',
    'table.header.title': 'Title',
    place: 'Place',
    'view.details': 'View Details',
    'list.empty.title': `You don't have any places.`,
    'list.empty.subtitle': `Try coming back next week to check for a position.`
  };

  this.$onInit = () => {
    PlacesAPIDataService.query.call(this, $routeParams.id);
  };
};
