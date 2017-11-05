'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('app', function() {

  describe('List of Places', function() {
    it('should render the placesContainer', function() {
      const placesListContainer = element.all(by.css('.places-list'));

      expect(placesListContainer.count()).toEqual(1);
    });

    it('should render list of places in a container', function() {
      const tableRows = element.all(by.css('.places-list .place'));

      expect(tableRows.count()).toEqual(3);
    });
  });
});
