describe('validation service: ', () => {

  beforeEach(module('appticles.validation'));

  describe('validateComments method: ', () => {

    let serviceInstance;

    beforeEach(() => {
      inject((_AppticlesValidation_) => {
        serviceInstance = _AppticlesValidation_;
      });
    });

    let validData = {
      'data': {
        'comments': [
          {
            'id': 'alphanumericid1234',
            'author': 'Comment author',
            'author_url': 'https:\/\/blog.dummydomainname.com\/',
            'date': 'December 02, 2015',
            'content': 'Hi, this is a comment.',
            'article_id': 'alphanumericpostid7890',
            'avatar': 'http:\/\/0.gravatar.com\/avatar\/?s=50&#038;d=mm&#038;r=g'
          },
          {
            'id': 2,
            'author': 'Comment author',
            'author_url': 'https:\/\/blog.dummydomainname.com\/',
            'date': 'January 13, 2016',
            'content': 'Hi, this is another comment.',
            'article_id': 5,
            'avatar': 'http:\/\/0.gravatar.com\/avatar\/?s=50&#038;d=mm&#038;r=g'
          }
        ]
      }
    };

    // helper function for overwriting properties from the data array
    const overwriteProperty = (originalData, property, value) => {

      let invalidData = angular.copy(originalData);
      invalidData.data.comments = invalidData.data.comments.map(obj => {
        obj[property] = value;
        return obj;
      });

      return invalidData;
    };

    // helper function for deleting properties from the data array
    const deleteProperty = (originalData, property) => {

      let invalidData = angular.copy(originalData);
      invalidData.data.comments = invalidData.data.comments.map(obj => {
        delete obj[property];
        return obj;
      });

      return invalidData;
    };

    it('should exist', () => {
      expect(serviceInstance.validateComments).toBeDefined();
    });

    it('returns an object with an error property if the passed parameter is not an object', () => {
      let inputs = [[1,2,3],'strgngs', undefined, null, '<script>(function(){return \' run like a beast \';})()</script>'];

      for(let i = 0; i < inputs.length; i++) {
        result = serviceInstance.validateComments(inputs[i]);
        expect(result.error).toBeDefined();
      }
    });

    it('should return error if the data property does not exist', () => {
      let result = serviceInstance.validateComments({});
      expect(result.error).toBeDefined();
    });

    it('should return error if the comments property does not exist', () => {
      let result = serviceInstance.validateComments({'data':{}});
      expect(result.error).toBeDefined();
    });

    it('should return empty list if comments list is empty', () => {
      let result = serviceInstance.validateComments({'data':{'comments':[]}});
      expect(result).toEqual([]);
    });

    it('should return error if data is missing the id field', () => {
      let result = serviceInstance.validateComments(deleteProperty(validData, 'id'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the id field is not alphanumeric', () => {
      let result = serviceInstance.validateComments(overwriteProperty(validData, 'id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the author field is missing', () => {
      let result = serviceInstance.validateComments(deleteProperty(validData,'author'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the author field is not string', () => {
      let result = serviceInstance.validateComments(overwriteProperty(validData, 'author', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the author_url field is missing', () => {
      let result = serviceInstance.validateComments(deleteProperty(validData,'author_url'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the author_url field is not string', () => {
      let result = serviceInstance.validateComments(overwriteProperty(validData, 'author_url', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the avatar field is missing', () => {
      let result = serviceInstance.validateComments(deleteProperty(validData,'avatar'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the avatar field is not string', () => {
      let result = serviceInstance.validateComments(overwriteProperty(validData, 'avatar', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the date field is missing', () => {
      let result = serviceInstance.validateComments(deleteProperty(validData,'date'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the date field is not string', () => {
      let result = serviceInstance.validateComments(overwriteProperty(validData, 'date', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the content field is missing', () => {
      let result = serviceInstance.validateComments(deleteProperty(validData,'content'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the content field is not string', () => {
      let result = serviceInstance.validateComments(overwriteProperty(validData, 'content', 342));
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the article_id field', () => {
      let result = serviceInstance.validateComments(deleteProperty(validData, 'article_id'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the article_id field is not alphanumeric', () => {
      let result = serviceInstance.validateComments(overwriteProperty(validData, 'article_id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return the validated comments if they are valid', () => {
      let res = serviceInstance.validateComments(validData);
      expect(res).toEqual(validData.data.comments);
    });
  });
});
