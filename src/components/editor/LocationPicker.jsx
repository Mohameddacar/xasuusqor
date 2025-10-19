import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";

export default function LocationPicker({ location, onLocationChange }) {
  const [showInput, setShowInput] = useState(!!location);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationChange({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: ""
          });
          setShowInput(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter it manually.");
          setShowInput(true);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setShowInput(true);
    }
  };

  const removeLocation = () => {
    onLocationChange(null);
    setShowInput(false);
  };

  if (!showInput) {
    return (
      <div className="space-y-2">
        <Label>Location</Label>
        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          className="w-full border-[#8B7355] text-[#8B7355]"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Location</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={removeLocation}
          className="text-red-500"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Input
          value={location?.name || ""}
          onChange={(e) => onLocationChange({ ...location, name: e.target.value })}
          placeholder="Location name (e.g., Central Park)"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            step="any"
            value={location?.latitude || ""}
            onChange={(e) => onLocationChange({ ...location, latitude: parseFloat(e.target.value) })}
            placeholder="Latitude"
          />
          <Input
            type="number"
            step="any"
            value={location?.longitude || ""}
            onChange={(e) => onLocationChange({ ...location, longitude: parseFloat(e.target.value) })}
            placeholder="Longitude"
          />
        </div>
        {!location?.latitude && !location?.longitude && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
            className="w-full text-xs"
          >
            Use Current Location
          </Button>
        )}
      </div>
    </div>
  );
}