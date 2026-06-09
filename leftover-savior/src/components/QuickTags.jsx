const DEFAULT_TAGS = {
  zh: ['鸡蛋', '番茄', '土豆', '洋葱', '青椒', '胡萝卜', '猪肉', '鸡胸肉', '豆腐', '白菜', '蘑菇', '黄瓜', '茄子', '火腿', '虾仁'],
  en: ['Eggs', 'Tomato', 'Potato', 'Onion', 'Pepper', 'Carrot', 'Pork', 'Chicken', 'Tofu', 'Cabbage', 'Mushroom', 'Cucumber', 'Eggplant', 'Ham', 'Shrimp'],
  jp: ['卵', 'トマト', 'じゃがいも', '玉ねぎ', 'ピーマン', '人参', '豚肉', '鶏肉', '豆腐', '白菜', 'きのこ', 'きゅうり', 'なす', 'ハム', 'エビ'],
};

export default function QuickTags({ lang, onTagClick, theme }) {
  const tags = DEFAULT_TAGS[lang] || DEFAULT_TAGS.zh;
  const isCartoon = theme === 'magazine';

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {tags.map((tag, i) => (
        <button
          key={tag}
          onClick={() => onTagClick(tag)}
          className={`theme-tag text-xs sm:text-sm ${
            isCartoon ? 'hover:scale-110 active:scale-90' : ''
          }`}
          style={
            isCartoon
              ? {
                  border: '2.5px solid #333',
                  borderRadius: 'var(--radius-tag)',
                  backgroundColor: '#fff',
                  color: '#333',
                  fontWeight: 600,
                  padding: '5px 14px',
                  transition: 'var(--transition-base)',
                  cursor: 'pointer',
                }
              : {
                  backgroundColor: '#f0f0f0',
                  color: 'var(--color-text)',
                  border: 'none',
                  borderRadius: '20px',
                  fontWeight: 400,
                  padding: '4px 14px',
                  transition: 'background var(--transition-fast)',
                  cursor: 'pointer',
                }
          }
          onMouseEnter={(e) => {
            if (!isCartoon) {
              e.target.style.backgroundColor = '#e0e0e0';
            }
          }}
          onMouseLeave={(e) => {
            if (!isCartoon) {
              e.target.style.backgroundColor = '#f0f0f0';
            }
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
