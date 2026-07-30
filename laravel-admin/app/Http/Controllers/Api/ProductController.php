<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;


class ProductController extends Controller
{

    public function __construct(private ProductService $productService)
    {
    }

    public function index()
    {
        return response()->json(
            $this->productService->getProducts()
        );
    }



    public function store(Request $request)
    {

        $validated = $request->validate([

            'name'=>'required|string|max:255',

            'description'=>'nullable|string',

            'price'=>'required|numeric',

            'image'=>'nullable|image|mimes:jpg,jpeg,png|max:2048',

        ]);
        $product = $this->productService->create($validated);
        
        return response()->json([
            'message'=>'Product created successfully',
            'product'=>$product
        ],201);
    }



    public function show(Product $product)
    {

        return response()->json(

            $this->productService
                 ->getProduct($product)

        );
    }



    public function update(
        Request $request,
        Product $product
    )
    {

        $validated = $request->validate([

            'name'=>'sometimes|string|max:255',

            'description'=>'nullable|string',

            'price'=>'sometimes|numeric',

            'image'=>'nullable|image|mimes:jpg,jpeg,png|max:2048',

        ]);



        $product = $this->productService
                        ->update(
                            $product,
                            $validated
                        );


        return response()->json([

            'message'=>'Product updated successfully',

            'product'=>$product

        ]);
    }




    public function toggleStatus(Product $product)
    {

        return response()->json([

            'message'=>'Product status updated',

            'product'=>$this->productService
                            ->toggleStatus($product)

        ]);

    }




    public function destroy(Product $product)
    {
        $this->productService->delete($product);
        return response()->json([
            'message'=>'Product deleted successfully'
        ]);

    }

}