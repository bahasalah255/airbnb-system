<?php

namespace App\Services;

use App\Models\Apartment;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ApartmentPhotoService
{
    public function resolvePhotos(Request $request, ?Apartment $apartment = null): array
    {
        $keptPhotos = $this->normalizePhotoArray($request->input('kept_photos', $apartment?->photos ?? []));
        $legacyPhotos = $this->normalizePhotoArray($request->input('photos', []));
        $uploadedPhotos = $this->storeUploadedPhotos($request->file('photos', []));

        $photos = array_merge($keptPhotos, $legacyPhotos, $uploadedPhotos);
        $photos = array_values(array_unique(array_filter($photos)));

        return array_slice($photos, 0, 5);
    }

    private function storeUploadedPhotos(mixed $files): array
    {
        $uploadedFiles = is_array($files) ? $files : [$files];
        $paths = [];

        foreach ($uploadedFiles as $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $path = $file->store('apartments', 'public');
            if ($path) {
                $paths[] = Storage::disk('public')->url($path);
            }
        }

        return $paths;
    }

    private function normalizePhotoArray(mixed $photos): array
    {
        if (is_string($photos)) {
            $decoded = json_decode($photos, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $photos = $decoded;
            } else {
                $photos = array_map('trim', explode(',', $photos));
            }
        }

        if (! is_array($photos)) {
            return [];
        }

        return array_values(array_filter(array_map(function ($photo) {
            if (! is_string($photo)) {
                return null;
            }

            $photo = trim($photo);

            return $photo !== '' ? $photo : null;
        }, $photos)));
    }
}
