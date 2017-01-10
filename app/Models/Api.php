<?php

namespace App\Models;

class Api
{
	// list of columns and their derived attributes. sub-selects are possible here. @see \App\Models\Auditor\Page for an example.
	public static $derived_columns = [];
	
	/**
	 * Resolves a derived column attribute.
	 * 
	 * @param string $column The column to resolve
	 * @return string The mapped attribute, or the original.
	 */
	public static function resolveColumn($column, $model) {
		$table_name = $model->table_name();
		$prefix = $table_name . '.';

		if (empty(static::$derived_columns) || !is_array(static::$derived_columns)) {
			return $column;
		}
		
		if (isset(static::$derived_columns[$column])) {
			return static::$derived_columns[$column];
		};
		
		// support the reverse
		foreach(static::$derived_columns as $original => $derived) {
			if ($derived === $column) {
				return $original;
			}
		}
		
		if (!empty(static::$columns)) {
			if (in_array($column, static::$columns)) {
				return $prefix . $column;
			}

			if (stripos($column, $prefix) === 0) {
				return str_replace($prefix, '', $column);
			}
		}

		if ($column == 'id') {
			return $table_name . '.id';
		}
		
		if ($column == $table_name . '.id') {
			return 'id';
		}
		
		return $column;
	}
	
	/**
	 * Returns paginated results using DataTables parameters from a PHPActiveRecord model 
	 *
	 * @param Illuminate\Http\Request $request the HTTP request
	 * @param ActiveRecord\Model $model The ActiveRecord model to paginate
	 * @param array $options Optional options
	 * @return array Paginated results
	 */
	public static function paginate(\Illuminate\Http\Request $request, \ActiveRecord\Model $model, $options = []) {
		$params = [];
		
		// build the initial parameters to get the total count
		$params = self::buildParameters($request, $model, $options);

		// overrides 
		if (isset($options['conditions'])) {
			$params['conditions'] = $options['conditions'];
		}

		if (isset($options['joins'])) {
			$params['joins'] = $options['joins'];
		}

		if (isset($options['group'])) {
			$params['group'] = $options['group'];
		}

		$total = self::getCount($request, $model, $params);

		// filter the initial parameters to get a filtered count
		$params = self::filterParameters($request, $params);

		$filtered = self::getCount($request, $model, $params);
		
		// apply pagination parameters
		if ($request->input('length')) {
			$params['limit'] = $request->input('length');
		} else {
			$params['limit'] = 10;
		}
		
		if ($request->input('start')) {
			$params['offset'] = $request->input('start');
		} else {
			$params['offset'] = 0;
		}

		/* // leaving this bit commented here because reasons. coming soon: actual query log
		$table = $model->table();
		$sql = $table->options_to_sql($params);

		\Log::info('executing sql: ' . $sql->to_s());
		*/

		// finally, find all the paginated records
		$records = $model->find('all', $params);
		
		$rows = [];
		
		// reverse resolve any derived columns back to the original "fields"
		foreach($records as $row) {
			$item = [];
			
			foreach(self::$derived_columns as $column) {
				$column = self::resolveColumn($column, $model);
				
				$value = $row->$column;
				
				if (is_numeric($value)) {
					$value = (float) $value;
				}
				
				$item[$column] = $value;
			}
			
			$rows[] = $item;
		}
		
		$data = [
			'draw' => $request->input('draw'),
			'total' => $total,
			'filtered' => $filtered,
			'records' => $rows
		];
		
		return $data;
	}
	
	/**
	 * Builds a hash of parameters that PHPActiveRecord needs to be able to run model queries.
	 * 
	 * @param Request $request The raw HTTP request
	 * @param \ActiveRecord\Model $model The PHPActiveRecord model
	 * @param Array $options An optional options array
	 * @return Array A valid parameters array that can be sent to any PHPActiveRecord model finder
	 */
	public static function buildParameters($request, $model, $options = []) {
		$params = [];
		$filters = [];
		
		$type = $request->input('type');
		
		if (empty($type) && !empty($options['type'])) {
			$type = $options['type'];
		}

		$where = [];

		if (!empty($options['where'])) {
			$where = $options['where'];

			if (!is_array($where)) {
				$where = [$where];
			}
		}
		
		// build a list of columns to select
		$columns = $request->input('columns');
		$columns_to_add = [];
		$select = '';

		if (!empty($columns)) {
			foreach($columns as $expected) {
				$column = $expected['data'];
				
				// this method will resolve a column to its aliased value - can be anything that works
				// as part of a "SELECT" statement (like a sub select)
				$column = self::resolveColumn($column, $model);

				$columns_to_add[] = $column;
			}
		}
		
		// always select the id field
		if (empty(static::$default_options) || empty(static::$default_options['default_columns'])) {
			$options['default_columns'] = ['id'];
		} else {
			$options['default_columns'] = array_merge(['id'], static::$default_options['default_columns']);
		}
		
		// apply the default columns to the list of columns
		if (!empty($options['default_columns'])) {
			foreach($options['default_columns'] as $column) {
				$column = self::resolveColumn($column, $model);
				$columns_to_add[] = $column;
			}
		}
		
		// apply a "having" parameter
		if (!empty(static::$having) && !empty(static::$having[$type])) {
			$params['having'] = static::$having[$type];
			
			if (!empty(static::$group[$type])) {
				$column = self::resolveColumn(static::$group[$type], $model);
				
				if (!in_array($type, $columns_to_add)) {
					$columns_to_add[] = $column;
				}
			}
		}
		
		// store the columns list in a static property so it can be reverse resolved later
		// this cannot be injected in the "params" array return value below, because phpactiverecord tries to select
		// on any array key it does not recognize as a valid parameter
		foreach($columns_to_add as $column) {
			$derived = self::resolveColumn($column, $model);
			
			if ($derived === $column) {
				self::$derived_columns[$column] = $column;
			} else {
				self::$derived_columns[] = $column;
			}
		}
		
		// combine the columns we need to build the select statement
		if (!empty($columns_to_add)) {
			$columns_to_add = array_unique($columns_to_add);
			
			$select = join(',', $columns_to_add);

			$params['select'] = $select;
		}
		
		// apply the "type" query string parameter
		if (!empty($type) && is_array($type)) {
			foreach($type as $filter) {
				if (!empty(static::$types[$filter])) {
					$filters[] = sprintf("(%s)", static::$types[$filter]);
				}
			}
		} else if (!empty($type)) {
			if (!empty(static::$types) && !empty(static::$types[$type])) {
				$filters[] = sprintf("(%s)", static::$types[$type]);
			}
		}

		if (!empty($where) && is_array($where)) {
			$filters = array_merge($filters, $where);
		}
		
		// combine the type filters array for the "AND" portion of the WHERE clause
		if (!empty($filters)) {
			$conditions = sprintf("(%s)", join(' AND ', $filters));
			
			$params['conditions'] = $conditions;
		}
		
		// apply any joins found on the model
		if (!empty(static::$joins) && !empty(static::$joins[$type])) {
			$params['joins'] = static::$joins[$type];
		}
		
		// apply a group parameter
		if (!empty(static::$group) && !empty(static::$group[$type])) {
			$params['group'] = static::$group[$type];
		} else if (!empty(static::$global_group_by)) {
			// apply a group parameter for ALL queries on the model if one is specified (currently only used by Links and Images)
			$params['group'] = static::$global_group_by;
		}
		
		// apply sort column and direction
		$order = $request->input('order');
		
		if (is_numeric($order[0]['column']) && !empty($order[0]['dir'])) {
			$sort_column = $columns[$order[0]['column']]['data'];
			if (!empty(static::$conditional_order) && isset(static::$conditional_order[$sort_column])) {
				$sort_column = sprintf(" (%s) ", static::$conditional_order[$sort_column]);
			}
			
			$sort_direction = (strtolower($order[0]['dir']) === 'desc' ? 'desc' : 'asc'); // only accept those two valid values
			
			$params['order'] = sprintf("%s %s", $sort_column, $sort_direction);
		}
		
		return $params;
	}
	
	/**
	 * Helper method to apply table filters to an array of parameters
	 * 
	 * @param Request $request The raw HTTP request
	 * @param Array $params A valid set of phpactiverecord model parameters prepared by `buildParameters`
	 * @return Array The same set of parameters with the conditions filtered to the search field
	 */
	protected static function filterParameters($request, $params) {
		// apply the table search filter - the "OR" portion of the WHERE clause
		$filtered = false;
		$search = $request->input('search');
		
		$search_filters = [];
		
		if (empty(static::$default_options) || empty(static::$default_options['searchable_columns'])) {
			return $params;
		}
		
		if (empty($search) || empty($search['value'])) {
			return $params;
		}
		
		$value = $search['value'];
		
		foreach (static::$default_options['searchable_columns'] as $k => $column) {
			// TODO: escape the strings!!!11
			$condition = sprintf("(%s LIKE '%%%s%%')", $column, $value);
			$search_filters[] = $condition;
		}
		
		if (!empty($search_filters)) {
			// build the "OR" portion of the WHERE clause
			$search_filter_string = sprintf("(%s)", join(' OR ', $search_filters));
			
			if (!empty($params['conditions'])) {
				$params['conditions'] .= " AND ";
			}
			
			// append it on to the WHERE clause that already exists
			$params['conditions'] .= $search_filter_string;
		}
		
		return $params;
	}
	
	/**
	 * Helper method to retrieve the results of what would be selected by a set of model parameters
	 * 
	 * @param \ActiveRecord\Model $model The phpactiverecord model
	 * @param Array $params The model parameters
	 * @return Integer The number of results in the record set
	 */
	public static function getCount($request, $model, $params = []) {
		$type = $request->input('type');
		
		if (empty($type) && !empty($params['type'])) {
			$type = $params['type'];
		}

		$options = [
			'select' => 'COUNT(DISTINCT(' . static::$count_column . '))' . ',' . $params['select'],
			'conditions' => $params['conditions']
		];

		if (isset($params['joins'])) {
			$options['joins'] = $params['joins'];
		} else if (!empty(static::$joins) && !empty(static::$joins[$type])) {
			$options['joins'] = static::$joins[$type];
		}
		
		$table = $model->table();
		$sql = $table->options_to_sql($options);

		$count = $model->connection()->query_and_fetch_one($sql->to_s());

		return (int) $count;
	}
	
	/** 
	 * Converts any PHP object that has a "to_json" (such as PHPActiveRecord and DynamoDB models) to an array (de-objectifying it)
	 * This gets rid of class methods and potential circular or recursive things inserted by magic getters.
	 * 
	 * @param object $obj The object
	 * @return array
	 */
	public static function transform($obj) {
		if (is_array($obj)) {
			return $obj;
		}
		
		return json_decode(json_encode($obj), true);
	}
}