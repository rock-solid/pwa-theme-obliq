describe('validation service: ', () => {

  beforeEach(module('appticles.validation'));

  describe('validateInsertComments method: ', () => {

    let serviceInstance;

    beforeEach(() => {
      inject((_AppticlesValidation_) => {
        serviceInstance = _AppticlesValidation_;
      });
    });

    let validData = {
      'content': 'savecomment',
      'articleId': 1379,
      'callback': 'angular.callbacks._4',
      'code': 'ZWVjY2I0ZTU3MGMwOWMwNWI1YTZmMzE5MjM0MWE1YmZfMTQ1ODk0MTQxMA==',
      'comment': 'this is a real comment',
      'author': 'Chuck Norris',
      'email': 'sdf@gmail.com',
      'require_name_email': 1
    };

    // helper function for overwriting properties from the data array
    const overwriteProperty = (originalData, property, value) => {

      let invalidData = angular.copy(originalData);
      let obj = invalidData;

      obj[property] = value;
      return obj;

    };

    // helper function for deleting properties from the data array
    const deleteProperty = (originalData, property) => {

      let invalidData = angular.copy(originalData);
      let obj = invalidData;

      delete obj[property];
      return obj;

    };

    it('returns an object with an error property if the passed parameter is not an object', () => {
      let inputs = [[1,2,3],'strgngs', undefined, null, '<script>(function(){return \' run like a beast \';})()</script>'];

      for(let i = 0; i < inputs.length; i++) {
        result = serviceInstance.validateInsertComments(inputs[i]);
        expect(result.error).toBeDefined();
      }
    });

    it('should return error if data is missing the articleId field', () => {
      let result = serviceInstance.validateInsertComments(deleteProperty(validData, 'articleId'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the articleId field is not alphanumeric', () => {
      let result = serviceInstance.validateInsertComments(overwriteProperty(validData, 'articleId', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the comment field', () => {
      let result = serviceInstance.validateInsertComments(deleteProperty(validData,'comment'));
    });

    it('should return error if the comment field is not a string', () => {
      let result = serviceInstance.validateInsertComments(overwriteProperty(validData, 'comment', 432423));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the code field', () => {
      let result = serviceInstance.validateInsertComments(deleteProperty(validData,'code'));
    });

    it('should return error if the code field is not a string', () => {
      let result = serviceInstance.validateInsertComments(overwriteProperty(validData, 'code', 432423));
      expect(result.error).toBeDefined();
    });

    it('should return error if the \'require_name_email\' is required but there is no name or email to check', () => {
      let res1 = serviceInstance.validateInsertComments(deleteProperty(validData,'author'));
      expect(res1.error).toBeDefined();

      let res2 = serviceInstance.validateInsertComments(deleteProperty(validData,'email'));
      expect(res2.error).toBeDefined();
    });

    it('should not return error if the \'require_name_email\' is not required but there is no name or email to check', () => {
      let res1 = serviceInstance.validateInsertComments(overwriteProperty(validData,'require_name_email', 0));
      expect(res1.error).toBeUndefined();
    });

    it('should not return error if the \'require_name_email\' is not a property on the validData', () => {
      let res = serviceInstance.validateInsertComments(deleteProperty(validData,'require_name_email'));
      expect(res.error).toBeUndefined();
    });

    it('should return the input if the data is valid', () => {
      let res = serviceInstance.validateInsertComments(validData);
      expect(res).toEqual(validData);
    });
  });
});
