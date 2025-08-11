import React, { useState } from 'react';
import { Link } from 'lucide-react';


function RelationshipForm({ tables, onAddRelationship }) {
const [fromTable, setFromTable] = useState('');
  const [fromField, setFromField] = useState('');
  const [toTable, setToTable] = useState('');
  const [toField, setToField] = useState('');

  const fromTableData = tables.find(t => t.id == fromTable);
  const toTableData = tables.find(t => t.id == toTable);

  const handleSubmit = () => {
    if (fromTable && fromField && toTable && toField) {
      onAddRelationship(parseInt(fromTable), parseInt(fromField), parseInt(toTable), parseInt(toField));
      setFromTable('');
      setFromField('');
      setToTable('');
      setToField('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-2">Create Relationship</div>
      
      <select
        value={fromTable}
        onChange={(e) => {
          setFromTable(e.target.value);
          setFromField('');
        }}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      >
        <option value="">From Table...</option>
        {tables.map(table => (
          <option key={table.id} value={table.id}>{table.name}</option>
        ))}
      </select>

      {fromTableData && (
        <select
          value={fromField}
          onChange={(e) => setFromField(e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="">From Field...</option>
          {fromTableData.fields.filter(f => !f.isPrimary && !f.isForeignKey).map(field => (
            <option key={field.id} value={field.id}>{field.name}</option>
          ))}
        </select>
      )}

      <select
        value={toTable}
        onChange={(e) => {
          setToTable(e.target.value);
          setToField('');
        }}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      >
        <option value="">To Table...</option>
        {tables.filter(t => t.id != fromTable).map(table => (
          <option key={table.id} value={table.id}>{table.name}</option>
        ))}
      </select>

      {toTableData && (
        <select
          value={toField}
          onChange={(e) => setToField(e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="">To Field...</option>
          {toTableData.fields.map(field => (
            <option key={field.id} value={field.id}>{field.name}</option>
          ))}
        </select>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!fromTable || !fromField || !toTable || !toField}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm transition-colors"
      >
        <Link className="w-3 h-3 inline mr-1" />
        Create Relationship
      </button>
    </div>
  );
};
export default RelationshipForm