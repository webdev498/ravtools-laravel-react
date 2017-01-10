<?php

namespace App\Http\Helpers;

use App\Models\Api;

use \RavenTools\SiteAuditorData\CrawlSession as CrawlObject;

use \RavenTools\SiteAuditorData\IssueExclusion;

use Log;

class CrawlHelper
{
	private $_crawl = null;

	public function __construct($crawl_object = null) {
		if (!is_null($crawl_object)) {
			$this->setCrawl($crawl_object);
		}
	}

	public function getCrawl() {
		if (is_null($this->_crawl)) {
			return false;
		}

		return $this->_crawl;
	}

	public function setCrawl($crawl_object) {
		$this->_crawl  = $crawl_object;
	}

	public function format() {
		$crawl_object = $this->getCrawl();

		if ($crawl_object === false) {
			throw new \Exception('Can not format missing crawl object.');
		}

		$crawl = Api::transform($crawl_object);

		if (!is_array($crawl)) {
			return $crawl;
		}

		if (!array_key_exists('pages_crawled', $crawl)) {
			$crawl['pages_crawled'] = 0;
		}

		if ($crawl['pages_crawled'] == 0) {
			$crawl['score'] = 0;

			return $crawl;
		}

		$exclusions = $this->getScoreExclusions($crawl_object->site_id);

		$crawl['score'] = $this->calculateScore($crawl, $exclusions);

		return $crawl;
	}

	public function calculateScore($crawl, $exclusions) {
		$score = 100; // score starts at 100, then quickly decreases to something more depressing

		$severity_scores = [
			'low' => 1,
			'medium' => 5,
			'high' => 10
		];

		$severity_stats = [
			'page_errors' => [
				'severity' => 'high'
			],
			'page_blocked_by_robots' => [
				'severity' => 'high'
			],
			'malware' => [
				'severity' => 'high'
			],
			'page_redirects' => [
				'severity' => 'medium'
			],
			'page_missing_title' => [
				'severity' => 'high'
			],
			'page_invalid_title' => [
				'severity' => 'medium'
			],
			'duplicate_titles' => [
				'severity' => 'medium'
			],
			'page_missing_description' => [
				'severity' => 'medium'
			],
			'page_invalid_description' => [
				'severity' => 'medium'
			],
			'duplicate_descriptions' => [
				'severity' => 'medium'
			],
			'page_missing_google_analytics' => [
				'severity' => 'medium'
			],
			'page_low_word_count' => [
				'severity' => 'medium'
			],
			'duplicate_content' => [
				'severity' => 'medium'
			],
			'link_internal_broken' => [
				'severity' => 'high'
			],
			'link_internal_missing_anchor_or_alt' => [
				'severity' => 'medium'
			],
			'link_internal_nofollow' => [
				'severity' => 'high'
			],
			'link_external_broken' => [
				'severity' => 'medium'
			],
			'link_external_missing_anchor_or_alt' => [
				'severity' => 'medium'
			],
			'link_external_nofollow' => [
				'severity' => 'low'
			],
			'image_broken' => [
				'severity' => 'high'
			],
			'image_missing_alt' => [
				'severity' => 'medium'
			],
			'image_missing_title' => [
				'severity' => 'low'
			],
			'page_missing_headers' => [
				'severity' => 'low'
			],
			'page_missing_schema_microdata' => [
				'severity' => 'low'
			]
		];

		foreach ($severity_stats as $stat => $details) {
			if (in_array($stat, $exclusions)) { // if the stat name is in the exclusion list, skip it entirely
				continue;
			}

			$severity = $details['severity'];

			if ($stat === 'malware') {
				$stat_value = 0; // TODO implement malware check; also is a bool
			}
			else {
				if (array_key_exists($stat, $crawl)) {
					$stat_value = (int)$crawl[$stat];	
				}
				else {
					$stat_value = 0;
				}
			}

			$issue_threshold = 10;

			switch ($stat) {
				case 'malware':
					if ((bool)$stat_value) {
						$score -= 10;
					}

					break;

				case 'page_missing_schema_microdata':
					if ($stat_value > 0) {
						$score -= 1;
					}

					break;

				default:
					if ($stat_value > $issue_threshold) {
						$stat_value = $issue_threshold;
					}

					$stat_value = $stat_value / $issue_threshold;
					$modifier = $severity_scores[$severity];

					$score -= ceil($modifier * $stat_value);

					break;
			}
		}

		if ($score <= 0) {
			$score = 0; // you suck more than 0, but we'll upgrade you to 0
		}

		return $score;
	}

	public function getScoreExclusions($site_id) {
		$exclusion_object = new IssueExclusion;

		$exclusion_rows = $exclusion_object->find([
			'values' => [
				':site_id' => [
					'S' => $site_id
				]
			],

			'conditions' => 'site_id = :site_id'
		]);

		$exclusion_rows = iterator_to_array($exclusion_rows);

		if (count($exclusion_rows) == 0) {
			return [];
		}

		$stat_translations = [
			'visibility/errors' => 'page_errors',
			'visibility/blocked_by_robots' => 'page_blocked_by_robots',
			'visibility/malware' => 'malware',
			'visibility/redirects' => 'page_redirects',
			'meta/missing_title' => 'page_missing_title',
			'meta/invalid_title' => 'page_invalid_title',
			'meta/duplicate_title' => 'duplicate_titles',
			'meta/missing_description' => 'page_missing_description',
			'meta/invalid_description' => 'page_invalid_description',
			'meta/duplicate_description' => 'duplicate_descriptions',
			'meta/missing_google_analytics' => 'page_missing_google_analytics',
			'content/low_word_count' => 'page_low_word_count',
			'content/duplicate_content' => 'duplicate_content',
			'links_internal/broken' => 'link_internal_broken',
			'links_internal/missing_anchor_or_alt' => 'link_internal_missing_anchor_or_alt',
			'links_internal/nofollow' => 'link_internal_nofollow',
			'links_external/broken' => 'link_external_broken',
			'links_external/missing_anchor_or_alt' => 'link_external_missing_anchor_or_alt',
			'links_external/nofollow' => 'link_external_nofollow',
			'images/broken' => 'image_broken',
			'images/missing_alt' => 'image_missing_alt',
			'images/missing_title' => 'image_missing_title',
			'semantics/missing_headers' => 'page_missing_headers',
			'semantics/missing_schema_microdata' => 'page_missing_schema_microdata'
		];

		$translated_stats = [];

		foreach ($exclusion_rows as $exclusion_row) {
			if (!array_key_exists($exclusion_row->issue, $stat_translations)) {
				continue;
			}

			$translated_stats[] = $stat_translations[$exclusion_row->issue];
		}

		return $translated_stats;
	}
}
