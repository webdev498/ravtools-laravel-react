<?php

class BillingTest extends TestCase
{
    public function testShowAccountId()
    {
        $this->json('GET', '/api/v1/billing', [
            'api_key' => '123'
        ])->seeJsonEquals(
            [
                'account_id' => '7a8d3254-3523-471f-b70e-b845a29ff69b',
                'account' => [
                    'id' => '7a8d3254-3523-471f-b70e-b845a29ff69b',
                    'name' => 'Steve Harvey',
                    'email' => 'steve@koc.com'
                ]
            ]
        );
    }
}
