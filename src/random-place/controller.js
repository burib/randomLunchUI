export default function($routeParams, RandomPlaceAPIDataService) {
  this.getRandomPlace = () => {
    RandomPlaceAPIDataService.query.call(this);
  };
};
