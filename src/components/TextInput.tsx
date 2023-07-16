import '@/components/TextInput.css'
interface TextInputProps {
  type: string,
  label: string,
  value:string,
  handleChange: Function
}

function TextInput({ type = 'text', label, value, handleChange }: TextInputProps) {
  return (
    <div className="input-container">
      <input type={type} value={value} onChange={(e) => handleChange(e.target.value)} />
      <label className={type === 'date'? 'filled': value && 'filled'}>
        {label}
      </label>
    </div>
  );
}

export default TextInput;