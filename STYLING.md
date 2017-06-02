# Styling your application

## Prerequisites

- Understanding [BEM CSS methodology](https://en.bem.info/methodology/quick-start/)
- Understanding of [SASS](http://sass-lang.com/guide) as a CSS preprocessor.

## Structure

1. You will find the main .sass files in ``` src/assets/sass ``` folder. There will be 3 sass files that get compiled:

  - ``` ionic.app.scss ``` this is where we import the Ionic library and you can import other partials before the library to override default Ionic variables.
  - ``` main.scss ``` this is where we import the main application styles.
  - ``` customizable.scss ``` this is where we import the styles that we decide are themable from an external source.

  These files act like the table of contents for the application styling. All these files do not contain any styles themselves, rather than they import other files. In sass, these are called partials and are prefixed with an ``` _ ```. They cannot be compiled on their own.

  ```sass 
  // main.scss - the file we are currently in

  @import 
    "utilities/_functions.scss"
    "utilities/_mixins.scss" 

  @import
    "components/_item.scss",
    "components/_form.scss // general styles for the form component

  @import 
    "../../app/posts/category/_post-list.scss" // the post-list module

  ```

2. By default we separate the files we import here into three categories:

* BASE - where we include utilities, such as:
  * SASS functions
  * Variables
  * Mixins
  * Typography -- default styles for typography across the entire app. You can obviously override them in your components.
  * Utility-classes -- are classes that help quickly style your design.

* COMPONENTS - where we include the default styles for components, such as the ones in Ionic's list of CSS Components e.g. Forms, Buttons, Toggles etc.

* MODULES - This is where we include styles specific to each module in your application. The module is an independent unit that contains Javascript, HTML and a .scss stylesheet partial.

## Conventions

These are things we have borrowed from others or came up with it during the development of themes, in order to make things more consistent, more maintainable and easier to reason about.

- BEM methodology - a popular naming convention to achieve flexible and maintainable code.
- Nesting: Avoid nesting more than 2-3 levels of CSS classes.
```
  .category-ctx .hero-article .item // GOOD - 3 levels of nesting
  .category-ctx .hero-article__item // BETTER - 2 levels of nesting
  .category-ctx .hero-article .hero-article__photo .hero-text .item // BAD - 6 levels of nesting, think of refactoring
```
- Every module has a context class, whose sole purpose is to encapsulate the styles in that module to that particular module. It's more to prevent styles in that module from leaking outside the module, rather than the opposite.

- Sass partials that represent a module and that belong to the ``` customizable.scss ``` file have a '-custom' suffix and the classes they contain have a '-custom' suffix as well, containing only the styles that are themeable, hence the value of the property should be a variable.
```sass
// src/app/posts/details/_post-details-custom.scss

// context class
.post-details-ctx {

  // notice the '-custom' suffix as attached only to the element that is custom, not the entire block 
  .post__content-custom {
    font-size: $base-font-size;
  }

  .post__label-custom {
    background-color: $label-color;
  }
}
```

## Real usecase example

You will find a complete example that follows these principles, in the sample module implemented in ``` src/app/pages/details ```, but I will provide a contrived example here as well, for clarity.

```sass
// main.scss

@import 
  '../../app/pages/details/page-details';



// customizable.scss

@import  
  '../../app/pages/details/page-details-custom';



// src/app/pages/details/_page-details.scss

.page-ctx {
  
  .page {}
  .page__title {}
  .page__content {}
}



// src/app/pages/details/_page-details-custom.scss

.page-ctx {
  
  .page-custom {}
  .page-custom__title-custom {}
  .page-custom__content-custom {}
}

```

## Concluding remarks

While there is a mishmash of CSS styles and patterns throughout, that's okay. Going forward, you should rewrite sections according to these principles. Leave the place nicer than you found it.

In our experience working with a handful of developers over the past months, this structure has enabled us to greatly improve how we write CSS and handle our stylesheets, and we hope it will do the same to you too. If you feel you can improve on this, submit a pull request.

For more information:

- See the [BEM methodology documentation ](https://en.bem.info/methodology/quick-start/)