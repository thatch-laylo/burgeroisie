"use client";

import { useState } from "react";
import { Member } from "@/lib/types";
import { PhotoGallery } from "./PhotoGallery";
import { PhotoUpload } from "./PhotoUpload";

export function PhotoSection({
  visitId,
  initialPhotoIds,
  members,
}: {
  visitId: string;
  initialPhotoIds: string[];
  members: Member[];
}) {
  const [photoIds, setPhotoIds] = useState(initialPhotoIds);

  return (
    <div className="space-y-4">
      {photoIds.length > 0 && <PhotoGallery photoIds={photoIds} />}
      <PhotoUpload
        visitId={visitId}
        members={members}
        onUploaded={(id) => setPhotoIds((prev) => [...prev, id])}
      />
    </div>
  );
}
