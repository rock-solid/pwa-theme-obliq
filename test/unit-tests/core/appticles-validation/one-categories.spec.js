describe('validation service: ', () => {

  beforeEach(module('appticles.validation'));

  describe('validateOneCategories method: ', () => {

    let serviceInstance;

    beforeEach(() => {
      inject((_AppticlesValidation_) => {
        serviceInstance = _AppticlesValidation_;
      });
    });

    let validData = {
      'data': {
        'category': {
          'id': 4,
          'order': 2,
          'name': 'Audio',
          'name_slug': 'post-format-audio',
          'parent_id': 2,
          'link': 'http:\/\/dev2.techlady.co\/index.php\/category\/post-format-audio\/',
          'image': ''
        }
      }
    };

    // helper function for overwriting properties from the data array
    const overwriteProperty = (originalData, property, value) => {

      let invalidData = angular.copy(originalData);
      let obj = invalidData;

      obj.data.category[property] = value;
      return obj;

    };

    // helper function for deleting properties from the data array
    const deleteProperty = (originalData, property) => {

      let invalidData = angular.copy(originalData);
      let obj = invalidData;

      delete obj.data.category[property];
      return obj;

    };

    it('should receive an object with an error property if the passed parameter is not an object', () => {
      let inputs = [[1,2,3],'strgngs', undefined, null, '<script>(function(){return \' run like a beast \';})()</script>'];

      for(let i = 0; i < inputs.length; i++) {
        result = serviceInstance.validateOneCategories(inputs[i]);
        expect(result.error).toBeDefined();
      }
    });

    it('should return error if the data property does not exist', () => {
      let result = serviceInstance.validateOneCategories({});
      expect(result.error).toBeDefined();
    });

    it('should return error if the categories property does not exist', () => {
      let result = serviceInstance.validateOneCategories({'data':{}});
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the id field', () => {
      let result = serviceInstance.validateOneCategories(deleteProperty(validData, 'id'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the id field is not alphanumeric', () => {
      let result = serviceInstance.validateOneCategories(overwriteProperty(validData, 'id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the name field is missing', () => {
      let result = serviceInstance.validateOneCategories(deleteProperty(validData,'name'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the name field is not string', () => {
      let result = serviceInstance.validateOneCategories(overwriteProperty(validData, 'name', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the name_slug field is missing', () => {
      let result = serviceInstance.validateOneCategories(deleteProperty(validData,'name_slug'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the name_slug field is not string', () => {
      let result = serviceInstance.validateOneCategories(overwriteProperty(validData, 'name_slug', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the parent_id field is not alphanumeric', () => {
      let result = serviceInstance.validateOneCategories(overwriteProperty(validData, 'parent_id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return the validated category if the data is valid', () => {
      let res = serviceInstance.validateOneCategories(validData);
      expect(res).toEqual(validData.data.category);
    });
  });
});
