describe('validation service: ', () => {

  beforeEach(module('appticles.validation'));

  describe('validatePosts method: ', () => {

    let serviceInstance;

    beforeEach(() => {
      inject((_AppticlesValidation_) => {
        serviceInstance = _AppticlesValidation_;
      });
    });

    let validData = {
      'data': {
        'articles': [
          {
            'id': 'alphanumericpostid1234',
            'title': 'Post Title',
            'author': 'Author name',
            'link': 'http:\/\/blog.dummydomainname.com\/2016\/03\/11\/post-title\/',
            'image': '',
            'date': 'Fri, March 11',
            'timestamp': 1457735104,
            'description': '<p>This is the article description, a part of the content<\/p>',
            'content': '',
            'categories': [2],
            'comment_status': 'open'
          },
          {
            'id': 5,
            'title': 'Another Post Title',
            'author': 'Author Name',
            'link': 'http:\/\/blog.dummydomainname.com\/2012\/12\/09\/another-post-title\/',
            'image': {
              'src': 'http:\/\/blog.dummydomainname.com\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg',
              'width': 300,
              'height': 580
            },
            'date': 'December 09, 2012',
            'timestamp': 1355043654,
            'description': '<p>This is the article description, a part of the content<\/p>',
            'content': '',
            'categories': [1,2],
            'comment_status': 'closed',
            'no_comments': 5,
            'show_avatars': 1,
            'require_name_email': 1
          }
        ]
      }
    };

    // helper function for overwriting properties from the data array
    const overwriteProperty = (originalData, property, value) => {

      let invalidData = angular.copy(originalData);
      invalidData.data.articles = invalidData.data.articles.map(obj => {
        obj[property] = value;
        return obj;
      });

      return invalidData;
    };

    // helper function for deleting properties from the data array
    const deleteProperty = (originalData, property) => {

      let invalidData = angular.copy(originalData);
      invalidData.data.articles = invalidData.data.articles.map(obj => {
        delete obj[property];
        return obj;
      });

      return invalidData;
    };

    it('returns an object with an error property if the passed parameter is not an object', () => {
      let inputs = [[1,2,3],'strgngs', undefined, null, '<script>(function(){return \' run like a beast \';})()</script>'];

      for(let i = 0; i < inputs.length; i++) {
        result = serviceInstance.validatePosts(inputs[i]);
        expect(result.error).toBeDefined();
      }
    });

    it('should return error if the data property does not exist', () => {
      let result = serviceInstance.validatePosts({});
      expect(result.error).toBeDefined();
    });

    it('should return error if the articles property does not exist', () => {
      let result = serviceInstance.validatePosts({'data':{}});
      expect(result.error).toBeDefined();
    });

    it('should return empty list if articles list is empty', () => {
      let result = serviceInstance.validatePosts({'data':{'articles':[]}});
      expect(result).toEqual([]);
    });

    it('should return error if data is missing the id field', () => {
      let result = serviceInstance.validatePosts(deleteProperty(validData, 'id'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the id field is not alphanumeric', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'id', '$#$@#$34'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the title field is missing', () => {
      let result = serviceInstance.validatePosts(deleteProperty(validData,'title'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the title field is not string', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'title', 23));
      expect(result.error).toBeDefined();
    });

    it('should return error if the author field is missing', () => {
      let result = serviceInstance.validatePosts(deleteProperty(validData,'author'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the author field is not string', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'author', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the link field is missing', () => {
      let result = serviceInstance.validatePosts(deleteProperty(validData,'link'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the link field is not string', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'link', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the date field is missing', () => {
      let result = serviceInstance.validatePosts(deleteProperty(validData,'date'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the date field is not string', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'date', 34234));
      expect(result.error).toBeDefined();
    });

    it('should return error if the timestamp field is missing', () => {
      let result = serviceInstance.validatePosts(deleteProperty(validData,'timestamp'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the timestamp field is not integer', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'timestamp', 'string'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the description field is missing', () => {
      let result = serviceInstance.validatePosts(deleteProperty(validData,'description'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the description field is not string', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'description', 342));
      expect(result.error).toBeDefined();
    });

    it('should return error if the content field is missing', () => {
      let result = serviceInstance.validatePosts(deleteProperty(validData,'content'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the content field is not string', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'content', 342));
      expect(result.error).toBeDefined();
    });

    it('should return error if the categories field is missing', () => {
      let result = serviceInstance.validatePosts(deleteProperty(validData,'categories'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the categories field is not array', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'categories', 342));
      expect(result.error).toBeDefined();
    });

    it('should return error if the comment_status field is not open, closed or disabled', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'comment_status', 'notallowed'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the no_comments field is not integer', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'no_comments', 'string'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the show_avatars field is not integer', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'show_avatars', 'string'));
      expect(result.error).toBeDefined();
    });

    it('should return error if the require_name_email field is not integer', () => {
      let result = serviceInstance.validatePosts(overwriteProperty(validData, 'require_name_email', 'string'));
      expect(result.error).toBeDefined();
    });

    it('should return the validated posts if they are valid', () => {
      let res = serviceInstance.validatePosts(validData);
      expect(res).toEqual(validData.data.articles);
    });
  });
});
