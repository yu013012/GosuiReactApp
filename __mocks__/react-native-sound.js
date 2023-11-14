const mockSound = jest.fn();

class Sound {
  constructor(filename, bundle, callback) {
    // You can add any specific behavior you need for the constructor here
    mockSound(filename, bundle, callback);
  }

  // Add any other methods you're using in your code here
}

// Mock other properties or methods if needed
Sound.MAIN_BUNDLE = 'dummy_bundle';

module.exports = Sound;
