<?php

class PlanTest extends TestCase
{
    public function testGetPlan() {
        $this->json('GET', '/api/v1/billing/plans/plan', [
            'api_key' => '123'
        ]);

        $response = $this->response->getContent();
        $response = json_decode($response, true);

        $this->assertEquals('free', $response['type']);
        $this->assertArrayHasKey('billing_pages_remaining', $response);
        $this->assertArrayHasKey('extra_pages_remaining', $response);
        $this->assertGreaterThan(0, $response['next_billing_ts']);
        $this->assertEquals(20, $response['billing_pages_remaining']);
    }

    public function testUpgradePlan() {
        $this->json('POST', '/api/v1/billing/plans/upgrade', [
            'api_key' => '123',
            'plan' => 'grow'
        ])->seeJsonEquals(
            [
                'plan' => 'grow',
                'result' => 'Grow Plan'
            ]
        );

        $this->json('POST', '/api/v1/billing/plans/upgrade', [
            'api_key' => '123',
            'plan' => 'pro'
        ])->seeJsonEquals(
            [
                'plan' => 'pro',
                'result' => 'Pro Plan'
            ]
        );
    }

    public function testDowngradePlan() {
        $this->json('POST', '/api/v1/billing/plans/downgrade', [
            'api_key' => '123',
            'plan' => 'grow',
        ])->seeJsonEquals(
            [
                'plan' => 'grow',
                'result' => 'Grow Plan'
            ]
        );

        $this->json('POST', '/api/v1/billing/plans/downgrade', [
            'api_key' => '123',
            'plan' => 'free'
        ])->seeJsonEquals(
            [
                'plan' => 'free',
                'result' => 'Free Plan'
            ]
        );
    }
}
