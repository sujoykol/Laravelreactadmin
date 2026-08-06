<?php

namespace App\Services;

use GuzzleHttp\Psr7\Request;

class OciSignerService
{
    private string $privateKey;

    public function __construct()
    {
        $this->privateKey = file_get_contents(
            config('oci.private_key')
        );
    }


    public function sign(Request $request): Request
    {
        $date = gmdate('D, d M Y H:i:s T');

        $request = $request->withHeader(
            'Date',
            $date
        );


        $method = strtolower($request->getMethod());

        $path = $request->getUri()->getPath();


        $signingString =
            "(request-target): $method $path\n" .
            "host: " . $request->getUri()->getHost() . "\n" .
            "date: " . $date;


        openssl_sign(
            $signingString,
            $signature,
            $this->privateKey,
            OPENSSL_ALGO_SHA256
        );


        $signature = base64_encode($signature);


        $authorization =
            'Signature version="1",' .
            'keyId="' .
            config('oci.tenancy') .
            '/' .
            config('oci.user') .
            '/' .
            config('oci.fingerprint') .
            '",' .
            'algorithm="rsa-sha256",' .
            'headers="(request-target) host date",' .
            'signature="' .
            $signature .
            '"';


        return $request->withHeader(
            'Authorization',
            $authorization
        );
    }
}