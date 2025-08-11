import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Link, Database, Edit2, Save, X, Eye, Settings, Layout } from 'lucide-react';


function TableDesigner() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [newTableName, setNewTableName] = useState('');
  const [relationships, setRelationships] = useState([]);
  const [viewMode, setViewMode] = useState('design'); // 'design' or 'diagram'
  const [tablePositions, setTablePositions] = useState({});
  const [draggedTable, setDraggedTable] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const diagramRef = useRef(null);

  const dataTypes = [
    'INTEGER', 'VARCHAR(255)', 'TEXT', 'BOOLEAN', 'TIMESTAMP', 
    'DATE', 'DECIMAL', 'FLOAT', 'UUID', 'JSON'
  ];

  const addTable = () => {
    if (!newTableName.trim()) return;
    
    const newTable = {
      id: Date.now(),
      name: newTableName,
      fields: [
        { id: Date.now() + 1, name: 'id', type: 'INTEGER', isPrimary: true, isRequired: true }
      ]
    };
    
    setTables([...tables, newTable]);
    setNewTableName('');
    setSelectedTable(newTable.id);
    
    // Set default position for new table in diagram
    setTablePositions(prev => ({
      ...prev,
      [newTable.id]: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      }
    }));
  };

    const deleteTable = (tableId) => {
    setTables(tables.filter(t => t.id !== tableId));
    setRelationships(relationships.filter(r => r.fromTable !== tableId && r.toTable !== tableId));
    setTablePositions(prev => {
      const newPos = { ...prev };
      delete newPos[tableId];
      return newPos;
    });
    if (selectedTable === tableId) {
      setSelectedTable(null);
    }
  };

    const updateTableName = (tableId, newName) => {
    setTables(tables.map(t => 
      t.id === tableId ? { ...t, name: newName } : t
    ));
    setEditingTable(null);
  };

    const addField = (tableId) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? {
            ...t,
            fields: [
              ...t.fields,
              {
                id: Date.now(),
                name: 'new_field',
                type: 'VARCHAR(255)',
                isPrimary: false,
                isRequired: false,
                isForeignKey: false,
                referencesTable: null,
                referencesField: null
              }
            ]
          }
        : t
    ));
  };

  
  const updateField = (tableId, fieldId, updates) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? {
            ...t,
            fields: t.fields.map(f => 
              f.id === fieldId ? { ...f, ...updates } : f
            )
          }
        : t
    ));
  };

    const deleteField = (tableId, fieldId) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? { ...t, fields: t.fields.filter(f => f.id !== fieldId) }
        : t
    ));
  };


  const selectedTableData = tables.find(t => t.id === selectedTable);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Database Table Designer</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('design')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'design'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-1" />
                  Design
                </button>
                <button
                  onClick={() => setViewMode('diagram')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'diagram'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Layout className="w-4 h-4 inline mr-1" />
                  Diagram
                </button>
              </div>
              <button
                onClick={exportSchema}
                data-export-button
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Export Schema
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter table name..."
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTable()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTable}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Table
            </button>
          </div>
        </div>

        {viewMode === 'design' ? (
          /* Design View - Original Three Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tables List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tables</h2>
              <div className="space-y-2">
                {tables.map(table => (
                  <div key={table.id} className="group">
                    <div
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTable === table.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTable(table.id)}
                    >
                      <div className="flex items-center justify-between">
                        {editingTable === table.id ? (
                          <input
                            type="text"
                            defaultValue={table.name}
                            onBlur={(e) => updateTableName(table.id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateTableName(table.id, e.target.value);
                              }
                            }}
                            className="font-medium bg-transparent border-b border-blue-500 focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-gray-800">{table.name}</span>
                        )}
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTable(table.id);
                            }}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTable(table.id);
                            }}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {table.fields.length} fields
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedTableData ? `Fields: ${selectedTableData.name}` : 'Select a Table'}
                </h2>
                {selectedTableData && (
                  <button
                    onClick={() => addField(selectedTable)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Field
                  </button>
                )}
              </div>

              {selectedTableData ? (
                <div className="space-y-3">
                  {selectedTableData.fields.map(field => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateField(selectedTable, field.id, { name: e.target.value })}
                          className="font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => deleteField(selectedTable, field.id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                          disabled={field.isPrimary}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <select
                          value={field.type}
                          onChange={(e) => updateField(selectedTable, field.id, { type: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {dataTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        
                        <div className="flex gap-4 text-sm">
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={field.isPrimary}
                              onChange={(e) => updateField(selectedTable, field.id, { isPrimary: e.target.checked })}
                              disabled={field.isPrimary}
                            />
                            Primary Key
                          </label>
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={field.isRequired}
                              onChange={(e) => updateField(selectedTable, field.id, { isRequired: e.target.checked })}
                            />
                            Required
                          </label>
                        </div>
                        
                        {field.isForeignKey && (
                          <div className="bg-blue-50 p-2 rounded text-sm">
                            <div className="flex items-center gap-1 text-blue-700">
                              <Link className="w-3 h-3" />
                              References: {getTableName(field.referencesTable)}.{getFieldName(field.referencesTable, field.referencesField)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Select a table to view and edit its fields
                </div>
              )}
            </div>

            {/* Relationships */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Relationships</h2>
              
              {/* Add Relationship */}
              <div className="mb-4">
                <RelationshipForm 
                  tables={tables}
                  onAddRelationship={addRelationship}
                />
              </div>

              {/* Existing Relationships */}
              <div className="space-y-2">
                {relationships.map(rel => (
                  <div key={rel.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-700">
                          <Link className="w-3 h-3" />
                          <span className="font-medium">{getTableName(rel.fromTable)}</span>
                          <span>.{getFieldName(rel.fromTable, rel.fromField)}</span>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          → {getTableName(rel.toTable)}.{getFieldName(rel.toTable, rel.toField)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeRelationship(rel.id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Diagram View */
        <>
            <h1>Diagram View Here</h1>
        </>
        )}
      </div>
    </div>
  );
};


export default TableDesigner