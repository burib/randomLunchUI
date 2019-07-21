import module from './module';

describe(`${module.name} module`, function() {
  it('should load successfully', function() {
    expect(module.name).toBe('randomLunch.places.create');
  });
});
