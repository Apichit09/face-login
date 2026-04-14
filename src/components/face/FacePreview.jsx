export default function FacePreview({ images = [] }) {
  if (!images.length) return null;

  return (
    <div className="preview-list">
      {images.map((image, index) => (
        <div className="preview-item" key={index}>
          <img src={image.previewUrl} alt={`preview-${index + 1}`} />
        </div>
      ))}
    </div>
  );
}