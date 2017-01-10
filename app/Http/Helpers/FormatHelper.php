<?php

namespace App\Http\Helpers;

use App\Models\Api;

use Log;

class FormatHelper
{
	public static function generate($data, $format, $columns = null, $filename = "export") {
		if ($format === 'csv') {
			self::generateCSV($data, $columns, $filename);
		}

		return false;
	}

	public static function generateCSV($data, $columns = null, $filename = "export") {
		$csv = self::formatCSV($data, $columns);

		header("Content-type: text/csv");
		header("Content-Disposition: attachment; filename={$filename}.csv");
		header("Pragma: no-cache");
		header("Expires: 0");

		echo $csv;

		exit();
	}

	public static function formatCSV($data, $desired_columns = null, $value_delimiter = ",", $line_delimiter = "\n") {
		$csv = "";

		if (!is_array($data['records']) || count($data['records']) == 0) {
			return $csv;
		}

		$first_record = $data['records'][0];

		if (is_array($first_record)) {
			unset($first_record['rel']);	
		}

		if (is_array($desired_columns)) {
			$columns = $desired_columns;
		}
		else {
			$default_columns = array_keys($first_record);
			$columns = array_map(function($column) {
				return [
					'data' => $column,
					'title' => $column
				];
			}, $default_columns);
		}

		$headers = array_map(function($column) {
			return "\"{$column['title']}\"";
		}, $columns);

		$csv .= implode($headers, $value_delimiter);
		$csv .= $line_delimiter;

		foreach($data['records'] as $record) {
			$values = [];
			foreach($columns as $column) {
				if (!is_array($record)) {
					$record = API::transform($record);
				}

				$value = $record[$column['data']];
				$values[] = "\"{$value}\"";
			}
			$csv .= implode($values, $value_delimiter);
			$csv .= $line_delimiter;
		}

		return $csv;
	}
}