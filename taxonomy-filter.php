<?php

namespace Grav\Plugin;

use Composer\Autoload\ClassLoader;
use DateTime;
use Grav\Common\Assets;
use Grav\Common\Page\Collection;
use Grav\Common\Page\Page;
use Grav\Common\Plugin;
use Grav\Common\Uri;
use RocketTheme\Toolbox\Event\Event;

/**
 * Class TaxonomyFilterPlugin
 * @package Grav\Plugin
 */
class TaxonomyFilterPlugin extends Plugin
{

    protected array $routes;

    /**
     * @return array
     *
     * The getSubscribedEvents() gives the core a list of events
     *     that the plugin wants to listen to. The key of each
     *     array section is the event that the plugin listens to
     *     and the value (in the form of an array) contains the
     *     callable (or function) as well as the priority. The
     *     higher the number the higher the priority.
     */
    public static function getSubscribedEvents(): array
    {
        return [
            'onPluginsInitialized' => [
                // Uncomment following line when plugin requires Grav < 1.7
                // ['autoload', 100000],
                ['onPluginsInitialized', 0]
            ]
        ];
    }

    /**
     * Composer autoload
     *
     * @return ClassLoader
     */
    public function autoload(): ClassLoader
    {
        return require __DIR__ . '/vendor/autoload.php';
    }

    /**
     * Initialize the plugin
     */
    public function onPluginsInitialized(): void
    {
        // Don't proceed if we are in the admin plugin
        if ($this->isAdmin()) {
            return;
        }

        // Enable the main events we are interested in

        if ($this->isOnRoute()) {
            $this->enable([
                // Put your main events here
                'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
                'onAssetsInitialized' => ['onAssetsInitialized', 0],
                'onCollectionProcessed' => ['onCollectionProcessed', 0],
            ]);
        }
    }

    /** 
     * Determine if plugin should be enabled on current route.
     * 
     * @return bool
     */
    public function isOnRoute(): bool
    {
        $lang = $this->grav['language']->getActive();

        $path = $this->grav['uri']->rootUrl() ?: '/';
        $routes = $this->config->get('plugins.' . $this->name . '.routes');

        foreach ($routes as $route) {
            ['blog' => $blog, 'items' => $items] = $route;
            if ($path === $blog || str_starts_with($path, $items)) {
                if ($lang) {
                    $route['blog'] = '/' . $lang . $route['blog'];
                    $route['items'] = '/' . $lang . $route['items'];
                }
                $this->routes = $route;

                return true;
            }
        }

        return false;
    }

    /**
     * Add current directory to twig lookup paths.
     *
     * @return void
     */
    public function onTwigTemplatePaths(): void
    {
        $this->grav['twig']->twig_paths[] = __DIR__ . "/templates";
    }

    /**
     * Add Javascript and Css to page
     *
     * @return void
     */
    public function onAssetsInitialized(): void
    {
        $isProduction = $this->config->get("plugins.$this->name.isProduction", true);
        $minified = $isProduction ? '.min' : '';

        /** @var Assets */
        $assets = $this->grav['assets'];

        $assets->addCss("plugin://{$this->name}/css/taxonomy-filter$minified.css");
        $assets->addJs(
            "plugin://{$this->name}/js/taxonomy-filter$minified.js",
            ['group' => 'head', 'position' => 'after', 'loading' => 'defer']
        );
        $assets->addInlineJs(
            "const taxonomyFilters = " . json_encode($this->routes),
            ['group' => 'head', 'position' => 'after']
        );
    }

    /**
     * Remove items from collection when selected dates do not fall between dates of seminar (if set in page header).
     * 
     * @param Event $event Contains 'collection' and 'context'
     */
    public function onCollectionProcessed(Event $event)
    {
        /** @var Collection */
        $collection = $event['collection'];

        /** @var Uri */
        $uri = $this->grav['uri'];

        $paramStart = $uri->param('starts-after');
        $paramEnd = $uri->param('ends-before');

        if ($paramStart !== false || $paramEnd !== false) {
            /** @var Page */
            foreach ($collection as $page) {
                $header = $page->header();

                if ($paramStart && isset($header->daterange['start'])) {
                    $headerStart = $header->daterange['start'];

                    // Remove item when selected start date is after start date seminar
                    $startDate = (new DateTime($paramStart))->getTimestamp();

                    if ($startDate > $headerStart) {
                        $collection->remove($page->path());
                    }
                }

                if ($paramEnd && isset($header->daterange['end'])) {
                    $headerEnd = $header->daterange['end'];

                    $endDate = (new DateTime($paramEnd))->getTimestamp();

                    // Remove item when selected end date is before end date seminar
                    if ($endDate < $headerEnd) {
                        $collection->remove($page->path());
                    }
                }
            }
        }
    }
}
