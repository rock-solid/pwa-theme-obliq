It is assumed that you already have your app working and online, and all the files related to it are in the ``` www ``` folder.
Make sure 'ionic serve' is running and that the gulp watcher is enabled ('gulp watch' for newer versions of Ionic).

1. Check out the ``` gulp production:js ``` task. 

* This task is formed from two sub-tasks. First checkout 'prepare-templates'. Make sure that the task has access to all the templates used in your application.
* Now for the 'uglify' task you need to make sure you pass in all the files in your app in the order you have them in your index file, and at the end add the angular templates js file.
* Run ``` gulp production:js ```

2. Check out the ``` gulp production:css ``` task.

* This tasks has two sub-tasks. One prepares the fonts to be inlined in a css file, the other concatenates that file with the other existing css.
* First copy the 'fonts' folder from the Ionic library into 'src/assets/fonts'.
* First time build - Go to www.icomoon.io and upload the font-file with a .svg extension. It will show you all the icons in the ionic library. You need to select only the ones used in your app, and press 'generate font'. 
* After the first build - Go to www.icomoon.io and upload the font-file with a .svg extension and the selection.json file from the ``` src/assets/fonts ``` folder. It will show you all the icons in the ionic library and the icons that are currently used in the app. You need to select only the ones used in your app, and press 'generate font'. 
* Download the zipfile and overwrite the existing font-assets with the ones from icomoon.io.
* Make sure the assets are copied over in the 'www/assets' folder .
* Run ``` gulp production:css ```
* Open the ``` www/dist/bundle.css ``` file. Search for `@font-face`. You should have 2 entries. Delete everything related to the second entry.

3. Checkout the the ``` gulp production:scss ``` task

* Open your terminal and run `` gulp export-custom-scss-paths ```. This runs through your 'customizable.scss' file and creates a dependency graph.
* You can see it in your terminal, it should look like this:

```

src/app/layout/shell/customizable.scss
    |--src/app/layout/shell/utilities/_appticles-variables.scss
    |--src/app/layout/shell/utilities/_functions.scss
    |--src/app/layout/shell/utilities/_internal-variables.scss
    |--src/app/layout/shell/_typography-custom.scss
    |--src/app/layout/shell/utilities/_mixins.scss
    |--src/app/layout/shell/components/_button-custom.scss
    |--src/app/layout/shell/components/_bar-custom.scss
    |--src/app/layout/shell/components/_popup-custom.scss
    |--src/app/layout/shell/components/_item-custom.scss
    |--src/app/layout/shell/components/_shadow-custom.scss
    |--src/app/layout/shell/components/_icon-custom.scss
    |--src/app/posts/latest/_latest-custom.scss
    |--src/app/posts/categories/_categories-custom.scss
    |--src/app/posts/details/_post-details-custom.scss
    |--src/app/posts/posts/_category-posts-custom.scss
    |--src/app/posts/comments/_comments-custom.scss
    |--src/app/pages/menu/_pages-menu-custom.scss
    |--src/app/pages/details/_page-details-custom.scss
    |--src/app/sidemenu/_sidemenu-custom.scss

```

* Copy that into a new file named ```customizableSass-paths.json ```. create a key named "paths", put the data there. 
* Go to the 'src/app/layout/shell/customizable.scss' and make sure the paths in the customizableSass-paths.json are in the same order as in the original file.
* At the end you should have something like this 

```
// config.json

{ "paths": [
    "src/assets/sass/utilities/_functions.scss.scss",
    "src/assets/sass/utilities/_appticles-variables.scss",
    "src/assets/sass/utilities/_internal-variables.scss",
    "src/assets/sass/utilities/_mixins.scss",
    "src/assets/sass/utilities/_typography.scss",
    "src/assets/sass/customs/_item-custom.scss",
    "src/assets/sass/customs/_icon-custom.scss",
    "src/assets/sass/customs/_typography-custom.scss",
    "src/app/posts/latest/_latest-custom.scss",
    "src/app/posts/category/_post-list-custom.scss",
    "src/app/posts/details/_post-details-custom.scss",
    "src/app/categories/_category-list-custom.scss",
    "src/app/pages/details/_page-details-custom.scss",
    "src/app/posts/comments/_comments-custom.scss",
    "src/app/posts/add-comment/_add-comment-custom.scss",
    "src/app/pages/list/_nested-pages-custom.scss",
    "src/app/layout/nav/_main-nav-view-custom.scss",
    "src/app/layout/nav/popover/_popover-custom.scss"
]}

```

* Run ``` gulp build-custom-sass ``` to generate your customizable.scss file that includes all the partials.


4. In your ```www/dist/ ``` folder you must have 3 files that are important.
```bundle.js```, ```customizable.scss``` and ```bundle.css```