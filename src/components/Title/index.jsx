
export default function Title({ children, name }) {
  return (
    <div className="flex flex-row items-center m-2 mb-4 rounded-md bg-[#f8f8f8] p-2">
      {children}
      <span className="ml-4 text-lg">{name}</span>
    </div>
  )
}

// o que está dentro de Title (children) para fazer as alterações