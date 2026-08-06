<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Http\UploadedFile;
use App\Services\ObjectStorageService;

class CustomerService
{
    private ObjectStorageService $objectStorageService;

    public function __construct(ObjectStorageService $objectStorageService)
    {
        $this->objectStorageService = $objectStorageService;
    }

    public function getCustomers()
    {
        return Customer::latest()->paginate(10);
    }

    public function getCustomer(Customer $customer)
    {
        return $customer;
    }

    public function create(array $data)
    {
        if (isset($data['image'])) {
            $data['image'] = $this->uploadImage($data['image']);
        }

        return Customer::create($data);
    }

    public function update(Customer $customer, array $data)
    {
        if (isset($data['image'])) {

            if ($customer->image) {
                $this->objectStorageService->delete($customer->image);
            }

            $data['image'] = $this->uploadImage($data['image']);
        }

        $customer->update($data);

        return $customer;
    }

    public function delete(Customer $customer)
    {
        if ($customer->image) {
            $this->objectStorageService->delete($customer->image);
        }

        $customer->delete();
    }

    public function toggleStatus(Customer $customer)
    {
        $customer->status = !$customer->status;
        $customer->save();

        return $customer;
    }

    private function uploadImage(UploadedFile $image)
    {
        return $this->objectStorageService->upload(
            $image,
            'customers'
        );
    }
}