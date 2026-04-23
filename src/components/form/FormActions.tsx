type Props = {
  loading?: boolean;
  onCancel: () => void;
  submitLabel?: string;
};

export default function FormActions({
  loading,
  onCancel,
  submitLabel = "Save",
}: Props) {
  return (
    <div className="form-actions">
      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
      >
        {loading ? "Saving..." : submitLabel}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="btn-secondary"
      >
        Cancel
      </button>
    </div>
  );
}