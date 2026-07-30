<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Str;

class ProductObserver
{

    public function creating(Product $product)
    {
        $product->slug = $this->generateSlug($product->name);
    }


    public function updating(Product $product)
    {
        if ($product->isDirty('name')) {

            $product->slug = $this->generateSlug(
                $product->name
            );

        }
    }



    private function generateSlug($name)
    {
        $slug = Str::slug($name);

        $count = Product::where('slug',$slug)->count();

        return $count
            ? $slug . '-' . ($count + 1)
            : $slug;
    }
}