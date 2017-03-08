describe('validation service: ', () => {

  beforeEach(module('appticles.validation'));

  describe('validateOnePosts method: ', () => {

    let serviceInstance;

    beforeEach(() => {
      inject((_AppticlesValidation_) => {
        serviceInstance = _AppticlesValidation_;
      });
    });

    let validData = {
      'data': {
        'article': {
          'id': 'alphanumericpostid1234',
          'title': 'Hello world!',
          'author': 'Author name',
          'link': 'http:\/\/blog.dummydomainname.com\/2015\/12\/02\/hello-world\/',
          'image': {
            'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg',
            'width': 300,
            'height': 580
          },
          'date': 'December 02, 2015',
          'timestamp': 1449078448,
          'description': '<p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!<\/p>',
          'content': '<p>en Welcome to WordPress. This is your first post. Edit or delete it, then start writing!<\/p>\n<div style="width:910px;"><img src="http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2012\/06\/dsc20050604_133440_34211.jpg" width="640" height="480" alt="dsc20050604_133440_34211.jpg" \/><\/div>',
          'categories': [1,2],
          'comment_status': 'open',
          'no_comments': 5,
          'show_avatars': 1,
          'require_name_email': 0
        }
      }
    };

    // helper function for overwriting properties from the data array
    const overwriteProperty = (originalData, property, value) => {

      let invalidData = angular.copy(originalData);
      let obj = invalidData;

      obj.data.article[property] = value;
      return obj;

    };

    // helper function for deleting properties from the data array
    const deleteProperty = (originalData, property) => {

      let invalidData = angular.copy(originalData);
      let obj = invalidData;

      delete obj.data.article[property];
      return obj;

    };

    it('should receive an object with an error property if the passed parameter is not an object', () => {
      let inputs = [[1,2,3],'strgngs', undefined, null, '<script>(function(){return \' run like a beast \';})()</script>'];

      for(let i = 0; i < inputs.length; i++) {
        result = serviceInstance.validateOnePosts(inputs[i]);
        expect(result.error).toBeDefined();
      }
    });

    it('should return error if the data property does not exist', () => {
      let result = serviceInstance.validateOnePosts({});
      expect(result.error).toBeDefined();
    });

    it('should return error if the article property does not exist', () => {
      let result = serviceInstance.validateOnePosts({'data':{}});
      expect(result.error).toBeDefined();
    });

    it('should return error if data is missing the id field', () => {
      let result = serviceInstance.validateOnePosts(deleteProperty(validData, 'id'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the id field is not alphanumeric', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the title field is missing', () => {
      let result = serviceInstance.validateOnePosts(deleteProperty(validData,'title'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the title field is not string', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'title', 23));
      expect(result.error).toBeDefined();
    });

    it('should return error if the author field is missing', () => {
      let result = serviceInstance.validateOnePosts(deleteProperty(validData,'author'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the author field is not string', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'author', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the link field is missing', () => {
      let result = serviceInstance.validateOnePosts(deleteProperty(validData,'link'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the link field is not string', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'link', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the date field is missing', () => {
      let result = serviceInstance.validateOnePosts(deleteProperty(validData,'date'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the date field is not string', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'date', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the timestamp field is missing', () => {
      let result = serviceInstance.validateOnePosts(deleteProperty(validData,'timestamp'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the timestamp field is not integer', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'timestamp', 'string'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the description field is missing', () => {
      let result = serviceInstance.validateOnePosts(deleteProperty(validData,'description'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the description field is not string', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'description', 342));
      expect(result.error).toBeDefined();
    });

    it('should return error if the content field is missing', () => {
      let result = serviceInstance.validateOnePosts(deleteProperty(validData,'content'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the content field is not string', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'content', 342));
      expect(result.error).toBeDefined();
    });

    it('should return error if the categories field is missing', () => {
      let result = serviceInstance.validateOnePosts(deleteProperty(validData,'categories'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the categories field is not array', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'categories', 342));
      expect(result.error).toBeDefined();
    });

    it('should return error if the comment_status field is not open, closed or disabled', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'comment_status', 'notallowed'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the no_comments field is not integer', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'no_comments', 'string'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the show_avatars field is not integer', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'show_avatars', 'string'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the require_name_email field is not integer', () => {
      let result = serviceInstance.validateOnePosts(overwriteProperty(validData, 'require_name_email', 'string'));
      expect(result.error).toBeDefined();
    });

    it('should return the validated post if the data is valid', () => {
      let res = serviceInstance.validateOnePosts(validData);
      expect(res).toEqual(validData.data.article);
    });
  });
});
