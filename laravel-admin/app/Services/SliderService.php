<?php

namespace App\Services;

use App\Models\Slider;
use Illuminate\Http\UploadedFile;
use App\Services\ObjectStorageService;

class SliderService
{
    private ObjectStorageService $objectStorageService;

    public function __construct(ObjectStorageService $objectStorageService)
    {
        $this->objectStorageService = $objectStorageService;
    }

    public function getSliders()
    {
        return Slider::latest()->paginate(10);
    }

    public function getSlider(Slider $slider)
    {
        return $slider;
    }

    public function create(array $data)
    {
        if (isset($data['image'])) {
            $data['image'] = $this->uploadImage($data['image']);
        }

        return Slider::create($data);
    }

    public function update(Slider $slider, array $data)
    {
        if (isset($data['image'])) {

            if ($slider->image) {
                $this->objectStorageService->delete($slider->image);
            }

            $data['image'] = $this->uploadImage($data['image']);
        }

        $slider->update($data);

        return $slider;
    }

    public function delete(Slider $slider)
    {
        if ($slider->image) {
            $this->objectStorageService->delete($slider->image);
        }

        $slider->delete();
    }

    public function toggleStatus(Slider $slider)
    {
        $slider->status = !$slider->status;
        $slider->save();

        return $slider;
    }

    private function uploadImage(UploadedFile $image)
    {
        return $this->objectStorageService->upload(
            $image,
            'sliders'
        );
    }
}