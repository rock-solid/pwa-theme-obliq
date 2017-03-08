describe('validation service: ', () => {

  beforeEach(module('appticles.validation'));

  describe('validatePages method: ', () => {

    let serviceInstance;

    beforeEach(() => {
      inject((_AppticlesValidation_) => {
        serviceInstance = _AppticlesValidation_;
      });
    });

    let validData = {
      'data': {
        'pages': [
          {
            'id': 'alphanumericpageid1234',
            'parent_id': 0,
            'order': 1,
            'title': 'About',
            'link':'http:\/\/blog.dummydomainname.com\/about\/',
            'image': {
              'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/page-image-691x1024.jpg',
              'width': 691,
              'height': 1024
            },
            'content': '',
            'has_content': 1
          },
          {
            'id': 1409,
            'parent_id': 0,
            'order': 3,
            'title': 'Another page',
            'link':'http:\/\/blog.dummydomainname.com\/another-page\/',
            'image': '',
            'content': '',
            'has_content': 1
          },
          {
            'id': 1388,
            'parent_id': 'alphanumericpageid1234',
            'order': 2,
            'title': 'Child page',
            'link':'http:\/\/blog.dummydomainname.com\/child-page\/',
            'image': '',
            'content': '',
            'has_content': 1
          }
        ]
      }
    };

    // helper function for overwriting properties from the data array
    const overwriteProperty = (originalData, property, value) => {

      let invalidData = angular.copy(originalData);
      invalidData.data.pages = invalidData.data.pages.map(obj => {
        obj[property] = value;
        return obj;
      });

      return invalidData;
    };

    // helper function for deleting properties from the data array
    const deleteProperty = (originalData, property) => {

      let invalidData = angular.copy(originalData);
      invalidData.data.pages = invalidData.data.pages.map(obj => {
        delete obj[property];
        return obj;
      });

      return invalidData;
    };

    it('returns an object with an error property if the passed parameter is not an object', () => {
      let inputs = [[1,2,3],'strgngs', undefined, null, '<script>(function(){return \' run like a beast \';})()</script>'];

      for(let i = 0; i < inputs.length; i++) {
        result = serviceInstance.validatePages(inputs[i]);
        expect(result.error).toBeDefined();
      }
    });

    it('should return error if the data property does not exist', () => {
      let result = serviceInstance.validatePages({});
      expect(result.error).toBeDefined();
    });

    it('should return error if the pages property does not exist', () => {
      let result = serviceInstance.validatePages({'data':{}});
      expect(result.error).toBeDefined();
    });

    it('should return empty list if pages list is empty', () => {
      let result = serviceInstance.validatePages({'data':{'pages':[]}});
      expect(result).toEqual([]);
    });

    it('should return error if data is missing the id field', () => {
      let result = serviceInstance.validatePages(deleteProperty(validData, 'id'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the id field is not alphanumeric', () => {
      let result = serviceInstance.validatePages(overwriteProperty(validData, 'id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the order field', () => {
      let result = serviceInstance.validatePages(deleteProperty(validData, 'order'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the order field is not numeric', () => {
      let result = serviceInstance.validatePages(overwriteProperty(validData, 'order', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the title field', () => {
      let result = serviceInstance.validatePages(deleteProperty(validData, 'title'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the title field is not string', () => {
      let result = serviceInstance.validatePages(overwriteProperty(validData, 'title', 3424));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the has_content field', () => {
      let result = serviceInstance.validatePages(deleteProperty(validData, 'has_content'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the \'has_content\' field is not numeric', () => {
      let result = serviceInstance.validatePages(overwriteProperty(validData, 'has_content', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the parent_id field', () => {
      let result = serviceInstance.validatePages(deleteProperty(validData,'parent_id'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the parent_id field is not alphanumeric', () => {
      let result = serviceInstance.validatePages(overwriteProperty(validData, 'parent_id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });
  });
});
