<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ProductService
{
  
    public function getProducts()
    {
   /* $key = 'products_' . md5(request()->fullUrl());
    return Cache::remember(
        $key,
        now()->addMinutes(10),
        function () {
            return Product::latest()
                ->paginate(10);
        }
    );*/
    return Product::latest()->paginate(10);
    }


    public function getProduct(Product $product)
    {
       /* return Cache::remember(
            'product_' . $product->id,
            now()->addMinutes(10),
            fn () => $product
        );*/
        return $product;
    }

    


    public function create(array $data)
    {
        if (isset($data['image'])) {

            $data['image'] = $this->uploadImage(
                $data['image']
            );
        }

        $product = Product::create($data);

        $this->clearCache();

        return $product;
    }


    public function update(Product $product, array $data)
    {

        if (isset($data['image'])) {

            if ($product->image) {
                Storage::disk('public')
                    ->delete($product->image);
            }

            $data['image'] = $this->uploadImage(
                $data['image']
            );
        }


        $product->update($data);

        $this->clearCache($product);

        return $product;
    }


    public function delete(Product $product)
    {
        if ($product->image) {

            Storage::disk('public')
                ->delete($product->image);
        }


        $product->delete();

        $this->clearCache($product);
    }


    public function toggleStatus(Product $product)
    {
        $product->status = !$product->status;

        $product->save();

        $this->clearCache($product);

        return $product;
    }



    private function uploadImage(UploadedFile $image)
    {
        return $image->store(
            'products',
            'public'
        );
    }
    private function clearCache(?Product $product = null)
    {
    Cache::forget('products_page_' . request('page', 1));

    if ($product) {
        Cache::forget('product_' . $product->id);
    }
    }


    
}