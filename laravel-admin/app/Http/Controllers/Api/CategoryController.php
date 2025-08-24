<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
          return response()->json(Category::latest()->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
     public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'status' => $request->status ?? 1,
        ]);

        return response()->json(['message' => 'Category created successfully', 'category' => $category]);
    }

    /**
     * Display the specified resource.
     */
     public function show(Category $category)
    {
        return response()->json($category);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update([
            'name' => $request->name,
            'status' => $request->status ?? $category->status,
        ]);

        return response()->json(['message' => 'Category updated successfully', 'category' => $category]);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }

    public function toggleStatus(Category $category)
    {
        $category->status = !$category->status;
        $category->save();

        return response()->json(['message' => 'Category status updated', 'status' => $category->status]);
    }
}
