<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use App\Services\SliderService;


class SliderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
     private SliderService $sliderService;

    public function __construct(SliderService $sliderService)
    {
        $this->sliderService = $sliderService;
    }

    public function index()
    {
        return Slider::paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        //$path = $request->file('image')->store('sliders', 'public');

        $slider = $this->sliderService->create($validated);

        return response()->json(['message' => 'Slider created successfully', 'slider' => $slider], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Slider $slider)
    {
        return $slider;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Slider $slider)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        //$slider = $request->only(['title', 'description', 'status']);

        $slider = $this->sliderService->update($slider, $validated);
        

        return response()->json(['message' => 'Slider updated successfully', 'slider' => $slider]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Slider $slider)
    {
       $this->sliderService->delete($slider);

        return response()->json(['message' => 'Slider deleted successfully']);
    }
    public function toggleStatus(Slider $slider)
    {
        $slider = $this->sliderService->toggleStatus($slider);

        return response()->json([
            'message' => 'Status updated successfully',
            'status' => $slider->status
        ]);
    }
}
