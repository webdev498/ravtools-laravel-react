<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$api_version = '/api/v1';


/* API */

$app->group([
	'namespace' => 'App\Http\Controllers',
	'prefix' => $api_version
], function() use ($app) {
	// changed to post because getting the API key requires posting user info
	$app->post('/key', [
		'as' => 'api.getKey',
		'uses' => 'ApiController@getKey'
	]);
});


/* Auditor (App) */

$app->group([
	'namespace' => 'App\Http\Controllers\Api',
	'prefix' => "{$api_version}/auditor"
], function() use ($app) {
	$app->get('/navigation', [
		'as' => 'auditor.getNavigation',
		'uses' => 'AuditorController@getNavigation'
	]);
});


/* Auditor.Sites */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/sites"
], function() use ($app) {
	$app->get('/', [
		'as' => 'auditor.sites',
		'uses' => 'SiteController@getSites'
	]);

	$app->get('/site', [
		'as' => 'auditor.sites.get',
		'uses' => 'SiteController@getSite'
	]);

	$app->put('/site', [
		'as' => 'auditor.sites.put',
		'uses' => 'SiteController@putSite'
	]);

	$app->post('/site', [
		'as' => 'auditor.sites.post',
		'uses' => 'SiteController@postSite'
	]);

	$app->delete('/site', [
		'as' => 'auditor.sites.delete',
		'uses' => 'SiteController@deleteSite'
	]);

	$app->get('/site/summary', [
		'as' => 'auditor.sites.summary',
		'uses' => 'SiteController@getSummary'
	]);

	$app->get('/site/summary/{section}', [
		'as' => 'auditor.sites.summary',
		'uses' => 'SiteController@getSummary'
	]);

	$app->get('/site/hash', [
		'as' => 'auditor.sites.hash',
		'uses' => 'SiteController@getSiteHash'
	]);

	$app->post('/site/hash', [
		'as' => 'auditor.sites.hash',
		'uses' => 'SiteController@postSiteHash'
	]);

	$app->delete('/site/hash', [
		'as' => 'auditor.sites.hash',
		'uses' => 'SiteController@deleteSiteHash'
	]);

	$app->post('/site/crawl', [
		'as' => 'auditor.sites.crawl',
		'uses' => 'SiteController@runCrawl'
	]);

	$app->post('/site/cancel', [
		'as' => 'auditor.sites.cancel',
		'uses' => 'SiteController@cancelCrawl'
	]);
});


/* Auditor.Crawls */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/crawls"
], function() use ($app) {
	$app->get('/', [
		'as' => 'auditor.crawls',
		'uses' => 'CrawlController@getCrawls'
	]);

	$app->get('/crawl/{crawl_id}', [
		'as' => 'auditor.crawls.get',
		'uses' => 'CrawlController@getCrawl'
	]);

	$app->put('/crawl/{crawl_id}', [
		'as' => 'auditor.crawls.put',
		'uses' => 'CrawlController@putCrawl'
	]);

	$app->post('/crawl', [
		'as' => 'auditor.crawls.post',
		'uses' => 'CrawlController@postCrawl'
	]);

	$app->delete('/crawl/{crawl_id}', [
		'as' => 'auditor.crawls.delete',
		'uses' => 'CrawlController@deleteCrawl'
	]);

	$app->get('/crawl/{crawl_id}/summary', [
		'as' => 'auditor.crawls.summary',
		'uses' => 'CrawlController@getSummary'
	]);
});


/* Auditor.Path Exclusions */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/pathexclusions"
], function() use ($app) {
	$app->get('/', [
		'as' => 'auditor.pathexclusions',
		'uses' => 'PathExclusionController@getExclusions'
	]);

	$app->get('/pathexclusion/{exclusion_id}', [
		'as' => 'auditor.pathexclusions.get',
		'uses' => 'PathExclusionController@getExclusion'
	]);

	$app->put('/pathexclusion/{exclusion_id}', [
		'as' => 'auditor.pathexclusions.put',
		'uses' => 'PathExclusionController@putExclusion'
	]);

	$app->post('/pathexclusion', [
		'as' => 'auditor.pathexclusions.post',
		'uses' => 'PathExclusionController@postExclusion'
	]);

	$app->delete('/pathexclusion', [
		'as' => 'auditor.pathexclusions.delete',
		'uses' => 'PathExclusionController@deleteExclusion'
	]);
});

/* Error Exclusions */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/issueexclusions" // the exclusion endpoints should be separated by underscores to avoid double e's
], function() use ($app) {
	$app->get('/', [
		'as' => 'auditor.issueexclusions',
		'uses' => 'IssueExclusionController@getExclusions'
	]);

	$app->get('/issueexclusion/{exclusion_id}', [
		'as' => 'auditor.issueexclusions.get',
		'uses' => 'IssueExclusionController@getExclusion'
	]);

	$app->put('/issueexclusion/{exclusion_id}', [
		'as' => 'auditor.issueexclusions.put',
		'uses' => 'IssueExclusionController@putExclusion'
	]);

	$app->post('/issueexclusion', [
		'as' => 'auditor.issueexclusion.post',
		'uses' => 'IssueExclusionController@postExclusion'
	]);

	$app->delete('/issueexclusion', [
		'as' => 'auditor.issueexclusion.delete',
		'uses' => 'IssueExclusionController@deleteExclusionFromSite'
	]);

	$app->delete('/issueexclusion/{exclusion_id}', [
		'as' => 'auditor.issueexclusion.delete',
		'uses' => 'IssueExclusionController@deleteExclusion'
	]);
});


/* Auditor.Pages */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/pages"
], function() use ($app) {
	$app->get('/', [
		'as' => 'auditor.pages',
		'uses' => 'PageController@getPages'
	]);

	$app->get('/page/{page_id}', [
		'as' => 'auditor.pages.get',
		'uses' => 'PageController@getPage'
	]);
});


/* Auditor.Duplicates */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/duplicates"
], function() use ($app) {
	$app->get('/', [
		'as' => 'auditor.duplicates',
		'uses' => 'DuplicateController@getDuplicates'
	]);

	$app->get('/titles', [
		'as' => 'auditor.duplicates.titles.get',
		'uses' => 'DuplicateController@getTitles'
	]);

	$app->get('/titles/pages', [
		'as' => 'auditor.pagesfortitle',
		'uses' => 'DuplicateController@getPagesForTitles'
	]);

	$app->get('/descriptions', [
		'as' => 'auditor.duplicates.descriptions.get',
		'uses' => 'DuplicateController@getDescriptions'
	]);

	$app->get('/descriptions/pages', [
		'as' => 'auditor.pagesfordescription',
		'uses' => 'DuplicateController@getPagesForDescriptions'
	]);

	$app->get('/content', [
		'as' => 'auditor.duplicates.content.get',
		'uses' => 'DuplicateController@getContent'
	]);

	$app->get('/content/pages', [
		'as' => 'auditor.pagesforcontent',
		'uses' => 'DuplicateController@getPagesForContent'
	]);
});


/* Auditor.Headings */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/headings"
], function () use ($app) {
	$app->get('/', [
		'as' => 'auditor.headings',
		'uses' => 'HeadingController@getHeadings'
	]);

	$app->get('/heading/{heading_id}', [
		'as' => 'auditor.headings.get',
		'uses' => 'HeadingController@getHeading'
	]);
});


/* Auditor.Resources */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/resources"
], function () use ($app) {
	$app->get('/', [
		'as' => 'auditor.resources',
		'uses' => 'ResourceController@getResources'
	]);

	$app->get('/resource/{resource_id}', [
		'as' => 'auditor.resources.get',
		'uses' => 'HeadingController@getResource'
	]);
});


/* Auditor.Links */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/links"
], function() use ($app) {
	$app->get('/', [
		'as' => 'auditor.links',
		'uses' => 'LinkController@getLinks'
	]);

	$app->get('/link/{link_id}', [
		'as' => 'auditor.links.get',
		'uses' => 'LinkController@getLink'
	]);

	$app->get('/pages', [
		'as' => 'auditor.pagesforlink',
		'uses' => 'LinkController@getPagesForLink'
	]);
});


/* Auditor.Images */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/images"
], function() use ($app) {
	$app->get('/', [
		'as' => 'auditor.images',
		'uses' => 'ImageController@getImages'
	]);

	$app->get('/image/{image_id}', [
		'as' => 'auditor.images.get',
		'uses' => 'ImageController@getImage'
	]);

	$app->get('/pages', [
		'as' => 'auditor.pagesforimage',
		'uses' => 'ImageController@getPagesForImage'
	]);
});


/* Auditor.Schemas */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Auditor',
	'prefix' => "{$api_version}/auditor/schemas"
], function() use ($app) {
	$app->get('/', [
		'as' => 'auditor.schemas',
		'uses' => 'SchemaController@getSchemas'
	]);

	$app->get('/schema/{schema_id}', [
		'as' => 'auditor.schemas.get',
		'uses' => 'SchemaController@getSchema'
	]);
});


/* Billings */

$app->group([
	'namespace' => 'App\Http\Controllers\Api',
	'prefix' => "{$api_version}/billing"
], function() use ($app) {
	$app->get('/', [
		'as' => 'billing.show_account_id',
		'uses' => 'BillingController@showAccountId'
	]);
});


/* Billings.Customers */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Billing',
	'prefix' => "{$api_version}/billing/customers"
], function() use ($app) {
	$app->post('/cancel', [
		'as' => 'billing.customer.cancel',
		'uses' => 'CustomerController@cancelAccount'
	]);
});


/* Billings.Plans */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Billing',
	'prefix' => "{$api_version}/billing/plans"
], function() use ($app) {
	$app->get('/plan', [
		'as' => 'billing.plans.get',
		'uses' => 'PlanController@getPlan'
	]);

	$app->post('/create', [
		'as' => 'billing.plan.create',
		'uses' => 'PlanController@createPlan'
	]);

	$app->post('/upgrade', [
		'as' => 'billing.plan.upgrade',
		'uses' => 'PlanController@upgradePlan'
	]);

	$app->post('/downgrade', [
		'as' => 'billing.plan.downgrade',
		'uses' => 'PlanController@downgradePlan'
	]);
});


/* Billings.Charges */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Billing',
	'prefix' => "{$api_version}/billing/charges"
], function() use ($app) {
	$app->post('/pages', [
		'as' => 'billing.charges',
		'uses' => 'ChargeController@purchasePages'
	]);
});


/* Billings.Cards */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Billing',
	'prefix' => "{$api_version}/billing/cards"
], function() use ($app) {
	$app->get('/', [
		'as' => 'billing.cards',
		'uses' => 'CardController@getCards'
	]);

	$app->post('/card', [
		'as' => 'billing.post',
		'uses' => 'CardController@postCard'
	]);

	$app->delete('/card', [
		'as' => 'billing.delete',
		'uses' => 'CardController@deleteCard'
	]);
});


/* Billings.Invoices */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Billing',
	'prefix' => "{$api_version}/billing/invoices"
], function() use ($app) {
	$app->get('/', [
		'as' => 'billing.invoices',
		'uses' => 'InvoiceController@getInvoices'
	]);
});
	

/* Notifications */

$app->group([
	'namespace' => 'App\Http\Controllers\Api',
	'prefix' => "{$api_version}/notifications"
], function() use ($app) {
	$app->get('/', [
		'as' => 'notifications',
		'uses' => 'NotificationController@getNotifications'
	]);

	$app->post('/', [
		'as' => 'notification.post',
		'uses' => 'NotificationController@postNotification'
	]);

	$app->post('/read', [
		'as' => 'notification.read',
		'uses' => 'NotificationController@markRead'
	]);

	$app->post('/read_all', [
		'as' => 'notification.read_all',
		'uses' => 'NotificationController@markAllRead'
	]);
});

	
/* Errors */

$app->group([
	'namespace' => 'App\Http\Controllers',
	'prefix' => "/errors"
], function () use ($app) {
	$app->get('/{error_category}', [
		'as' => 'errors.get',
		'uses' => 'ErrorController@getErrors'
	]);

	$app->get('/{error_category}/{language}', [
		'as' => 'errors.get',
		'uses' => 'ErrorController@getErrors'
	]);
});


/* Admin - Accounts API */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Admin',
	'prefix' => "{$api_version}/admin/accounts"
], function() use ($app) {
	$app->get('/', [
		'as' => 'admin.account.getAccounts',
		'uses' => 'AccountController@getAccounts'
	]);

	$app->get('/account', [
		'as' => 'admin.account.getAccount',
		'uses' => 'AccountController@getAccount'
	]);

	$app->put('/account/extra_pages', [
		'as' => 'admin.account.setExtraPagesOnAccount',
		'uses' => 'AccountController@setExtraPagesOnAccount'
	]);
});

/* Admin - Sites API */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Admin',
	'prefix' => "{$api_version}/admin/sites"
], function() use ($app) {
	$app->get('/', [
		'as' => 'admin.site.getSites',
		'uses' => 'SiteController@getSites'
	]);

	$app->get('/account/{account_id}', [
		'as' => 'admin.site.getAccountSites',
		'uses' => 'SiteController@getAccountSites'
	]);

	$app->get('/site', [
		'as' => 'admin.site.getSite',
		'uses' => 'SiteController@getSite'
	]);
});

/* Admin - Crawls API */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Admin',
	'prefix' => "{$api_version}/admin/crawls"
], function() use ($app) {
	$app->get('/', [
		'as' => 'admin.crawl.getCrawls',
		'uses' => 'CrawlController@getCrawls'
	]);

	$app->get('/account/{account_id}', [
		'as' => 'admin.crawl.getAccountCrawls',
		'uses' => 'CrawlController@getAccountCrawls'
	]);

	$app->get('/site/{site_id}', [
		'as' => 'admin.crawl.getSiteCrawls',
		'uses' => 'CrawlController@getSiteCrawls'
	]);

	$app->get('/crawl', [
		'as' => 'admin.crawl.getCrawl',
		'uses' => 'CrawlController@getCrawl'
	]);
});

/* Admin - Packages API */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Admin',
	'prefix' => "{$api_version}/admin/packages"
], function() use ($app) {
	$app->get('/', [
		'as' => 'admin.package.getPackages',
		'uses' => 'PackageController@getPackages'
	]);

	$app->get('/feature/{feature_id}', [
		'as' => 'admin.package.getFeaturePackages',
		'uses' => 'PackageController@getFeaturePackages'
	]);

	$app->get('/package', [
		'as' => 'admin.package.getPackage',
		'uses' => 'PackageController@getPackage'
	]);
});

/* Admin - Features API */

$app->group([
	'namespace' => 'App\Http\Controllers\Api\Admin',
	'prefix' => "{$api_version}/admin/features"
], function() use ($app) {
	$app->get('/', [
		'as' => 'admin.feature.getFeatures',
		'uses' => 'FeatureController@getFeatures'
	]);

	$app->get('/package/{package_id}', [
		'as' => 'admin.feature.getPackageFeatures',
		'uses' => 'FeatureController@getPackageFeatures'
	]);

	$app->get('/feature', [
		'as' => 'admin.feature.getFeature',
		'uses' => 'FeatureController@getFeature'
	]);
});
