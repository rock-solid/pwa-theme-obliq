describe('appticles-canonical service:', () => {

  let serviceInstance, $document;

  beforeEach(module('appticles.canonical'));

  // a fake $document service
  beforeEach( () => {
    $document = angular.element(document);
    $document.find('body').append('<canonical-testing-content><link rel="canonical"></canonical-testing-content>');

    var originalFind = $document.find;
    var originalRemove = $document.remove;
    $document.find = function(selector) {
      if (selector === 'body') {
        return originalFind.call($document, 'body').find('content');
      } else {
        return originalFind.call($document, selector);
      }
    };

    module(function($provide) {
      $provide.value('$document', $document);
    });
  });

  beforeEach(() => {
    inject((_AppticlesCanonical_) => {
      serviceInstance = _AppticlesCanonical_;
    });
  });

  it('should return an object', () => {
    expect(typeof serviceInstance).toBe('object');
  });

  it('should have a method called set', () => {
    expect(serviceInstance.set).toBeDefined();
  });

  it('should set the attribute href of its input', () => {
    let href = 'www.google.ro';
    serviceInstance.set(href);
    let res = $document[0].querySelector('[rel="canonical"]').outerHTML;
    expect(res).toEqual('<link rel="canonical" href="www.google.ro">');
  });

  it('should remove an existing element if called with no arguments', () => {
    serviceInstance.set();
    let res = $document[0].querySelector('[rel="canonical"]');
    expect(res).toBe(null);
  });

  it('should create a link element and attach it to the head', () => {
    $document.find('link').remove();
    serviceInstance.set('www.google.ro');
    let head = $document.find('head');
    expect($document[0].querySelector('head').innerHTML.toString()).toContain('<link rel="canonical" href="www.google.ro">');
  });

  afterEach( () => {
    $document.find('canonical-testing-content').remove();
  });
});
