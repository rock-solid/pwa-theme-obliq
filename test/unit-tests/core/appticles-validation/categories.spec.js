describe('validation service: ', () => {

  beforeEach(module('appticles.validation'));

  describe('validateCategories method: ', () => {

    let serviceInstance;

    beforeEach(() => {
      inject((_AppticlesValidation_) => {
        serviceInstance = _AppticlesValidation_;
      });
    });

    let validData = {
      'data': {
        'categories': [
          {
            'id': 0,
            'order': 1,
            'name': 'Latest',
            'name_slug': 'Latest',
            'image': ''
          },
          {
            'id': 'alphanumericid1234',
            'order': 2,
            'name': 'Audio',
            'name_slug': 'post-format-audio',
            'parent_id': 2,
            'link': 'http:\/\/dev2.techlady.co\/index.php\/category\/post-format-audio\/',
            'image': ''
          }
        ],
        'page': '1',
        'rows': '2',
        'wpmp': '2.2.4'
      }
    };

    // helper function for overwriting properties from the data array
    const overwriteProperty = (originalData, property, value) => {

      let invalidData = angular.copy(originalData);
      invalidData.data.categories = invalidData.data.categories.map(obj => {
        obj[property] = value;
        return obj;
      });

      return invalidData;
    };

    // helper function for deleting properties from the data array
    const deleteProperty = (originalData, property) => {

      let invalidData = angular.copy(originalData);
      invalidData.data.categories = invalidData.data.categories.map(obj => {
        delete obj[property];
        return obj;
      });

      return invalidData;
    };

    it('should receive an object with an error property if the passed parameter is not an object', () => {
      let inputs = [[1,2,3],'strgngs', undefined, null, '<script>(function(){return \' run like a beast \';})()</script>'];

      for(let i = 0; i < inputs.length; i++) {
        result = serviceInstance.validateCategories(inputs[i]);
        expect(result.error).toBeDefined();
      }
    });

    it('should return error if the data property does not exist', () => {
      let result = serviceInstance.validateCategories({});
      expect(result.error).toBeDefined();
    });

    it('should return error if the categories property does not exist', () => {
      let result = serviceInstance.validateCategories({'data':{}});
      expect(result.error).toBeDefined();
    });

    it('should return empty list if categories list is empty', () => {
      let result = serviceInstance.validateCategories({'data':{'categories':[]}});
      expect(result).toEqual([]);
    });

    it('should return error if data is missing the id field', () => {
      let result = serviceInstance.validateCategories(deleteProperty(validData, 'id'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the id field is not alphanumeric', () => {
      let result = serviceInstance.validateCategories(overwriteProperty(validData, 'id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the order field', () => {
      let result = serviceInstance.validateCategories(deleteProperty(validData, 'order'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the order field is not numeric', () => {
      let result = serviceInstance.validateCategories(overwriteProperty(validData, 'order', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the name field', () => {
      let result = serviceInstance.validateCategories(deleteProperty(validData, 'name'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the name field is not string', () => {
      let result = serviceInstance.validateCategories(overwriteProperty(validData, 'name', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the name_slug field', () => {
      let result = serviceInstance.validateCategories(deleteProperty(validData, 'name_slug'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the name_slug field is not string', () => {
      let result = serviceInstance.validateCategories(overwriteProperty(validData, 'name_slug', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the parent_id field is not alphanumeric', () => {
      let result = serviceInstance.validateCategories(overwriteProperty(validData, 'parent_id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return the validated categories if the data is valid', () => {
      let res = serviceInstance.validateCategories(validData);
      expect(res).toEqual(validData.data.categories);
    });
  });
});
