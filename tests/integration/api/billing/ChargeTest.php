<?php

class ChargeTest extends TestCase
{
    public function testPurchasePages() {
        $this->json('POST', '/api/v1/billing/charges/pages', [
            'api_key' => '123',
            'pages' => 50000
        ]);

        $response = $this->response->getContent();
        $response = json_decode($response, true);

        $this->assertTrue((bool)preg_match("/^ch_\w+$/", $response['result']));
        
        $this->json('POST', '/api/v1/billing/charges/pages', [
            'api_key' => '123',
            'pages' => 47
        ])->seeJsonEquals(
            [
                'error' => 'Invalid page total.'
            ]
        );

        $this->json('POST', '/api/v1/billing/charges/pages', [
            'api_key' => '123',
            'pages' => 'foo'
        ])->seeJsonEquals(
            [
                'error' => 'Invalid page total.'
            ]
        );
    }
}
