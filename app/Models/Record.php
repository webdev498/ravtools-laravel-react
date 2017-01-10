<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Record extends Model
{
	protected function linear_regression($plots = array()) {
		$x_array = array();
		$y_array = array();

		foreach($plots as $plot) {
			$x_array[] = $plot[0];
			$y_array[] = $plot[1];
		}

		$count = count($x_array);

		$x_sum = array_sum($x_array);
		$y_sum = array_sum($y_array);

		$xx_sum = 0;
		$xy_sum = 0;

		for ($i = 0; $i < $count; $i++) {
			$xy_sum += ($x_array[$i] * $y_array[$i]);
			$xx_sum += ($x_array[$i] * $x_array[$i]);
		}

		$m = (($count * $xy_sum) - ($x_sum * $y_sum)) / (($count * $xx_sum) - ($x_sum * $x_sum));
		$b = ($y_sum - ($m * $x_sum)) / $count;

		return array('m' => $m, 'b' => $b);
	}

	protected function linereg_point($lr, $x) {
		$y = ($lr['m'] * $x) + $lr['b'];

		return array($x, $y);
	}

	protected function js_date($date_string) {
		return strtotime($date_string) * 1000;
	}

	public function getStatsData() {
		$data = array(
			array(
				'label' => 'Quality Score',
				'sublabel' => 'Research Central',
				'value' => 95
			),
			array(
				'label' => 'Alexa Rank',
				'sublabel' => 'Alexa',
				'value' => 1045
			),
			array(
				'label' => 'Active Links',
				'sublabel' => 'Link Manager',
				'value' => 0
			),
			array(
				'label' => 'Paid Links',
				'sublabel' => 'AdWords',
				'value' => 0
			),
			array(
				'label' => 'Total Pages',
				'sublabel' => 'Majestic',
				'value' => 380895
			),
			array(
				'label' => 'Total Links',
				'sublabel' => 'Majestic',
				'value' => 5798741
			),
			array(
				'label' => 'MozRank',
				'sublabel' => 'Moz',
				'value' => '7.25/10'
			),
			array(
				'label' => 'MozTrust',
				'sublabel' => 'Moz',
				'value' => '6.56/10'
			)
		);

		return $data;
	}

	public function getTotalLinksChart() {
		$plots = array(
			array($this->js_date('1/1/2010'), 0),
			array($this->js_date('2/1/2010'), 0),
			array($this->js_date('3/1/2010'), 0),
			array($this->js_date('4/1/2010'), 3),
			array($this->js_date('5/1/2010'), 3),
			array($this->js_date('6/1/2010'), 28),
			array($this->js_date('7/1/2010'), 25),
			array($this->js_date('8/1/2010'), 46),
			array($this->js_date('9/1/2010'), 67),
			array($this->js_date('10/1/2010'), 64),
			array($this->js_date('11/1/2010'), 45),
			array($this->js_date('12/1/2010'), 25)
		);

		// Takes a set of coordinates (x, y) and returns an equation for linear regression (m, b)
		$lr = $this->linear_regression($plots);

		$data = array(
			'title' => array(
				'text' => 'Total Links'
			),
			'yAxis' => array(
				'title' => array(
					'text' => 'Backlinks'
				)
			),
			'xAxis' => array(
				'type' => 'datetime'
			),
			'tooltip' => array(
				'xDateFormat' => '%B %Y'
			),
			'plotOptions' => array(
				'series' => array(
					'pointStart' => $this->js_date('1/1/2010'),
					'pointIntervalUnit' => 'month'
				)
			),
			'series' => array(
				array(
					'name' => '2010',
					'data' => $plots
				),
				array(
					'type' => 'line',
					'name' => '2010 Trendline',
					'data' => array(
						// Uses linear regression equation and x value to return data point
						$this->linereg_point($lr, $this->js_date('1/1/2010')),
						$this->linereg_point($lr, $this->js_date('12/1/2010'))
					),
					'marker' => array(
						'enabled' => false,
					),
					'states' => array(
						'hover' => array(
							'lineWidth' => 0
						)
					),
					'enableMouseTracking' => false
				)
			)
		);

		return $data;
	}

	public function getImageLinksChart() {
		$data = array(
			'title' => array(
				'text' => 'Image Links'
			),
			'yAxis' => array(
				'title' => array(
					'text' => 'Backlinks'
				)
			),
			'xAxis' => array(
				'type' => 'datetime',
				'plotBands' => array(
					'color' => '#FCFFC5',
					'from' => $this->js_date('6/1/2014'),
					'to' => $this->js_date('9/1/2014'),
					'label' => array(
						'text' => 'Summer'
					)
				)
			),
			'tooltip' => array(
				'xDateFormat' => '%B %Y'
			),
			'plotOptions' => array(
				'series' => array(
					'pointStart' => $this->js_date('1/1/2014'),
					'pointIntervalUnit' => 'month',
					'dataLabels' => array(
						'enabled' => true
					)
				)
			),
			'series' => array(
				array(
					'name' => '2014',
					'data' => array(10469, 12737, 8585, 16561, 13377, 17641, 18350, 15349, 14168, 30027, 27533, 55290)
				),
				array(
					'name' => '2015',
					'data' => array(41827, 19348, 76249, 108900, 117022, 93613, 60919, 166521, 77004, 60422, 0, 0)
				)
			)
		);

		return $data;
	}

	public function getTableData($options) {
		$records = Record::all();

		$data = array();
		foreach($records as $record) {
			$data[] = array(
				'first_name' => $record->name,
				'score' => $record->score
			);
		}

		$table = array(
			'draw' => 1,
			'recordsTotal' => 10,
			'recordsFiltered' => 10,
			'data' => $data
		);

		return $table;
	}
}