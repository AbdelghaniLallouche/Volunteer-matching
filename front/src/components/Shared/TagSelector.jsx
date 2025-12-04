const TagSelector = ({ tags, selectedTags, onToggle, label }) => {
  return (
    <div>
      {label && <h3 className="text-lg font-semibold text-deep-green mb-4">{label}</h3>}
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={`tag ${selectedTags.includes(tag) ? 'tag-selected' : 'tag-unselected'}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
