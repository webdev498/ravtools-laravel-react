<?php

namespace App\Http\Helpers;

use App\Models\Api;

class StatHelper
{
	public static function getPercentChange($latest, $previous) {
		if ($previous == 0) {
			return 0;
		}
		
		return number_format((($latest - $previous) / $previous) * 100, 0);
	}
}
