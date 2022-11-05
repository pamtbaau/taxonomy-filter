# Taxonomy Filter Plugin

The **Taxonomy Filter** Plugin is an extension for [Grav CMS](http://github.com/getgrav/grav). q

## Installation

Since this plugin is **NOT** released to Grav's plugin directory, the plugin can only be installed manually.

> NOTE: This plugin is a modular component for Grav and requires plugin 'TaxonomyList' to be installed.

### Manual Installation

This plugin can be installed in two ways: Download a zip file, or cloning the repository.

#### Download zip
To install the plugin using zip, download the zip-version of this repository and unzip it under `/your/site/grav/user/plugins`. Then rename the folder to `taxonomy-filter`. You can find these files on [GitHub](https://github.com/pamtbaau/taxonomy-filter).

You should now have all the plugin files under

    /your/site/grav/user/plugins/taxonomy-filter
	
#### Git clone
To install the plugin using `git clone` run the following commands in the terminal:
```
$ cd /your/site/grav/user/plugins
$ mkdir taxonomy-filter
$ cd taxonomy-filter
$ git clone https://github.com/pamtbaau/taxonomy-filter
```

### Admin Plugin

If you use the Admin Plugin, you can install the plugin directly by opening the `Tools`-menu and clicking the `Direct install` tab. Select the downloaed zip-file and install.

## Configuration

Before configuring this plugin, you should copy the `user/plugins/taxonomy-filter/taxonomy-filter.yaml` to `user/config/plugins/taxonomy-filter.yaml` and only edit that copy.

Here is the default configuration and an explanation of available options:

```yaml
enabled: true                # Enable/disable plugin
routes:                      # Array of routes on which the plugin should be enabled
  - blog: /
    items: /blog                  
taxonomies: [category, tag]  # Array of taxonomies to display in list. These taxonomies must be listed in `site.yaml`.
isProduction: true           # Load minified css/js when true.
```

Note that if you use the Admin Plugin, a file with your configuration named taxonomy-filter.yaml will be saved in the `user/config/plugins/`-folder once the configuration is saved in the Admin.

## Usage

The plugin provides a Twig template that you need to include in one of your theme templates. If available choose `user/themes/<your theme>/templates/partials/sidebar.html.twig`. Depending on the layout of the 'sidebar' template, add something like:

```
{% if config.plugins['taxonomy-filter'].enabled %}
<div class="sidebar-content">
    {% include 'partials/taxonomy-filter.html.twig' ignore missing %}
</div>
{% endif %}
```

To filter on Taxonomies, the Taxonomies need to be added to the frontmatter of the page. To use the date rage filters, the start and end date need to be added to the frontmatter of the blog item:
```
taxonomy:
    category: blog
    tag: [mushroom, photography]
daterange:
    start: 2021-01-01
    end: 2021-12-31
```

## To Do

- No future plans..

