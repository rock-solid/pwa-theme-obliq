describe('validation service: ', () => {

  beforeEach(module('appticles.validation'));

  describe('validateOnePages method: ', () => {

    let serviceInstance;

    beforeEach(() => {
      inject((_AppticlesValidation_) => {
        serviceInstance = _AppticlesValidation_;
      });
    });

    let validData = {
      'data': {
        'page': {
          'id': 'alphanumericpageid1234',
          'parent_id': 0,
          'title': 'About',
          'link': 'http:\/\/blog.dummydomainname.com\/about\/',
          'image': {
            'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/page-image-691x1024.jpg',
            'width': 691,
            'height': 1024
          },
          'content': '<p>This is the content of the page<\/p>',
          'has_content': 1
        }
      }
    };

    // helper function for overwriting properties from the data array
    const overwriteProperty = (originalData, property, value) => {

      let invalidData = angular.copy(originalData);
      let obj = invalidData;

      obj.data.page[property] = value;
      return obj;

    };

    // helper function for deleting properties from the data array
    const deleteProperty = (originalData, property) => {

      let invalidData = angular.copy(originalData);
      let obj = invalidData;

      delete obj.data.page[property];
      return obj;

    };

    it('returns an object with an error property if the passed parameter is not an object', () => {
      let inputs = [[1,2,3],'strgngs', undefined, null, '<script>(function(){return \' run like a beast \';})()</script>'];

      for(let i = 0; i < inputs.length; i++) {
        result = serviceInstance.validateOnePages(inputs[i]);
        expect(result.error).toBeDefined();
      }
    });

    it('should return error if the data property does not exist', () => {
      let result = serviceInstance.validateOnePages({});
      expect(result.error).toBeDefined();
    });

    it('should return error if the page property does not exist', () => {
      let result = serviceInstance.validateOnePages({'data':{}});
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the id field', () => {
      let result = serviceInstance.validateOnePages(deleteProperty(validData, 'id'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the id field is not alphanumeric', () => {
      let result = serviceInstance.validateOnePages(overwriteProperty(validData, 'id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the parent_id field', () => {
      let result = serviceInstance.validateOnePages(deleteProperty(validData, 'parent_id'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the parent_id field is not alphanumeric', () => {
      let result = serviceInstance.validateOnePages(overwriteProperty(validData, 'parent_id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the title field', () => {
      let result = serviceInstance.validateOnePages(deleteProperty(validData, 'title'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the title field is not string', () => {
      let result = serviceInstance.validateOnePages(overwriteProperty(validData, 'title', 3424));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the has_content field', () => {
      let result = serviceInstance.validateOnePages(deleteProperty(validData, 'has_content'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the \'has_content\' field is not numeric', () => {
      let result = serviceInstance.validateOnePages(overwriteProperty(validData, 'has_content', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the content field', () => {
      let result = serviceInstance.validateOnePages(deleteProperty(validData,'content'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the content field is not a string', () => {
      let result = serviceInstance.validateOnePages(overwriteProperty(validData, 'content', 432423));
      expect(result.error).toBeDefined();
    });

    it('should return the validated page if the data is valid', () => {
      let res = serviceInstance.validateOnePages(validData);
      expect(res).toEqual(validData.data.page);
    });
  });
});
