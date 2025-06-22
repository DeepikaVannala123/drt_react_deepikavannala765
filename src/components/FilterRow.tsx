import React, { useState } from "react";

const OBJECT_TYPES = ["ROCKET BODY", "DEBRIS", "UNKNOWN", "PAYLOAD"];
const ATTRIBUTES = [
  "noradCatId",
  "intlDes",
  "name",
  "launchDate",
  "decayDate",
  "objectType",
  "launchSiteCode",
  "countryCode",
  "orbitCode",
];

type Props = {
  onApply: (filters: { objectTypes: string[], attributes: string[] }) => void;
};

const FilterRow: React.FC<Props> = ({ onApply }) => {
  const [selectedObjectTypes, setSelectedObjectTypes] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  const toggleSelection = (value: string, set: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) => {
    if (current.includes(value)) {
      set(current.filter(v => v !== value));
    } else {
      set([...current, value]);
    }
  };

  return (
    <div className="border rounded p-4 mb-4 bg-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Object Types */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Object Types</h3>
          <div className="flex flex-wrap gap-2">
            {OBJECT_TYPES.map(type => (
              <label key={type} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedObjectTypes.includes(type)}
                  onChange={() => toggleSelection(type, setSelectedObjectTypes, selectedObjectTypes)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Attributes */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Attributes</h3>
          <div className="flex flex-wrap gap-2">
            {ATTRIBUTES.map(attr => (
              <label key={attr} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedAttributes.includes(attr)}
                  onChange={() => toggleSelection(attr, setSelectedAttributes, selectedAttributes)}
                />
                {attr}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className="mt-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => onApply({ objectTypes: selectedObjectTypes, attributes: selectedAttributes })}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterRow;
