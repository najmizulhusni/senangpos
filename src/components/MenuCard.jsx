import { Edit2 } from 'lucide-react';
import { getFoodIcon } from './FoodIcons';
import { useLanguage } from '../context/LanguageContext';

export default function MenuCard({ item, onAdd, onEdit, variant = 'main' }) {
  const { t } = useLanguage();
  const isDisabled = !item.is_available || (item.stock_qty !== null && item.stock_qty <= 0);
  const borderColor = variant === 'main' ? 'hover:border-emerald-400' : 'hover:border-amber-400';
  const priceColor = variant === 'main' ? 'text-emerald-600' : 'text-amber-600';

  const StockBadge = () => {
    if (item.stock_qty === null) return null;
    if (item.stock_qty <= 0) {
      return <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{t('soldOut')}</span>;
    }
    if (item.stock_qty <= 10) {
      return <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{item.stock_qty}</span>;
    }
    return <span className="absolute top-2 left-2 bg-emerald-500/80 text-white text-xs px-2 py-0.5 rounded-full font-medium">{item.stock_qty}</span>;
  };

  return (
    <div className="relative group">
      <button
        onClick={() => onAdd(item)}
        disabled={isDisabled}
        className={`w-full bg-white rounded-xl p-4 shadow-sm transition-all border-2 ${
          isDisabled
            ? 'opacity-50 cursor-not-allowed border-gray-100'
            : `border-gray-100 ${borderColor} hover:shadow-md active:scale-[0.98]`
        }`}
      >
        <StockBadge />
        <div className="flex justify-center mb-2">
          {getFoodIcon(item.icon || 'nasi-lemak', 48)}
        </div>
        <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </h3>
        <p className={`${priceColor} font-bold text-lg`}>
          RM {item.price.toFixed(2)}
        </p>
        {!item.is_available && (
          <p className="text-xs text-red-500 mt-1 font-medium">{t('unavailable')}</p>
        )}
      </button>
      
      {onEdit && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(item); }}
          className="absolute top-2 right-2 bg-white rounded-lg p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 border border-gray-200"
        >
          <Edit2 size={14} className="text-gray-600" />
        </button>
      )}
    </div>
  );
}
