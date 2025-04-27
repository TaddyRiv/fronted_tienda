const WidgetCard = ({ titulo, valor, icono }) => {
    return (
      <div className="bg-white shadow-md rounded p-6 w-full max-w-sm border-t-4 border-red-600">
        <div className="text-sm text-gray-500">{titulo}</div>
        <div className="text-3xl font-bold text-red-700 mt-2">{valor}</div>
        {icono && <div className="mt-4 text-gray-400">{icono}</div>}
      </div>
    );
  };
  
  export default WidgetCard;
  