<?php

class CardTest extends TestCase
{
    /* fix soon
    public function testPostCard() {
        $this->json('POST', '/api/v1/billing/cards/card', [
            'api_key' => '123',
            'card_token' => 'tok_18F3EYLwRPn1IqYw78T9DbUK'
        ]);

        $response = $this->response->getContent();
        $response = json_decode($response, true);

        $this->assertTrue(array_key_exists('id', $response) && !empty($response['id']));
        $this->assertTrue((bool)preg_match("/^card_/", $response['id']));
    }
    */

    public function testGetCards() {
        $this->json('GET', '/api/v1/billing/cards', [
            'api_key' => '123'
        ]);

        $response = $this->response->getContent();
        $response = json_decode($response, true);

        $this->assertTrue((bool)preg_match("/^card_/", $response['data'][0]['id']));
    }

    /*
    public function testDeleteCard() {
        $this->json('DELETE', '/api/v1/billing/cards/card', [
            'api_key' => '123',
            'card_id' => 'tok_18F3EYLwRPn1IqYw78T9DbUK'
        ]);

        $response = $this->response->getContent();
        $response = json_decode($response, true);

        $this->assertTrue(array_key_exists('id', $response) && !empty($response['id']));
    }
    */
}
