import React, { FormEvent, FunctionComponent, useState } from 'react';

import Typography from '../typography';

interface Props {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: FunctionComponent<Props> = ({ tags, setTags }: Props) => {
  const [input, setInput] = useState<string>('');

  const onSubmit = (e: FormEvent, tag: string) => {
    e.preventDefault();
    if (!tags.includes(tag)) {
      const newArray = [tag, ...tags];
      setInput('');
      setTags(newArray);
    } else {
      setInput('');
    }
  };

  const removeTag = (index: number) => {
    const newArray = [...tags];

    newArray.splice(index, 1);

    setTags(newArray);
  };

  return (
    <div className="w-full">
      <form className="flex relative">
        <input
          className="p-2 bg-dark-components rounded w-full"
          placeholder="Add a tag..."
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <button
          className="absolute right-1 m-auto flex items-start justify-center p-2 hover:bg-dark-light rounded-full"
          type="submit"
          onClick={(e) => onSubmit(e, input)}
        >
          <span className="material-icons-outlined">add_circle</span>
        </button>
      </form>
      <div className="flex flex-wrap mt-3 max-h-48 overflow-auto">
        {tags.map((tag, index) => (
          <div
            key={tag}
            className="pl-3 mb-2 flex items-center justify-center bg-dark-components rounded-full mr-2"
          >
            <Typography variant="subtitle">{tag}</Typography>
            <button
              className="flex items-center ml-1 justify-center p-2 hover:bg-dark-light rounded-full"
              type="button"
              onClick={() => removeTag(index)}
            >
              <span className="material-icons-outlined text-md">cancel</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
