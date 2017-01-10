<?php

namespace App\Models\Auditor;

use \RavenTools\SiteAuditorData\CrawlSession as CrawlObject;

class Crawl
{
	/**
	 * Retrieves the latest crawl for a site
	 * 
	 * @param integer $site_id The site id
	 * @return object
	 */
	public static function getLatestCrawlForSite($site_id) {
		$crawl_object = new CrawlObject;
		
		// get the site crawls
		$results = $crawl_object->find(
			['site_id'=>['EQ',$site_id]]
		);
		
		$results = iterator_to_array($results);
		
		usort($results, function($a, $b) {
			return $a->complete_ts <= $b->complete_ts;
		});
		
		$latest = new CrawlObject(['id' => $results[0]->id]);
		
		$latest = json_decode(json_encode($latest), true);
		
		// TODO: implement in crawl model
		$latest['issues'] = 37;
		
		return $latest;
	}
	
	/**
	 * Retrieves the previous crawl for a site
	 * 
	 * @param integer $site_id The site id
	 * @return object
	 */
	public static function getPreviousCrawlForSite($site_id) {
		$crawl_object = new CrawlObject;
		
		// get the site crawls
		$results = $crawl_object->find(
			['site_id'=>['EQ',$site_id]]
		);
		
		$results = iterator_to_array($results);
		
		usort($results, function($a, $b) {
			return $a->complete_ts <= $b->complete_ts;
		});
		
		array_shift($results);
		
		$previous = new CrawlObject(['id' => $results[0]->id]);
		
		$previous = json_decode(json_encode($previous), true);
		
		// TODO: implement in crawl model
		$previous['issues'] = 100;
		
		return $previous;
	}
}