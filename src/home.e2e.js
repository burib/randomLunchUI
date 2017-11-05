'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('app', function() {

  describe('List of Places', function() {
    it('should render table', function() {
      const listTable = element.all(by.css('.places-list-table'));

      expect(listTable.count()).toEqual(1);
    });

    it('should render list of places in a table', function() {
      const tableRows = element.all(by.css('.places-list-table tbody tr'));

      expect(tableRows.count()).toEqual(3);
    });
  });
});
