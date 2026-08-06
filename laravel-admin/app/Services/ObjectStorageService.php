<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class ObjectStorageService
{
    private string $bucket = 'bucket-20260805-2016';

    /**
     * Upload image to OCI Object Storage
     */
    public function upload(UploadedFile $file): string
    {
        $objectName = 'products/' . $file->hashName();

        $command = sprintf(
            '/home/sujoy/bin/oci os object put --bucket-name %s --file %s --name %s --force 2>&1',
            escapeshellarg($this->bucket),
            escapeshellarg($file->getRealPath()),
            escapeshellarg($objectName)
        );

        exec($command, $output, $status);

        if ($status !== 0) {
            throw new \Exception(implode("\n", $output));
        }

        return $objectName;
    }

    /**
     * Delete image from OCI Object Storage
     */
    public function delete(string $objectName): void
    {
        $command = sprintf(
            '/home/sujoy/bin/oci os object delete --bucket-name %s --name %s --force 2>&1',
            escapeshellarg($this->bucket),
            escapeshellarg($objectName)
        );

        exec($command, $output, $status);

        if ($status !== 0) {
            throw new \Exception(implode("\n", $output));
        }
    }
}