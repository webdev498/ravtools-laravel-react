<?php

class InvoiceTest extends TestCase
{
    public function testGetInvoices() {
        $this->json('GET', '/api/v1/billing/invoices', [
            'api_key' => '123'
        ]);

        $response = $this->response->getContent();
        $response = json_decode($response, true);

        foreach ($response['records'] as $item) {
            $this->assertTrue(intval($item['amount']) > 0);
            $this->assertNotEmpty($item['type']);

            $this->assertNotEmpty($item['date']);
            $this->assertTrue((bool)preg_match("/\d{2}\/\d{2}\/\d{2}/", $item['date']));
        }

        $this->assertEquals($response['draw'], 1);
        $this->assertTrue($response['total'] > 0);
        $this->assertTrue($response['filtered'] > 0);
    }
}
