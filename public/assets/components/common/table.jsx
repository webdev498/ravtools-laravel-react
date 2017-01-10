define([
	'react',
	'jquery',
	'underscore',
	'request',
	'jsx!components/common/table',
	'jsx!components/common/column',
	'jsx!components/common/row',
	'jsx!components/common/text',
	'jsx!components/common/icon',
	'jsx!components/common/link',
	'jsx!components/common/select',
	'jsx!components/common/dropdown',
	'jsx!components/common/loading',
	'datatables-bootstrap'
], function (
	React,
	$,
	_,
	Request,
	Table,
	Column,
	Row,
	Text,
	Icon,
	Link,
	Select,
	DropDown,
	Loading
) {
	return React.createClass({
		componentDidMount: function() {
			this.buildTable();
		},

		processData: function(json) {
			var callbacks = this.props.callbacks || {};
			var data = json.records; // TODO - This needs to be "data" to be consistent with non-table API methods

			var disableAuto = this.props.disableAuto || false;

			if (disableAuto == false) {
				data = this.onData(data);
			}

			if (callbacks.hasOwnProperty('onData') && _.isFunction(callbacks.onData)) {
				data = callbacks.onData(data);
			}

			return {
				recordsTotal: json.total,
				recordsFiltered: json.filtered,
				data: data
			};
		},

		// Global Data Processing (for common columns, like urls)
		onData: function(data) {
			var linkUrl = function(url) {
				return React.renderToStaticMarkup(
					<Link options={ {
						label: url,
						url: url,
						icon: 'glyphicon-share',
						updateHash: false,
						target: '_blank'
					} } />
				);
			};

			_.each(data, function(row) {
				if (row.hasOwnProperty('url') && _.isString(row.url)) {
					row.url = linkUrl(row.url);
				}
				if (row.hasOwnProperty('redirect_url') && _.isString(row.redirect_url)) {
					row.redirect_url = linkUrl(row.redirect_url);
				}
				if (row.hasOwnProperty('page_title') && _.isString(row.page_title) && row.page_title == '') {
					row.page_title = '(no title)';
				}
			});

			return data;
		},

		showTable: function() {
			var element = React.findDOMNode(this);

			$(element).find('.table-loader').addClass('hide');
			$(element).find('.table-wrapper').removeClass('hide');
		},

		buildTable: function() {
			var self = this;
			var element = React.findDOMNode(this);

			var options = {
				dom: 't',
				scrollX: true,
				processing: true,
				serverSide: true,
				columns: self.props.columns,
				order: [[0, 'asc']],
				drawCallback: function() {
					self.updateInfo();
				}
			};

			var callbacks = self.props.callbacks || {};

			var table = $(element).find('table.datatable');

			if (callbacks.hasOwnProperty('onRow') && _.isFunction(callbacks.onRow)) {
				options.createdRow = callbacks.onRow;
			}

			options.ajax = function(data, callback) {
				Request.get(self.props.endpoint, {
					data: data,
					onSuccess: function(json) {
						var data = self.processData(json);
						self.showTable();
						callback(data);
					}
				});
			};

			$(table).DataTable(options);
		},

		getAPI: function() {
			var element = React.findDOMNode(this);

			return $(element).find('table.datatable').DataTable();
		},

		updateInfo: function() {
			var element = React.findDOMNode(this);
			var api = this.getAPI();

			var info = api.page.info();

			var message = (info.start+1) + '-' + info.end + ' of ' + info.recordsDisplay;
			$(element).find('.table-info').text(message);

			$(element).find('.table-length select').val(info.length);

			var currentPage = (info.page+1); //info.page is zero-based
			var lastPage = info.pages;

			if (currentPage == lastPage) {
				$(element).find('.table-button-next').addClass('disabled');
			}
			else {
				$(element).find('.table-button-next').removeClass('disabled');
			}

			if (currentPage == 1) {
				$(element).find('.table-button-prev').addClass('disabled');
			}
			else {
				$(element).find('.table-button-prev').removeClass('disabled');
			}
		},

		handleSearch: function(event) {
			var search = $(event.target).val();
			var api = this.getAPI();

			api.search(search).draw();
		},

		handlePage: function(event, direction) {
			var api = this.getAPI();

			api.page(direction).draw(false);
		},

		handleLength: function(event) {
			var length = $(event.target).val();
			var api = this.getAPI();

			api.page.len(length).draw();
		},

		handleExport: function(event, format) {
			var endpoint = Request.getApiUrl(this.props.endpoint);

			var api = this.getAPI();
			var tableParams = api.ajax.params();

			tableParams.format = format;

			// DataTable's Columns and Component's Columns need to be consolidated for exporting
			var tableCol = tableParams.columns;
			var compCol = this.props.columns;

			_.each(tableCol, function(column, index) {
				tableCol[index] = _.extend({}, column, compCol[index]);
			});

			var params = $.param(tableParams);

			window.open(endpoint + '&' + params, 'exports');
		},

		render: function() {
			var self = this;

			var lengthOptions = [
				{
					label: '10',
					value: 10
				},
				{
					label: '25',
					value: 25
				},
				{
					label: '50',
					value: 50
				},
				{
					label: '100',
					value: 100
				},
				{
					label: '250',
					value: 250
				},
				{
					label: '500',
					value: 500
				}
			];

			var linkPrev = {
				label: (<Icon icon="glyphicon-triangle-left" />),
				onClick: function(event) {
					self.handlePage(event, 'previous');
				}
			};

			var linkNext = {
				label: (<Icon icon="glyphicon-triangle-right" />),
				onClick: function(event) {
					self.handlePage(event, 'next');
				}
			};

			var download_options = {
				label: "Download",
				alignRight: true,
				showCaret: true
			};

			var download_links = [
				{
					type: 'header',
					label: 'Download'
				},
				{
					type: 'link',
					label: 'Save as .csv',
					onClick: function(event) {
						self.handleExport(event, 'csv');
					}
				}
			];


			var tableSearch = (
					<div className="table-search input-group">
						<Text type="search" placeholder="Search" onChange={this.handleSearch} />
						<span className="input-group-addon">
							<Icon icon="glyphicon-search" />
						</span>
					</div>
			);
			if (this.props.hasOwnProperty('search') && this.props.search === false) {
				tableSearch = (
					<div></div>
				);
			}

			var tableActions = (
				<div className="table-actions">
					<span className="table-length">
						Show&nbsp;&nbsp;<Select options={lengthOptions} onChange={self.handleLength} />
					</span>
					<span className="table-paging">
						<Link className="table-button-prev" options={linkPrev} />
						<span className="table-info"></span>
						<Link className="table-button-next" options={linkNext} />
					</span>
					<span className="table-export">
						<DropDown options={download_options} links={download_links} />
					</span>
				</div>
			);
			if (this.props.hasOwnProperty('actions') && this.props.actions === false) {
				tableActions = (
					<div></div>
				);
			}

			return (
				<Row>
					<Column width="12">
						<div className="table-loader">
							<Loading />
						</div>
						<div className="table-wrapper hide">
							<Row className="table-controls header">
								<Column width="4">
									{tableSearch}
								</Column>
								<Column width="6" offset="2">
									{tableActions}
								</Column>
							</Row>

							<Row>
								<table id={this.props.id} className="datatable table table-hover table-bordered"></table>
							</Row>

							<Row className="table-controls footer">
								<Column width="6" offset="6">
									{tableActions}
								</Column>
							</Row>
						</div>
					</Column>
				</Row>
			);
		}
	});
});
