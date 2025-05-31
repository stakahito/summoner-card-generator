export default function Input({ label, value, onChange }) {
  return (
    <div>
      <p className="font-semibold">{label}</p>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded-lg p-2 focus:outline-blue-300"
      />
    </div>
  );
}
