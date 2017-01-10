<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiController as ApiController;
use Illuminate\Http\Request as Request;

use \RavenTools\SiteAuditorData\Notification;

use App\Models\Api;
use App\Config;

class NotificationController extends ApiController
{
	public function __construct(Request $request)
	{
		parent::__construct($request);
	}

	public function getNotifications(Request $request) {

		$object = new Notification([
			'account_id' => $this->account_id
		]);

		$notifications = $object->all();

		$unread = 0;
		foreach($notifications as $n) {
			if($n->read != 1) {
				$unread++;
			}
		}

		$data = [
			'total' => count($notifications),
			'unread_count' => $unread,
			'data' => $notifications
		];

		return $this->response($data, 'notifications', $request);
	}

	/**
	 * Create a new notification item for a particular site
	 *
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function postNotification(Request $request)
	{
		$data = $request->input();
		
		$object = new Notification([
			'account_id' => $this->account_id
		]);
		
		/** Example notification structure:
			[
				'message' => 'Report Summary ready for https://raventools.com',
				'url' => 'https://raventools.com',
				'site_id' => '123',
				'read' => 0
			]
		 */

		$object->message = $data['message'];
		$object->url = $data['url'];
		$object->site_id = $data['site_id'];
		$object->read = $data['read'];

		$result = $object->save();
		
		if ($result) {
			$data = Api::transform($object);

			return $this->response($data, 'notification_post');
		} 
		else {
			return $this->error();
		}
	}


	public function markAllRead(Request $request) {

		$object = new Notification([
			'account_id' => $this->account_id
		]);

		$notifications = $object->all();

		foreach ($notifications as $item) {
			$item->read = 1;
			$item->save();
		}

		$data = [
			'total' => count($notifications),
			'unread_count' => 0, // we just marked them all read, right?
			'data' => $notifications
		];

		return $this->response($data, 'notification_read', $request);	
	}
}
